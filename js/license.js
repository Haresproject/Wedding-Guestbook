// =====================================================
// LICENSE SYSTEM
// =====================================================

const LICENSE_STORAGE_KEY = "hareslens_license";

// =====================================================
// CEK APAKAH SUPER ADMIN
// =====================================================

function isSuperAdmin() {

    if (
        typeof CONFIG !== "undefined" &&
        CONFIG.SUPER_ADMIN === true
    ) {
        return true;
    }

    return false;
}


// =====================================================
// AMBIL LICENSE YANG TERSIMPAN
// =====================================================

function getSavedLicense() {

    return localStorage.getItem(LICENSE_STORAGE_KEY) || "";

}


// =====================================================
// SIMPAN LICENSE
// =====================================================

function saveLicense(license) {

    localStorage.setItem(
        LICENSE_STORAGE_KEY,
        String(license).trim().toUpperCase()
    );

}


// =====================================================
// HAPUS LICENSE
// =====================================================

function removeLicense() {

    localStorage.removeItem(
        LICENSE_STORAGE_KEY
    );

}


// =====================================================
// CEK LICENSE KE SERVER
// =====================================================

async function validateLicense(license) {

    license = String(license || "")
        .trim()
        .toUpperCase();

    if (!license) {

        return {
            success: false,
            message: "License wajib diisi"
        };

    }


    try {

        const res = await fetch(
            CONFIG.API_URL +
            "?action=license" +
            "&license=" +
            encodeURIComponent(license) +
            "&domain=" +
            encodeURIComponent(location.hostname) +
            "&t=" +
            Date.now()
        );


        const data = await res.json();

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
            message: "Tidak dapat terhubung ke server license"
        };

    }

}


// =====================================================
// AKTIVASI LICENSE DARI activation.html
// =====================================================

async function activateLicense() {

    const input =
        document.getElementById("licenseInput");

    const button =
        document.getElementById("activateButton");

    const loading =
        document.getElementById("loading");

    const message =
        document.getElementById("message");


    if (!input) {

        console.error(
            "licenseInput tidak ditemukan"
        );

        return;

    }


    const license =
        input.value
            .trim()
            .toUpperCase();


    // ================= VALIDASI INPUT =================

    if (!license) {

        showLicenseMessage(
            "Masukkan License Key terlebih dahulu.",
            "error"
        );

        input.focus();

        return;

    }


    // ================= LOADING =================

    if (button) {

        button.disabled = true;
        button.innerText = "MEMERIKSA...";

    }

    if (loading) {

        loading.style.display = "block";

    }

    if (message) {

        message.style.display = "none";

    }


    // ================= CEK SERVER =================

    const data =
        await validateLicense(license);


    // ================= SELESAI LOADING =================

    if (loading) {

        loading.style.display = "none";

    }


    if (button) {

        button.disabled = false;
        button.innerText = "AKTIFKAN LISENSI";

    }


    // ================= LICENSE INVALID =================

    if (!data.success) {

        showLicenseMessage(
            data.message ||
            "License tidak valid.",
            "error"
        );

        return;

    }


    // ================= LICENSE VALID =================

    saveLicense(license);


    console.log(
        "✅ License berhasil diaktifkan"
    );

    console.log(
        "Owner:",
        data.owner || "-"
    );


    showLicenseMessage(
        "License berhasil diaktifkan! Mengarahkan ke dashboard...",
        "success"
    );


    // ================= MASUK DASHBOARD =================

    setTimeout(function() {

        window.location.href =
            "dashboard.html";

    }, 1000);

}


// =====================================================
// PESAN AKTIVASI
// =====================================================

function showLicenseMessage(
    text,
    type
) {

    const message =
        document.getElementById("message");

    if (!message) return;


    message.innerText = text;

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

        console.warn(
            "Running Super Admin"
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
            "Belum ada license tersimpan"
        );


        // Jangan redirect kalau sedang berada
        // di halaman activation.html

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


        // Jangan redirect kalau sudah di activation

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


    return true;

}


// =====================================================
// OTOMATIS CEK LICENSE
// =====================================================
//
// PENTING:
// activation.html TIDAK menjalankan checkLicense()
// secara otomatis karena customer belum memasukkan key.
//
// Halaman lain boleh memanggil checkLicense().
// =====================================================
