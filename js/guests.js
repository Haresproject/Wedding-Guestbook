// =====================================================
// ACTIVE SPREADSHEET
// =====================================================

function getActiveSpreadsheetId() {

    try {

        const user =
            JSON.parse(
                localStorage.getItem("user") || "{}"
            );

        // =============================================
        // SUPER ADMIN
        // =============================================

        if (
            String(user.role || "")
                .trim()
                .toLowerCase() === "superadmin"
            ||
            String(user.username || "")
                .trim()
                .toLowerCase() === "admin"
        ) {

            return CONFIG.SUPER_ADMIN_SPREADSHEET_ID;
        }

        // =============================================
        // CUSTOMER
        // =============================================

        return (
            localStorage.getItem("spreadsheetId") || ""
        );

    } catch (error) {

        console.error(
            "Gagal menentukan spreadsheet aktif:",
            error
        );

        return "";
    }
}

const API_URL = CONFIG.API_URL;

let guests = [];
let filteredGuests = [];
let currentTypeFilter = "ALL";

// Pagination
let currentPage = 1;
const rowsPerPage = 10;

// ================= LOAD DATA =================
async function loadGuests() {

    try {

        const spreadsheetId = getActiveSpreadsheetId();

        if (!spreadsheetId) {

            console.error("Spreadsheet ID kosong.");
            return;

        }

        const response = await fetch(

            API_URL +
            "?action=guests" +
            "&spreadsheetId=" +
            encodeURIComponent(spreadsheetId) +
            "&t=" +
            Date.now(),

            {
                cache: "no-store"
            }

        );

        const data = await response.json();

        console.log("Guests:", data);

        if (Array.isArray(data)) {

            guests = data;

        } else if (data && Array.isArray(data.guests)) {

            guests = data.guests;

        } else {

            guests = [];

        }

        filteredGuests = [...guests];
        currentPage = 1;
        renderGuests(filteredGuests);

    }
    catch (err) {

        console.error("Load guests gagal:", err);

    }

}

// ================= WARNA TIPE TAMU =================

function getTipeBadge(tipe) {

    const value = String(tipe || "")
        .trim()
        .toUpperCase();

    if (value === "VIP") {

        return `<span class="tipe-badge tipe-vip">VIP</span>`;

    }

    if (value === "KELUARGA") {

        return `<span class="tipe-badge tipe-keluarga">Keluarga</span>`;

    }

    if (value === "BRIDESMAID") {

        return `<span class="tipe-badge tipe-bridesmaid">Bridesmaid</span>`;

    }

    return `<span class="tipe-badge tipe-reguler">Reguler</span>`;

}

// ================= FILTER TIPE TAMU =================

function filterTipe(tipe) {

    currentTypeFilter = tipe;
    currentPage = 1;

    // Highlight tombol aktif
    document.querySelectorAll(".filter-tipe-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    const activeBtn = document.querySelector(`[data-tipe="${tipe}"]`);

    if (activeBtn) {
        activeBtn.classList.add("active");
    }

    applyGuestFilter();

}

// ================= GABUNG SEARCH + FILTER =================

function applyGuestFilter() {

    const keyword = document
        .getElementById("search")
        .value
        .toLowerCase()
        .trim();

    filteredGuests = guests.filter(g => {

        const nama = String(g.nama || "").toLowerCase();
        const id = String(g.id || "").toLowerCase();
        const notes = String(g.notes || "").toLowerCase();
        const tipe = String(g.tipe || "REGULER").toUpperCase();

        const cocokSearch =
            !keyword ||
            nama.includes(keyword) ||
            id.includes(keyword) ||
            notes.includes(keyword);

        const cocokTipe =
            currentTypeFilter === "ALL" ||
            tipe === currentTypeFilter;

        return cocokSearch && cocokTipe;

    });

    renderGuests(filteredGuests);

}

// ================= TAMPILKAN TABEL =================

function renderGuests(data) {

    const tbody = document.getElementById("guestTable");

    let html = "";

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const pageData = data.slice(start, end);

    pageData.forEach(guest => {

        const statusClass =
            guest.status === "HADIR"
                ? "hadir"
                : "belum";

        const tombol =
            guest.status === "HADIR"
                ? `<button class="btn-disabled" disabled>✔ Sudah Hadir</button>`
                : `<button class="btn-checkin" onclick="manualCheckin('${guest.id}')">
                    ✅ Check-in
                   </button>`;

        html += `
        <tr>

            <td>${guest.id}</td>

            <td>${guest.nama}</td>

            <td>${guest.notes || "-"}</td>

            <td>
                <span class="${statusClass}">
                    ${guest.status}
                </span>
            </td>

            <td>${getTipeBadge(guest.tipe)}</td>

            <td>${formatJam(guest.jam)}</td>

            <td>${tombol}</td>

        </tr>`;
    });

    tbody.innerHTML = html;

    updatePagination(data.length);

    const info = document.getElementById("tableInfo");

    if (info) {

        const from = data.length === 0 ? 0 : start + 1;
        const to = Math.min(end, data.length);

        info.innerText = `Menampilkan ${from}-${to} dari ${data.length} tamu`;

    }

}

// ================= CHECK-IN MANUAL =================

async function manualCheckin(id) {

    if (!confirm("Check-in tamu ini?")) return;

    try {

        const res = await fetch(API_URL, {

            method: "POST",

            body: JSON.stringify({

                action: "manualCheckin",

                id: id,

                spreadsheetId: getActiveSpreadsheetId()

            })

        });

        const data = await res.json();

        alert(data.message || "Check-in berhasil.");

        loadGuests();

    } catch (err) {

        console.log(err);

        alert("Terjadi kesalahan.");

    }

}

// ================= SEARCH =================

document
    .getElementById("search")
    .addEventListener("keyup", function () {

        currentPage = 1;

        applyGuestFilter();

    });
    
// ================= FORMAT JAM =================

function formatJam(jam) {

    if (!jam) return "-";

    const d = new Date(jam);

    return d.toLocaleTimeString("id-ID", {

        hour: "2-digit",

        minute: "2-digit"

    });

}

// ================= AUTO LOAD =================

loadGuests();

// ================= IMPORT EXCEL =================

document
    .getElementById("excelFile")
    .addEventListener("change", importExcel);

async function importExcel(e) {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async function (evt) {

        const workbook = XLSX.read(evt.target.result, {
            type: "binary"
        });

        const sheet = workbook.Sheets[
            workbook.SheetNames[0]
        ];

        const rows = XLSX.utils.sheet_to_json(sheet);

        if (rows.length == 0) {

            alert("File Excel kosong.");

            return;

        }

        if (!confirm("Import " + rows.length + " tamu?")) return;

        try {

            const res = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    action: "importGuests",

                    guests: rows,

                    spreadsheetId: getActiveSpreadsheetId()

                })

            });

            const result = await res.json();

            alert(result.message || "Import berhasil.");

            loadGuests();

        } catch (err) {

            console.log(err);

            alert("Import gagal.");

        }

    };

    reader.readAsBinaryString(file);

}

