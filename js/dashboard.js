const API_URL = CONFIG.API_URL;

const SPREADSHEET_ID =
    localStorage.getItem("spreadsheetId") || "";


// =====================================================
// CEK LOGIN
// =====================================================

const isLogin =
    localStorage.getItem("login");

if (
    isLogin !== "true" ||
    !SPREADSHEET_ID
) {

    window.location.href =
        "login.html";

}


// =====================================================
// LOAD DASHBOARD
// =====================================================

async function loadDashboard() {

    try {

        const res =
            await fetch(

                API_URL +
                "?action=dashboard" +
                "&spreadsheetId=" +
                encodeURIComponent(
                    SPREADSHEET_ID
                ) +
                "&t=" +
                Date.now(),

                {
                    cache: "no-store"
                }

            );


        const data =
            await res.json();


        console.log(
            "Dashboard:",
            data
        );


        if (!data.success) {

            console.error(
                "Dashboard error:",
                data
            );

            return;

        }


        // =================================================
        // SETTINGS
        // =================================================

        const settings =
            data.settings || {};


        const coupleName =
            document.getElementById(
                "coupleName"
            );

        const weddingDate =
            document.getElementById(
                "weddingDate"
            );

        const weddingVenue =
            document.getElementById(
                "weddingVenue"
            );

        const appName =
            document.getElementById(
                "appName"
            );

        const weddingLogo =
            document.getElementById(
                "weddingLogo"
            );

        const hero =
            document.querySelector(
                ".hero"
            );


        if (coupleName) {

            coupleName.innerHTML =
                `${settings.bride || ""} ❤️ ${settings.groom || ""}`;

        }


        if (weddingDate) {

            weddingDate.innerHTML =
                formatTanggal(
                    settings.date
                );

        }


        if (weddingVenue) {

            weddingVenue.innerHTML =
                "📍 " +
                (settings.venue || "");

        }


        if (appName) {

            appName.innerHTML =
                CONFIG.APP_NAME;

        }


        // =================================================
        // LOGO
        // =================================================

        if (
            settings.logo &&
            weddingLogo
        ) {

            weddingLogo.src =
                settings.logo;

        }


        // =================================================
        // BACKGROUND
        // =================================================

        if (
            settings.background &&
            hero
        ) {

            hero.style.backgroundImage =
                `url("${settings.background}")`;

            hero.style.backgroundSize =
                "cover";

            hero.style.backgroundPosition =
                "center";

        }


        // =================================================
        // THEME
        // =================================================

        if (
            settings.primaryColor
        ) {

            document.documentElement
                .style
                .setProperty(
                    "--primary",
                    settings.primaryColor
                );

        }


        if (
            settings.secondaryColor
        ) {

            document.documentElement
                .style
                .setProperty(
                    "--secondary",
                    settings.secondaryColor
                );

        }


        if (
            settings.accentColor
        ) {

            document.documentElement
                .style
                .setProperty(
                    "--accent",
                    settings.accentColor
                );

        }


        // =================================================
        // STATS
        // =================================================

        const stats =
            data.stats || {};


        setText(
            "total",
            stats.total
        );

        setText(
            "hadir",
            stats.hadir
        );

        setText(
            "belum",
            stats.belum
        );

        setText(
            "waCount",
            stats.wa
        );

        setText(
            "fisikCount",
            stats.fisik
        );

        setText(
            "bothCount",
            stats.both
        );

        setText(
            "noneCount",
            stats.none
        );


        // =================================================
        // PROGRESS
        // =================================================

        const persen =
            stats.total > 0
                ? (
                    stats.hadir /
                    stats.total *
                    100
                ).toFixed(1)
                : 0;


        const progressFill =
            document.getElementById(
                "progressFill"
            );

        const progressText =
            document.getElementById(
                "progressText"
            );


        if (progressFill) {

            progressFill.style.width =
                persen + "%";

        }


        if (progressText) {

            progressText.innerHTML =
                persen +
                "% Tamu Sudah Hadir";

        }


        // =================================================
        // LATEST GUEST
        // =================================================

        renderLatestGuests(
            data.latestGuests || []
        );


    } catch (err) {

        console.error(
            "Gagal load dashboard:",
            err
        );

    }

}


// =====================================================
// SET TEXT
// =====================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.innerText =
        value || 0;

}


// =====================================================
// LATEST GUEST
// =====================================================

function renderLatestGuests(
    data
) {

    const latestGuest =
        document.getElementById(
            "latestGuest"
        );


    if (!latestGuest) return;


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        latestGuest.innerHTML =
            "Belum ada tamu yang check-in.";

        return;

    }


    let html = "";


    data.forEach(
        tamu => {

            html += `

                <div class="latest-card">

                    <div class="latest-icon">
                        🎉
                    </div>

                    <div class="latest-info">

                        <h3>
                            ${escapeHtml(
                                tamu.nama || "-"
                            )}
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

        }
    );


    latestGuest.innerHTML =
        html;

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(
    text
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;

}


// =====================================================
// FORMAT TANGGAL
// =====================================================

function formatTanggal(
    tanggal
) {

    if (!tanggal) {

        return "-";

    }


    const date =
        new Date(tanggal);


    if (
        isNaN(
            date.getTime()
        )
    ) {

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


// =====================================================
// LOAD AWAL
// =====================================================

loadDashboard();


// =====================================================
// REFRESH
// =====================================================

// Cukup 5 detik.
// Tidak perlu lagi 2 request berbeda.

setInterval(
    loadDashboard,
    5000
);