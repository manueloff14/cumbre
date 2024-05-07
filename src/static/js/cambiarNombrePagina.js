// Función para obtener el nombre de la página según la ruta
function obtenerNombrePagina() {
    var rutaActual = window.location.pathname; // Obtener la ruta actual
    var nombrePagina = 'Cargando'; // Valor predeterminado

    // Asignar el nombre de la página según la ruta
    switch (rutaActual) {
        case '/acortar':
            nombrePagina = 'Acortar';
            break;
        case '/transferencias':
            nombrePagina = 'Transferencias';
            break;
        case '/ajustes':
            nombrePagina = 'Ajustes';
            break;
        case '/estadisticas':
            nombrePagina = 'Estadísticas';
            break;
        case '/retirar':
            nombrePagina = 'Retirar';
            break;
        case '/panel':
            nombrePagina = 'Panel';
            break;
        case '/search': // Agrega un caso para la ruta '/search'
            nombrePagina = 'Búsqueda';
            break;
        case '/enlaces':
            nombrePagina = 'Enlaces';
            break;
        // Agrega más casos según tus rutas
    }

    return nombrePagina;
}

// Cambiar el contenido del elemento <h1> con el id "nombrePagina"
document.getElementById('nombrePagina').textContent = obtenerNombrePagina();