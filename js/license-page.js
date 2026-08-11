// ================= LICENSE MANAGEMENT =================

async function loadLicenses() {

    const table = document.getElementById("licenseTable");

    if (!table) return;

    table.innerHTML = `
        <tr>
            <td colspan="5" class="empty-license">
                Memuat data license...
            </td>
        </tr>
    `;

    try {

        const res = await fetch(
            CONFIG.API_URL + "?action=licenses&t=" + Date.now()
        );

        const data = await res.json();

        console.log("License list:", data);


        if (!data.success) {

            table.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-license">
                        ${data.message || "Gagal mengambil data license"}
                    </td>
                </tr>
            `;

            return;
        }


        const licenses = data.licenses || [];


        if (licenses.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-license">
                        Belum ada license.
                    </td>
                </tr>
            `;

            return;
        }


        table.innerHTML = licenses.map(item => {

            const status =
                String(item.status || "").toUpperCase();


            const statusClass =
                status === "ACTIVE"
                    ? "status-active"
                    : "status-inactive";


            return `
                <tr>

                    <td>
                        <strong>
                            ${escapeHtml(item.license || "-")}
                        </strong>
                    </td>

                    <td>
                        ${escapeHtml(item.owner || "-")}
                    </td>

                    <td>
                        ${escapeHtml(item.domain || "-")}
                    </td>

                    <td>
                        <span class="${statusClass}">
                            ${escapeHtml(status || "-")}
                        </span>
                    </td>

                    <td>
                        ${escapeHtml(item.activated || "-")}
                    </td>

                    <td>
                         ${escapeHtml(item.spreadsheetId || "-")}
                    </td>

                </tr>
            `;

        }).join("");


    } catch (err) {

        console.error("Load license error:", err);

        table.innerHTML = `
            <tr>
                <td colspan="5" class="empty-license">
                    Gagal mengambil data license.
                </td>
            </tr>
        `;

    }

}


// ================= ESCAPE HTML =================

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ================= BUAT LICENSE =================

async function buatLicense() {

    const owner = prompt(
        "Masukkan nama customer:"
    );

    if (!owner) return;


    const confirmCreate = confirm(
        "Buat license untuk:\n\n" + owner + "?"
    );

    if (!confirmCreate) return;


    try {

        const response = await fetch(
            CONFIG.API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body: JSON.stringify({
                    action: "createLicense",
                    owner: owner
                })
            }
        );


        const data = await response.json();


        console.log(
            "Create license:",
            data
        );


        if (!data.success) {

            alert(
                data.message ||
                "Gagal membuat license."
            );

            return;
        }


        alert(
            "License berhasil dibuat!\n\n" +
            "License: " +
            data.license
        );


        loadLicenses();


    } catch (err) {

        console.error(
            "Create license error:",
            err
        );

        alert(
            "Terjadi kesalahan saat membuat license."
        );

    }

}


// ================= START =================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadLicenses();

    }
);