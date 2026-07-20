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