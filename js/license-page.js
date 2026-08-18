// =====================================================
// LICENSE MANAGEMENT
// =====================================================


// =====================================================
// LOAD LICENSES
// =====================================================

async function loadLicenses() {

    const table =
        document.getElementById("licenseTable");

    if (!table) return;


    table.innerHTML = `
        <tr>
            <td colspan="9" class="empty-license">
                Memuat data license...
            </td>
        </tr>
    `;


    try {

        const res =
            await fetch(
                CONFIG.API_URL +
                "?action=licenses&t=" +
                Date.now()
            );


        const data =
            await res.json();


        console.log(
            "License list:",
            data
        );


        if (!data.success) {

            table.innerHTML = `
                <tr>
                    <td colspan="9" class="empty-license">
                        ${escapeHtml(
                            data.message ||
                            "Gagal mengambil data license"
                        )}
                    </td>
                </tr>
            `;

            return;

        }


        const licenses =
            data.licenses || [];


        if (licenses.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="9" class="empty-license">
                        Belum ada license.
                    </td>
                </tr>
            `;

            return;

        }


        table.innerHTML =
            licenses.map(item => {

                const status =
                    String(
                        item.status || ""
                    )
                    .trim()
                    .toUpperCase();


                const statusClass =
                    status === "ACTIVE"
                        ? "status-active"
                        : "status-inactive";


                const toggleText =
                    status === "ACTIVE"
                        ? "🔴"
                        : "🟢";


                const toggleTitle =
                    status === "ACTIVE"
                        ? "Nonaktifkan"
                        : "Aktifkan";


                return `

                    <tr>

                        <!-- CUSTOMER -->

                        <td>
                            <strong>
                                ${escapeHtml(
                                    item.owner || "-"
                                )}
                            </strong>
                        </td>


                        <!-- LICENSE -->

                        <td>
                            <strong>
                                ${escapeHtml(
                                    item.license || "-"
                                )}
                            </strong>
                        </td>


                        <!-- USERNAME -->

                        <td>
                            ${escapeHtml(
                                item.username || "-"
                            )}
                        </td>


                        <!-- PASSWORD -->

                        <td>
                            ${escapeHtml(
                                item.password || "-"
                            )}
                        </td>


                        <!-- DOMAIN -->

                        <td>
                            ${escapeHtml(
                                item.domain || "-"
                            )}
                        </td>


                        <!-- STATUS -->

                        <td>

                            <span
                                class="${statusClass}"
                            >

                                ${status === "ACTIVE"
                                    ? "🟢 ACTIVE"
                                    : "🔴 INACTIVE"
                                }

                            </span>

                        </td>


                        <!-- ACTIVATED -->

                        <td>
                            ${escapeHtml(
                                item.activated || "-"
                            )}
                        </td>


                        <!-- SPREADSHEET -->

                        <td>
                            <small>
                                ${escapeHtml(
                                    item.spreadsheetId || "-"
                                )}
                            </small>
                        </td>


                        <!-- ACTION -->

                        <td>

                            <div
                                class="license-actions"
                            >

                                <button
                                    class="license-action btn-edit"
                                    title="Edit"
                                    onclick='editLicense(${JSON.stringify(item)})'
                                >
                                    ✏️
                                </button>


                                <button
                                    class="license-action btn-toggle"
                                    title="${toggleTitle}"
                                    onclick='toggleLicense("${escapeJs(item.license)}", "${escapeJs(status)}")'
                                >
                                    ${toggleText}
                                </button>


                                <button
                                    class="license-action btn-delete"
                                    title="Hapus"
                                    onclick='deleteLicense("${escapeJs(item.license)}")'
                                >
                                    🗑️
                                </button>


                                <button
                                    class="license-action btn-share"
                                    title="Bagikan"
                                    onclick='shareLicense(${JSON.stringify(item)})'
                                >
                                    📤
                                </button>

                            </div>

                        </td>

                    </tr>

                `;

            }).join("");


    } catch (err) {

        console.error(
            "Load license error:",
            err
        );


        table.innerHTML = `
            <tr>
                <td colspan="9" class="empty-license">
                    Gagal mengambil data license.
                </td>
            </tr>
        `;

    }

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================================
// ESCAPE JAVASCRIPT
// =====================================================

function escapeJs(value) {

    return String(value ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/'/g, "\\'")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");

}


// =====================================================
// BUAT LICENSE
// =====================================================

async function buatLicense() {

    const owner =
        prompt(
            "Masukkan nama customer:"
        );


    if (!owner) return;


    const confirmCreate =
        confirm(
            "Buat license untuk:\n\n" +
            owner +
            "?"
        );


    if (!confirmCreate) return;


    try {

        const response =
            await fetch(
                CONFIG.API_URL,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
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
            await response.json();


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

            "Customer: " +
            data.owner +

            "\n\nLicense: " +
            data.license +

            "\nUsername: " +
            data.username +

            "\nPassword: " +
            data.password

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


// =====================================================
// EDIT LICENSE
// =====================================================

async function editLicense(item) {

    const owner =
        prompt(
            "Nama Customer:",
            item.owner || ""
        );


    if (owner === null) return;


    const username =
        prompt(
            "Username:",
            item.username || ""
        );


    if (username === null) return;


    const password =
        prompt(
            "Password:",
            item.password || ""
        );


    if (password === null) return;


    const domain =
        prompt(
            "Domain:",
            item.domain || ""
        );


    if (domain === null) return;


    if (!owner.trim()) {

        alert(
            "Nama customer tidak boleh kosong."
        );

        return;

    }


    if (!username.trim()) {

        alert(
            "Username tidak boleh kosong."
        );

        return;

    }


    if (!password.trim()) {

        alert(
            "Password tidak boleh kosong."
        );

        return;

    }


    try {

        const response =
            await fetch(
                CONFIG.API_URL,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify({

                            action:
                                "editLicense",

                            license:
                                item.license,

                            owner:
                                owner.trim(),

                            username:
                                username.trim(),

                            password:
                                password.trim(),

                            domain:
                                domain.trim()

                        })

                }
            );


        const data =
            await response.json();


        if (!data.success) {

            alert(
                data.message ||
                "Gagal mengubah license."
            );

            return;

        }


        alert(
            "License berhasil diperbarui."
        );


        loadLicenses();


    } catch (err) {

        console.error(
            "Edit license error:",
            err
        );


        alert(
            "Terjadi kesalahan saat mengedit license."
        );

    }

}


// =====================================================
// TOGGLE LICENSE
// =====================================================

async function toggleLicense(
    license,
    currentStatus
) {

    const newStatus =
        currentStatus === "ACTIVE"
            ? "INACTIVE"
            : "ACTIVE";


    const actionText =
        newStatus === "ACTIVE"
            ? "mengaktifkan"
            : "menonaktifkan";


    const confirmToggle =
        confirm(

            "Yakin ingin " +
            actionText +
            " license ini?\n\n" +

            license

        );


    if (!confirmToggle) return;


    try {

        const response =
            await fetch(
                CONFIG.API_URL,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify({

                            action:
                                "toggleLicense",

                            license:
                                license,

                            status:
                                newStatus

                        })

                }
            );


        const data =
            await response.json();


        if (!data.success) {

            alert(
                data.message ||
                "Gagal mengubah status license."
            );

            return;

        }


        loadLicenses();


    } catch (err) {

        console.error(
            "Toggle license error:",
            err
        );


        alert(
            "Terjadi kesalahan saat mengubah status."
        );

    }

}


// =====================================================
// DELETE LICENSE
// =====================================================

async function deleteLicense(
    license
) {

    const confirmDelete =
        confirm(

            "⚠️ PERINGATAN\n\n" +

            "Yakin ingin menghapus license:\n\n" +

            license +

            "\n\nData license akan dihapus dari License Management."

        );


    if (!confirmDelete) return;


    try {

        const response =
            await fetch(
                CONFIG.API_URL,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify({

                            action:
                                "deleteLicense",

                            license:
                                license

                        })

                }
            );


        const data =
            await response.json();


        if (!data.success) {

            alert(
                data.message ||
                "Gagal menghapus license."
            );

            return;

        }


        alert(
            "License berhasil dihapus."
        );


        loadLicenses();


    } catch (err) {

        console.error(
            "Delete license error:",
            err
        );


        alert(
            "Terjadi kesalahan saat menghapus license."
        );

    }

}


// =====================================================
// SHARE LICENSE
// =====================================================

function shareLicense(item) {

    const text =

        "Halo " +
        (item.owner || "Customer") +
        ",\n\n" +

        "Berikut akses Wedding Guestbook Anda:\n\n" +

        "👤 Customer: " +
        (item.owner || "-") +
        "\n\n" +

        "🔑 License: " +
        (item.license || "-") +
        "\n\n" +

        "👤 Username: " +
        (item.username || "-") +
        "\n\n" +

        "🔒 Password: " +
        (item.password || "-") +
        "\n\n" +

        "Silakan gunakan data tersebut untuk login.";


    // =================================================
    // COPY KE CLIPBOARD
    // =================================================

    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard
            .writeText(text)
            .then(function() {

                alert(
                    "Data akses berhasil disalin.\n\n" +
                    "Silakan paste ke WhatsApp."
                );

            })
            .catch(function() {

                fallbackCopy(text);

            });

    } else {

        fallbackCopy(text);

    }

}


// =====================================================
// FALLBACK COPY
// =====================================================

function fallbackCopy(text) {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    textarea.style.position =
        "fixed";

    textarea.style.opacity =
        "0";


    document.body.appendChild(
        textarea
    );


    textarea.select();


    try {

        document.execCommand(
            "copy"
        );


        alert(
            "Data akses berhasil disalin.\n\n" +
            "Silakan paste ke WhatsApp."
        );


    } catch (err) {

        alert(
            text
        );

    }


    document.body.removeChild(
        textarea
    );

}


// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadLicenses();

    }
);