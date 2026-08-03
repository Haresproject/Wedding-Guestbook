async function loadGuests(){

    const res = await fetch(API_URL + "?action=guests");

    const data = await res.json();

    let html = "";

    data.forEach(g=>{

        html += `
        <tr>

            <td>${g.id}</td>

            <td>${g.nama}</td>

            <td>

                <button class="action-btn preview"
                onclick="previewGuest('${g.id}')">
                    👁️ Lihat
                </button>

                <button
                    class="action-btn wa"
                    onclick="sendWhatsapp('${g.id}','${g.nama}')">

                    📤 WhatsApp

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

    document.getElementById("guestTable").innerHTML = html;

}

function previewGuest(id){

    window.open(
        "invite.html?id=" + id,
        "_blank"
    );

}

loadGuests();

async function sendWhatsapp(id, nama){

    // Ambil pengaturan
    const res = await fetch(API_URL + "?action=settings");
    const settings = await res.json();

   // Link undangan dari Pengaturan
const separator =
settings.invitationLink.includes("?")
    ? "&"
    : "?";

const invitation =
settings.invitationLink +
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

Mohon tunjukkan QR tersebut kepada petugas saat memasuki area acara.

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
berkenan untuk hadir dan memberikan doa restu

Terima kasih.`;

    }

    // Replace placeholder
    text = text
        .replaceAll("{nama}", nama)
        .replaceAll("{link}", qr)
        .replaceAll("{undangan}", invitation);

   window.open(
    "https://wa.me/?text=" + encodeURIComponent(text),
    "_blank"
);
    

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