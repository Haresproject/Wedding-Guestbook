async function checkLicense(){

    // ================= DEMO =================

    if(CONFIG.DEMO){

        console.warn("Running Demo Version");

        return true;
    }


    // ================= INFO =================

    console.log(
        CONFIG.APP_NAME +
        " v" +
        CONFIG.VERSION
    );

    console.log(
        "License : " +
        CONFIG.LICENSE
    );


    console.log(
        "License =",
        CONFIG.LICENSE
    );

    console.log(
        "Domain =",
        location.hostname
    );


    // ================= CHECK LICENSE =================

    try{

        const res = await fetch(
            CONFIG.API_URL +
            "?action=license" +
            "&license=" +
            encodeURIComponent(CONFIG.LICENSE) +
            "&domain=" +
            encodeURIComponent(location.hostname)
        );


        const data = await res.json();


        console.log(
            "License response:",
            data
        );


        // ================= INVALID =================

        if(!data.success){

            document.body.innerHTML = `

                <div style="
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    height:100vh;
                    font-family:Arial,sans-serif;
                    background:#f8f8f8;
                    text-align:center;
                ">

                    <div>

                        <h1>🔒 Website Belum Diaktivasi</h1>

                        <p>${data.message}</p>

                        <small>Hubungi HaresLens</small>

                    </div>

                </div>

            `;


            console.error(
                "License Invalid:",
                data.message
            );


            return false;

        }


        // ================= VALID =================

        console.log(
            "✅ License Valid"
        );

        console.log(
            "Owner:",
            data.owner
        );


        return true;


    }catch(err){

        console.error(
            "License Error:",
            err
        );


        return false;

    }

}