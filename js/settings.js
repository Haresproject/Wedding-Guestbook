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


// =====================================================
// LOAD SETTINGS
// =====================================================

async function loadSettings() {

    try {

        const spreadsheetId =
            getCustomerSpreadsheetId();


        let url =
            API_URL +
            "?action=settings";


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


        if (!res.ok) {

            throw new Error(
                "HTTP " + res.status
            );

        }


        const data =
            await res.json();


        console.log(
            "⚙ SETTINGS RESPONSE:",
            data
        );


        // ============================================
        // DATA UTAMA
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


        // ============================================
        // LOGO PREVIEW
        // ============================================

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


        // ============================================
        // BACKGROUND PREVIEW
        // ============================================

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


        // ============================================
        // DATE
        // ============================================

        if (data.date) {

            const d =
                new Date(data.date);


            if (!isNaN(d.getTime())) {

                document.getElementById(
                    "date"
                ).value =
                    d.toISOString()
                        .split("T")[0];

            }

        }


        // ============================================
        // THEME
        // ============================================

        const theme =
            data.theme ||
            "emerald";


        document.getElementById(
            "theme"
        ).value =
            theme;


        applyTheme(
            theme
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
    catch (err) {

        console.error(
            "LOAD SETTINGS ERROR:",
            err
        );

        alert(
            "Gagal memuat pengaturan."
        );

    }

}


// =====================================================
// SAVE SETTINGS
// =====================================================

async function saveSettings() {

    const spreadsheetId =
        getCustomerSpreadsheetId();


    const body = {

        action:
            "saveSettings",

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
                "HTTP " + res.status
            );

        }


        const result =
            await res.json();


        console.log(
            "SAVE SETTINGS RESPONSE:",
            result
        );


        if (
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
            "Gagal menyimpan pengaturan."
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
                async function (e) {

                    try {

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
                            data.success === false ||
                            !data.url
                        ) {

                            throw new Error(
                                data.message ||
                                "URL upload tidak tersedia"
                            );

                        }


                        resolve(
                            data.url
                        );

                    }
                    catch (err) {

                        reject(
                            err
                        );

                    }

                };


            reader.onerror =
                function () {

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
// LOGO
// =====================================================

const logoFile =
    document.getElementById(
        "logoFile"
    );


if (logoFile) {

    logoFile.addEventListener(
        "change",
        async function () {

            if (
                this.files.length === 0
            ) return;


            const file =
                this.files[0];


            const preview =
                document.getElementById(
                    "logoPreview"
                );


            preview.src =
                URL.createObjectURL(
                    file
                );


            preview.style.display =
                "block";


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
            catch (err) {

                alert(
                    "Upload logo gagal"
                );


                console.error(
                    err
                );

            }

        }
    );

}


// =====================================================
// BACKGROUND
// =====================================================

const bgFile =
    document.getElementById(
        "bgFile"
    );


if (bgFile) {

    bgFile.addEventListener(
        "change",
        async function () {

            if (
                this.files.length === 0
            ) return;


            const file =
                this.files[0];


            const preview =
                document.getElementById(
                    "bgPreview"
                );


            preview.src =
                URL.createObjectURL(
                    file
                );


            preview.style.display =
                "block";


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
            catch (err) {

                alert(
                    "Upload background gagal"
                );


                console.error(
                    err
                );

            }

        }
    );

}


// =====================================================
// CARD BACKGROUND
// =====================================================

const cardBgFile =
    document.getElementById(
        "cardBgFile"
    );


if (cardBgFile) {

    cardBgFile.addEventListener(
        "change",
        async function () {

            if (
                this.files.length === 0
            ) return;


            const file =
                this.files[0];


            const preview =
                document.getElementById(
                    "cardBgPreview"
                );


            preview.src =
                URL.createObjectURL(
                    file
                );


            preview.style.display =
                "block";


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
            catch (err) {

                alert(
                    "Upload background QR gagal"
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