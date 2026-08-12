const API_URL = CONFIG.API_URL;


// =====================================================
// DATA CUSTOMER
// =====================================================

let CUSTOMER_SPREADSHEET_ID = "";

let CUSTOMER_LICENSE = "";


// =====================================================
// VERIFIKASI LICENSE
// =====================================================

async function verifyLicense() {

    const licenseInput =
        document.getElementById("license");

    const button =
        document.getElementById("licenseButton");

    const loading =
        document.getElementById("loading");

    const license =
        licenseInput.value.trim();


    if (!license) {

        showMessage(
            "License wajib diisi.",
            "error"
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


    clearMessage();


    try {

        const domain =
            window.location.hostname;


        const url =
            API_URL +
            "?action=license" +
            "&license=" +
            encodeURIComponent(license) +
            "&domain=" +
            encodeURIComponent(domain) +
            "&t=" +
            Date.now();


        const res =
            await fetch(
                url,
                {
                    cache: "no-store"
                }
            );


        const data =
            await res.json();


        console.log(
            "LICENSE RESPONSE:",
            data
        );


        if (!data.success) {

            showMessage(
                data.message ||
                "License tidak valid.",
                "error"
            );

            return;
        }


        // =================================================
        // SIMPAN DATA CUSTOMER
        // =================================================

        CUSTOMER_LICENSE =
            license;


        CUSTOMER_SPREADSHEET_ID =
            data.spreadsheetId || "";


        if (!CUSTOMER_SPREADSHEET_ID) {

            showMessage(
                "License valid tetapi Spreadsheet Customer belum tersedia.",
                "error"
            );

            return;
        }


        // =================================================
        // SIMPAN KE LOCAL STORAGE
        // =================================================

        localStorage.setItem(
            "license",
            CUSTOMER_LICENSE
        );


        localStorage.setItem(
            "spreadsheetId",
            CUSTOMER_SPREADSHEET_ID
        );


        localStorage.setItem(
            "licenseOwner",
            data.owner || ""
        );


        // =================================================
        // TAMPILKAN LOGIN CUSTOMER
        // =================================================

        const licenseForm =
            document.getElementById(
                "licenseForm"
            );


        const loginForm =
            document.getElementById(
                "loginForm"
            );


        const licenseInfo =
            document.getElementById(
                "licenseInfo"
            );


        if (licenseForm) {

            licenseForm.classList.add(
                "hidden"
            );

        }


        if (loginForm) {

            loginForm.classList.remove(
                "hidden"
            );

        }


        if (licenseInfo) {

            licenseInfo.innerText =
                "License aktif: " +
                (data.owner ||
                "Customer");

        }


        showMessage(
            "License berhasil diverifikasi.",
            "success"
        );


    } catch (err) {

        console.error(
            "Verify license error:",
            err
        );


        showMessage(
            "Tidak dapat terhubung ke server.",
            "error"
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
                "VERIFIKASI LICENSE";

        }

    }

}


// =====================================================
// LOGIN CUSTOMER
// =====================================================

async function login() {

    const usernameInput =
        document.getElementById(
            "username"
        );


    const passwordInput =
        document.getElementById(
            "password"
        );


    const button =
        document.getElementById(
            "loginButton"
        );


    const loading =
        document.getElementById(
            "loading"
        );


    const username =
        usernameInput.value.trim();


    const password =
        passwordInput.value;


    // =================================================
    // VALIDASI
    // =================================================

    if (!username || !password) {

        showMessage(
            "Username dan password wajib diisi.",
            "error"
        );

        return;
    }


    if (!CUSTOMER_SPREADSHEET_ID) {

        CUSTOMER_SPREADSHEET_ID =
            localStorage.getItem(
                "spreadsheetId"
            ) || "";

    }


    if (!CUSTOMER_SPREADSHEET_ID) {

        showMessage(
            "License belum diverifikasi.",
            "error"
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


    clearMessage();


    try {

        const res =
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
                                CUSTOMER_SPREADSHEET_ID

                        })

                }
            );


        const data =
            await res.json();


        console.log(
            "CUSTOMER LOGIN RESPONSE:",
            data
        );


        if (!data.success) {

            showMessage(
                data.message ||
                "Username atau password salah.",
                "error"
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
                    username

            })
        );


        localStorage.setItem(
            "spreadsheetId",
            CUSTOMER_SPREADSHEET_ID
        );


        localStorage.setItem(
            "license",
            CUSTOMER_LICENSE ||
            localStorage.getItem(
                "license"
            ) ||
            ""
        );


        // =================================================
        // MASUK DASHBOARD BIASA
        // =================================================

        window.location.replace(
            "dashboard.html"
        );


    } catch (err) {

        console.error(
            "Customer login error:",
            err
        );


        showMessage(
            "Tidak dapat terhubung ke server.",
            "error"
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

function showMessage(
    text,
    type = "error"
) {

    const message =
        document.getElementById(
            "message"
        );


    if (!message) return;


    message.innerText =
        text;


    message.className =
        "message " +
        type;


    message.style.display =
        "block";

}


function clearMessage() {

    const message =
        document.getElementById(
            "message"
        );


    if (!message) return;


    message.innerText =
        "";


    message.style.display =
        "none";

}


// =====================================================
// FORM LICENSE
// =====================================================

document
    .getElementById(
        "licenseForm"
    )
    ?.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            verifyLicense();

        }
    );


// =====================================================
// FORM LOGIN
// =====================================================

document
    .getElementById(
        "loginForm"
    )
    ?.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            login();

        }
    );