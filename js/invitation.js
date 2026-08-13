const API_URL = CONFIG.API_URL;


// =====================================================
// SESSION
// =====================================================

const USER =
    JSON.parse(
        localStorage.getItem("user") || "{}"
    );

const IS_LOGIN =
    localStorage.getItem("login") === "true";

const IS_SUPER_ADMIN =
    USER.role === "superadmin";

const SPREADSHEET_ID =
    localStorage.getItem("spreadsheetId") || "";


// =====================================================
// CEK LOGIN
// =====================================================

if (!IS_LOGIN) {

    window.location.href = "login.html";

}


// =====================================================
// CUSTOMER WAJIB PUNYA SPREADSHEET
// =====================================================

if (
    !IS_SUPER_ADMIN &&
    !SPREADSHEET_ID
) {

    window.location.href = "login.html";

}


// =====================================================
// DATA
// =====================================================

let guests = [];

let filteredGuests = [];

let currentFilter = "all";

let currentPage = 1;

const rowsPerPage = 10;


// =====================================================
// GET SPREADSHEET ID
// =====================================================

function getSpreadsheetId() {

    /*
     * Super Admin menggunakan spreadsheet milik sendiri.
     * Customer menggunakan spreadsheet dari login.
     */

    if (IS_SUPER_ADMIN) {

        return (
            CONFIG.SUPER_ADMIN_SPREADSHEET_ID ||
            SPREADSHEET_ID ||
            ""
        );

    }

    return SPREADSHEET_ID;

}


// =====================================================
// LOAD GUESTS
// =====================================================

async function loadGuests() {

    try {

        const spreadsheetId =
            getSpreadsheetId();


        const url =
            API_URL +
            "?action=guests" +
            "&spreadsheetId=" +
            encodeURIComponent(
                spreadsheetId
            ) +
            "&t=" +
            Date.now();


        console.log(
            "Load invitation:",
            url
        );


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
            "Invitation guests:",
            data
        );


        if (Array.isArray(data)) {

            guests = data;

        }

        else if (
            data &&
            Array.isArray(data.guests)
        ) {

            guests = data.guests;

        }

        else {

            guests = [];

        }


        filteredGuests =
            guests;


        currentPage = 1;


        renderGuests(
            filteredGuests
        );


    }
    catch (err) {

        console.error(
            "Gagal load undangan:",
            err
        );


        const tbody =
            document.getElementById(
                "guestTable"
            );


        if (tbody) {

            tbody.innerHTML = `
                <tr>
                    <td
                        colspan="5"
                        style="
                            text-align:center;
                            padding:30px;
                            color:#999;
                        "
                    >
                        ❌ Gagal memuat data tamu
                    </td>
                </tr>
            `;

        }

    }

}


// =====================================================
// PREVIEW
// =====================================================

function previewGuest(id) {

    window.open(
        "card.html?id=" +
        encodeURIComponent(id),
        "_blank"
    );

}


// =====================================================
// RENDER GUESTS
// =====================================================

function renderGuests(data) {

    const tbody =
        document.getElementById(
            "guestTable"
        );


    if (!tbody) return;


    const start =
        (currentPage - 1) *
        rowsPerPage;


    const end =
        start +
        rowsPerPage;


    const pageData =
        data.slice(
            start,
            end
        );


    let html = "";


    if (pageData.length === 0) {

        html = `
            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:30px;
                        color:#999;
                    "
                >

                    Tidak ada data tamu.

                </td>

            </tr>
        `;

    }


    pageData.forEach(g => {

        const id =
            escapeHtml(
                g.id
            );


        const nama =
            escapeHtml(
                g.nama || "-"
            );


        const notes =
            escapeHtml(
                g.notes || "-"
            );


        html += `

            <tr>

                <td>
                    ${id}
                </td>


                <td>
                    ${nama}
                </td>


                <td>
                    ${notes}
                </td>


                <td>
                    ${getDeliveryStatus(g)}
                </td>


                <td>


                    <!-- LIHAT -->

                    <button
                        class="action-btn preview"
                        onclick="
                            previewGuest(
                                '${escapeJs(g.id)}'
                            )
                        "
                    >

                        👁️ Lihat

                    </button>


                    <!-- WHATSAPP -->

                    <button
                        class="action-btn wa"
                        onclick="
                            sendWhatsapp(
                                '${escapeJs(g.id)}',
                                '${escapeJs(g.nama)}'
                            )
                        "
                    >

                        <i
                            class="fa-brands fa-whatsapp"
                        ></i>

                        WhatsApp

                    </button>


                    <!-- DOWNLOAD -->

                    <button
                        class="action-btn print"
                        onclick="
                            downloadGuest(
                                '${escapeJs(g.id)}'
                            )
                        "
                    >

                        📥 Download

                    </button>


                    <!-- EDIT -->

                    <button
                        class="action-btn edit-btn"
                        onclick="
                            editGuest(
                                '${escapeJs(g.id)}'
                            )
                        "
                    >

                        ✏️ Edit

                    </button>


                    <!-- DELETE -->

                    <button
                        class="action-btn delete-btn"
                        onclick="
                            deleteGuest(
                                '${escapeJs(g.id)}'
                            )
                        "
                    >

                        🗑️ Hapus

                    </button>


                </td>

            </tr>

        `;

    });


    tbody.innerHTML =
        html;


    const from =
        data.length === 0
            ? 0
            : start + 1;


    const to =
        Math.min(
            end,
            data.length
        );


    const resultInfo =
        document.getElementById(
            "resultInfo"
        );


    if (resultInfo) {

        resultInfo.innerText =
            `Menampilkan ${from}-${to} dari ${data.length} tamu`;

    }


    updatePagination(
        data.length
    );

}


