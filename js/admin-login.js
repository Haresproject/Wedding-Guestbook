const API_URL = CONFIG.API_URL;


// =====================================================
// LOGIN SUPER ADMIN
// =====================================================

async function loginSuperAdmin() {

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


    if (!username || !password) {

        showMessage(
            "Username dan password wajib diisi."
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

                    action: "loginSuperAdmin",

                    username: username,

                    password: password

                })
            }
        );


        const data =
            await res.json();


        console.log(
            "Super Admin Login:",
            data
        );


        // ================= BERHASIL =================

        if (data.success) {

            localStorage.setItem(
                "superAdminLogin",
                "true"
            );


            localStorage.setItem(
                "superAdmin",
                JSON.stringify({

                    username:
                        data.username,

                    name:
                        data.name,

                    role:
                        data.role

                })
            );


            // Masuk Super Admin Dashboard

            window.location.href =
                "admin.html";

            return;

        }


        // ================= GAGAL =================

        showMessage(
            data.message ||
            "Username atau password salah."
        );


    } catch (err) {

        console.error(
            "Super Admin Login Error:",
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
// FORM
// =====================================================

document
    .getElementById("adminLoginForm")
    ?.addEventListener(
        "submit",
        function(e) {

            e.preventDefault();

            loginSuperAdmin();

        }
    );