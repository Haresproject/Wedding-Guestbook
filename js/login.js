const API_URL = CONFIG.API_URL;

const SPREADSHEET_ID =
    localStorage.getItem("spreadsheetId") || "";


// =====================================================
// CEK CUSTOMER
// =====================================================

if (!SPREADSHEET_ID) {

    console.warn(
        "Spreadsheet customer belum ditemukan."
    );

}


// =====================================================
// LOGIN
// =====================================================

async function login() {

    const username =
        document.getElementById("username")
            .value
            .trim();

    const password =
        document.getElementById("password")
            .value;

    const button =
        document.getElementById("loginButton");

    const loading =
        document.getElementById("loading");

    const message =
        document.getElementById("message");


    // ================= VALIDASI =================

    if (!username || !password) {

        showMessage(
            "Username dan password wajib diisi."
        );

        return;
    }


    // ================= CEK SPREADSHEET =================

    if (!SPREADSHEET_ID) {

        showMessage(
            "License belum terhubung dengan customer."
        );

        return;
    }


    // ================= LOADING =================

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

        const res = await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    action: "login",

                    username: username,

                    password: password,

                    spreadsheetId:
                        SPREADSHEET_ID

                })
            }
        );


        const data =
            await res.json();


        console.log(
            "Login response:",
            data
        );


        // ================= BERHASIL =================

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
                        username

                })
            );


            // MASUK DASHBOARD

            window.location.href =
                "dashboard.html";

            return;
        }


        // ================= GAGAL =================

        showMessage(
            data.message ||
            "Username atau password salah."
        );


    } catch (err) {

        console.error(
            "Login error:",
            err
        );

        showMessage(
            "Tidak dapat terhubung ke server."
        );

    }


    // ================= SELESAI =================

    if (loading) {

        loading.style.display = "none";

    }

    if (button) {

        button.disabled = false;

        button.innerText = "LOGIN";

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