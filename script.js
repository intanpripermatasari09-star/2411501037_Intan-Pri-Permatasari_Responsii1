// script.fix.js (versi perbaikan + sidebar toggle + tanggal lahir)
let patients = [
    { nama: "Pasien 1", jk: "Laki-laki", tanggalLahir: "1995-01-10", telp: "0000000001", alamat: "Padang" },
    { nama: "Pasien 2", jk: "Laki-laki", tanggalLahir: "1994-03-12", telp: "0000000002", alamat: "Padang" },
    { nama: "Pasien 3", jk: "Laki-laki", tanggalLahir: "1993-06-25", telp: "0000000003", alamat: "Jakarta" },
    { nama: "Pasien 4", jk: "Laki-laki", tanggalLahir: "1996-09-18", telp: "0000000004", alamat: "Jambi" },
    { nama: "Pasien 5", jk: "Perempuan", tanggalLahir: "1997-12-05", telp: "0000000005", alamat: "Medan" }
];

let currentPage = 1;
let perPage = 5;
let editIndex = null;

// ambil elemen DOM
const searchInput = document.getElementById('searchInput');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const infoPageEl = document.getElementById('infoPage');

/* ======================
   SIDEBAR TOGGLE FIX
   ====================== */
const toggleBtn = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");
const content = document.querySelector(".content");

toggleBtn.addEventListener("click", function () {
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle("show");
    } else {
        sidebar.classList.toggle("closed");
        content.classList.toggle("full");
    }
});
/* ======================
   END SIDEBAR TOGGLE
   ====================== */

function tampilData() {
    let start = (currentPage - 1) * perPage;
    let end = start + perPage;

    const filteredWithIndex = patients
        .map((p, idx) => ({ p, idx }))
        .filter(item => item.p.nama.toLowerCase().includes((searchInput.value || '').toLowerCase()));

    const total = filteredWithIndex.length;
    const maxPage = Math.max(1, Math.ceil(total / perPage));
    if (currentPage > maxPage) currentPage = maxPage;

    start = (currentPage - 1) * perPage;
    end = start + perPage;

    const pageData = filteredWithIndex.slice(start, end);

    const table = document.getElementById("dataPasien");
    table.innerHTML = "";

    for (let i = 0; i < pageData.length; i++) {
        const item = pageData[i];
        const p = item.p;
        const originalIndex = item.idx;

        const row = `
        <tr>
            <td>${start + i + 1}</td>
            <td>${p.nama}</td>
            <td>${p.jk}</td>
            <td>${p.tanggalLahir}</td>
            <td>${p.telp}</td>
            <td>${p.alamat}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="openEdit(${originalIndex})">✏</button>
                <button class="btn btn-danger btn-sm" onclick="hapus(${originalIndex})">🗑</button>
            </td>
        </tr>`;
        table.innerHTML += row;
    }

    infoPageEl.innerHTML = `Showing ${total === 0 ? 0 : start + 1} to ${Math.min(end, total)} of ${total} entries`;

    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= maxPage;
}

function tambahData() {
    let p = {
        nama: document.getElementById('nama').value,
        jk: document.getElementById('jk').value,
        tanggalLahir: document.getElementById('tanggalLahir').value,
        telp: document.getElementById('telp').value,
        alamat: document.getElementById('alamat').value
    };

    patients.push(p);
    tampilData();
}

function openEdit(i) {
    editIndex = i;
    let p = patients[i];

    document.getElementById('editNama').value = p.nama;
    document.getElementById('editJk').value = p.jk;
    document.getElementById('editTanggalLahir').value = p.tanggalLahir;
    document.getElementById('editTelp').value = p.telp;
    document.getElementById('editAlamat').value = p.alamat;

    new bootstrap.Modal(document.getElementById('modalEdit')).show();
}

function simpanEdit() {
    patients[editIndex] = {
        nama: document.getElementById('editNama').value,
        jk: document.getElementById('editJk').value,
        tanggalLahir: document.getElementById('editTanggalLahir').value,
        telp: document.getElementById('editTelp').value,
        alamat: document.getElementById('editAlamat').value
    };
    tampilData();
}

function hapus(i) {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    patients.splice(i, 1);
    tampilData();
}

// Pagination
prevBtn.onclick = () => {
    if (currentPage > 1) currentPage--;
    tampilData();
};
nextBtn.onclick = () => {
    const filteredCount = patients.filter(p => p.nama.toLowerCase().includes((searchInput.value || '').toLowerCase())).length;
    const maxPage = Math.max(1, Math.ceil(filteredCount / perPage));
    if (currentPage < maxPage) currentPage++;
    tampilData();
};

// Search
searchInput.onkeyup = () => {
    currentPage = 1;
    tampilData();
};

tampilData();
