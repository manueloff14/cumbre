// Obtener la ruta actual
var rutaActual = window.location.pathname;

// Obtener todos los botones
var botones = document.querySelectorAll('button');

// Iterar sobre los botones
botones.forEach(function(boton) {
    // Obtener la ruta asociada al botón
    var rutaBoton = boton.getAttribute('data-ruta');

    // Comparar la ruta actual con la ruta del botón y aplicar el color correspondiente
    if (rutaActual === rutaBoton) {
        boton.style.background = 'linear-gradient(to right, #4E31AA, #3A1078)';
        boton.style.transition = 'background-color 0.2s'; // Añadir transición
    } else {
        boton.style.backgroundColor = 'transparent'; // Color por defecto si no coincide la ruta
        boton.style.transition = 'background-color 0.2s'; // Añadir transición
    }

    // Añadir el estilo para hover
    boton.onmouseover = function() {
        boton.style.backgroundColor = '#373737';
    };

    // Restaurar el estilo original cuando no está en hover
    boton.onmouseout = function() {
        if (rutaActual === rutaBoton) {
            boton.style.background = 'linear-gradient(to right, #4E31AA, #3A1078)';
        } else {
            boton.style.backgroundColor = 'transparent';
        }
    };
});
