// =====================================================
// SUPER ADMIN LOGIN
// =====================================================

const API_URL = CONFIG.API_URL;


// =====================================================
// ELEMENT
// =====================================================

const form = document.getElementById("adminLoginForm");
const loginButton = document.getElementById("loginButton");
const loading = document.getElementById("loading");
const message = document.getElementById("message");


// =====================================================
// LOGIN
// =====================================================

form.addEventListener("submit", async function (e) {

    e.preventDefault();


    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;


    if (!username || !password) {

        showMessage(
            "Username dan password wajib diisi.",
            "error"
        );

        return;
    }


    // Disable button
    loginButton.disabled = true;
    loginButton.innerText = "LOGIN...";

    loading.style.display = "block";
    loading.innerText = "Memeriksa login...";

    message.innerText = "";


    try {

        const response = await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    action: "loginSuperAdmin",

                    username: username,

                    password: password

                })
            }
        );


        const data = await response.json();


        console.log(
            "SUPER ADMIN LOGIN:",
            data
        );


        // =================================================
        // LOGIN BERHASIL
        // =================================================

        if (data.success) {

            // Simpan session super admin
            localStorage.setItem(
                "superadminLogin",
                "true"
            );


            localStorage.setItem(
                "superadminUser",
                JSON.stringify({

                    username:
                        data.username || username,

                    name:
                        data.name || "Super Admin",

                    role:
                        data.role || "superadmin"

                })
            );


            loading.innerText =
                "Login berhasil. Membuka dashboard...";


            // Masuk ke halaman Super Admin
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
            "Username atau password salah.",
            "error"
        );


    } catch (error) {

        console.error(
            "SUPER ADMIN LOGIN ERROR:",
            error
        );


        showMessage(
            "Tidak dapat terhubung ke server.",
            "error"
        );


    } finally {

        loginButton.disabled = false;

        loginButton.innerText = "LOGIN";

        loading.style.display = "none";

    }

});


// =====================================================
// MESSAGE
// =====================================================

function showMessage(text, type) {

    message.innerText = text;

    message.className =
        "message " + type;

}