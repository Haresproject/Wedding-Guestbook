const API_URL = "https://script.google.com/macros/s/AKfycbxypLyJtFO5DdrkBFHPEE6fGqG8HvHyubI4hxfN4jcb00m5auniNEjIvpfQLrFs5Y7P/exec";

let lastGuestTime = "";

// ================= SETTINGS =================
async function loadSettings(){

    const res = await fetch(API_URL + "?action=settings");

    const data = await res.json();

    document.getElementById("coupleName").innerHTML =
        `${data.bride} ❤️ ${data.groom}`;

    document.getElementById("weddingDate").innerHTML =
        formatTanggal(data.date);

    document.getElementById("weddingVenue").innerHTML =
        data.venue;

    document.getElementById("weddingLogo").src =
        data.logo;

}

// ================= STATISTIK =================
async function loadStats(){

    try{

        const res = await fetch(API_URL + "?action=stats");

        const data = await res.json();

        document.getElementById("total").innerText = data.total;
        document.getElementById("hadir").innerText = data.hadir;
        document.getElementById("belum").innerText = data.belum;

    }catch(err){

        console.log(err);

    }

}

// Tamu terakhir
async function loadLatestGuest(){

    try{

        const res = await fetch(API_URL + "?action=latest");

        const data = await res.json();

        if(data.time != lastGuestTime){

            lastGuestTime = data.time;

            document.getElementById("latestGuest").innerHTML = `
                <h3>🎉 Tamu Terakhir Check-in</h3>
                <br>
                <h2>${data.nama || "-"}</h2>
            `;

        }

    }catch(err){

        console.log(err);

    }

}

loadSettings();
loadStats();
loadLatestGuest();

setInterval(loadStats,3000);
setInterval(loadLatestGuest,2000);
function formatTanggal(tanggal){

    const d = new Date(tanggal);

    return d.toLocaleDateString("id-ID",{
        day:"numeric",
        month:"long",
        year:"numeric"
    });

}