// =====================================================
// WHATSAPP
// =====================================================

async function sendWhatsapp(
    id,
    nama
) {

    try {

        const spreadsheetId =
            getSpreadsheetId();


        // =============================================
        // LOAD SETTINGS CUSTOMER
        // =============================================

        const settingsUrl =
            API_URL +
            "?action=settings" +
            "&spreadsheetId=" +
            encodeURIComponent(
                spreadsheetId
            ) +
            "&t=" +
            Date.now();


        const res =
            await fetch(
                settingsUrl,
                {
                    cache: "no-store"
                }
            );


        const settings =
            await res.json();


        console.log(
            "WA Settings:",
            settings
        );


        // =============================================
        // LINK UNDANGAN
        // =============================================

        let invitation =
            settings.invitationLink ||
            "";


        if (!invitation) {

            alert(
                "Link undangan belum diatur di Pengaturan."
            );

            return;

        }


        const separator =
            invitation.includes("?")
                ? "&"
                : "?";


        invitation +=
            separator +
            "ev=1&to=" +
            encodeURIComponent(
                nama
            );


        // =============================================
        // QR LINK
        // =============================================

        const qr =
            location.origin +
            "/card.html?id=" +
            encodeURIComponent(
                id
            );


        // =============================================
        // TEMPLATE
        // =============================================

        let text =
            settings.waTemplate ||
            "";


        if (!text) {

            text =
`Assalamu'alaikum Wr. Wb.

Yth.
{nama}

Dengan penuh rasa syukur dan tanpa mengurangi rasa hormat melalui pesan ini kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami.

Anggia & Haidar

🌸 Buka Undangan
{undangan}

━━━━━━━━━━━━━━━━━━━━━━

📍 REGISTRASI TAMU

Untuk mempercepat proses registrasi pada hari acara,
silakan simpan QR Check-in melalui tautan berikut.

👉 {link}

Mohon tunjukkan QR tersebut kepada penerima tamu saat memasuki area acara.

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Terima kasih.`;

        }


        // =============================================
        // REPLACE
        // =============================================

        text =
            text
                .replaceAll(
                    "{nama}",
                    nama
                )
                .replaceAll(
                    "{link}",
                    qr
                )
                .replaceAll(
                    "{undangan}",
                    invitation
                );


        console.log(
            "Invitation:",
            invitation
        );


        // =============================================
        // UPDATE STATUS WA
        // =============================================

        try {

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
                            "updateWaStatus",

                        id:
                            id,

                        spreadsheetId:
                            spreadsheetId

                    })

                }
            );

        }
        catch (err) {

            console.warn(
                "Gagal update status WA:",
                err
            );

        }


        // =============================================
        // BUKA WHATSAPP
        // =============================================

        const waUrl =
            "https://api.whatsapp.com/send?text=" +
            encodeURIComponent(
                text
            );


        window.location.href =
            waUrl;


    }
    catch (err) {

        console.error(
            "WhatsApp error:",
            err
        );


        alert(
            "Gagal membuat pesan WhatsApp."
        );

    }

}


// =====================================================
// DOWNLOAD
// =====================================================

function downloadGuest(id) {

    window.open(
        "card.html?id=" +
        encodeURIComponent(id) +
        "&download=1",
        "_blank"
    );

}


// =====================================================
// SEARCH
// =====================================================

