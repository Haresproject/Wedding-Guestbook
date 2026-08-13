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
// CEK SUPER ADMIN
// =====================================================

function isSuperAdminUser(username) {

    return String(username || "")
        .trim()
        .toLowerCase() === "admin";

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
        button.innerText = "MEMERIKSA...";

    }

    if (loading) {

        loading.style.display = "block";

    }

    if (message) {

        message.style.display = "none";

    }


    try {

        // =================================================
        // SUPER ADMIN
        // =================================================

        if (isSuperAdminUser(username)) {

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


            // =================================================
            // LOGIN SUPER ADMIN GAGAL
            // =================================================

            if (!data.success) {

                showMessage(
                    data.message ||
                    "Username atau password Super Admin salah."
                );

                return;

            }


            // =================================================
            // SIMPAN SESSION SUPER ADMIN
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
                        data.role ||
                        "superadmin",

                    name:
                        data.name ||
                        "Super Admin"

                })
            );


            // =================================================
            // HAPUS DATA CUSTOMER
            // =================================================

            localStorage.removeItem(
                "license"
            );

            localStorage.removeItem(
                "spreadsheetId"
            );

            localStorage.removeItem(
                "owner"
            );


            console.log(
                "SUPER ADMIN LOGIN BERHASIL"
            );


            // =================================================
            // MASUK DASHBOARD
            // =================================================

            window.location.href =
                "dashboard.html";

            return;

        }


        // =================================================
        // CUSTOMER
        // =================================================

        const license =
            localStorage.getItem(
                "license"
            ) || "";

        const spreadsheetId =
            localStorage.getItem(
                "spreadsheetId"
            ) || "";


        // =================================================
        // CUSTOMER BELUM AKTIVASI
        // =================================================

        if (
            !license ||
            !spreadsheetId
        ) {

            console.log(
                "Customer belum memiliki license."
            );


            window.location.href =
                "activation.html";

            return;

        }


        // =================================================
        // VALIDASI LICENSE
        // =================================================

        const licenseUrl =
            API_URL +
            "?action=license" +
            "&license=" +
            encodeURIComponent(
                license
            ) +
            "&domain=" +
            encodeURIComponent(
                DOMAIN
            ) +
            "&t=" +
            Date.now();


        const licenseResponse =
            await fetch(
                licenseUrl,
                {
                    cache:
                        "no-store"
                }
            );


        const licenseData =
            await licenseResponse.json();


        console.log(
            "LICENSE RESPONSE:",
            licenseData
        );


        // =================================================
        // LICENSE INVALID
        // =================================================

        if (!licenseData.success) {

            console.warn(
                "License customer tidak valid."
            );


            localStorage.removeItem(
                "license"
            );

            localStorage.removeItem(
                "spreadsheetId"
            );

            localStorage.removeItem(
                "owner"
            );


            window.location.href =
                "activation.html";

            return;

        }


        // =================================================
        // AMBIL SPREADSHEET CUSTOMER
        // =================================================

        const customerSpreadsheetId =
            licenseData.spreadsheetId ||
            spreadsheetId;


        if (!customerSpreadsheetId) {

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
                                customerSpreadsheetId

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
            customerSpreadsheetId
        );


        localStorage.setItem(
            "license",
            license
        );


        localStorage.setItem(
            "owner",
            data.owner ||
            licenseData.owner ||
            data.name ||
            ""
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
        // DASHBOARD CUSTOMER
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

            loading.style.display = "none";

        }


        if (button) {

            button.disabled = false;

            button.innerText = "LOGIN";

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
// CEK SAAT LOGIN DIBUKA
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


            window.location.href =
                "dashboard.html";

            return;

        }


        // =================================================
        // PENTING
        // =================================================
        // JANGAN CEK LICENSE DI SINI.
        //
        // Karena login adalah 1 pintu.
        //
        // Kita belum tahu orang ini:
        // - Super Admin
        // - Customer
        //
        // Penentuan dilakukan SETELAH
        // username dan password dimasukkan.
        // =================================================

        console.log(
            "Login page siap."
        );

    }
);