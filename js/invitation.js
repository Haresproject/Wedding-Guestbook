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
    document.getElementById("resultInfo").innerText =
    `Menampilkan ${data.length} dari ${data.length} tamu`;

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

        console.log("Invitation =", invitation);
console.log("QR =", qr);
console.log("Text =", text);
  const waUrl =
    "https://api.whatsapp.com/send?text=" +
    encodeURIComponent(text);

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

    const rows =
        document.querySelectorAll("#guestTable tr");

    let total = rows.length;
    let tampil = 0;

    rows.forEach(row=>{

        const nama =
            row.children[1]
            .innerText
            .toLowerCase();

        if(nama.includes(keyword)){

            row.style.display = "";
            tampil++;

        }else{

            row.style.display = "none";

        }

    });

    document.getElementById("resultInfo").innerText =
        `Menampilkan ${tampil} dari ${total} tamu`;

}