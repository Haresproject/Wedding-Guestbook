const API_URL = "https://script.google.com/macros/s/AKfycbxypLyJtFO5DdrkBFHPEE6fGqG8HvHyubI4hxfN4jcb00m5auniNEjIvpfQLrFs5Y7P/exec";

let lastGuestTime = "";

// ================= SETTINGS =================

async function loadSettings(){

    try{

        const res = await fetch(API_URL + "?action=settings");
        const data = await res.json();

        document.getElementById("coupleName").innerHTML =
            `${data.bride} ❤️ ${data.groom}`;

        document.getElementById("weddingDate").innerHTML =
            formatTanggal(data.date);

        document.getElementById("weddingVenue").innerHTML =
            "📍 " + data.venue;

        if(data.logo){
            document.getElementById("weddingLogo").src = data.logo;
        if(data.background){

    document.querySelector(".hero").style.backgroundImage =
        `url(${data.background})`;

    document.querySelector(".hero").style.backgroundSize =
        "cover";

    document.querySelector(".hero").style.backgroundPosition =
        "center";

}
        }
        // Dynamic Theme
if(data.primaryColor){
    document.documentElement.style.setProperty(
        "--primary",
        data.primaryColor
    );
}

if(data.secondaryColor){
    document.documentElement.style.setProperty(
        "--secondary",
        data.secondaryColor
    );
}

if(data.accentColor){
    document.documentElement.style.setProperty(
        "--accent",
        data.accentColor
    );
}

    }catch(err){
        console.log(err);
    }

}

// ================= STATS =================

async function loadStats(){

    try{

        const res = await fetch(API_URL + "?action=stats&t=" + Date.now());
        const data = await res.json();

        document.getElementById("total").innerText = data.total;
        document.getElementById("hadir").innerText = data.hadir;
        document.getElementById("belum").innerText = data.belum;

        const persen = data.total > 0
            ? ((data.hadir / data.total) * 100).toFixed(1)
            : 0;

        document.getElementById("progressFill").style.width =
            persen + "%";

        document.getElementById("progressText").innerHTML =
            persen + "% Tamu Sudah Hadir";

    }catch(err){

        console.log(err);

    }

}

// ================= LATEST GUEST =================

async function loadLatestGuest(){

    try{

        const res = await fetch(API_URL + "?action=latestGuests&t=" + Date.now());

        const data = await res.json();

        if(data.length === 0){

            document.getElementById("latestGuest").innerHTML =
                "Belum ada tamu yang check-in.";

            return;

        }

        let html = "";

        data.forEach(tamu => {

            html += `
                <div class="latest-card">

                    <div class="latest-icon">🎉</div>

                    <div class="latest-info">
                        <h3>${tamu.nama}</h3>
                        <p>Berhasil Check-in</p>
                    </div>

                    <div class="latest-time">
                        ${tamu.jam}
                    </div>

                </div>
            `;

        });

        document.getElementById("latestGuest").innerHTML = html;

    }catch(err){

        console.log(err);

    }

}

// ================= FORMAT =================

function formatTanggal(tanggal){

    if(!tanggal) return "-";

    return new Date(tanggal).toLocaleDateString("id-ID",{
        day:"numeric",
        month:"long",
        year:"numeric"
    });

}

// ================= LOAD =================

loadSettings();
loadStats();
loadLatestGuest();

setInterval(loadStats,5000);
setInterval(loadLatestGuest,2000);