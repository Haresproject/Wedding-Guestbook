// =====================================================
// SESSION HELPER
// =====================================================


// =====================================================
// GET USER
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

    // -----------------------------------------------
    // SUPER ADMIN
    // -----------------------------------------------

    if (isSuperAdmin()) {

        return (
            CONFIG.SUPER_ADMIN_SPREADSHEET_ID ||
            ""
        );

    }


    // -----------------------------------------------
    // CUSTOMER
    // -----------------------------------------------

    return (
        localStorage.getItem(
            "spreadsheetId"
        ) || ""
    );

}


// =====================================================
// CEK SESSION CUSTOMER
// =====================================================

function checkCustomerSession() {

    const user =
        getUser() || {};


    // -----------------------------------------------
    // BELUM LOGIN
    // -----------------------------------------------

    if (!isLogin()) {

        window.location.href =
            "login.html";

        return false;

    }


    // -----------------------------------------------
    // USER TIDAK ADA
    // -----------------------------------------------

    if (!user.username) {

        localStorage.removeItem("login");

        window.location.href =
            "login.html";

        return false;

    }


    // -----------------------------------------------
    // SUPER ADMIN
    // -----------------------------------------------

    if (isSuperAdmin()) {

        console.log(
            "👑 Session Super Admin aktif."
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
            "🔐 Customer belum memiliki Spreadsheet ID."
        );


        // Tandai user untuk aktivasi

        localStorage.setItem(
            "pendingActivationUsername",
            user.username
        );


        // Jangan redirect kalau sudah di activation

        if (
            !location.pathname.endsWith(
                "activation.html"
            )
        ) {

            window.location.href =
                "activation.html";

        }

        return false;

    }


    console.log(
        "👤 Session Customer aktif."
    );

    console.log(
        "User:",
        user
    );

    console.log(
        "Spreadsheet ID:",
        spreadsheetId
    );


    return true;

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    // -----------------------------------------------
    // HANYA HAPUS SESSION LOGIN
    // -----------------------------------------------

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


    // -----------------------------------------------
    // JANGAN HAPUS:
    //
    // license
    // spreadsheetId
    // activatedUsername
    // licenseUsername
    // owner
    //
    // Karena data tersebut adalah data
    // aktivasi customer.
    // -----------------------------------------------


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
    // HALAMAN YANG BOLEH DIAKSES TANPA SESSION
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
    // CEK SESSION
    // =================================================

    const valid =
        checkCustomerSession();


    if (!valid) {

        return;

    }


    // =================================================
    // LOG SESSION
    // =================================================

    const user =
        getUser() || {};

    const spreadsheetId =
        getSessionSpreadsheetId();


    console.log(
        "=============================="
    );

    console.log(
        "SESSION AKTIF"
    );

    console.log(
        "User:",
        user
    );

    console.log(
        "Super Admin:",
        isSuperAdmin()
    );

    console.log(
        "Spreadsheet ID:",
        spreadsheetId
    );

    console.log(
        "=============================="
    );

})();