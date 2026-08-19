// =====================================================
// SESSION HELPER
// =====================================================

function getUser() {

    try {

        const user =
            localStorage.getItem("user");

        if (!user) {
            return null;
        }

        return JSON.parse(user);

    } catch (error) {

        console.error(
            "Gagal membaca user:",
            error
        );

        return null;

    }

}


// =====================================================
// CEK LOGIN
// =====================================================

function isLogin() {

    return (
        localStorage.getItem("login") === "true"
    );

}


// =====================================================
// CEK SUPER ADMIN
// =====================================================

function isSuperAdmin() {

    const user =
        getUser() || {};

    return (
        String(user.role || "")
            .trim()
            .toLowerCase() === "superadmin"
        ||
        String(user.username || "")
            .trim()
            .toLowerCase() === "admin"
    );

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    localStorage.clear();

    sessionStorage.clear();

    window.location.href =
        "login.html";

}


// =====================================================
// SESSION DASHBOARD
// =====================================================

(function () {

    const USER =
        getUser() || {};

    const IS_LOGIN =
        isLogin();

    const IS_SUPER_ADMIN =
        isSuperAdmin();


    // =================================================
    // CEK LOGIN
    // =================================================

    if (!IS_LOGIN) {

        window.location.href =
            "login.html";

        return;

    }


    // =================================================
    // SPREADSHEET ID
    // =================================================

    const SPREADSHEET_ID =
        IS_SUPER_ADMIN
            ? (
                CONFIG.SUPER_ADMIN_SPREADSHEET_ID ||
                ""
            )
            : (
                localStorage.getItem(
                    "spreadsheetId"
                ) || ""
            );


    console.log(
        "=============================="
    );

    console.log(
        "SESSION"
    );

    console.log(
        "User:",
        USER
    );

    console.log(
        "Super Admin:",
        IS_SUPER_ADMIN
    );

    console.log(
        "Spreadsheet ID:",
        SPREADSHEET_ID
    );

    console.log(
        "=============================="
    );


    // =================================================
    // CUSTOMER WAJIB PUNYA SPREADSHEET
    // =================================================

    if (
        !IS_SUPER_ADMIN &&
        !SPREADSHEET_ID
    ) {

        console.warn(
            "Customer belum memiliki Spreadsheet ID."
        );

        window.location.href =
            "activation.html";

        return;

    }


    // =================================================
    // SUPER ADMIN
    // =================================================

    if (
        IS_SUPER_ADMIN &&
        !SPREADSHEET_ID
    ) {

        console.error(
            "SUPER_ADMIN_SPREADSHEET_ID belum diatur di config.js"
        );

    }

    // =================================================
    // LOAD DASHBOARD
    // =================================================

    async function loadDashboard() {

        if (!SPREADSHEET_ID) {

            console.error(
                "Spreadsheet ID kosong."
            );

            return;

        }


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
                    (
                        settings.venue ||
                        ""
                    );

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

            if (settings.primaryColor) {

                document.documentElement
                    .style
                    .setProperty(
                        "--primary",
                        settings.primaryColor
                    );

            }


            if (settings.secondaryColor) {

                document.documentElement
                    .style
                    .setProperty(
                        "--secondary",
                        settings.secondaryColor
                    );

            }


            if (settings.accentColor) {

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


    // =================================================
    // SET TEXT
    // =================================================

    function setText(
        id,
        value
    ) {

        const element =
            document.getElementById(
                id
            );


        if (!element) {
            return;
        }


        element.innerText =
            value ?? 0;

    }


    // =================================================
    // LATEST GUEST
    // =================================================

    function renderLatestGuests(
        data
    ) {

        const latestGuest =
            document.getElementById(
                "latestGuest"
            );


        if (!latestGuest) {
            return;
        }


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
                            ${escapeHtml(
                                tamu.jam || "-"
                            )}
                        </div>

                    </div>

                `;

            }
        );


        latestGuest.innerHTML =
            html;

    }


    // =================================================
    // ESCAPE HTML
    // =================================================

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


    // =================================================
    // FORMAT TANGGAL
    // =================================================

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


    // =================================================
    // INIT
    // =================================================

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            setupAdminMenu();

            loadDashboard();

            setInterval(
                loadDashboard,
                5000
            );

        }
    );

})();