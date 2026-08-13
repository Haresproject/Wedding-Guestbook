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

    const licenseElement =
        document.getElementById("license");

    const usernameElement =
        document.getElementById("username");

    const passwordElement =
        document.getElementById("password");

    const button =
        document.getElementById("loginButton");

    const loading =
        document.getElementById("loading");

    const message =
        document.getElementById("message");


    const license =
        licenseElement
            ? licenseElement.value.trim().toUpperCase()
            : "";


    const username =
        usernameElement
            ? usernameElement.value.trim()
            : "";


    const password =
        passwordElement
            ? passwordElement.value
            : "";


    // =================================================
    // VALIDASI USERNAME & PASSWORD
    // =================================================

    if (!username || !password) {

        showMessage(
            "Username dan password wajib diisi."
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
        // 1. SUPER ADMIN LOGIN
        // =================================================

        if (
            username.toLowerCase() === "admin"
        ) {

            console.log(
                "LOGIN SUPER ADMIN"
            );


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
                                    "loginSuperAdmin",

                                username:
                                    username,

                                password:
                                    password

                            })
                    }
                );


            const data =
                await response.json();


            console.log(
                "SUPER ADMIN RESPONSE:",
                data
            );


            // =================================================
            // SUPER ADMIN GAGAL
            // =================================================

            if (!data.success) {

                showMessage(
                    data.message ||
                    "Username atau password Super Admin salah."
                );

                return;

            }


            // =================================================
            // SUPER ADMIN BERHASIL
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
                        "admin",

                    role:
                        "superadmin",

                    name:
                        "Super Admin"

                })
            );


            // Bersihkan data customer lama
            localStorage.removeItem(
                "spreadsheetId"
            );

            localStorage.removeItem(
                "license"
            );

            localStorage.removeItem(
                "owner"
            );


            console.log(
                "SUPER ADMIN LOGIN BERHASIL"
            );


            // =================================================
            // MASUK HALAMAN SUPER ADMIN
            // =================================================

            window.location.href =
                "license.html";


            return;

        }


        // =================================================
        // 2. CUSTOMER
        // =================================================

        if (!license) {

            showMessage(
                "License wajib diisi untuk login customer."
            );

            return;

        }


        // =================================================
        // 3. CEK LICENSE
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

        if (!licenseData.success) {

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
        // 4. LOGIN CUSTOMER
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
            "CUSTOMER LOGIN RESPONSE:",
            data
        );


        // =================================================
        // LOGIN CUSTOMER GAGAL
        // =================================================

        if (!data.success) {

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
        // CUSTOMER LOGIN BERHASIL
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
        // MASUK DASHBOARD CUSTOMER
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