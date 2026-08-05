let guests = [];
let filteredGuests = [];
let currentFilter = "all";

let currentPage = 1;
const rowsPerPage = 10;

async function loadGuests(){

    const res = await fetch(API_URL + "?action=guests");

    guests = await res.json();

filteredGuests = guests;

renderGuests(filteredGuests); 
}

function previewGuest(id){

    window.open(
        "invite.html?id=" + id,
        "_blank"
    );

}

loadGuests();
function renderGuests(data){

    const tbody = document.getElementById("guestTable");

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const pageData = data.slice(start, end);

    let html = "";

    pageData.forEach(g=>{

        html += `
        <tr>

            <td>${g.id}</td>

            <td>${g.nama}</td>

            <td>${g.notes || "-"}</td>

<td>${getDeliveryStatus(g)}</td>

<td>

                <button class="action-btn preview"
                    onclick="previewGuest('${g.id}')">
                    👁️ Lihat
                </button>

                <button
    class="action-btn wa"
    onclick="sendWhatsapp('${g.id}','${g.nama}')">

    <i class="fa-brands fa-whatsapp"></i>
    WhatsApp

</button>

                <button
                    class="action-btn print"
                    onclick="downloadGuest('${g.id}')">

                    📥 Download

                </button>

            </td>

        </tr>
        `;

    });

    tbody.innerHTML = html;

    const from = data.length === 0 ? 0 : start + 1;
    const to = Math.min(end, data.length);

    document.getElementById("resultInfo").innerText =
        `Menampilkan ${from}-${to} dari ${data.length} tamu`;
        
        updatePagination(data.length);

}

async function sendWhatsapp(id, nama){

    // Ambil pengaturan
    const res = await fetch(API_URL + "?action=settings");
    const settings = await res.json();
    console.log(settings);

  // Link undangan dari Pengaturan
let invitation = settings.invitationLink;

const separator =
    invitation.includes("?")
    ? "&"
    : "?";

invitation +=
    separator +
    "ev=1&to=" +
    encodeURIComponent(nama);


    // Link QR
    const qr =
    location.origin +
    "/card.html?id=" +
    id;

    // Template
    let text = settings.waTemplate;

    // kalau template kosong gunakan default
    if(!text){

        text =
`Assalamu'alaikum Wr. Wb.

Yth.
{nama}

Dengan penuh rasa syukur dan tanpa mengurangi rasa hormat melalui pesan ini
kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami:

Anggia & Haidar

🌸 Buka Undangan
{undangan}

━━━━━━━━━━━━━━━━━━━━━━

📍 REGISTRASI TAMU

Untuk mempercepat proses registrasi pada hari acara,
silahkan simpan QR Check-in melalui tautan berikut.


👉 {link}

Mohon tunjukkan QR tersebut kepada penerima tamu saat memasuki area acara.

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
berkenan untuk hadir dan memberikan doa restu

Terima kasih.`;

    }

    // Replace placeholder
    text = text
        .replaceAll("{nama}", nama)
        .replaceAll("{link}", qr)
        .replaceAll("{undangan}", invitation);

        console.log("Invitation =", invitation);
console.log("QR =", qr);
console.log("Text =", text);
  const waUrl =
    "https://api.whatsapp.com/send?text=" +
    encodeURIComponent(text);

// Simpan status WA ke Google Sheet
try{

    await fetch(API_URL,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            action:"updateWaStatus",

            id:id

        })

    });

}catch(err){

    console.log(err);

}

// Buka WhatsApp
location.href = waUrl;
    

}
function printGuest(id){

    const win = window.open(
        "invite.html?id=" + id,
        "_blank"
    );

    win.onload = function(){

        win.print();

    };

}
function downloadGuest(id){

    window.open(
        "invite.html?id=" + id + "&download=1",
        "_blank"
    );

}
function searchGuest(){

    const keyword =
        document
        .getElementById("searchGuest")
        .value
        .toLowerCase();

    currentPage = 1;

    filteredGuests = guests.filter(g=>{

        const nama =
            (g.nama || "")
            .toLowerCase();

        const wa =
            g.wa === true ||
            g.wa === "TRUE";

        const fisik =
            g.fisik === true ||
            g.fisik === "TRUE";

        let cocokFilter = true;

        switch(currentFilter){

            case "wa":
                cocokFilter = wa && !fisik;
                break;

            case "fisik":
                cocokFilter = fisik && !wa;
                break;

            case "both":
                cocokFilter = wa && fisik;
                break;

            case "none":
                cocokFilter = !wa && !fisik;
                break;

        }

        return nama.includes(keyword) && cocokFilter;

    });

    renderGuests(filteredGuests);

}

function updatePagination(totalData){

    const totalPages = Math.ceil(totalData / rowsPerPage);

    const pageInfo = document.getElementById("pageInfo");

    if(pageInfo){
        pageInfo.innerText = `Halaman ${currentPage} / ${totalPages}`;
    }

    document.getElementById("prevBtn").disabled =
        currentPage === 1;

    document.getElementById("nextBtn").disabled =
        currentPage === totalPages || totalPages === 0;

}

document.getElementById("prevBtn").onclick = () => {

    if(currentPage > 1){

        currentPage--;

        renderGuests(filteredGuests);

    }

};

document.getElementById("nextBtn").onclick = () => {

    const totalPages = Math.ceil(filteredGuests.length / rowsPerPage);

    if(currentPage < totalPages){

        currentPage++;

        renderGuests(filteredGuests);

    }

};
function getDeliveryStatus(g){

    const wa = g.wa === true || g.wa === "TRUE";
    const fisik = g.fisik === true || g.fisik === "TRUE";

    if(wa && fisik){

        return `<span class="delivery both">🟡 Keduanya</span>`;

    }

    if(wa){

        return `<span class="delivery wa">🟢 WhatsApp</span>`;

    }

    if(fisik){

        return `<span class="delivery fisik">🔵 Fisik</span>`;

    }

    return `<span class="delivery none">🔴 Belum</span>`;

}
function filterDelivery(type){

    currentFilter = type;

    currentPage = 1;

    filteredGuests = guests.filter(g=>{

        const wa =
            g.wa === true ||
            g.wa === "TRUE";

        const fisik =
            g.fisik === true ||
            g.fisik === "TRUE";

        switch(type){

            case "wa":
                return wa && !fisik;

            case "fisik":
                return fisik && !wa;

            case "both":
                return wa && fisik;

            case "none":
                return !wa && !fisik;

            default:
                return true;

        }

    });

    renderGuests(filteredGuests);

}