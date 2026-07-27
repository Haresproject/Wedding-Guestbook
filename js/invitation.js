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

                <button class="action-btn wa">
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