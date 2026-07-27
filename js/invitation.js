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

                <button class="action-btn print">
                    🖨️ Cetak
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
    const invitation =
        settings.invitationLink || "";

    // Link QR
    const qr =
        location.origin +
        "/open.html?id=" +
        id;

    // Template
    let text = settings.waTemplate;

    // kalau template kosong gunakan default
    if(!text){

        text =
`Assalamu'alaikum Wr. Wb.

Yth.
{nama}

Dengan penuh rasa syukur kami mengundang
Bapak/Ibu/Saudara/i untuk hadir dalam
acara pernikahan kami.

🌸 Buka Undangan
{undangan}

━━━━━━━━━━━━━━━━━━━━━━

📍 REGISTRASI TAMU

Untuk mempercepat proses registrasi pada hari acara,
silakan simpan QR Check-in melalui tautan berikut.

👉 {link}

Mohon tunjukkan QR tersebut kepada petugas saat memasuki area acara.

Terima kasih.`;

    }

    // Replace placeholder
    text = text
        .replaceAll("{nama}", nama)
        .replaceAll("{link}", qr)
        .replaceAll("{undangan}", invitation);

    window.open(
        "https://wa.me/?text=" +
        encodeURIComponent(text),
        "_blank"
    );

}