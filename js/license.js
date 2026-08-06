async function checkLicense(){

    // Demo
    if(CONFIG.DEMO){
        console.warn("Running Demo Version");
        return;
    }

    console.log(CONFIG.APP_NAME + " v" + CONFIG.VERSION);
    console.log("License : " + CONFIG.LICENSE);

    try{
        
console.log("License =", CONFIG.LICENSE);
console.log("Domain =", location.hostname);

        const res = await fetch(
            CONFIG.API_URL +
            "?action=license" +
            "&license=" + encodeURIComponent(CONFIG.LICENSE) +
            "&domain=" + encodeURIComponent(location.hostname)
        );

        const data = await res.json();

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

            throw new Error("License Invalid");

        }

        console.log("✅ License Valid");

    }catch(err){

        console.error("License Error :", err);

    }

}

checkLicense();