function searchGuest() {

    const keyword =
        document
            .getElementById(
                "searchGuest"
            )
            .value
            .toLowerCase()
            .trim();


    currentPage = 1;


    filteredGuests =
        guests.filter(
            g => {

                const nama =
                    String(
                        g.nama || ""
                    )
                    .toLowerCase();


                const notes =
                    String(
                        g.notes || ""
                    )
                    .toLowerCase();


                const id =
                    String(
                        g.id || ""
                    )
                    .toLowerCase();


                const wa =
                    g.wa === true ||
                    g.wa === "TRUE";


                const fisik =
                    g.fisik === true ||
                    g.fisik === "TRUE";


                let cocokFilter =
                    true;


                switch (
                    currentFilter
                ) {

                    case "wa":

                        cocokFilter =
                            wa &&
                            !fisik;

                        break;


                    case "fisik":

                        cocokFilter =
                            fisik &&
                            !wa;

                        break;


                    case "both":

                        cocokFilter =
                            wa &&
                            fisik;

                        break;


                    case "none":

                        cocokFilter =
                            !wa &&
                            !fisik;

                        break;

                }


                return (

                    (
                        nama.includes(
                            keyword
                        ) ||

                        notes.includes(
                            keyword
                        ) ||

                        id.includes(
                            keyword
                        )
                    )

                    &&

                    cocokFilter

                );

            }
        );


    renderGuests(
        filteredGuests
    );

}


// =====================================================
// FILTER DELIVERY
// =====================================================

function filterDelivery(
    type
) {

    currentFilter =
        type;


    currentPage =
        1;


    applyFilters();

}


// =====================================================
// APPLY FILTERS
// =====================================================

function applyFilters() {

    const input =
        document.getElementById(
            "searchGuest"
        );


    const keyword =
        input
            ? input.value
                .toLowerCase()
                .trim()
            : "";


    filteredGuests =
        guests.filter(
            g => {

                const nama =
                    String(
                        g.nama || ""
                    )
                    .toLowerCase();


                const notes =
                    String(
                        g.notes || ""
                    )
                    .toLowerCase();


                const id =
                    String(
                        g.id || ""
                    )
                    .toLowerCase();


                const wa =
                    g.wa === true ||
                    g.wa === "TRUE";


                const fisik =
                    g.fisik === true ||
                    g.fisik === "TRUE";


                let cocokFilter =
                    true;


                switch (
                    currentFilter
                ) {

                    case "wa":

                        cocokFilter =
                            wa &&
                            !fisik;

                        break;


                    case "fisik":

                        cocokFilter =
                            fisik &&
                            !wa;

                        break;


                    case "both":

                        cocokFilter =
                            wa &&
                            fisik;

                        break;


                    case "none":

                        cocokFilter =
                            !wa &&
                            !fisik;

                        break;

                }


                const cocokSearch =

                    !keyword ||

                    nama.includes(
                        keyword
                    ) ||

                    notes.includes(
                        keyword
                    ) ||

                    id.includes(
                        keyword
                    );


                return (
                    cocokSearch &&
                    cocokFilter
                );

            }
        );


    renderGuests(
        filteredGuests
    );

}


// =====================================================
// PAGINATION
// =====================================================

function updatePagination(
    totalData
) {

    const totalPages =
        Math.ceil(
            totalData /
            rowsPerPage
        );


    const pageInfo =
        document.getElementById(
            "pageInfo"
        );


    if (pageInfo) {

        pageInfo.innerText =
            `Halaman ${currentPage} / ${Math.max(
                totalPages,
                1
            )}`;

    }


    const prevBtn =
        document.getElementById(
            "prevBtn"
        );


    const nextBtn =
        document.getElementById(
            "nextBtn"
        );


    if (prevBtn) {

        prevBtn.disabled =
            currentPage === 1;

    }


    if (nextBtn) {

        nextBtn.disabled =
            currentPage >=
            totalPages ||
            totalPages === 0;

    }

}


// =====================================================
// PREVIOUS
// =====================================================

const prevBtn =
    document.getElementById(
        "prevBtn"
    );


if (prevBtn) {

    prevBtn.onclick =
        function () {

            if (
                currentPage > 1
            ) {

                currentPage--;

                renderGuests(
                    filteredGuests
                );

            }

        };

}


// =====================================================
// NEXT
// =====================================================

const nextBtn =
    document.getElementById(
        "nextBtn"
    );


if (nextBtn) {

    nextBtn.onclick =
        function () {

            const totalPages =
                Math.ceil(
                    filteredGuests.length /
                    rowsPerPage
                );


            if (
                currentPage <
                totalPages
            ) {

                currentPage++;

                renderGuests(
                    filteredGuests
                );

            }

        };

}


// =====================================================
// DELIVERY STATUS
// =====================================================

