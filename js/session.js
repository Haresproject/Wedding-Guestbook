// =====================================================
// SESSION HELPER
// =====================================================


// =====================================================
// GET USER
// =====================================================

function getUser() {

    try {

        const raw =
            localStorage.getItem("user");

        if (!raw) {
            return null;
        }

        return JSON.parse(raw);

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
    );

}


// =====================================================
// GET USERNAME
// =====================================================

function getSessionUsername() {

    const user =
        getUser() || {};

    return String(
        user.username || ""
    ).trim();

}


// =====================================================
// GET SPREADSHEET ID
// =====================================================

function getSessionSpreadsheetId() {

    const user =
        getUser() || {};


    // =================================================
    // SUPER ADMIN
    // =================================================

    if (
        String(user.role || "")
            .trim()
            .toLowerCase() ===
        "superadmin"
    ) {

        return String(
            CONFIG.SUPER_ADMIN_SPREADSHEET_ID || ""
        ).trim();

    }


    // =================================================
    // CUSTOMER
    // =================================================

    return String(
        localStorage.getItem(
            "spreadsheetId"
        ) || ""
    ).trim();

}


// =====================================================
// CEK SESSION
// =====================================================

function checkSession() {

    // =================================================
    // BELUM LOGIN
    // =================================================

    if (!isLogin()) {

        window.location.href =
            "login.html";

        return false;

    }


    // =================================================
    // USER
    // =================================================

    const user =
        getUser();


    if (
        !user ||
        !user.username
    ) {

        localStorage.removeItem(
            "login"
        );

        localStorage.removeItem(
            "user"
        );

        window.location.href =
            "login.html";

        return false;

    }


    // =================================================
    // SUPER ADMIN
    // =================================================

    if (isSuperAdmin()) {

        console.log(
            "👑 SESSION SUPER ADMIN"
        );

        console.log(
            "Spreadsheet:",
            getSessionSpreadsheetId()
        );

        return true;

    }


    // =================================================
    // CUSTOMER
    // =================================================

    const spreadsheetId =
        getSessionSpreadsheetId();


    if (!spreadsheetId) {

        console.error(
            "❌ CUSTOMER TIDAK MEMILIKI SPREADSHEET ID"
        );

        window.location.href =
            "activation.html";

        return false;

    }


    console.log(
        "👤 SESSION CUSTOMER"
    );

    console.log(
        "Username:",
        user.username
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

    console.log(
        "🚪 Logout..."
    );


    // =================================================
    // YANG DIHAPUS HANYA SESSION LOGIN
    // =================================================

    localStorage.removeItem(
        "login"
    );

    localStorage.removeItem(
        "user"
    );

    localStorage.removeItem(
        "pendingActivationUsername"
    );


    // =================================================
    // JANGAN HAPUS INI
    // =================================================
    //
    // license
    // spreadsheetId
    // activatedUsername
    // licenseUsername
    // owner
    //
    // Karena ini adalah DATA AKTIVASI CUSTOMER.
    // =================================================


    sessionStorage.clear();


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


    // =================================================
    // PUBLIC PAGE
    // =================================================

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


    // =================================================
    // INTERNAL PAGE
    // =================================================

    checkSession();

})();