const API_URL = CONFIG.API_URL;


// =====================================================
// AMBIL SPREADSHEET ID CUSTOMER
// =====================================================

function getCustomerSpreadsheetId() {

    const user =
        JSON.parse(
            localStorage.getItem("user") || "{}"
        );


    // ================================================
    // SUPER ADMIN
    // ================================================

    if (
        String(user.role || "")
            .trim()
            .toLowerCase() === "superadmin"
        ||
        String(user.username || "")
            .trim()
            .toLowerCase() === "admin"
    ) {

        return "";

    }


    // ================================================
    // CUSTOMER
    // ================================================

    return (
        localStorage.getItem(
            "spreadsheetId"
        ) || ""
    );

}


// ================= LOAD SETTINGS =================

async function loadSettings(){

    try{

        const spreadsheetId =
            getCustomerSpreadsheetId();


        // ============================================
        // BUAT URL SETTINGS
        // ============================================

        let url =
            API_URL +
            "?action=settings";


        // Customer
        if (spreadsheetId) {

            url +=
                "&spreadsheetId=" +
                encodeURIComponent(
                    spreadsheetId
                );

        }


        console.log(
            "📥 LOAD SETTINGS:",
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
            "⚙ SETTINGS RESPONSE:",
            data
        );


        // ============================================
        // DATA SETTINGS
        // ============================================

        document.getElementById("bride").value =
            data.bride || "";


        document.getElementById("groom").value =
            data.groom || "";


        document.getElementById("venue").value =
            data.venue || "";


        document.getElementById("invitationLink").value =
            data.invitationLink || "";


        document.getElementById("logo").value =
            data.logo || "";


        document.getElementById("background").value =
            data.background || "";


        document.getElementById("cardBackground").value =
            data.cardBackground || "";


        // ============================================
        // CARD BACKGROUND PREVIEW
        // ============================================

        if(data.cardBackground){

            document.getElementById(
                "cardBgPreview"
            ).src =
                data.cardBackground;


            document.getElementById(
                "cardBgPreview"
            ).style.display =
                "block";

        }


        // ============================================
        // LOGO PREVIEW
        // ============================================

        if(data.logo){

            document.getElementById(
                "logoPreview"
            ).src =
                data.logo;


            document.getElementById(
                "logoPreview"
            ).style.display =
                "block";

        }


        // ============================================
        // BACKGROUND PREVIEW
        // ============================================

        if(data.background){

            document.getElementById(
                "bgPreview"
            ).src =
                data.background;


            document.getElementById(
                "bgPreview"
            ).style.display =
                "block";

        }


        // ============================================
        // DATE
        // ============================================

        if(data.date){

            const d =
                new Date(data.date);


            document.getElementById(
                "date"
            ).value =
                d.toISOString()
                    .split("T")[0];

        }


        // ============================================
        // THEME
        // ============================================

        document.getElementById(
            "theme"
        ).value =
            data.theme ||
            "emerald";


        applyTheme(
            data.theme ||
            "emerald"
        );


        // ============================================
        // USERNAME
        // ============================================

        document.getElementById(
            "username"
        ).value =
            data.username ||
            "admin";


        // ============================================
        // PASSWORD
        // ============================================

        document.getElementById(
            "password"
        ).value =
            data.password ||
            "admin123";


        // ============================================
        // WHATSAPP TEMPLATE
        // ============================================

        document.getElementById(
            "waTemplate"
        ).value =
            data.waTemplate ||
            "";


    }
    catch(err){

        console.error(
            "LOAD SETTINGS ERROR:",
            err
        );

    }

}


// ================= SAVE SETTINGS =================

async function saveSettings(){

    const spreadsheetId =
        getCustomerSpreadsheetId();


    // ================================================
    // BODY
    // ================================================

    const body = {

        action:
            "saveSettings",


        // ============================================
        // CUSTOMER SPREADSHEET
        // ============================================

        spreadsheetId:
            spreadsheetId,


        bride:
            document.getElementById(
                "bride"
            ).value,


        groom:
            document.getElementById(
                "groom"
            ).value,


        date:
            document.getElementById(
                "date"
            ).value,


        venue:
            document.getElementById(
                "venue"
            ).value,


        invitationLink:
            document.getElementById(
                "invitationLink"
            ).value,


        logo:
            document.getElementById(
                "logo"
            ).value,


        background:
            document.getElementById(
                "background"
            ).value,


        theme:
            document.getElementById(
                "theme"
            ).value,


        username:
            document.getElementById(
                "username"
            ).value,


        password:
            document.getElementById(
                "password"
            ).value,


        waTemplate:
            document.getElementById(
                "waTemplate"
            ).value,


        cardBackground:
            document.getElementById(
                "cardBackground"
            ).value

    };


    console.log(
        "📤 SAVE SETTINGS:",
        body
    );


    try{

        const res =
            await fetch(
                API_URL,
                {

                    method:
                        "POST",

                    headers:{
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            body
                        )

                }
            );


        const result =
            await res.json();


        console.log(
            "SAVE SETTINGS RESPONSE:",
            result
        );


        alert(
            result.message ||
            "Pengaturan berhasil disimpan."
        );


    }
    catch(err){

        console.error(
            "SAVE SETTINGS ERROR:",
            err
        );


        alert(
            "Gagal menyimpan."
        );

    }

}


