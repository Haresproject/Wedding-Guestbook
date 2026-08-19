// =====================================================
// LICENSE SYSTEM
// =====================================================

const LICENSE_STORAGE_KEY =
    "license";

const SPREADSHEET_ID_STORAGE_KEY =
    "spreadsheetId";

const ACTIVATED_USERNAME_STORAGE_KEY =
    "activatedUsername";


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
// AMBIL USER LOGIN
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


function getActivatedUsername() {

    return (
        localStorage.getItem(
            ACTIVATED_USERNAME_STORAGE_KEY
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


function saveActivatedUsername(username) {

    localStorage.setItem(
        ACTIVATED_USERNAME_STORAGE_KEY,
        String(username || "")
            .trim()
            .toLowerCase()
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
        ACTIVATED_USERNAME_STORAGE_KEY
    );

    localStorage.removeItem(
        "owner"
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


    const license =
        input.value
            .trim()
            .toUpperCase();


    // =================================================
    // AMBIL USER YANG LOGIN
    // =================================================

    const user =
        getCurrentUser();


    const username =
        String(
            user.username ||
            localStorage.getItem(
                "pendingActivationUsername"
            ) ||
            ""
        )
            .trim();


    // =================================================
    // USER WAJIB ADA
    // =================================================

    if (!username) {

        showLicenseMessage(
            "Sesi login tidak ditemukan. Silakan login kembali.",
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
    // VALIDASI INPUT
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
                "License valid tetapi Spreadsheet customer tidak ditemukan.",
                "error"
            );

            return;

        }


        // =================================================
        // LICENSE VALID
        // =================================================

        console.log(
            "✅ License berhasil diaktifkan"
        );


        console.log(
            "Customer:",
            username
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
            "Spreadsheet ID:",
            data.spreadsheetId
        );


        // =================================================
        // SIMPAN LICENSE
        // =================================================

        saveLicense(
            license
        );


        // =================================================
        // SIMPAN SPREADSHEET ID CUSTOMER
        // =================================================

        saveSpreadsheetId(
            data.spreadsheetId
        );


        // =================================================
        // SIMPAN USERNAME PEMILIK LICENSE
        // =================================================

        saveActivatedUsername(
            username
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
        // LANGSUNG DASHBOARD
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
            "👑 Running Super Admin"
        );

        return true;

    }


    // =================================================
    // USER LOGIN
    // =================================================

    const user =
        getCurrentUser();


    const username =
        String(
            user.username || ""
        )
            .trim()
            .toLowerCase();


    if (!username) {

        console.warn(
            "Tidak ada user login."
        );

        window.location.href =
            "login.html";

        return false;

    }


    // =================================================
    // LICENSE TERSIMPAN
    // =================================================

    const savedLicense =
        getSavedLicense();


    const savedSpreadsheetId =
        getSavedSpreadsheetId();


    const activatedUsername =
        getActivatedUsername();


    // =================================================
    // LICENSE BUKAN MILIK USER INI
    // =================================================

    if (
        !savedLicense ||
        !savedSpreadsheetId ||
        activatedUsername !== username
    ) {

        console.warn(
            "License tidak ditemukan atau bukan milik user ini."
        );


        removeLicense();


        window.location.href =
            "activation.html";

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


        window.location.href =
            "activation.html";

        return false;

    }


    // =================================================
    // PASTIKAN SPREADSHEET SESUAI
    // =================================================

    if (
        data.spreadsheetId &&
        data.spreadsheetId !== savedSpreadsheetId
    ) {

        console.warn(
            "Spreadsheet ID berubah. Memperbarui..."
        );


        saveSpreadsheetId(
            data.spreadsheetId
        );

    }


    // =================================================
    // UPDATE OWNER
    // =================================================

    if (data.owner) {

        localStorage.setItem(
            "owner",
            data.owner
        );

    }


    console.log(
        "✅ License Valid"
    );


    console.log(
        "Customer:",
        username
    );


    console.log(
        "Spreadsheet:",
        data.spreadsheetId ||
        savedSpreadsheetId
    );


    return true;

}