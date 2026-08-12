const API_URL = CONFIG.API_URL;


// =====================================================
// LOGIN SUPER ADMIN
// =====================================================

async function loginSuperAdmin() {

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


    const username =
        usernameElement.value.trim();

    const password =
        passwordElement.value;


    // =================================================
    // VALIDASI
    // =================================================

    if (!username || !password) {

        showMessage(
            "Username dan password wajib diisi."
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

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

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
            "SUPER ADMIN LOGIN:",
            data
        );


        // =================================================
        // LOGIN BERHASIL
        // =================================================

        if (data.success) {

            localStorage.setItem(
                "superadminLogin",
                "true"
            );


            localStorage.setItem(
                "superadminUser",
                JSON.stringify({

                    username:
                        data.username ||
                        username,

                    role:
                        "superadmin",

                    name:
                        data.name ||
                        "Super Admin"

                })
            );


            // Masuk dashboard

            window.location.replace(
                "superadmin.html"
            );

            return;
        }


        // =================================================
        // LOGIN GAGAL
        // =================================================

        showMessage(
            data.message ||
            "Username atau password salah."
        );


    } catch (error) {

        console.error(
            "Super Admin Login Error:",
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

            button.disabled = false;

            button.innerText =
                "LOGIN";

        }

    }

}


// =====================================================
// PESAN
// =====================================================

function showMessage(text) {

    const message =
        document.getElementById(
            "message"
        );


    if (!message) return;


    message.innerText =
        text;


    message.className =
        "message error";


    message.style.display =
        "block";

}


// =====================================================
// FORM LOGIN
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const form =
            document.getElementById(
                "adminLoginForm"
            );


        if (!form) return;


        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                loginSuperAdmin();

            }
        );

    }
);