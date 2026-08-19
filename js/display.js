// =====================================================
// DISPLAY CUSTOMER
// =====================================================

const API_URL = CONFIG.API_URL;


// =====================================================
// AMBIL USER
// =====================================================

function getUser() {

    try {

        return JSON.parse(
            localStorage.getItem("user") || "{}"
        );

    } catch (error) {

        return {};

    }

}


// =====================================================
// CEK LOGIN
// =====================================================

function isLoggedIn() {

    return (
        localStorage.getItem("login") === "true"
    );

}


// =====================================================
// SPREADSHEET CUSTOMER
// =====================================================

function getSpreadsheetId() {

    return (
        localStorage.getItem(
            "spreadsheetId"
        ) || ""
    );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text ?? "";

    return div.innerHTML;

}


// =====================================================
// FORMAT TANGGAL
// =====================================================

function formatTanggal(tanggal) {

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
// LOAD DISPLAY
// =====================================================

async function loadDisplay() {

    const spreadsheetId =
        getSpreadsheetId();


    if (!spreadsheetId) {

        console.error(
            "Spreadsheet customer tidak ditemukan."
        );

        document.getElementById(
            "coupleName"
        ).innerText =
            "Display belum terhubung";

        return;

    }


    try {

        const response =
            await fetch(

                API_URL +
                "?action=dashboard" +
                "&spreadsheetId=" +
                encodeURIComponent(
                    spreadsheetId
                ) +
                "&t=" +
                Date.now(),

                {
                    cache: "no-store"
                }

            );


        const data =
            await response.json();


        console.log(
            "Display data:",
            data
        );


        if (!data.success) {

            console.error(
                "Gagal mengambil data display:",
                data
            );

            return;

        }


        // =================================================
        // SETTINGS
        // =================================================

        const settings =
            data.settings || {};


        // =================================================
        // NAMA PENGANTIN
        // =================================================

        const coupleName =
            document.getElementById(
                "coupleName"
            );


        if (coupleName) {

            const bride =
                settings.bride || "";

            const groom =
                settings.groom || "";


            coupleName.innerHTML =
                `${escapeHtml(bride)}
                 ❤️
                 ${escapeHtml(groom)}`;

        }


        // =================================================
        // LOGO
        // =================================================

        const logo =
            document.getElementById(
                "weddingLogo"
            );


        if (
            logo &&
            settings.logo
        ) {

            logo.src =
                settings.logo;

            logo.style.display =
                "block";

        }


        // =================================================
        // WARNA
        // =================================================

        if (settings.primaryColor) {

            document.body.style.background =
                `linear-gradient(
                    135deg,
                    ${settings.primaryColor},
                    ${settings.secondaryColor ||
                    settings.primaryColor}
                )`;

        }


        // =================================================
        // TAMU TERBARU
        // =================================================

        renderLatestGuests(
            data.latestGuests || []
        );


    } catch (error) {

        console.error(
            "Display error:",
            error
        );

    }

}


// =====================================================
// RENDER TAMU
// =====================================================

function renderLatestGuests(
    guests
) {

    const container =
        document.getElementById(
            "latestGuest"
        );


    if (!container) {

        return;

    }


    if (
        !Array.isArray(guests) ||
        guests.length === 0
    ) {

        container.innerHTML = `

            <div class="empty">

                Belum ada tamu yang check-in.

            </div>

        `;

        return;

    }


    let html = "";


    guests.forEach(
        guest => {

            html += `

                <div class="guest-card">

                    <div class="guest-icon">

                        🎉

                    </div>


                    <div class="guest-info">

                        <div class="guest-name">

                            ${escapeHtml(
                                guest.nama || "-"
                            )}

                        </div>


                        <div class="guest-status">

                            Berhasil Check-in

                        </div>

                    </div>


                    <div class="guest-time">

                        ${escapeHtml(
                            guest.jam || "-"
                        )}

                    </div>

                </div>

            `;

        }
    );


    container.innerHTML =
        html;

}


// =====================================================
// FULLSCREEN
// =====================================================

function toggleFullscreen() {

    if (!document.fullscreenElement) {

        document.documentElement
            .requestFullscreen()
            .catch(
                error => {

                    console.error(
                        "Fullscreen gagal:",
                        error
                    );

                }
            );

    } else {

        document.exitFullscreen();

    }

}


// =====================================================
// INIT
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // =============================================
        // CUSTOMER HARUS LOGIN
        // =============================================

        if (!isLoggedIn()) {

            window.location.href =
                "login.html";

            return;

        }


        // =============================================
        // LOAD PERTAMA
        // =============================================

        loadDisplay();


        // =============================================
        // AUTO REFRESH
        // =============================================

        setInterval(
            loadDisplay,
            5000
        );

    }
);