const API_URL = CONFIG.API_URL;


// =====================================================
// DOMAIN
// =====================================================

const DOMAIN =
    window.location.hostname;


// =====================================================
// ELEMENT
// =====================================================

const loginForm =
    document.getElementById("loginForm");

const usernameElement =
    document.getElementById("username");

const passwordElement =
    document.getElementById("password");

const licenseElement =
    document.getElementById("license");

const licenseBox =
    document.getElementById("licenseBox");

const button =
    document.getElementById("loginButton");

const loading =
    document.getElementById("loading");

const message =
    document.getElementById("message");


// =====================================================
// DETEKSI USERNAME
// =====================================================

if (usernameElement) {

    usernameElement.addEventListener(
        "input",
        function () {

            const username =
                this.value.trim().toLowerCase();

            // Admin tidak membutuhkan license
            if (username === "admin") {

                if (licenseBox) {
                    licenseBox.classList.remove("show");
                }

                if (licenseElement) {
                    licenseElement.required = false;
                }

            }

            // Customer membutuhkan license
            else {

                if (licenseBox) {
                    licenseBox.classList.add("show");
                }

                if (licenseElement) {
                    licenseElement.required = true;
                }

            }

        }
    );

}


// =====================================================
// LOGIN
// =====================================================

async function login() {

    const username =
        usernameElement
            ? usernameElement.value.trim()
            : "";

    const password =
        passwordElement
            ? passwordElement.value
            : "";

    const license =
        licenseElement
            ? licenseElement.value.trim().toUpperCase()
            : "";


    // =================================================
    // VALIDASI
    // =================================================

    if (!username) {

        showMessage(
            "Username wajib diisi."
        );

        return;

    }


    if (!password) {

        showMessage(
            "Password wajib diisi."
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
        // SUPER ADMIN
        // =================================================

        if (
            username.toLowerCase() === "admin"
        ) {

            console.log(
                "LOGIN SUPER ADMIN..."
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


            if (!data.success) {

                showMessage(
                    data.message ||
                    "Username atau password Super Admin salah."
                );

                return;

            }


            // =================================================
            // SIMPAN LOGIN SUPER ADMIN
            // =================================================

            localStorage.setItem(
                "login",
                "true"
            );


            localStorage.setItem(
                "user",
                JSON.stringify({

                    username:
                        "admin",

                    role:
                        "superadmin",

                    name:
                        "Super Admin"

                })
            );


            // Hapus data customer lama

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


            // Masuk License Management

            window.location.href =
                "dashboard.html";


            return;

        }


        // =================================================
        // CUSTOMER
        // =================================================

        if (!license) {

            showMessage(
                "License wajib diisi untuk login customer."
            );

            return;

        }


        // =================================================
        // CEK LICENSE
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
        // LOGIN CUSTOMER
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


        if (!data.success) {

            showMessage(
                data.message ||
                "Username atau password salah."
            );

            return;

        }


        // =================================================
        // SIMPAN CUSTOMER
        // =================================================

        localStorage.setItem(
            "login",
            "true"
        );

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
            licenseData.owner || ""
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


        console.log(
            "CUSTOMER LOGIN BERHASIL"
        );


        // =================================================
        // DASHBOARD
        // =================================================

        window.location.href =
            "dashboard.html";


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        showMessage(
            "Tidak dapat terhubung ke server."
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
                "LOGIN";

        }

    }

}


// =====================================================
// PESAN
// =====================================================

function showMessage(text) {

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
// SUBMIT
// =====================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            login();

        }
    );

}