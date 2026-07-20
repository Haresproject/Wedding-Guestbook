const API_URL = "https://script.google.com/macros/s/AKfycbxypLyJtFO5DdrkBFHPEE6fGqG8HvHyubI4hxfN4jcb00m5auniNEjIvpfQLrFs5Y7P/exec";

let lastGuestTime = "";
let chart;

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

        // Angka langsung tampil
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

        // Progress Bar
        const persen = data.total > 0
            ? ((data.hadir / data.total) * 100).toFixed(1)
            : 0;

        document.getElementById("progressFill").style.width = persen + "%";
        document.getElementById("progressText").innerHTML =
            persen + "% Tamu Sudah Hadir";

        // Donut Chart
        updateChart(data.hadir, data.belum);

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
function updateChart(hadir, belum){

    const ctx = document
        .getElementById("attendanceChart")
        .getContext("2d");

    if(chart){

        chart.data.datasets[0].data = [
            hadir,
            belum
        ];

        chart.update();

        return;

    }

    chart = new Chart(ctx,{

        type:"doughnut",

        data:{

            labels:[
                "Sudah Hadir",
                "Belum Hadir"
            ],

            datasets:[{

                data:[
                    hadir,
                    belum
                ],

                backgroundColor:[
                    "#214E43",
                    "#E8C547"
                ],

                borderWidth:0

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{
                    position:"bottom"
                }

            }

        }

    });

}