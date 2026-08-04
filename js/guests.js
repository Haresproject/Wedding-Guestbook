const API_URL = "https://wedguest.kosthandoko907.workers.dev";

let guests = [];

// Pagination
let currentPage = 1;
const rowsPerPage = 10;
// ================= LOAD DATA =================
async function loadGuests() {

    try {

        const response = await fetch(API_URL + "?action=guests&t=" + Date.now());

        guests = await response.json();

        renderGuests(guests);

    } catch(err){

        console.error(err);

    }

}

// ================= TAMPILKAN TABEL =================
function renderGuests(data){

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
            : `<button class="btn-checkin"
                onclick="manualCheckin('${guest.id}')">
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

            <td>${guest.tipe || "-"}</td>

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
async function manualCheckin(id){

    if(!confirm("Check-in tamu ini?")) return;

    try{

        const res = await fetch(API_URL,{

            method:"POST",

            body:JSON.stringify({

                action:"manualCheckin",

                id:id

            })

        });

        const data = await res.json();

        alert(data.message);

        loadGuests();

    }catch(err){

        console.log(err);

        alert("Terjadi kesalahan.");

    }

}

// ================= SEARCH =================
document.getElementById("search").addEventListener("keyup",function(){

    const keyword = this.value.toLowerCase();

    const hasil = guests.filter(g =>

        (g.nama || "")
        .toLowerCase()
        .includes(keyword)

    );

    currentPage = 1;
    renderGuests(hasil);

});

// ================= FORMAT JAM =================
function formatJam(jam){

    if(!jam) return "-";

    const d = new Date(jam);

    return d.toLocaleTimeString("id-ID",{

        hour:"2-digit",

        minute:"2-digit"

    });

}

// ================= AUTO LOAD =================
loadGuests();

// ================= IMPORT EXCEL =================

document
.getElementById("excelFile")
.addEventListener("change", importExcel);

async function importExcel(e){

    const file = e.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = async function(evt){

        const workbook = XLSX.read(evt.target.result,{
            type:"binary"
        });

        const sheet = workbook.Sheets[
            workbook.SheetNames[0]
        ];

        const rows = XLSX.utils.sheet_to_json(sheet);

        if(rows.length==0){

            alert("File Excel kosong.");

            return;

        }

        if(!confirm(
            "Import "+rows.length+" tamu?"
        )) return;

        try{

            const res = await fetch(API_URL,{

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    action:"importGuests",

                    guests:rows

                })

            });

            const result = await res.json();

            alert(result.message);

            loadGuests();

        }catch(err){

            console.log(err);

            alert("Import gagal.");

        }

    };

    reader.readAsBinaryString(file);

}

function updatePagination(totalData){

    const totalPages = Math.ceil(totalData / rowsPerPage);

    document.getElementById("pageInfo").innerText =
        `Halaman ${currentPage} / ${totalPages}`;

    document.getElementById("prevBtn").disabled =
        currentPage === 1;

    document.getElementById("nextBtn").disabled =
        currentPage === totalPages;
}

function exportExcel(){

    const data = guests.map(g=>({

        ID:g.id,

        Nama:g.nama,

        Status:g.status,

        Tipe:g.tipe,

        Jam:g.jam,

        Tanggal:g.tanggal

    }));

    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb,ws,"Daftar Tamu");

    XLSX.writeFile(wb,"Daftar_Tamu.xlsx");

}
async function exportPDF(){

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text("Daftar Tamu Wedding",14,18);

    const rows = guests.map(g=>[

        g.id,

        g.nama,

        g.status,

        g.tipe,

        formatJam(g.jam)

    ]);

    doc.autoTable({

        head:[["ID","Nama","Status","Tipe","Jam"]],

        body:rows,

        startY:25

    });

    doc.save("Daftar_Tamu.pdf");

}
document.getElementById("prevBtn").onclick = () => {

    if(currentPage > 1){

        currentPage--;

        renderGuests(guests);

    }

};

document.getElementById("nextBtn").onclick = () => {

    const totalPages = Math.ceil(guests.length / rowsPerPage);

    if(currentPage < totalPages){

        currentPage++;

        renderGuests(guests);

    }

};

async function saveGuest(){

    const nama = document.getElementById("guestNama").value.trim();
    const notes = document.getElementById("guestNotes").value.trim();
    const tipe = document.getElementById("guestTipe").value;
    const fisik = document.getElementById("guestFisik").checked;

    if(nama === ""){

        alert("Nama tamu wajib diisi.");

        return;

    }

    try{

        const res = await fetch(API_URL,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                action:"addGuest",

                nama:nama,
                notes:notes,
                tipe:tipe,
                fisik:fisik

            })

        });

        const result = await res.json();

        if(result.success){

            alert("Tamu berhasil ditambahkan.");

            closeAddGuestModal();

            document.getElementById("guestNama").value = "";
            document.getElementById("guestNotes").value = "";
            document.getElementById("guestFisik").checked = false;

            loadGuests();

        }else{

            alert(result.message);

        }

    }catch(err){

        console.log(err);

        alert("Gagal menambahkan tamu.");

    }

}