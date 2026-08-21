// =====================================================
// SESSION HELPER
// =====================================================

function getUser() {

    try {

        const user =
            localStorage.getItem("user");

        if (!user) {
            return null;
        }

        return JSON.parse(user);

    } catch (error) {

        console.error(
            "Gagal membaca user:",
            error
        );

        return null;

    }

}


// =====================================================
// CEK LOGIN
// =====================================================

function isLogin() {

    return (
        localStorage.getItem("login") === "true"
    );

}


// =====================================================
// CEK SUPER ADMIN
// =====================================================

function isSuperAdmin() {

    const user =
        getUser() || {};

    return (
        String(user.role || "")
            .trim()
            .toLowerCase() === "superadmin"
        ||
        String(user.username || "")
            .trim()
            .toLowerCase() === "admin"
    );

}


// =====================================================
// GET SPREADSHEET ID
// =====================================================

function getSessionSpreadsheetId() {

    if (isSuperAdmin()) {

        return (
            CONFIG.SUPER_ADMIN_SPREADSHEET_ID ||
            ""
        );

    }

    return (
        localStorage.getItem(
            "spreadsheetId"
        ) || ""
    );

}


// =====================================================
// CEK SESSION
// =====================================================

function checkSession() {

    if (!isLogin()) {

        window.location.href =
            "login.html";

        return false;

    }


    const user =
        getUser();


    if (!user || !user.username) {

        localStorage.removeItem("login");
        localStorage.removeItem("user");

        window.location.href =
            "login.html";

        return false;

    }


    // -----------------------------------------------
    // SUPER ADMIN
    // -----------------------------------------------

    if (isSuperAdmin()) {

        console.log(
            "👑 SUPER ADMIN SESSION"
        );

        console.log(
            "Spreadsheet:",
            CONFIG.SUPER_ADMIN_SPREADSHEET_ID
        );

        return true;

    }


    // -----------------------------------------------
    // CUSTOMER
    // -----------------------------------------------

    const spreadsheetId =
        getSessionSpreadsheetId();


    if (!spreadsheetId) {

        console.warn(
            "Customer belum memiliki Spreadsheet ID."
        );

        window.location.href =
            "activation.html";

        return false;

    }


    console.log(
        "👤 CUSTOMER SESSION"
    );

    console.log(
        "User:",
        user
    );

    console.log(
        "Spreadsheet:",
        spreadsheetId
    );


    return true;

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    // HANYA SESSION

    localStorage.removeItem(
        "login"
    );

    localStorage.removeItem(
        "user"
    );

    localStorage.removeItem(
        "pendingActivationUsername"
    );

    sessionStorage.clear();


    // JANGAN HAPUS:
    //
    // license
    // spreadsheetId
    // owner
    // activatedUsername
    // licenseUsername

    window.location.href =
        "login.html";

}


// =====================================================
// SESSION INIT
// =====================================================

(function () {

    const currentPage =
        location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    const publicPages = [
        "",
        "index.html",
        "login.html",
        "activation.html"
    ];


    if (
        publicPages.includes(
            currentPage
        )
    ) {

        return;

    }


    checkSession();

})();