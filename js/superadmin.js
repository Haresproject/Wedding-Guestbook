const API_URL = CONFIG.API_URL;


// =====================================================
// CEK LOGIN SUPER ADMIN
// =====================================================

function checkSuperAdmin() {

    const login =
        localStorage.getItem("superadminLogin");

    const userString =
        localStorage.getItem("superadminUser");


    // Belum login
    if (login !== "true" || !userString) {

        window.location.replace(
            "admin-login.html"
        );

        return false;
    }


    try {

        const user =
            JSON.parse(userString);


        // Pastikan role benar
        if (user.role !== "superadmin") {

            localStorage.removeItem(
                "adminLogin"
            );

            localStorage.removeItem(
                "adminUser"
            );

            window.location.replace(
                "admin-login.html"
            );

            return false;
        }


        // Tampilkan nama
        const adminName =
            document.getElementById("adminName");

        if (adminName) {

            adminName.innerText =
                user.name || "Super Admin";

        }


        return true;


    } catch (err) {

        console.error(
            "Session Super Admin error:",
            err
        );

        localStorage.removeItem(
            "superadminLogin"
        );

        localStorage.removeItem(
            "superadminUser"
        );

        window.location.replace(
            "superadmin-login.html"
        );

        return false;
    }
}


// =====================================================
// LOAD LICENSE
// =====================================================

async function loadLicenses() {

    try {

        const res = await fetch(
            API_URL +
            "?action=licenses&t=" +
            Date.now()
        );

        const data =
            await res.json();

        console.log(
            "LICENSE DATA:",
            data
        );


        if (!data.success) {

            showEmpty(
                data.message ||
                "Gagal mengambil license."
            );

            return;
        }


        const licenses =
            data.licenses || [];


        renderStats(licenses);
        renderLicenses(licenses);


    } catch (err) {

        console.error(
            "Load licenses error:",
            err
        );

        showEmpty(
            "Tidak dapat mengambil data license."
        );
    }
}


// =====================================================
// STATISTIK
// =====================================================

function renderStats(licenses) {

    const total =
        licenses.length;


    const active =
        licenses.filter(
            item =>
                String(item.status)
                    .toUpperCase() ===
                "ACTIVE"
        ).length;


    const used =
        licenses.filter(
            item =>
                String(item.domain || "")
                    .trim() !== ""
        ).length;


    const unused =
        total - used;


    const totalElement =
        document.getElementById(
            "totalLicense"
        );

    const activeElement =
        document.getElementById(
            "activeLicense"
        );

    const usedElement =
        document.getElementById(
            "usedLicense"
        );

    const unusedElement =
        document.getElementById(
            "unusedLicense"
        );


    if (totalElement) {
        totalElement.innerText = total;
    }

    if (activeElement) {
        activeElement.innerText = active;
    }

    if (usedElement) {
        usedElement.innerText = used;
    }

    if (unusedElement) {
        unusedElement.innerText = unused;
    }
}


// =====================================================
// RENDER TABLE
// =====================================================

function renderLicenses(licenses) {

    const table =
        document.getElementById(
            "licenseTable"
        );


    if (!table) return;


    if (!licenses.length) {

        showEmpty(
            "Belum ada license."
        );

        return;
    }


    let html = "";


    licenses.forEach(
        (item, index) => {

            const status =
                String(
                    item.status || ""
                ).toUpperCase();


            const badgeClass =
                status === "ACTIVE"
                    ? "active"
                    : "inactive";


            const domain =
                item.domain
                    ? item.domain
                    : "Belum digunakan";


            html += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        <span class="license-key">
                            ${escapeHtml(
                                item.license
                            )}
                        </span>
                    </td>

                    <td>
                        ${escapeHtml(
                            item.owner
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            domain
                        )}
                    </td>

                    <td>
                        <span class="badge ${badgeClass}">
                            ${escapeHtml(
                                status
                            )}
                        </span>
                    </td>

                    <td>
                        ${escapeHtml(
                            item.activated || "-"
                        )}
                    </td>

                </tr>

            `;
        }
    );


    table.innerHTML =
        html;
}


// =====================================================
// EMPTY TABLE
// =====================================================

function showEmpty(message) {

    const table =
        document.getElementById(
            "licenseTable"
        );


    if (!table) return;


    table.innerHTML = `

        <tr>

            <td
                colspan="6"
                class="empty">

                ${escapeHtml(message)}

            </td>

        </tr>

    `;
}


// =====================================================
// CREATE LICENSE MODAL
// =====================================================

function openCreateModal() {

    const modal =
        document.getElementById(
            "createModal"
        );

    const owner =
        document.getElementById(
            "ownerName"
        );

    const result =
        document.getElementById(
            "licenseResult"
        );


    if (modal) {
        modal.classList.add("show");
    }


    if (owner) {

        owner.value = "";
        owner.focus();

    }


    if (result) {

        result.style.display =
            "none";

    }
}


function closeCreateModal() {

    const modal =
        document.getElementById(
            "createModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }
}


// =====================================================
// CREATE LICENSE
// =====================================================

async function createNewLicense() {

    const ownerInput =
        document.getElementById(
            "ownerName"
        );


    const button =
        document.getElementById(
            "createButton"
        );


    if (!ownerInput) {

        alert(
            "Input nama customer tidak ditemukan."
        );

        return;
    }


    const owner =
        ownerInput.value.trim();


    if (!owner) {

        alert(
            "Nama customer wajib diisi."
        );

        return;
    }


    if (button) {

        button.disabled = true;

        button.innerText =
            "MEMBUAT...";

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

                    body:
                        JSON.stringify({

                            action:
                                "createLicense",

                            owner:
                                owner

                        })
                }
            );


        const data =
            await res.json();


        console.log(
            "CREATE LICENSE:",
            data
        );


        if (!data.success) {

            alert(
                data.message ||
                "Gagal membuat license."
            );

            return;
        }


        const result =
            document.getElementById(
                "licenseResult"
            );


        const newLicense =
            document.getElementById(
                "newLicense"
            );


        if (newLicense) {

            newLicense.innerText =
                data.license;

        }


        if (result) {

            result.style.display =
                "block";

        }


        await loadLicenses();


    } catch (err) {

        console.error(
            "Create license error:",
            err
        );


        alert(
            "Tidak dapat terhubung ke server."
        );


    } finally {

        if (button) {

            button.disabled =
                false;

            button.innerText =
                "BUAT LICENSE";

        }
    }
}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    localStorage.removeItem(
        "superadminLogin"
    );

    localStorage.removeItem(
        "superadminUser"
    );


    window.location.replace(
        "admin-login.html"
    );
}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (checkSuperAdmin()) {

            loadLicenses();

        }

    }
);