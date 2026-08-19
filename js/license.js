// =====================================================
// LICENSE SYSTEM
// =====================================================

const LICENSE_STORAGE_KEY =
    "license";

const SPREADSHEET_ID_STORAGE_KEY =
    "spreadsheetId";


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

        return false;

    }

}


// =====================================================
// AMBIL USER YANG SEDANG LOGIN
// =====================================================

function getCurrentUser() {

    try {

        return JSON.parse(
            localStorage.getItem("user") || "{}"
        );

    } catch (error) {

        return {};

    }

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
        "owner"
    );

    localStorage.removeItem(
        "activatedUsername"
    );

    localStorage.removeItem(
        "licenseUsername"
    );

}


// =====================================================
// VALIDASI LICENSE KE SERVER
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

    }
    catch (err) {

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
    // USER YANG LOGIN
    // =================================================

    const currentUser =
        getCurrentUser();


    const username =
        String(
            currentUser.username ||
            localStorage.getItem(
                "pendingActivationUsername"
            ) ||
            ""
        )
        .trim();


    // =================================================
    // CUSTOMER HARUS LOGIN
    // =================================================

    if (
        !username &&
        !isSuperAdmin()
    ) {

        showLicenseMessage(
            "Session login tidak ditemukan. Silakan login kembali.",
            "error"
        );

        setTimeout(
            function () {

                window.location.href =
                    "login.html";

            },
            1500
        );

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
        // VALID
        // =================================================

        console.log(
            "================================"
        );

        console.log(
            "LICENSE BERHASIL"
        );

        console.log(
            "License:",
            license
        );

        console.log(
            "Username:",
            username
        );

        console.log(
            "Owner:",
            data.owner || "-"
        );

        console.log(
            "Spreadsheet:",
            data.spreadsheetId || "-"
        );

        console.log(
            "================================"
        );


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
                "owner",
                data.owner
            );

        }


        // =================================================
        // IKAT LICENSE KE CUSTOMER
        // =================================================

        if (username) {

            localStorage.setItem(
                "activatedUsername",
                username
            );

            localStorage.setItem(
                "licenseUsername",
                username
            );

        }


        // =================================================
        // HAPUS PENDING
        // =================================================

        localStorage.removeItem(
            "pendingActivationUsername"
        );


        // =================================================
        // PESAN
        // =================================================

        showLicenseMessage(
            "License berhasil diaktifkan! Membuka dashboard...",
            "success"
        );


        // =================================================
        // MASUK DASHBOARD
        // =================================================

        setTimeout(
            function () {

                window.location.href =
                    "dashboard.html";

            },
            800
        );


    }
    catch (error) {

        console.error(
            "Activation error:",
            error
        );


        showLicenseMessage(
            "Terjadi kesalahan saat mengaktifkan license.",
            "error"
        );

    }
    finally {

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

    const user =
        getCurrentUser();


    const username =
        String(
            user.username || ""
        )
        .trim();


    // =================================================
    // BELUM LOGIN
    // =================================================

    if (!username) {

        window.location.href =
            "login.html";

        return false;

    }


    // =================================================
    // AMBIL LICENSE
    // =================================================

    const savedLicense =
        getSavedLicense();


    const savedSpreadsheetId =
        getSavedSpreadsheetId();


    const activatedUsername =
        localStorage.getItem(
            "activatedUsername"
        ) || "";


    // =================================================
    // BELUM AKTIF
    // =================================================

    if (
        !savedLicense ||
        !savedSpreadsheetId ||
        activatedUsername
            .trim()
            .toLowerCase() !==
        username
            .trim()
            .toLowerCase()
    ) {

        console.warn(
            "Customer belum memiliki license sendiri."
        );


        removeLicense();


        localStorage.setItem(
            "pendingActivationUsername",
            username
        );


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
    // VALIDASI ULANG KE SERVER
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


        localStorage.setItem(
            "pendingActivationUsername",
            username
        );


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
    // UPDATE DATA
    // =================================================

    saveLicense(
        savedLicense
    );


    if (data.spreadsheetId) {

        saveSpreadsheetId(
            data.spreadsheetId
        );

    }


    if (data.owner) {

        localStorage.setItem(
            "owner",
            data.owner
        );

    }


    return true;

}