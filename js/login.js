const API_URL = CONFIG.API_URL;


// =====================================================
// DOMAIN
// =====================================================

const DOMAIN =
    window.location.hostname;


// =====================================================
// LOGIN
// =====================================================

async function login() {

    const license =
        document
            .getElementById("license")
            .value
            .trim()
            .toUpperCase();


    const username =
        document
            .getElementById("username")
            .value
            .trim();


    const password =
        document
            .getElementById("password")
            .value;


    const button =
        document.getElementById("loginButton");


    const loading =
        document.getElementById("loading");


    const message =
        document.getElementById("message");


    // =================================================
    // VALIDASI
    // =================================================

    if (
        !license ||
        !username ||
        !password
    ) {

        showMessage(
            "License, username dan password wajib diisi."
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
        // 1. CEK LICENSE
        // =================================================

        const licenseUrl =
            API_URL +
            "?action=license" +
            "&license=" +
            encodeURIComponent(license) +
            "&domain=" +
            encodeURIComponent(DOMAIN);


        const licenseResponse =
            await fetch(
                licenseUrl,
                {
                    cache: "no-store"
                }
            );


        const licenseData =
            await licenseResponse.json();


        console.log(
            "LICENSE RESPONSE:",
            licenseData
        );


        // =================================================
        // LICENSE GAGAL
        // =================================================

        if (
            !licenseData.success
        ) {

            showMessage(
                licenseData.message ||
                "License tidak valid."
            );

            return;

        }


        // =================================================
        // SPREADSHEET CUSTOMER
        // =================================================

        const spreadsheetId =
            licenseData.spreadsheetId;


        if (!spreadsheetId) {

            showMessage(
                "Spreadsheet customer belum tersedia."
            );

            return;

        }


        // =================================================
        // SIMPAN CUSTOMER
        // =================================================

        localStorage.setItem(
            "spreadsheetId",
            spreadsheetId
        );


        localStorage.setItem(
            "license",
            license
        );


        localStorage.setItem(
            "owner",
            licenseData.owner ||
            ""
        );


        // =================================================
        // 2. LOGIN CUSTOMER
        // =================================================

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            action:
                                "login",

                            username:
                                username,

                            password:
                                password,

                            spreadsheetId:
                                spreadsheetId

                        })
                }
            );


        const data =
            await response.json();


        console.log(
            "LOGIN RESPONSE:",
            data
        );


        // =================================================
        // LOGIN GAGAL
        // =================================================

        if (!data.success) {

            // Jangan hapus license.
            // Tapi spreadsheetId boleh dibersihkan
            // supaya tidak tersangkut akun lain.

            localStorage.removeItem(
                "spreadsheetId"
            );


            showMessage(
                data.message ||
                "Username atau password salah."
            );

            return;

        }


        // =================================================
        // LOGIN BERHASIL
        // =================================================

        localStorage.setItem(
            "login",
            "true"
        );


        localStorage.setItem(
            "user",
            JSON.stringify({

                username:
                    data.username ||
                    username,

                role:
                    data.role ||
                    "owner",

                name:
                    data.name ||
                    licenseData.owner ||
                    username

            })
        );


        // =================================================
        // MASUK DASHBOARD LAMA
        // =================================================

        window.location.href =
            "dashboard.html";


    }

    catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        showMessage(
            "Tidak dapat terhubung ke server."
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
                "LOGIN";

        }

    }

}


// =====================================================
// PESAN
// =====================================================

function showMessage(text) {

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
        "message error";


    message.style.display =
        "block";

}


// =====================================================
// FORM LOGIN
// =====================================================

document
    .getElementById("loginForm")
    ?.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            login();

        }
    );