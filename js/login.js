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
// GET SAVED USER
// =====================================================

function getSavedUser() {

    try {

        return JSON.parse(
            localStorage.getItem("user") || "{}"
        );

    } catch (error) {

        console.error(
            "Gagal membaca user:",
            error
        );

        return {};

    }

}


// =====================================================
// SIMPAN SESSION CUSTOMER
// =====================================================

function saveCustomerSession(
    data,
    username
) {

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
// CEK LICENSE CUSTOMER
// =====================================================

function hasLicenseForCurrentUser(
    username
) {

    const savedLicense =
        localStorage.getItem(
            "license"
        ) || "";


    const savedSpreadsheetId =
        localStorage.getItem(
            "spreadsheetId"
        ) || "";


    const activatedUsername =
        localStorage.getItem(
            "activatedUsername"
        ) || "";


    // -----------------------------------------------
    // LICENSE ADA?
    // -----------------------------------------------

    if (!savedLicense.trim()) {

        console.log(
            "❌ License belum ada."
        );

        return false;

    }


    // -----------------------------------------------
    // SPREADSHEET ADA?
    // -----------------------------------------------

    if (!savedSpreadsheetId.trim()) {

        console.log(
            "❌ Spreadsheet ID belum ada."
        );

        return false;

    }


    // -----------------------------------------------
    // USERNAME AKTIVASI
    // -----------------------------------------------

    const currentUser =
        String(username || "")
            .trim()
            .toLowerCase();


    const activatedUser =
        String(activatedUsername || "")
            .trim()
            .toLowerCase();


    if (!activatedUser) {

        console.log(
            "❌ activatedUsername belum ada."
        );

        return false;

    }


    // -----------------------------------------------
    // HARUS MILIK USER YANG SAMA
    // -----------------------------------------------

    if (
        currentUser !==
        activatedUser
    ) {

        console.log(
            "❌ License milik customer lain."
        );

        console.log(
            "Login:",
            currentUser
        );

        console.log(
            "Aktivasi:",
            activatedUser
        );

        return false;

    }


    console.log(
        "✅ License customer ditemukan."
    );

    console.log(
        "Spreadsheet:",
        savedSpreadsheetId
    );


    return true;

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
        // SUPER ADMIN
        // =================================================

        if (
            username
                .trim()
                .toLowerCase() === "admin"
        ) {

            console.log(
                "👑 Memeriksa Super Admin..."
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


            // ---------------------------------------------
            // LOGIN GAGAL
            // ---------------------------------------------

            if (!data.success) {

                showMessage(
                    data.message ||
                    "Username atau password salah."
                );

                return;

            }


            // ---------------------------------------------
            // SUPER ADMIN BOLEH BERSIHKAN SESSION LAMA
            // ---------------------------------------------

            localStorage.clear();


            // ---------------------------------------------
            // SIMPAN SESSION SUPER ADMIN
            // ---------------------------------------------

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
                "✅ SUPER ADMIN LOGIN BERHASIL"
            );


            window.location.href =
                "dashboard.html";

            return;

        }


        // =================================================
        // CUSTOMER
        // =================================================

        console.log(
            "👤 Memeriksa Customer..."
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
        // SIMPAN SESSION CUSTOMER
        // =================================================

        saveCustomerSession(
            data,
            username
        );


        // =================================================
        // CEK LICENSE CUSTOMER
        // =================================================

        const sudahAktif =
            hasLicenseForCurrentUser(
                username
            );


        // =================================================
        // SUDAH AKTIF
        // =================================================

        if (sudahAktif) {

            console.log(
                "✅ CUSTOMER SUDAH AKTIF"
            );


            localStorage.removeItem(
                "pendingActivationUsername"
            );


            window.location.href =
                "dashboard.html";

            return;

        }


        // =================================================
        // BELUM AKTIF
        // =================================================

        console.log(
            "🔐 CUSTOMER BELUM AKTIF"
        );


        localStorage.setItem(
            "pendingActivationUsername",
            username
        );


        window.location.href =
            "activation.html";

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

function showMessage(
    text
) {

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
// CEK SESSION SAAT LOGIN PAGE DIBUKA
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const savedUser =
            getSavedUser();


        // =================================================
        // BELUM LOGIN
        // =================================================

        if (
            localStorage.getItem(
                "login"
            ) !== "true"
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
            String(
                savedUser.role || ""
            )
                .trim()
                .toLowerCase() ===
            "superadmin"
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

            localStorage.removeItem(
                "login"
            );

            localStorage.removeItem(
                "user"
            );

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

            console.log(
                "✅ Session customer masih aktif."
            );


            window.location.href =
                "dashboard.html";

            return;

        }


        // =================================================
        // CUSTOMER BELUM AKTIF
        // =================================================

        localStorage.setItem(
            "pendingActivationUsername",
            username
        );


        window.location.href =
            "activation.html";

    }
);