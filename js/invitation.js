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

function sendWhatsapp(id, nama){

    const url =
        location.origin +
        "/open.html?id=" +
        id;

    const text =
`Assalamu'alaikum Wr. Wb.

Kepada Yth.

${nama}

Dengan segala hormat kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.

Silakan buka undangan melalui tautan berikut:

${url}

Terima kasih.`;

    window.open(
        "https://wa.me/?text=" +
        encodeURIComponent(text),
        "_blank"
    );

}