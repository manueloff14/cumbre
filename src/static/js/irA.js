function irA(ruta) {
    // Obtener el host actual
    var host = window.location.protocol + '//' + window.location.host;

    // Redirigir a la ruta deseada
    window.location.href = host + ruta;
}