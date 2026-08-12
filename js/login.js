const API_URL = CONFIG.API_URL;


// =====================================================
// DOMAIN
// =====================================================

const DOMAIN = window.location.hostname;


// =====================================================
// LOGIN
// =====================================================

async function login() {

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

    if (!username || !password) {

        showMessage(
            "Username dan password wajib diisi."
        );

        return;
    }


    if (button) {

        button.disabled = true;
        button.innerText = "MEMERIKSA...";

    }

    if (loading) {

        loading.style.display = "block";
        loading.innerText =
            "Memeriksa license...";

    }

    if (message) {

        message.style.display = "none";

    }


    try {

        // =================================================
        // 1. AMBIL LICENSE
        // =================================================

        const license =
            localStorage.getItem("license") || "";


        // =================================================
        // CEK LICENSE
        // =================================================

        if (!license) {

            showMessage(
                "License tidak ditemukan."
            );

            return;
        }


        console.log(
            "Memeriksa license:",
            license
        );


        const licenseRes =
            await fetch(
                API_URL +
                "?action=license" +
                "&license=" +
                encodeURIComponent(license) +
                "&domain=" +
                encodeURIComponent(DOMAIN) +
                "&t=" +
                Date.now()
            );


        const licenseData =
            await licenseRes.json();


        console.log(
            "LICENSE RESPONSE:",
            licenseData
        );


        // =================================================
        // LICENSE INVALID
        // =================================================

        if (!licenseData.success) {

            showMessage(
                licenseData.message ||
                "License tidak valid."
            );

            return;
        }


        // =================================================
        // SIMPAN DATA LICENSE
        // =================================================

        const spreadsheetId =
            licenseData.spreadsheetId || "";


        localStorage.setItem(
            "spreadsheetId",
            spreadsheetId
        );


        localStorage.setItem(
            "licenseOwner",
            licenseData.owner || ""
        );


        console.log(
            "Spreadsheet customer:",
            spreadsheetId
        );


        // =================================================
        // 2. LOGIN CUSTOMER
        // =================================================

        if (loading) {

            loading.innerText =
                "Memeriksa username dan password...";

        }


        const loginRes =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        action: "login",

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
            await loginRes.json();


        console.log(
            "LOGIN RESPONSE:",
            data
        );


        // =================================================
        // LOGIN BERHASIL
        // =================================================

        if (data.success) {

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
                        data.owner ||
                        username,

                    license:
                        data.license ||
                        license,

                    spreadsheetId:
                        spreadsheetId

                })
            );


            // =============================================
            // MASUK DASHBOARD
            // =============================================

            window.location.href =
                "dashboard.html";

            return;
        }


        // =================================================
        // LOGIN GAGAL
        // =================================================

        showMessage(
            data.message ||
            "Username atau password salah."
        );


    }

    catch (err) {

        console.error(
            "Login error:",
            err
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

    const message =
        document.getElementById("message");

    if (!message) return;


    message.innerText = text;

    message.className =
        "message error";

    message.style.display =
        "block";

}


// =====================================================
// FORM
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