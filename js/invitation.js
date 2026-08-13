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

    window.location.href =
        "index.html";

}


if (
    !IS_SUPER_ADMIN &&
    !SPREADSHEET_ID
) {

    window.location.href =
        "index.html";

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
// SPREADSHEET ID
// =====================================================

function getSpreadsheetId(){

    if(IS_SUPER_ADMIN){

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

async function loadGuests(){

    try{

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


        const res =
            await fetch(
                url,
                {
                    cache:"no-store"
                }
            );


        const data =
            await res.json();


        console.log(
            "Invitation guests:",
            data
        );


        if(Array.isArray(data)){

            guests = data;

        }

        else if(
            data &&
            Array.isArray(data.guests)
        ){

            guests =
                data.guests;

        }

        else{

            guests = [];

        }


        filteredGuests =
            guests;


        currentPage = 1;


        renderGuests(
            filteredGuests
        );


    }
    catch(err){

        console.error(
            "Gagal load undangan:",
            err
        );


        const tbody =
            document.getElementById(
                "guestTable"
            );


        if(tbody){

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

function previewGuest(id){

    window.open(
        "card.html?id=" +
        encodeURIComponent(id),
        "_blank"
    );

}


// =====================================================
// RENDER GUESTS
// =====================================================

function renderGuests(data){

    const tbody =
        document.getElementById(
            "guestTable"
        );


    if(!tbody) return;


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


    if(pageData.length === 0){

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


    if(resultInfo){

        resultInfo.innerText =
            `Menampilkan ${from}-${to} dari ${data.length} tamu`;

    }


    updatePagination(
        data.length
    );

}


// =====================================================
// DELIVERY STATUS
// =====================================================

function getDeliveryStatus(g){

    const wa =
        g.wa === true ||
        g.wa === "TRUE";


    const fisik =
        g.fisik === true ||
        g.fisik === "TRUE";


    if(
        wa &&
        fisik
    ){

        return `

            <span class="delivery both">
                🟡 Keduanya
            </span>

        `;

    }


    if(wa){

        return `

            <span class="delivery wa">
                🟢 WhatsApp
            </span>

        `;

    }


    if(fisik){

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
// GET DELIVERY VALUE
// =====================================================

function getDeliveryValue(g){

    const wa =
        g.wa === true ||
        g.wa === "TRUE";


    const fisik =
        g.fisik === true ||
        g.fisik === "TRUE";


    if(
        wa &&
        fisik
    ){

        return "both";

    }


    if(wa){

        return "wa";

    }


    if(fisik){

        return "fisik";

    }


    return "none";

}


// =====================================================
// EDIT GUEST
// =====================================================

function editGuest(id){

    const guest =
        guests.find(
            g =>
                String(g.id) ===
                String(id)
        );


    if(!guest){

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


    // =================================================
    // STATUS PENGIRIMAN
    // =================================================

    document.getElementById(
        "editGuestDelivery"
    ).value =
        getDeliveryValue(
            guest
        );


    // =================================================
    // TIPE TAMU
    // =================================================

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
// CLOSE MODAL
// =====================================================

function closeEditModal(){

    const modal =
        document.getElementById(
            "editGuestModal"
        );


    if(modal){

        modal.classList.remove(
            "show"
        );

    }

}


// =====================================================
// SAVE EDIT
// =====================================================

async function saveGuestEdit(){

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


    const delivery =
        document
            .getElementById(
                "editGuestDelivery"
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


    if(!nama){

        alert(
            "Nama tamu wajib diisi."
        );

        return;

    }


    const spreadsheetId =
        getSpreadsheetId();


    try{

        const res =
            await fetch(
                API_URL,
                {

                    method:"POST",

                    headers:{
                        "Content-Type":
                            "application/json"
                    },

                    body:JSON.stringify({

                        action:
                            "updateGuest",

                        id:
                            id,

                        nama:
                            nama,

                        notes:
                            notes,

                        delivery:
                            delivery,

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


        if(!data.success){

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
    catch(err){

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
// SEARCH
// =====================================================

function searchGuest(){

    applyFilters();

}


// =====================================================
// FILTER DELIVERY
// =====================================================

function filterDelivery(type){

    currentFilter =
        type;


    currentPage =
        1;


    applyFilters();

}


// =====================================================
// APPLY FILTERS
// =====================================================

function applyFilters(){

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


                switch(
                    currentFilter
                ){

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
                    nama.includes(keyword) ||
                    notes.includes(keyword) ||
                    id.includes(keyword);


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
){

    const totalPages =
        Math.ceil(
            totalData /
            rowsPerPage
        );


    const pageInfo =
        document.getElementById(
            "pageInfo"
        );


    if(pageInfo){

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


    if(prevBtn){

        prevBtn.disabled =
            currentPage === 1;

    }


    if(nextBtn){

        nextBtn.disabled =
            currentPage >= totalPages ||
            totalPages === 0;

    }

}


// =====================================================
// PREVIOUS / NEXT
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function(){

        const prevBtn =
            document.getElementById(
                "prevBtn"
            );


        const nextBtn =
            document.getElementById(
                "nextBtn"
            );


        if(prevBtn){

            prevBtn.onclick =
                function(){

                    if(
                        currentPage > 1
                    ){

                        currentPage--;

                        renderGuests(
                            filteredGuests
                        );

                    }

                };

        }


        if(nextBtn){

            nextBtn.onclick =
                function(){

                    const totalPages =
                        Math.ceil(
                            filteredGuests.length /
                            rowsPerPage
                        );


                    if(
                        currentPage <
                        totalPages
                    ){

                        currentPage++;

                        renderGuests(
                            filteredGuests
                        );

                    }

                };

        }


        loadGuests();

    }
);


// =====================================================
// WHATSAPP
// =====================================================

async function sendWhatsapp(
    id,
    nama
){

    try{

        const spreadsheetId =
            getSpreadsheetId();


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
                    cache:"no-store"
                }
            );


        const settings =
            await res.json();


        let invitation =
            settings.invitationLink ||
            "";


        if(!invitation){

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


        const qr =
            location.origin +
            "/card.html?id=" +
            encodeURIComponent(
                id
            );


        let text =
            settings.waTemplate ||
            "";


        if(!text){

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


        // =================================================
        // UPDATE WA
        // =================================================

        try{

            await fetch(
                API_URL,
                {

                    method:"POST",

                    headers:{
                        "Content-Type":
                            "application/json"
                    },

                    body:JSON.stringify({

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
        catch(err){

            console.warn(
                "Gagal update status WA:",
                err
            );

        }


        const waUrl =
            "https://api.whatsapp.com/send?text=" +
            encodeURIComponent(
                text
            );


        window.location.href =
            waUrl;


    }
    catch(err){

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

function downloadGuest(id){

    window.open(
        "card.html?id=" +
        encodeURIComponent(id) +
        "&download=1",
        "_blank"
    );

}


// =====================================================
// DELETE
// =====================================================

async function deleteGuest(id){

    const guest =
        guests.find(
            g =>
                String(g.id) ===
                String(id)
        );


    if(!guest){

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


    if(!yakin){

        return;

    }


    const spreadsheetId =
        getSpreadsheetId();


    try{

        const res =
            await fetch(
                API_URL,
                {

                    method:"POST",

                    headers:{
                        "Content-Type":
                            "application/json"
                    },

                    body:JSON.stringify({

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


        if(!data.success){

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
    catch(err){

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

function escapeHtml(text){

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
// ESCAPE JS
// =====================================================

function escapeJs(text){

    return String(
        text == null
            ? ""
            : text
    )
        .replace(/\\/g,"\\\\")
        .replace(/'/g,"\\'")
        .replace(/"/g,'\\"')
        .replace(/\n/g,"\\n")
        .replace(/\r/g,"\\r");

}