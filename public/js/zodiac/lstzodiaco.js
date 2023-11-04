const db = firebase.apps[0].firestore();
const tabla = document.querySelector('#tabla');
const tiempoInactividad = 180000;
let timeout;

// Obtén los datos de los signos zodiacales y muestra en la tabla
db.collection("datosZodiaco").orderBy('posic', 'asc').get().then(function (query) {
    tabla.innerHTML = "";
    query.forEach(function (doc) {
        const data = doc.data();
        const signoId = doc.id;
        const salida = `
            <div class="divAnuncio m-3">
                <div class="imgBlock"><img src="${data.url}" width="100%" /></div>
                <div>${data.signo}<br/>${data.rango}<br/>${data.elemento}<br/>${data.astroCeleste}<br/>${data.piedraPreciosa}<br/>
                    <button class="btn-editar" data-id="${signoId}">Editar</button>
                </div><br/>
            </div>
        `;
        tabla.innerHTML += salida;
    });
    // Agregar manejadores de eventos para los botones de editar
    const botonesEditar = document.querySelectorAll('.btn-editar');
    botonesEditar.forEach((boton) => {
        boton.addEventListener('click', function () {
            const signoId = boton.getAttribute('data-id');
            window.location.href = `editar_signo.html?id=${signoId}`;
        });
    });
});

function reiniciarTimeout() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        // Cerrar la sesión del usuario automáticamente
        auth.signOut().then(() => {
            document.location.href = 'login.html';
        }).catch((error) => {
            console.error('Error al cerrar la sesión: ' + error);
        });
    }, tiempoInactividad);
}

reiniciarTimeout();

// Agregar manejadores de eventos para reiniciar el temporizador cuando el usuario interactúa
document.addEventListener('click', reiniciarTimeout);
document.addEventListener('mousemove', reiniciarTimeout);
document.addEventListener('keydown', reiniciarTimeout);