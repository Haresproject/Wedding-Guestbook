// =====================================================
// SETTINGS.JS
// WEDDING GUESTBOOK
// FINAL VERSION
// =====================================================

const API_URL = CONFIG.API_URL;


// =====================================================
// AMBIL SPREADSHEET ID
// =====================================================

function getCustomerSpreadsheetId() {

    const user =
        JSON.parse(
            localStorage.getItem("user") || "{}"
        );


    // =================================================
    // SUPER ADMIN
    // =================================================

    if (
        String(user.role || "")
            .trim()
            .toLowerCase() === "superadmin"
        ||
        String(user.username || "")
            .trim()
            .toLowerCase() === "admin"
    ) {

        return (
            CONFIG.SUPER_ADMIN_SPREADSHEET_ID ||
            ""
        );

    }


    // =================================================
    // CUSTOMER
    // =================================================

    return (
        localStorage.getItem(
            "spreadsheetId"
        ) || ""
    );

}


// =====================================================
// LOAD SETTINGS
// =====================================================

async function loadSettings() {

    try {

        const spreadsheetId =
            getCustomerSpreadsheetId();


        if (!spreadsheetId) {

            throw new Error(
                "Spreadsheet ID tidak ditemukan."
            );

        }


        // =============================================
        // URL SETTINGS
        // =============================================

        const url =
            API_URL +
            "?action=settings" +
            "&spreadsheetId=" +
            encodeURIComponent(
                spreadsheetId
            );


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


        if (!res.ok) {

            throw new Error(
                "HTTP " +
                res.status
            );

        }


        const data =
            await res.json();


        console.log(
            "⚙ SETTINGS RESPONSE:",
            data
        );


        // =============================================
        // VALIDASI RESPONSE
        // =============================================

        if (
            data &&
            data.success === false
        ) {

            throw new Error(
                data.message ||
                "Gagal mengambil settings."
            );

        }


        // =============================================
        // DATA UTAMA
        // =============================================

        const bride =
            document.getElementById(
                "bride"
            );

        const groom =
            document.getElementById(
                "groom"
            );

        const venue =
            document.getElementById(
                "venue"
            );

        const invitationLink =
            document.getElementById(
                "invitationLink"
            );

        const logo =
            document.getElementById(
                "logo"
            );

        const background =
            document.getElementById(
                "background"
            );

        const cardBackground =
            document.getElementById(
                "cardBackground"
            );


        if (bride) {

            bride.value =
                data.bride || "";

        }


        if (groom) {

            groom.value =
                data.groom || "";

        }


        if (venue) {

            venue.value =
                data.venue || "";

        }


        if (invitationLink) {

            invitationLink.value =
                data.invitationLink || "";

        }


        if (logo) {

            logo.value =
                data.logo || "";

        }


        if (background) {

            background.value =
                data.background || "";

        }


        if (cardBackground) {

            cardBackground.value =
                data.cardBackground || "";

        }


        // =============================================
        // LOGO PREVIEW
        // =============================================

        const logoPreview =
            document.getElementById(
                "logoPreview"
            );


        if (
            logoPreview &&
            data.logo
        ) {

            logoPreview.src =
                data.logo;

            logoPreview.style.display =
                "block";

        }


        // =============================================
        // BACKGROUND PREVIEW
        // =============================================

        const bgPreview =
            document.getElementById(
                "bgPreview"
            );


        if (
            bgPreview &&
            data.background
        ) {

            bgPreview.src =
                data.background;

            bgPreview.style.display =
                "block";

        }


        // =============================================
        // CARD BACKGROUND PREVIEW
        // =============================================

        const cardBgPreview =
            document.getElementById(
                "cardBgPreview"
            );


        if (
            cardBgPreview &&
            data.cardBackground
        ) {

            cardBgPreview.src =
                data.cardBackground;

            cardBgPreview.style.display =
                "block";

        }


        // =============================================
        // DATE
        // =============================================

        const dateElement =
            document.getElementById(
                "date"
            );


        if (
            dateElement &&
            data.date
        ) {

            const d =
                new Date(
                    data.date
                );


            if (
                !isNaN(
                    d.getTime()
                )
            ) {

                dateElement.value =
                    d.toISOString()
                        .split("T")[0];

            }

        }


        // =============================================
        // THEME
        // =============================================

        const theme =
            data.theme ||
            "emerald";


        const themeElement =
            document.getElementById(
                "theme"
            );


        if (themeElement) {

            themeElement.value =
                theme;

        }


        applyTheme(
            theme
        );


        // =============================================
        // USERNAME
        // =============================================

        const usernameElement =
            document.getElementById(
                "username"
            );


        if (usernameElement) {

            usernameElement.value =
                data.username ||
                "admin";

        }


        // =============================================
        // PASSWORD
        // =============================================

        const passwordElement =
            document.getElementById(
                "password"
            );


        if (passwordElement) {

            passwordElement.value =
                data.password ||
                "admin123";

        }


        // =============================================
        // WHATSAPP TEMPLATE
        // =============================================

        const waTemplateElement =
            document.getElementById(
                "waTemplate"
            );


        if (waTemplateElement) {

            waTemplateElement.value =
                data.waTemplate ||
                "";

        }


    }
    catch (err) {

        console.error(
            "LOAD SETTINGS ERROR:",
            err
        );

        alert(
            "Gagal memuat pengaturan: " +
            err.message
        );

    }

}


