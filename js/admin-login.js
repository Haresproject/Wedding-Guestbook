const API_URL = CONFIG.API_URL;


// =====================================================
// LOGIN SUPER ADMIN
// =====================================================

async function adminLogin() {

    const usernameInput =
        document.getElementById("username");

    const passwordInput =
        document.getElementById("password");

    const button =
        document.getElementById("loginButton");

    const loading =
        document.getElementById("loading");

    const message =
        document.getElementById("message");


    if (!usernameInput || !passwordInput) {

        console.error(
            "Input username/password tidak ditemukan."
        );

        return;
    }


    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


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
        button.innerText = "MEMERIKSA...";

    }

    if (loading) {

        loading.style.display = "block";

    }

    if (message) {

        message.style.display = "none";

    }


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

                    body: JSON.stringify({

                        action: "superadminLogin",

                        username: username,

                        password: password

                    })
                }
            );


        const data =
            await res.json();


        console.log(
            "SUPER ADMIN LOGIN:",
            data
        );


        // =================================================
        // BERHASIL
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


            // Masuk halaman Super Admin

            window.location.replace(
                "superadmin-login.html"
            );

            return;
        }


        // =================================================
        // GAGAL
        // =================================================

        showMessage(
            data.message ||
            "Username atau password salah."
        );


    } catch (err) {

        console.error(
            "Super Admin login error:",
            err
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

    const message =
        document.getElementById("message");


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


        if (!form) {

            console.error(
                "adminLoginForm tidak ditemukan."
            );

            return;
        }


        form.addEventListener(
            "submit",
            function (e) {

                e.preventDefault();

                adminLogin();

            }
        );

    }
);