// =====================================================
// LICENSE SYSTEM
// =====================================================

const LICENSE_STORAGE_KEY =
    "license";

const SPREADSHEET_ID_STORAGE_KEY =
    "spreadsheetId";


// =====================================================
// CEK APAKAH SUPER ADMIN
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
// AMBIL LICENSE TERSIMPAN
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

}


// =====================================================
// CEK LICENSE KE SERVER
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
        // CEK LICENSE KE SERVER
        // =================================================

        const data =
            await validateLicense(
                license
            );


        // =================================================
        // LICENSE INVALID
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
        // LICENSE VALID
        // =================================================

        console.log(
            "✅ License berhasil diaktifkan"
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
            data.spreadsheetId || "-"
        );


        // =================================================
        // SIMPAN LICENSE
        // =================================================

        saveLicense(
            license
        );


        // =================================================
        // SIMPAN SPREADSHEET ID
        // =================================================

        saveSpreadsheetId(
            data.spreadsheetId || ""
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
        // PESAN BERHASIL
        // =================================================

        showLicenseMessage(
            "License berhasil diaktifkan! Silakan login...",
            "success"
        );


        // =================================================
        // KEMBALI KE LOGIN
        // =================================================

        setTimeout(
            function () {

                window.location.href =
                    "login.html";

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
// PESAN AKTIVASI
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
    // INFO
    // =================================================

    console.log(
        "License System"
    );


    console.log(
        "App:",
        CONFIG.APP_NAME
    );


    console.log(
        "Version:",
        CONFIG.VERSION
    );


    console.log(
        "Domain:",
        location.hostname
    );


    // =================================================
    // AMBIL LICENSE
    // =================================================

    const savedLicense =
        getSavedLicense();


    // =================================================
    // BELUM ADA LICENSE
    // =================================================

    if (!savedLicense) {

        console.warn(
            "Belum ada license tersimpan."
        );


        // Jangan redirect kalau memang
        // sedang berada di halaman activation

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
    // VALIDASI LICENSE
    // =================================================

    const data =
        await validateLicense(
            savedLicense
        );


    // =================================================
    // LICENSE INVALID
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
    // LICENSE VALID
    // =================================================

    console.log(
        "✅ License Valid"
    );


    console.log(
        "Owner:",
        data.owner || "-"
    );


    console.log(
        "Spreadsheet ID:",
        data.spreadsheetId || "-"
    );


    // =================================================
    // UPDATE DATA TERBARU
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


// =====================================================
// CATATAN
// =====================================================
//
// license.js TIDAK menjalankan checkLicense()
// secara otomatis.
//
// login.html:
//     login dulu.
//
// activation.html:
//     customer memasukkan license.
//
// dashboard.html:
//     boleh memanggil checkLicense().
//
// Super Admin:
//     checkLicense() langsung return true.
//
// =====================================================