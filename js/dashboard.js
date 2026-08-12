const API_URL = CONFIG.API_URL;

const SPREADSHEET_ID =
    localStorage.getItem("spreadsheetId") || "";
    
let lastGuestTime = "";

// ================= SETTINGS =================

async function loadSettings() {

    try {

        const res = await fetch(
    CONFIG.API_URL +
    "?action=settings" +
    "&spreadsheetId=" +
    encodeURIComponent(SPREADSHEET_ID) +
    "&t=" +
    Date.now()
);

        const data = await res.json();

        const coupleName = document.getElementById("coupleName");
        const weddingDate = document.getElementById("weddingDate");
        const weddingVenue = document.getElementById("weddingVenue");
        const appName = document.getElementById("appName");
        const weddingLogo = document.getElementById("weddingLogo");
        const hero = document.querySelector(".hero");

        if (coupleName) {
            coupleName.innerHTML =
                `${data.bride || ""} ❤️ ${data.groom || ""}`;
        }

        if (weddingDate) {
            weddingDate.innerHTML =
                formatTanggal(data.date);
        }

        if (weddingVenue) {
            weddingVenue.innerHTML =
                "📍 " + (data.venue || "");
        }

        if (appName) {
            appName.innerHTML =
                CONFIG.APP_NAME;
        }

        // ================= LOGO =================

        if (data.logo && weddingLogo) {

            weddingLogo.src = data.logo;

        }

        // ================= BACKGROUND =================

        if (data.background && hero) {

            hero.style.backgroundImage =
                `url("${data.background}")`;

            hero.style.backgroundSize =
                "cover";

            hero.style.backgroundPosition =
                "center";

        }

        // ================= THEME =================

        if (data.primaryColor) {

            document.documentElement.style.setProperty(
                "--primary",
                data.primaryColor
            );

        }

        if (data.secondaryColor) {

            document.documentElement.style.setProperty(
                "--secondary",
                data.secondaryColor
            );

        }

        if (data.accentColor) {

            document.documentElement.style.setProperty(
                "--accent",
                data.accentColor
            );

        }

    } catch (err) {

        console.error(
            "Gagal load settings:",
            err
        );

    }

}


// ================= STATS =================

async function loadStats() {

    try {

        const res = await fetch(
            CONFIG.API_URL +
            "?action=stats" +
            "&spreadsheetId=" +
            encodeURIComponent(SPREADSHEET_ID) +
            "&t=" +
            Date.now()
        );

        const data = await res.json();

        console.log("STATISTICS:", data);

        const total = document.getElementById("total");
        const hadir = document.getElementById("hadir");
        const belum = document.getElementById("belum");

        const waCount =
            document.getElementById("waCount");

        const fisikCount =
            document.getElementById("fisikCount");

        const bothCount =
            document.getElementById("bothCount");

        const noneCount =
            document.getElementById("noneCount");


        if (total) {
            total.innerText = data.total || 0;
        }

        if (hadir) {
            hadir.innerText = data.hadir || 0;
        }

        if (belum) {
            belum.innerText = data.belum || 0;
        }

        if (waCount) {
            waCount.innerText = data.wa || 0;
        }

        if (fisikCount) {
            fisikCount.innerText = data.fisik || 0;
        }

        if (bothCount) {
            bothCount.innerText = data.both || 0;
        }

        if (noneCount) {
            noneCount.innerText = data.none || 0;
        }


        // ================= PROGRESS =================

        const persen =
            data.total > 0
                ? ((data.hadir / data.total) * 100).toFixed(1)
                : 0;


        const progressFill =
            document.getElementById("progressFill");

        const progressText =
            document.getElementById("progressText");


        if (progressFill) {

            progressFill.style.width =
                persen + "%";

        }


        if (progressText) {

            progressText.innerHTML =
                persen + "% Tamu Sudah Hadir";

        }

    } catch (err) {

        console.error(
            "Gagal load statistik:",
            err
        );

    }

}


// ================= LATEST GUEST =================

async function loadLatestGuest() {

    try {

        const res = await fetch(
    API_URL +
    "?action=latestGuests" +
    "&spreadsheetId=" +
    encodeURIComponent(SPREADSHEET_ID) +
    "&t=" +
    Date.now()
);

        const data = await res.json();

        const latestGuest =
            document.getElementById("latestGuest");

        if (!latestGuest) return;

        if (!Array.isArray(data) || data.length === 0) {

            latestGuest.innerHTML =
                "Belum ada tamu yang check-in.";

            return;

        }

        let html = "";

        data.forEach(tamu => {

            html += `
                <div class="latest-card">

                    <div class="latest-icon">
                        🎉
                    </div>

                    <div class="latest-info">

                        <h3>
                            ${tamu.nama || "-"}
                        </h3>

                        <p>
                            Berhasil Check-in
                        </p>

                    </div>

                    <div class="latest-time">
                        ${tamu.jam || "-"}
                    </div>

                </div>
            `;

        });

        latestGuest.innerHTML = html;

    } catch (err) {

        console.error(
            "Gagal load aktivitas:",
            err
        );

    }

}


// ================= FORMAT TANGGAL =================

function formatTanggal(tanggal) {

    if (!tanggal) return "-";

    const date = new Date(tanggal);

    if (isNaN(date.getTime())) {
        return tanggal;
    }

    return date.toLocaleDateString(
        "id-ID",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


// ================= LOAD =================

loadSettings();
loadStats();
loadLatestGuest();


// ================= AUTO REFRESH =================

setInterval(
    loadStats,
    5000
);

setInterval(
    loadLatestGuest,
    2000
);