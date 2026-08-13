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

const button =
    document.getElementById("loginButton");

const loading =
    document.getElementById("loading");

const message =
    document.getElementById("message");


// =====================================================
// HELPER
// =====================================================

function getSavedUser() {

    try {

        return JSON.parse(
            localStorage.getItem("user") || "{}"
        );

    } catch (error) {

        return {};

    }

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
        // 1. SUPER ADMIN
        // =================================================

        if (
            username
                .trim()
                .toLowerCase() === "admin"
        ) {

            console.log(
                "Memeriksa Super Admin..."
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


            // =============================================
            // SUPER ADMIN GAGAL
            // =============================================

            if (!data.success) {

                showMessage(
                    data.message ||
                    "Username atau password salah."
                );

                return;

            }


            // =============================================
            // BERSIHKAN SESSION CUSTOMER
            // =============================================

            localStorage.clear();


            // =============================================
            // SIMPAN SESSION SUPER ADMIN
            // =============================================

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

                    name:
                        data.name ||
                        "Super Admin",

                    role:
                        data.role ||
                        "superadmin"

                })
            );


            console.log(
                "SUPER ADMIN LOGIN BERHASIL"
            );


            // =============================================
            // DASHBOARD SUPER ADMIN
            // =============================================

            window.location.href =
                "dashboard.html";

            return;

        }


        // =================================================
        // 2. CUSTOMER
        // =================================================

        console.log(
            "Memeriksa Customer..."
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
                                "loginCustomerAuto",

                            username:
                                username,

                            password:
                                password,

                            domain:
                                DOMAIN

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
        // CUSTOMER LOGIN GAGAL
        // =================================================

        if (!data.success) {

            showMessage(
                data.message ||
                "Username atau password salah."
            );

            return;

        }


        // =================================================
        // SIMPAN SESSION CUSTOMER
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

                name:
                    data.name ||
                    data.owner ||
                    username,

                owner:
                    data.owner ||
                    data.name ||
                    "",

                role:
                    data.role ||
                    "owner"

            })
        );


        console.log(
            "CUSTOMER LOGIN BERHASIL"
        );


        // =================================================
        // CEK APAKAH SUDAH ADA LICENSE
        // =================================================

        const savedLicense =
            localStorage.getItem(
                "license"
            ) || "";


        const savedSpreadsheetId =
            localStorage.getItem(
                "spreadsheetId"
            ) || "";


        // =================================================
        // CUSTOMER PERTAMA KALI
        // BELUM ADA LICENSE
        // =================================================

        if (
            !savedLicense ||
            !savedSpreadsheetId
        ) {

            console.log(
                "Customer belum aktivasi license."
            );


            // Jangan hapus session login.
            // Karena setelah aktivasi berhasil
            // customer langsung masuk dashboard.

            window.location.href =
                "activation.html";

            return;

        }


        // =================================================
        // CUSTOMER SUDAH PERNAH AKTIVASI
        // =================================================

        console.log(
            "Customer sudah memiliki license."
        );


        window.location.href =
            "dashboard.html";

        return;

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


// =====================================================
// CEK SESSION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const savedUser =
            getSavedUser();


        // =================================================
        // SUDAH LOGIN
        // =================================================

        if (
            localStorage.getItem("login") === "true"
        ) {

            console.log(
                "User sudah login:",
                savedUser
            );


            // =================================================
            // SUPER ADMIN
            // =================================================

            if (
                String(savedUser.role || "")
                    .trim()
                    .toLowerCase() === "superadmin"
            ) {

                window.location.href =
                    "dashboard.html";

                return;

            }


            // =================================================
            // CUSTOMER
            // =================================================

            const savedLicense =
                localStorage.getItem(
                    "license"
                ) || "";


            const savedSpreadsheetId =
                localStorage.getItem(
                    "spreadsheetId"
                ) || "";


            // =================================================
            // CUSTOMER BELUM AKTIVASI
            // =================================================

            if (
                !savedLicense ||
                !savedSpreadsheetId
            ) {

                window.location.href =
                    "activation.html";

                return;

            }


            // =================================================
            // CUSTOMER SUDAH AKTIVASI
            // =================================================

            window.location.href =
                "dashboard.html";

            return;

        }


        // =================================================
        // BELUM LOGIN
        // =================================================

        console.log(
            "Login page siap."
        );

    }
);