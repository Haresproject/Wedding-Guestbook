// =====================================================
// LICENSE SYSTEM
// =====================================================

const LICENSE_STORAGE_KEY = "license";
const SPREADSHEET_ID_STORAGE_KEY = "spreadsheetId";
const OWNER_STORAGE_KEY = "owner";


// =====================================================
// CEK SUPER ADMIN
// =====================================================

function isSuperAdmin() {

    try {

        const user =
            JSON.parse(
                localStorage.getItem("user") || "{}"
            );

        return (
            String(user.role || "")
                .trim()
                .toLowerCase() === "superadmin"
            ||
            String(user.username || "")
                .trim()
                .toLowerCase() === "admin"
        );

    } catch (error) {

        console.error(
            "Error cek Super Admin:",
            error
        );

        return false;

    }

}


// =====================================================
// AMBIL USER YANG SEDANG LOGIN
// =====================================================

function getCurrentUsername() {

    try {

        const user =
            JSON.parse(
                localStorage.getItem("user") || "{}"
            );

        return String(
            user.username || ""
        ).trim();

    } catch (error) {

        return "";

    }

}


// =====================================================
// AMBIL PENDING ACTIVATION USER
// =====================================================

function getPendingActivationUsername() {

    return (
        localStorage.getItem(
            "pendingActivationUsername"
        ) || ""
    ).trim();

}


// =====================================================
// AMBIL LICENSE
// =====================================================

function getSavedLicense() {

    return (
        localStorage.getItem(
            LICENSE_STORAGE_KEY
        ) || ""
    );

}


function getSavedSpreadsheetId() {

    return (
        localStorage.getItem(
            SPREADSHEET_ID_STORAGE_KEY
        ) || ""
    );

}


// =====================================================
// SIMPAN LICENSE
// =====================================================

function saveLicense(license) {

    localStorage.setItem(
        LICENSE_STORAGE_KEY,
        String(license || "")
            .trim()
            .toUpperCase()
    );

}


// =====================================================
// SIMPAN SPREADSHEET
// =====================================================

function saveSpreadsheetId(id) {

    localStorage.setItem(
        SPREADSHEET_ID_STORAGE_KEY,
        String(id || "").trim()
    );

}


// =====================================================
// HAPUS LICENSE
// =====================================================

function removeLicense() {

    localStorage.removeItem(
        LICENSE_STORAGE_KEY
    );

    localStorage.removeItem(
        SPREADSHEET_ID_STORAGE_KEY
    );

    localStorage.removeItem(
        OWNER_STORAGE_KEY
    );

    localStorage.removeItem(
        "activatedUsername"
    );

    localStorage.removeItem(
        "licenseUsername"
    );

}


// =====================================================
// VALIDATE LICENSE KE SERVER
// =====================================================

