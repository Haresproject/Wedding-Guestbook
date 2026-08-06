function checkLicense(){

    // Demo
    if(CONFIG.DEMO){

        console.warn("Running Demo Version");

    }

    // Versi aplikasi
    console.log(
        CONFIG.APP_NAME +
        " v" +
        CONFIG.VERSION
    );

    // Jenis lisensi
    console.log(
        "License : " +
        CONFIG.LICENSE
    );

}