// ================= THEME =================

function applyTheme(theme){

    const themes = {

        emerald:{
            primary:"#214E43",
            secondary:"#2f6a5c",
            accent:"#E8C547"
        },

        gold:{
            primary:"#B8860B",
            secondary:"#D4AF37",
            accent:"#F5DEB3"
        },

        rosegold:{
            primary:"#B76E79",
            secondary:"#D98C99",
            accent:"#F4D6CC"
        },

        royalblue:{
            primary:"#1E3A8A",
            secondary:"#2563EB",
            accent:"#60A5FA"
        },

        black:{
            primary:"#222222",
            secondary:"#444444",
            accent:"#C9A227"
        }

    };


    const c =
        themes[theme] ||
        themes.emerald;


    document.documentElement.style.setProperty(
        "--primary",
        c.primary
    );


    document.documentElement.style.setProperty(
        "--secondary",
        c.secondary
    );


    document.documentElement.style.setProperty(
        "--accent",
        c.accent
    );

}


document
    .getElementById("theme")
    .addEventListener(
        "change",
        function(){

            applyTheme(
                this.value
            );

        }
    );


document
    .getElementById("saveBtn")
    .addEventListener(
        "click",
        saveSettings
    );


// ================= UPLOAD FILE =================

async function uploadFile(file){

    return new Promise(
        (resolve,reject)=>{

            const reader =
                new FileReader();


            reader.onload =
                async function(e){

                    try{

                        const base64 =
                            e.target.result
                                .split(",")[1];


                        const spreadsheetId =
                            getCustomerSpreadsheetId();


                        const res =
                            await fetch(
                                API_URL,
                                {

                                    method:
                                        "POST",

                                    headers:{
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body:
                                        JSON.stringify({

                                            action:
                                                "uploadImage",

                                            spreadsheetId:
                                                spreadsheetId,

                                            base64:
                                                base64,

                                            fileName:
                                                file.name,

                                            mimeType:
                                                file.type

                                        })

                                }
                            );


                        const data =
                            await res.json();


                        resolve(
                            data.url
                        );


                    }
                    catch(err){

                        reject(
                            err
                        );

                    }

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


// ================= LOGO =================

document
    .getElementById("logoFile")
    .addEventListener(
        "change",
        async function(){

            if(
                this.files.length === 0
            ) return;


            const file =
                this.files[0];


            document.getElementById(
                "logoPreview"
            ).src =
                URL.createObjectURL(
                    file
                );


            document.getElementById(
                "logoPreview"
            ).style.display =
                "block";


            try{

                const url =
                    await uploadFile(
                        file
                    );


                document.getElementById(
                    "logo"
                ).value =
                    url;


            }
            catch(err){

                alert(
                    "Upload logo gagal"
                );


                console.log(
                    err
                );

            }

        }
    );


// ================= BACKGROUND =================

document
    .getElementById("bgFile")
    .addEventListener(
        "change",
        async function(){

            if(
                this.files.length === 0
            ) return;


            const file =
                this.files[0];


            document.getElementById(
                "bgPreview"
            ).src =
                URL.createObjectURL(
                    file
                );


            document.getElementById(
                "bgPreview"
            ).style.display =
                "block";


            try{

                const url =
                    await uploadFile(
                        file
                    );


                document.getElementById(
                    "background"
                ).value =
                    url;


            }
            catch(err){

                alert(
                    "Upload background gagal"
                );


                console.log(
                    err
                );

            }

        }
    );


// ================= CARD BACKGROUND =================

document
    .getElementById("cardBgFile")
    .addEventListener(
        "change",
        async function(){

            if(
                this.files.length === 0
            ) return;


            const file =
                this.files[0];


            document.getElementById(
                "cardBgPreview"
            ).src =
                URL.createObjectURL(
                    file
                );


            document.getElementById(
                "cardBgPreview"
            ).style.display =
                "block";


            try{

                const url =
                    await uploadFile(
                        file
                    );


                document.getElementById(
                    "cardBackground"
                ).value =
                    url;


            }
            catch(err){

                alert(
                    "Upload background QR gagal"
                );


                console.log(
                    err
                );

            }

        }
    );


// ================= INIT =================

loadSettings();