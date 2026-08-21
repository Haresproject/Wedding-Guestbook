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
// SAVE CUSTOMER SESSION
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
// SAVE SUPER ADMIN SESSION
// =====================================================

function saveSuperAdminSession(
    data
) {

    // Hapus SESSION CUSTOMER SAJA

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

    const license =
        String(
            localStorage.getItem(
                "license"
            ) || ""
        ).trim();


    const spreadsheetId =
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
        ).trim()
        .toLowerCase();


    const currentUsername =
        String(
            username || ""
        ).trim()
        .toLowerCase();


    console.log(
        "=== CEK CUSTOMER LICENSE ==="
    );

    console.log(
        "Login:",
        currentUsername
    );

    console.log(
        "Activated:",
        activatedUsername
    );

    console.log(
        "License:",
        license ? "ADA" : "KOSONG"
    );

    console.log(
        "Spreadsheet:",
        spreadsheetId
    );


    if (!license) {

        return false;

    }


    if (!spreadsheetId) {

        return false;

    }


    if (!activatedUsername) {

        return false;

    }


    if (
        currentUsername !==
        activatedUsername
    ) {

        return false;

    }


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
                .toLowerCase() ===
            "admin"
        ) {

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


            if (!data.success) {

                showMessage(
                    data.message ||
                    "Username atau password salah."
                );

                return;

            }


            saveSuperAdminSession(
                data
            );


            window.location.href =
                "dashboard.html";

            return;

        }


        // =================================================
        // CUSTOMER
        // =================================================

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

        saveCustomerSession(
            data,
            username
        );


        // =================================================
        // CEK LICENSE YANG SUDAH TERSIMPAN
        // =================================================

        if (
            hasLicenseForCurrentUser(
                username
            )
        ) {

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
// MESSAGE
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