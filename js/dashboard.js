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
        }

    }catch(err){

        console.log(err);

    }

}

// ================= STATS =================

async function loadStats(){

    try{

        const res = await fetch(API_URL + "?action=stats");

        const data = await res.json();

        animateNumber("total", data.total);
        animateNumber("hadir", data.hadir);
        animateNumber("belum", data.belum);

    }catch(err){

        console.log(err);

    }

}

// ================= LATEST GUEST =================

async function loadLatestGuest(){

    try{

        const res = await fetch(API_URL + "?action=latest&t=" + Date.now());

        const data = await res.json();

        if(data.time != lastGuestTime){

            lastGuestTime = data.time;

            const jam = data.time
                ? new Date(Number(data.time)).toLocaleTimeString("id-ID",{
                    hour:"2-digit",
                    minute:"2-digit"
                })
                : "-";

            document.getElementById("latestGuest").innerHTML = `
                <div class="latest-card">

                    <div class="latest-icon">
                        🎉
                    </div>

                    <div class="latest-info">

                        <h3>${data.nama || "-"}</h3>

                        <p>Berhasil Check-in</p>

                    </div>

                    <div class="latest-time">

                        ${jam}

                    </div>

                </div>
            `;

        }

    }catch(err){

        console.log(err);

    }

}
// ================= ANIMATION =================

function animateNumber(id,target){

    const el = document.getElementById(id);

    let current = parseInt(el.innerText) || 0;

    const step = target > current ? 1 : -1;

    const interval = setInterval(()=>{

        current += step;

        el.innerText = current;

        if(current == target){

            clearInterval(interval);

        }

    },15);

}

// ================= FORMAT =================

function formatTanggal(tanggal){

    if(!tanggal) return "-";

    const d = new Date(tanggal);

    return d.toLocaleDateString("id-ID",{

        day:"numeric",

        month:"long",

        year:"numeric"

    });

}

function formatJam(time){

    if(!time) return "";

    const d = new Date(time);

    return d.toLocaleTimeString("id-ID",{

        hour:"2-digit",

        minute:"2-digit",

        second:"2-digit"

    });

}

// ================= LOAD =================

loadSettings();

loadStats();

loadLatestGuest();

setInterval(loadStats,3000);

setInterval(loadLatestGuest,2000);