// =====================================================
// SAVE SETTINGS
// =====================================================

async function saveSettings() {

    const spreadsheetId =
        getCustomerSpreadsheetId();


    if (!spreadsheetId) {

        alert(
            "Spreadsheet ID tidak ditemukan."
        );

        return;

    }


    // =================================================
    // AMBIL ELEMENT
    // =================================================

    const getValue =
        function(id) {

            const element =
                document.getElementById(
                    id
                );

            return element
                ? element.value
                : "";

        };


    // =================================================
    // BODY
    // =================================================

    const body = {

        action:
            "saveSettings",

        spreadsheetId:
            spreadsheetId,

        bride:
            getValue("bride"),

        groom:
            getValue("groom"),

        date:
            getValue("date"),

        venue:
            getValue("venue"),

        invitationLink:
            getValue("invitationLink"),

        logo:
            getValue("logo"),

        background:
            getValue("background"),

        theme:
            getValue("theme"),

        username:
            getValue("username"),

        password:
            getValue("password"),

        waTemplate:
            getValue("waTemplate"),

        cardBackground:
            getValue("cardBackground")

    };


    console.log(
        "📤 SAVE SETTINGS:",
        body
    );


    try {

        const res =
            await fetch(
                API_URL,
                {

                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            body
                        )

                }
            );


        if (!res.ok) {

            throw new Error(
                "HTTP " +
                res.status
            );

        }


        const result =
            await res.json();


        console.log(
            "💾 SAVE SETTINGS RESPONSE:",
            result
        );


        if (
            result &&
            result.success === false
        ) {

            alert(
                result.message ||
                "Gagal menyimpan pengaturan."
            );

            return;

        }


        alert(
            result.message ||
            "Pengaturan berhasil disimpan."
        );


    }
    catch (err) {

        console.error(
            "SAVE SETTINGS ERROR:",
            err
        );


        alert(
            "Gagal menyimpan pengaturan: " +
            err.message
        );

    }

}


// =====================================================
// THEME
// =====================================================

