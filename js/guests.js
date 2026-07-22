const API_URL = "https://script.google.com/macros/s/AKfycbxypLyJtFO5DdrkBFHPEE6fGqG8HvHyubI4hxfN4jcb00m5auniNEjIvpfQLrFs5Y7P/exec";

let guests = [];

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

    tbody.innerHTML = "";

    data.forEach(guest => {

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

        tbody.innerHTML += `
        <tr>

            <td>${guest.id}</td>

            <td>${guest.nama}</td>

            <td>
                <span class="${statusClass}">
                    ${guest.status}
                </span>
            </td>

            <td>${guest.tipe || "-"}</td>

            <td>${formatJam(guest.jam)}</td>

            <td>${tombol}</td>

        </tr>
        `;

    });

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

setInterval(loadGuests,3000);

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