function getDeliveryStatus(g) {

    const wa =
        g.wa === true ||
        g.wa === "TRUE";


    const fisik =
        g.fisik === true ||
        g.fisik === "TRUE";


    if (
        wa &&
        fisik
    ) {

        return `
            <span class="delivery both">
                🟡 Keduanya
            </span>
        `;

    }


    if (wa) {

        return `
            <span class="delivery wa">
                🟢 WhatsApp
            </span>
        `;

    }


    if (fisik) {

        return `
            <span class="delivery fisik">
                🔵 Fisik
            </span>
        `;

    }


    return `
        <span class="delivery none">
            🔴 Belum
        </span>
    `;

}


// =====================================================
// EDIT GUEST
// =====================================================

function editGuest(id) {

    const guest =
        guests.find(
            g =>
                String(g.id) ===
                String(id)
        );


    if (!guest) {

        alert(
            "Data tamu tidak ditemukan."
        );

        return;

    }


    document.getElementById(
        "editGuestId"
    ).value =
        guest.id || "";


    document.getElementById(
        "editGuestName"
    ).value =
        guest.nama || "";


    document.getElementById(
        "editGuestNotes"
    ).value =
        guest.notes || "";


    document.getElementById(
        "editGuestJenis"
    ).value =
        guest.jenis || "";


    document.getElementById(
        "editGuestTipe"
    ).value =
        guest.tipe || "";


    document
        .getElementById(
            "editGuestModal"
        )
        .classList
        .add("show");

}


// =====================================================
// CLOSE EDIT MODAL
// =====================================================

function closeEditModal() {

    const modal =
        document.getElementById(
            "editGuestModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


// =====================================================
// SAVE EDIT
// =====================================================

async function saveGuestEdit() {

    const id =
        document
            .getElementById(
                "editGuestId"
            )
            .value
            .trim();


    const nama =
        document
            .getElementById(
                "editGuestName"
            )
            .value
            .trim();


    const notes =
        document
            .getElementById(
                "editGuestNotes"
            )
            .value
            .trim();


    const jenis =
        document
            .getElementById(
                "editGuestJenis"
            )
            .value
            .trim();


    const tipe =
        document
            .getElementById(
                "editGuestTipe"
            )
            .value
            .trim();


    if (!nama) {

        alert(
            "Nama tamu wajib diisi."
        );

        return;

    }


    const spreadsheetId =
        getSpreadsheetId();


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

                        action:
                            "updateGuest",

                        id:
                            id,

                        nama:
                            nama,

                        notes:
                            notes,

                        jenis:
                            jenis,

                        tipe:
                            tipe,

                        spreadsheetId:
                            spreadsheetId

                    })

                }
            );


        const data =
            await res.json();


        console.log(
            "Update guest:",
            data
        );


        if (!data.success) {

            alert(
                data.message ||
                "Gagal mengubah data tamu."
            );

            return;

        }


        closeEditModal();


        await loadGuests();


        alert(
            "Data tamu berhasil diperbarui."
        );

    }
    catch (err) {

        console.error(
            "Update guest error:",
            err
        );


        alert(
            "Terjadi kesalahan saat mengubah data tamu."
        );

    }

}


// =====================================================
// DELETE GUEST
// =====================================================

async function deleteGuest(id) {

    const guest =
        guests.find(
            g =>
                String(g.id) ===
                String(id)
        );


    if (!guest) {

        alert(
            "Data tamu tidak ditemukan."
        );

        return;

    }


    const nama =
        guest.nama ||
        "tamu ini";


    const yakin =
        confirm(
            `Yakin ingin menghapus tamu "${nama}"?\n\n` +
            `Data yang dihapus tidak dapat dikembalikan.`
        );


    if (!yakin) {

        return;

    }


    const spreadsheetId =
        getSpreadsheetId();


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

                        action:
                            "deleteGuest",

                        id:
                            id,

                        spreadsheetId:
                            spreadsheetId

                    })

                }
            );


        const data =
            await res.json();


        console.log(
            "Delete guest:",
            data
        );


        if (!data.success) {

            alert(
                data.message ||
                "Gagal menghapus tamu."
            );

            return;

        }


        await loadGuests();


        alert(
            "Tamu berhasil dihapus."
        );

    }
    catch (err) {

        console.error(
            "Delete guest error:",
            err
        );


        alert(
            "Terjadi kesalahan saat menghapus tamu."
        );

    }

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text == null
            ? ""
            : String(text);


    return div.innerHTML;

}


// =====================================================
// ESCAPE JAVASCRIPT
// =====================================================

function escapeJs(text) {

    return String(
        text == null
            ? ""
            : text
    )
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");

}


// =====================================================
// INIT
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadGuests();

    }
);