async function validateLicense(license) {

    license =
        String(license || "")
            .trim()
            .toUpperCase();


    if (!license) {

        return {

            success: false,

            message:
                "License wajib diisi."

        };

    }


    try {

        const res =
            await fetch(
                CONFIG.API_URL +
                "?action=license" +
                "&license=" +
                encodeURIComponent(
                    license
                ) +
                "&domain=" +
                encodeURIComponent(
                    location.hostname
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
            "License response:",
            data
        );


        return data;


    } catch (err) {

        console.error(
            "License validation error:",
            err
        );


        return {

            success: false,

            message:
                "Tidak dapat terhubung ke server license."

        };

    }

}


// =====================================================
// AKTIVASI LICENSE
// =====================================================

async function activateLicense() {

    const input =
        document.getElementById(
            "licenseInput"
        );

    const button =
        document.getElementById(
            "activateButton"
        );

    const loading =
        document.getElementById(
            "loading"
        );

    const message =
        document.getElementById(
            "message"
        );


    if (!input) {

        console.error(
            "licenseInput tidak ditemukan."
        );

        return;

    }


    // =================================================
    // CEK USER LOGIN
    // =================================================

    const currentUsername =
        getCurrentUsername();


    const pendingUsername =
        getPendingActivationUsername();


    const activationUsername =
        pendingUsername ||
        currentUsername;


    // =================================================
    // CUSTOMER HARUS LOGIN
    // =================================================

    if (!activationUsername) {

        showLicenseMessage(
            "Silakan login terlebih dahulu.",
            "error"
        );

        setTimeout(
            function () {

                window.location.href =
                    "login.html";

            },
            1000
        );

        return;

    }


    // =================================================
    // SUPER ADMIN TIDAK PERLU AKTIVASI
    // =================================================

    if (isSuperAdmin()) {

        window.location.href =
            "dashboard.html";

        return;

    }


    // =================================================
    // AMBIL INPUT
    // =================================================

    const license =
        input.value
            .trim()
            .toUpperCase();


    // =================================================
    // VALIDASI
    // =================================================

    if (!license) {

        showLicenseMessage(
            "Masukkan License Key terlebih dahulu.",
            "error"
        );

        input.focus();

        return;

    }


    // =================================================
    // LOADING
    // =================================================

    if (button) {

        button.disabled = true;

        button.innerText =
            "MEMERIKSA...";

    }


    if (loading) {

        loading.style.display =
            "block";

    }


    if (message) {

        message.style.display =
            "none";

    }


    try {

        // =================================================
        // VALIDASI KE SERVER
        // =================================================

        const data =
            await validateLicense(
                license
            );


        // =================================================
        // INVALID
        // =================================================

        if (!data.success) {

            showLicenseMessage(
                data.message ||
                "License tidak valid.",
                "error"
            );

            return;

        }


        // =================================================
        // PASTIKAN SPREADSHEET ADA
        // =================================================

        if (!data.spreadsheetId) {

            showLicenseMessage(
                "License valid tetapi Spreadsheet ID tidak ditemukan.",
                "error"
            );

            return;

        }


        // =================================================
        // LICENSE VALID
        // =================================================

        console.log(
            "================================="
        );

        console.log(
            "LICENSE BERHASIL DIAKTIFKAN"
        );

        console.log(
            "Customer:",
            activationUsername
        );

        console.log(
            "License:",
            license
        );

        console.log(
            "Owner:",
            data.owner || "-"
        );

        console.log(
            "Spreadsheet:",
            data.spreadsheetId
        );

        console.log(
            "================================="
        );


        // =================================================
        // SIMPAN LICENSE
        // =================================================

        saveLicense(
            license
        );


        // =================================================
        // SIMPAN SPREADSHEET
        // =================================================

        saveSpreadsheetId(
            data.spreadsheetId
        );


        // =================================================
        // SIMPAN OWNER
        // =================================================

        if (data.owner) {

            localStorage.setItem(
                OWNER_STORAGE_KEY,
                data.owner
            );

        }


        // =================================================
        // SIMPAN USER PEMILIK LICENSE
        // =================================================

        localStorage.setItem(
            "activatedUsername",
            activationUsername
        );


        localStorage.setItem(
            "licenseUsername",
            activationUsername
        );


        // =================================================
        // HAPUS PENDING
        // =================================================

        localStorage.removeItem(
            "pendingActivationUsername"
        );


        // =================================================
        // PASTIKAN LOGIN TETAP AKTIF
        // =================================================

        localStorage.setItem(
            "login",
            "true"
        );


        // =================================================
        // PESAN
        // =================================================

        showLicenseMessage(
            "License berhasil diaktifkan! Membuka dashboard...",
            "success"
        );


        // =================================================
        // KE DASHBOARD
        // =================================================

        setTimeout(
            function () {

                window.location.href =
                    "dashboard.html";

            },
            1000
        );


    } catch (error) {

        console.error(
            "Activation error:",
            error
        );


        showLicenseMessage(
            "Terjadi kesalahan saat mengaktifkan license.",
            "error"
        );


    } finally {

        if (loading) {

            loading.style.display =
                "none";

        }


        if (button) {

            button.disabled =
                false;

            button.innerText =
                "AKTIFKAN LISENSI";

        }

    }

}


// =====================================================
// PESAN
// =====================================================

function showLicenseMessage(
    text,
    type
) {

    const message =
        document.getElementById(
            "message"
        );


    if (!message) {

        return;

    }


    message.innerText =
        text;


    message.className =
        "message " +
        (type || "error");


    message.style.display =
        "block";

}


// =====================================================
// CHECK LICENSE
// =====================================================

async function checkLicense() {

    // =================================================
    // SUPER ADMIN
    // =================================================

    if (isSuperAdmin()) {

        console.log(
            "👑 Super Admin - license tidak diperlukan."
        );

        return true;

    }


    // =================================================
    // USER
    // =================================================

    const currentUsername =
        getCurrentUsername();


    const activatedUsername =
        localStorage.getItem(
            "activatedUsername"
        ) || "";


    // =================================================
    // USER TIDAK SAMA
    // =================================================

    if (
        !currentUsername ||
        !activatedUsername ||
        currentUsername.trim().toLowerCase() !==
        activatedUsername.trim().toLowerCase()
    ) {

        console.error(
            "License bukan milik customer yang sedang login."
        );


        removeLicense();


        if (
            !location.pathname.endsWith(
                "activation.html"
            )
        ) {

            window.location.href =
                "activation.html";

        }


        return false;

    }


    // =================================================
    // AMBIL LICENSE
    // =================================================

    const savedLicense =
        getSavedLicense();


    if (!savedLicense) {

        if (
            !location.pathname.endsWith(
                "activation.html"
            )
        ) {

            window.location.href =
                "activation.html";

        }

        return false;

    }


    // =================================================
    // VALIDASI KE SERVER
    // =================================================

    const data =
        await validateLicense(
            savedLicense
        );


    // =================================================
    // INVALID
    // =================================================

    if (!data.success) {

        console.error(
            "License Invalid:",
            data.message
        );


        removeLicense();


        if (
            !location.pathname.endsWith(
                "activation.html"
            )
        ) {

            window.location.href =
                "activation.html";

        }


        return false;

    }


    // =================================================
    // UPDATE SPREADSHEET
    // =================================================

    if (data.spreadsheetId) {

        saveSpreadsheetId(
            data.spreadsheetId
        );

    }


    // =================================================
    // UPDATE OWNER
    // =================================================

    if (data.owner) {

        localStorage.setItem(
            OWNER_STORAGE_KEY,
            data.owner
        );

    }


    console.log(
        "✅ License valid untuk:",
        currentUsername
    );


    return true;

}