function applyTheme(theme) {

    const themes = {

        emerald: {
            primary: "#214E43",
            secondary: "#2f6a5c",
            accent: "#E8C547"
        },

        gold: {
            primary: "#B8860B",
            secondary: "#D4AF37",
            accent: "#F5DEB3"
        },

        rosegold: {
            primary: "#B76E79",
            secondary: "#D98C99",
            accent: "#F4D6CC"
        },

        royalblue: {
            primary: "#1E3A8A",
            secondary: "#2563EB",
            accent: "#60A5FA"
        },

        black: {
            primary: "#222222",
            secondary: "#444444",
            accent: "#C9A227"
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


// =====================================================
// THEME CHANGE
// =====================================================

const themeElement =
    document.getElementById(
        "theme"
    );


if (themeElement) {

    themeElement.addEventListener(
        "change",
        function () {

            applyTheme(
                this.value
            );

        }
    );

}


// =====================================================
// SAVE BUTTON
// =====================================================

const saveButton =
    document.getElementById(
        "saveBtn"
    );


if (saveButton) {

    saveButton.addEventListener(
        "click",
        saveSettings
    );

}


// =====================================================
// UPLOAD FILE
// =====================================================

async function uploadFile(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                async function(e) {

                    try {

                        const base64 =
                            e.target.result
                                .split(",")[1];


                        const spreadsheetId =
                            getCustomerSpreadsheetId();


                        if (!spreadsheetId) {

                            throw new Error(
                                "Spreadsheet ID tidak ditemukan."
                            );

                        }


                        const res =
                            await fetch(
                                API_URL,
                                {

                                    method:
                                        "POST",

                                    headers: {
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


                        if (!res.ok) {

                            throw new Error(
                                "HTTP " +
                                res.status
                            );

                        }


                        const data =
                            await res.json();


                        if (
                            data.success === false
                        ) {

                            throw new Error(
                                data.message ||
                                "Upload gagal."
                            );

                        }


                        if (!data.url) {

                            throw new Error(
                                "URL hasil upload tidak tersedia."
                            );

                        }


                        resolve(
                            data.url
                        );

                    }
                    catch(err) {

                        reject(
                            err
                        );

                    }

                };


            reader.onerror =
                function() {

                    reject(
                        new Error(
                            "File gagal dibaca."
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


// =====================================================
// LOGO UPLOAD
// =====================================================

const logoFile =
    document.getElementById(
        "logoFile"
    );


if (logoFile) {

    logoFile.addEventListener(
        "change",
        async function() {

            if (
                this.files.length === 0
            ) return;


            const file =
                this.files[0];


            const preview =
                document.getElementById(
                    "logoPreview"
                );


            if (preview) {

                preview.src =
                    URL.createObjectURL(
                        file
                    );

                preview.style.display =
                    "block";

            }


            try {

                const url =
                    await uploadFile(
                        file
                    );


                document.getElementById(
                    "logo"
                ).value =
                    url;


            }
            catch(err) {

                alert(
                    "Upload logo gagal: " +
                    err.message
                );


                console.error(
                    err
                );

            }

        }
    );

}


// =====================================================
// BACKGROUND UPLOAD
// =====================================================

const bgFile =
    document.getElementById(
        "bgFile"
    );


if (bgFile) {

    bgFile.addEventListener(
        "change",
        async function() {

            if (
                this.files.length === 0
            ) return;


            const file =
                this.files[0];


            const preview =
                document.getElementById(
                    "bgPreview"
                );


            if (preview) {

                preview.src =
                    URL.createObjectURL(
                        file
                    );

                preview.style.display =
                    "block";

            }


            try {

                const url =
                    await uploadFile(
                        file
                    );


                document.getElementById(
                    "background"
                ).value =
                    url;


            }
            catch(err) {

                alert(
                    "Upload background gagal: " +
                    err.message
                );


                console.error(
                    err
                );

            }

        }
    );

}


// =====================================================
// CARD BACKGROUND UPLOAD
// =====================================================

const cardBgFile =
    document.getElementById(
        "cardBgFile"
    );


if (cardBgFile) {

    cardBgFile.addEventListener(
        "change",
        async function() {

            if (
                this.files.length === 0
            ) return;


            const file =
                this.files[0];


            const preview =
                document.getElementById(
                    "cardBgPreview"
                );


            if (preview) {

                preview.src =
                    URL.createObjectURL(
                        file
                    );

                preview.style.display =
                    "block";

            }


            try {

                const url =
                    await uploadFile(
                        file
                    );


                document.getElementById(
                    "cardBackground"
                ).value =
                    url;


            }
            catch(err) {

                alert(
                    "Upload background QR gagal: " +
                    err.message
                );


                console.error(
                    err
                );

            }

        }
    );

}


// =====================================================
// INIT
// =====================================================

loadSettings();