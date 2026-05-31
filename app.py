from flask import Flask, render_template, request, jsonify
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required
)

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = "pawstore123"

jwt = JWTManager(app)

products = [
    {
        "id": 1,
        "nama": "Air Minum Aquapet 1L",
        "kategori": "Minuman",
        "harga": 12000,
        "stok": 3,
        "supplier": "AquaPet"
    },
    {
        "id": 2,
        "nama": "Collar Kucing Adjustable",
        "kategori": "Aksesoris",
        "harga": 35000,
        "stok": 60,
        "supplier": "PetStyle ID"
    },
    {
        "id": 3,
        "nama": "Fresh Step Cat Litter 4.5kg",
        "kategori": "Pasir",
        "harga": 120000,
        "stok": 24,
        "supplier": "CleanPet Co"
    }
]

@app.route("/")
def login_page():
    return render_template("login.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/api/login", methods=["POST"])
def login():

    username = request.json.get("username")
    password = request.json.get("password")

    if username == "admin" and password == "admin123":
        token = create_access_token(identity=username)

        return jsonify({
            "token": token
        })

    return jsonify({
        "message": "Login gagal"
    }), 401

@app.route("/api/products", methods=["GET"])
def get_products():
    return jsonify(products)

@app.route("/api/products", methods=["POST"])
@jwt_required()
def add_product():

    data = request.json

    new_product = {
        "id": len(products) + 1,
        "nama": data["nama"],
        "kategori": data["kategori"],
        "harga": data["harga"],
        "stok": data["stok"],
        "supplier": data["supplier"]
    }

    products.append(new_product)

    return jsonify(new_product)

@app.route("/api/products/<int:id>", methods=["PUT"])
@jwt_required()
def update_product(id):

    data = request.json

    for product in products:
        if product["id"] == id:

            product["nama"] = data["nama"]
            product["kategori"] = data["kategori"]
            product["harga"] = data["harga"]
            product["stok"] = data["stok"]
            product["supplier"] = data["supplier"]

            return jsonify(product)

    return jsonify({"message": "Data tidak ditemukan"}), 404

@app.route("/api/products/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_product(id):

    global products

    products = [p for p in products if p["id"] != id]

    return jsonify({
        "message": "Produk berhasil dihapus"
    })

if __name__ == "__main__":
    app.run(debug=True)