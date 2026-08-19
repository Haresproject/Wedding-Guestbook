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
// SIMPAN SESSION CUSTOMER
// =====================================================

function saveCustomerSession(data, username) {

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

}


// =====================================================
// CEK LICENSE MILIK USER INI
// =====================================================

function hasLicenseForCurrentUser(username) {

    const activatedUsername =
        localStorage.getItem(
            "activatedUsername"
        ) || "";

    const savedLicense =
        localStorage.getItem(
            "license"
        ) || "";

    const savedSpreadsheetId =
        localStorage.getItem(
            "spreadsheetId"
        ) || "";


    return (
        activatedUsername.trim().toLowerCase() ===
        username.trim().toLowerCase()
        &&
        savedLicense !== ""
        &&
        savedSpreadsheetId !== ""
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
            username.toLowerCase() === "admin"
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


            if (!data.success) {

                showMessage(
                    data.message ||
                    "Username atau password salah."
                );

                return;

            }


            // =================================================
            // BERSIHKAN SEMUA SESSION CUSTOMER
            // =================================================

            localStorage.clear();


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

                    name:
                        data.name ||
                        "Super Admin",

                    role:
                        "superadmin"

                })
            );


            console.log(
                "SUPER ADMIN LOGIN BERHASIL"
            );


            // =================================================
            // DASHBOARD
            // =================================================

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

        saveCustomerSession(
            data,
            username
        );


        // =================================================
        // CEK LICENSE MILIK CUSTOMER INI
        // =================================================

        const sudahAktif =
            hasLicenseForCurrentUser(
                username
            );


        // =================================================
        // BELUM AKTIF
        // =================================================

        if (!sudahAktif) {

            console.log(
                "Customer belum memiliki license sendiri."
            );


            /*
             * Jangan hapus user.
             *
             * Tetapi license lama milik customer lain
             * tidak boleh dipakai.
             */

            localStorage.removeItem(
                "license"
            );

            localStorage.removeItem(
                "spreadsheetId"
            );

            localStorage.removeItem(
                "owner"
            );


            /*
             * Simpan customer yang sedang
             * melakukan aktivasi.
             */

            localStorage.setItem(
                "pendingActivationUsername",
                username
            );


            window.location.href =
                "activation.html";

            return;

        }


        // =================================================
        // SUDAH AKTIF
        // =================================================

        console.log(
            "Customer sudah memiliki license sendiri."
        );


        localStorage.removeItem(
            "pendingActivationUsername"
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


        if (
            localStorage.getItem("login") !== "true"
        ) {

            console.log(
                "Login page siap."
            );

            return;

        }


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

        const username =
            String(
                savedUser.username || ""
            ).trim();


        if (!username) {

            localStorage.clear();

            return;

        }


        // =================================================
        // CUSTOMER SUDAH AKTIF
        // =================================================

        if (
            hasLicenseForCurrentUser(
                username
            )
        ) {

            window.location.href =
                "dashboard.html";

            return;

        }


        // =================================================
        // CUSTOMER BELUM AKTIF
        // =================================================

        window.location.href =
            "activation.html";

    }
);