// ================= PAGINATION =================

function updatePagination(totalData) {

    const totalPages = Math.max(1, Math.ceil(totalData / rowsPerPage));

    document.getElementById("pageInfo").innerText =
        `Halaman ${currentPage} / ${totalPages}`;

    document.getElementById("prevBtn").disabled =
        currentPage === 1;

    document.getElementById("nextBtn").disabled =
        currentPage === totalPages;

}

document.getElementById("prevBtn").onclick = () => {

    if (currentPage > 1) {

        currentPage--;

        renderGuests(filteredGuests);

    }

};

document.getElementById("nextBtn").onclick = () => {

    const totalPages = Math.max(1, Math.ceil(filteredGuests.length / rowsPerPage));

    if (currentPage < totalPages) {

        currentPage++;

        renderGuests(filteredGuests);

    }

};

// ================= EXPORT =================

function exportExcel() {

    const data = guests.map(g => ({

        ID: g.id,

        Nama: g.nama,

        Notes: g.notes || "",

        Status: g.status,

        Tipe: g.tipe,

        Jam: g.jam,

        Tanggal: g.tanggal

    }));

    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, "Daftar Tamu");

    XLSX.writeFile(wb, "Daftar_Tamu.xlsx");

}

async function exportPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text("Daftar Tamu Wedding", 14, 18);

    const rows = guests.map(g => [

        g.id,

        g.nama,

        g.notes || "-",

        g.status,

        g.tipe,

        formatJam(g.jam)

    ]);

    doc.autoTable({

        head: [["ID", "Nama", "Notes", "Status", "Tipe", "Jam"]],

        body: rows,

        startY: 25

    });

    doc.save("Daftar_Tamu.pdf");

}

// ================= TAMBAH TAMU =================

async function saveGuest() {

    const nama = document.getElementById("guestNama").value.trim();
    const notes = document.getElementById("guestNotes").value.trim();
    const tipe = document.getElementById("guestTipe").value;
    const fisik = document.getElementById("guestFisik").checked;

    if (nama === "") {

        alert("Nama tamu wajib diisi.");

        return;

    }

    try {

        const res = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                action: "addGuest",

                nama: nama,
                notes: notes,
                tipe: tipe,
                fisik: fisik,

                spreadsheetId: getActiveSpreadsheetId()

            })

        });

        const result = await res.json();

        if (result.success) {

            alert(result.message || "Tamu berhasil ditambahkan.");

            closeAddGuestModal();

            document.getElementById("guestNama").value = "";
            document.getElementById("guestNotes").value = "";
            document.getElementById("guestFisik").checked = false;

            loadGuests();

        } else {

            alert(result.message || "Gagal menambahkan tamu.");

        }

    } catch (err) {

        console.log(err);

        alert("Gagal menambahkan tamu.");

    }

}

function showAddGuestModal() {

    document.getElementById("addGuestModal").style.display = "flex";

}

function closeAddGuestModal() {

    document.getElementById("addGuestModal").style.display = "none";

}