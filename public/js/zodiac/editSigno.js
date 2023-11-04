const editSignoForm = document.getElementById('editSignoForm');
const db = firebase.firestore();
const tiempoInactividad = 180000;
let timeout;

const urlParams = new URLSearchParams(window.location.search);
const signoId = urlParams.get('id');

editSignoForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Obtén los valores de los campos del formulario
    const posic = document.getElementById('txtPosic').value;
    const signo = document.getElementById('txtSigno').value;
    const rango = document.getElementById('txtRango').value;
    const elemento = document.getElementById('txtElemento').value;
    const astroCeleste = document.getElementById('txtAstroCeleste').value;
    const piedraPreciosa = document.getElementById('txtPiedraPreciosa').value;

    // Crea un objeto con los valores
    const updatedSigno = {
        posic: parseInt(posic), // Convierte a entero si es numérico
        signo,
        rango,
        elemento,
        astroCeleste,
        piedraPreciosa,
    };

    // Actualiza el signo zodiacal en Firestore con los nuevos datos
    db.collection("datosZodiaco").doc(signoId).update(updatedSigno)
        .then(function () {
            alert("Los datos se han actualizado correctamente");
        })
        .catch(function (error) {
            alert("Error al actualizar los datos: " + error);
        });
});

// Obtén los datos del signo zodiacal
db.collection("datosZodiaco").doc(signoId).get().then(function (doc) {
    if (doc.exists) {
        const data = doc.data();
        // Rellena los campos del formulario con los valores existentes
        document.getElementById('txtPosic').value = data.posic;
        document.getElementById('txtSigno').value = data.signo;
        document.getElementById('txtRango').value = data.rango;
        document.getElementById('txtElemento').value = data.elemento;
        document.getElementById('txtAstroCeleste').value = data.astroCeleste;
        document.getElementById('txtPiedraPreciosa').value = data.piedraPreciosa;
    } else {
        console.log("El documento no existe");
    }
}).catch(function (error) {
    console.log("Error obteniendo el documento:", error);
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
