const API_URL = "https://script.google.com/macros/s/AKfycbxypLyJtFO5DdrkBFHPEE6fGqG8HvHyubI4hxfN4jcb00m5auniNEjIvpfQLrFs5Y7P/exec";

let guests = [];

async function loadGuests() {

    try {

        const response = await fetch(API_URL + "?action=guests");

        guests = await response.json();

        renderGuests(guests);

    } catch(err){

        console.error(err);

    }

}

function renderGuests(data){

    const tbody = document.getElementById("guestTable");

    tbody.innerHTML = "";

    data.forEach(guest => {

        tbody.innerHTML += `
        <tr>

            <td>${guest.id}</td>

            <td>${guest.nama}</td>

            <td>
    <span class="${guest.status === "HADIR" ? "hadir" : "belum"}">
        ${guest.status}
    </span>
</td>

            <td>${guest.tipe}</td>

            <td>${formatJam(guest.jam)}</td>

        </tr>
        `;

    });

}

document.getElementById("search").addEventListener("keyup", function(){

    const keyword = this.value.toLowerCase();

    const hasil = guests.filter(g =>
        (g.nama || "").toLowerCase().includes(keyword)
    );

    renderGuests(hasil);

});

loadGuests();

setInterval(loadGuests,3000);

function formatJam(jam){

    if(!jam) return "-";

    const d = new Date(jam);

    return d.toLocaleTimeString("id-ID",{
        hour:"2-digit",
        minute:"2-digit"
    });

}