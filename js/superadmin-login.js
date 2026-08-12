const API_URL = CONFIG.API_URL;


// =====================================================
// CEK LOGIN SUPER ADMIN
// =====================================================

function checkSuperAdmin() {

    const login =
        localStorage.getItem("login");

    const userString =
        localStorage.getItem("user");


    if (!login || !userString) {

        window.location.href =
            "superadmin-login.html";

        return false;
    }


    try {

        const user =
            JSON.parse(userString);


        if (user.role !== "superadmin") {

            window.location.href =
                "login.html";

            return false;
        }


        const adminName =
            document.getElementById("adminName");


        if (adminName) {

            adminName.innerText =
                user.name || "Super Admin";

        }


        return true;


    } catch (err) {

        console.error(err);

        window.location.href =
            "superadmin-login.html";

        return false;
    }

}


// =====================================================
// LOAD LICENSE
// =====================================================

async function loadLicenses() {

    try {

        const res =
            await fetch(
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


    document.getElementById(
        "totalLicense"
    ).innerText = total;


    document.getElementById(
        "activeLicense"
    ).innerText = active;


    document.getElementById(
        "usedLicense"
    ).innerText = used;


    document.getElementById(
        "unusedLicense"
    ).innerText = unused;

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

                        <span
                            class="badge ${badgeClass}">

                            ${escapeHtml(
                                status
                            )}

                        </span>

                    </td>

                    <td>
                        ${escapeHtml(
                            item.activated ||
                            "-"
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

    const owner =
        document.getElementById(
            "ownerName"
        )
        .value
        .trim();


    const button =
        document.getElementById(
            "createButton"
        );


    if (!owner) {

        alert(
            "Nama customer wajib diisi."
        );

        return;
    }


    if (button) {

        button.disabled =
            true;

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


        // Refresh table
        loadLicenses();


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
        "login"
    );

    localStorage.removeItem(
        "user"
    );

    window.location.href =
        "superadmin-login.html";

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

    return String(value || "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// =====================================================
// START
// =====================================================

if (checkSuperAdmin()) {

    loadLicenses();

}