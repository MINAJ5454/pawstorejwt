let allProducts = []

async function loadData() {

    const response = await fetch('/api/products')
    const products = await response.json()

    allProducts = products

    renderTable(products)

    document.getElementById('totalProduk').innerText = products.length

    let totalStok = 0

    products.forEach(p => {
        totalStok += p.stok
    })

    document.getElementById('totalStok').innerText = totalStok

    const menipis = products.filter(p => p.stok < 10)

    document.getElementById('stokMenipis').innerText = menipis.length

    const kategori = [...new Set(products.map(p => p.kategori))]

    document.getElementById('jumlahKategori').innerText = kategori.length
}

function renderTable(products) {

    let html = ''

    products.forEach(product => {

        html += `
        <tr>
            <td>${product.nama}</td>
            <td>${product.kategori}</td>
            <td>Rp ${product.harga.toLocaleString()}</td>
            <td>${product.stok}</td>
            <td>${product.supplier}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id})">
                    Edit
                </button>

                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">
                    Hapus
                </button>
            </td>
        </tr>
        `
    })

    document.getElementById('data').innerHTML = html
}

async function addProduct() {

    const token = localStorage.getItem('token')

    const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            nama: document.getElementById('nama').value,
            kategori: document.getElementById('kategori').value,
            harga: parseInt(document.getElementById('harga').value),
            stok: parseInt(document.getElementById('stok').value),
            supplier: document.getElementById('supplier').value
        })
    })

    if (response.ok) {
        alert('Produk berhasil ditambahkan')
        loadData()
    } else {
        alert('Gagal menambah produk')
    }
}

async function deleteProduct(id) {

    const token = localStorage.getItem('token')

    const konfirmasi = confirm('Yakin ingin menghapus produk?')

    if (!konfirmasi) return

    await fetch('/api/products/' + id, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })

    loadData()
}

async function editProduct(id) {

    const nama = prompt('Nama Produk Baru')
    const kategori = prompt('Kategori Baru')
    const harga = prompt('Harga Baru')
    const stok = prompt('Stok Baru')
    const supplier = prompt('Supplier Baru')

    const token = localStorage.getItem('token')

    await fetch('/api/products/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            nama,
            kategori,
            harga: parseInt(harga),
            stok: parseInt(stok),
            supplier
        })
    })

    alert('Produk berhasil diupdate')
    loadData()
}

function showToken() {
    const token = localStorage.getItem('token')
    alert(token)
}

function openAddModal() {
    document.getElementById('nama').focus()
}

function logout() {
    localStorage.removeItem('token')
    window.location.href = 'login.html'
}

loadData()
