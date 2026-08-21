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
// CEK SUPER ADMIN
// =====================================================

function isSuperAdminUser(user) {

    user =
        user || {};

    return (
        String(user.role || "")
            .trim()
            .toLowerCase() === "superadmin"
        ||
        String(user.username || "")
            .trim()
            .toLowerCase() === "admin"
    );

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
// SIMPAN SESSION SUPER ADMIN
// =====================================================

function saveSuperAdminSession(
    data
) {

    // -----------------------------------------------
    // HAPUS SESSION CUSTOMER SAJA
    // -----------------------------------------------

    localStorage.removeItem(
        "license"
    );

    localStorage.removeItem(
        "spreadsheetId"
    );

    localStorage.removeItem(
        "owner"
    );

    localStorage.removeItem(
        "activatedUsername"
    );

    localStorage.removeItem(
        "licenseUsername"
    );

    localStorage.removeItem(
        "pendingActivationUsername"
    );


    // -----------------------------------------------
    // SIMPAN LOGIN
    // -----------------------------------------------

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

}


// =====================================================
// CEK LICENSE CUSTOMER
// =====================================================

function hasLicenseForCurrentUser(
    username
) {

    const savedLicense =
        String(
            localStorage.getItem(
                "license"
            ) || ""
        ).trim();


    const savedSpreadsheetId =
        String(
            localStorage.getItem(
                "spreadsheetId"
            ) || ""
        ).trim();


    const activatedUsername =
        String(
            localStorage.getItem(
                "activatedUsername"
            ) || ""
        ).trim();


    // -----------------------------------------------
    // LICENSE HARUS ADA
    // -----------------------------------------------

    if (!savedLicense) {

        console.log(
            "❌ License belum tersimpan."
        );

        return false;

    }


    // -----------------------------------------------
    // SPREADSHEET HARUS ADA
    // -----------------------------------------------

    if (!savedSpreadsheetId) {

        console.log(
            "❌ Spreadsheet ID belum tersimpan."
        );

        return false;

    }


    // -----------------------------------------------
    // USERNAME LOGIN
    // -----------------------------------------------

    const currentUser =
        String(username || "")
            .trim()
            .toLowerCase();


    // -----------------------------------------------
    // USERNAME AKTIVASI
    // -----------------------------------------------

    const activatedUser =
        activatedUsername
            .toLowerCase();


    // -----------------------------------------------
    // USERNAME AKTIVASI HARUS ADA
    // -----------------------------------------------

    if (!activatedUser) {

        console.log(
            "❌ activatedUsername belum ada."
        );

        return false;

    }


    // -----------------------------------------------
    // HARUS USER YANG SAMA
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


    // -----------------------------------------------
    // VALID
    // -----------------------------------------------

    console.log(
        "================================="
    );

    console.log(
        "✅ CUSTOMER SUDAH AKTIF"
    );

    console.log(
        "Customer:",
        currentUser
    );

    console.log(
        "License:",
        savedLicense
    );

    console.log(
        "Spreadsheet:",
        savedSpreadsheetId
    );

    console.log(
        "================================="
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

        button.disabled =
            true;

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
                .toLowerCase() ===
            "admin"
        ) {

            console.log(
                "👑 Memeriksa Super Admin..."
            );


            const response =
                await fetch(
                    API_URL,
                    {

                        method:
                            "POST",

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
            // SIMPAN SESSION SUPER ADMIN
            // ---------------------------------------------

            saveSuperAdminSession(
                data
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

                    method:
                        "POST",

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
        // CEK LICENSE
        // =================================================

        const sudahAktif =
            hasLicenseForCurrentUser(
                username
            );


        // =================================================
        // CUSTOMER SUDAH AKTIF
        // =================================================

        if (sudahAktif) {

            console.log(
                "✅ Customer sudah memiliki license."
            );


            localStorage.removeItem(
                "pendingActivationUsername"
            );


            window.location.href =
                "dashboard.html";

            return;

        }


        // =================================================
        // CUSTOMER BELUM AKTIF
        // =================================================

        console.log(
            "🔐 Customer belum memiliki license."
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
// SUBMIT FORM
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