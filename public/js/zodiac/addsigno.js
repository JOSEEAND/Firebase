// JavaScript Document
var db = firebase.apps[0].firestore();
var container = firebase.apps[0].storage().ref();

const txtPosic = document.querySelector('#txtPosic');
const txtSigno = document.querySelector('#txtSigno');
const txtRango = document.querySelector('#txtRango');
const txtArchi = document.querySelector('#txtArchi');
const btnLoad = document.querySelector('#btnLoad');

//Laboratorio Firebase
const txtElemento = document.querySelector('#txtElemento');
const txtAstroCeleste = document.querySelector('#txtAstroCeleste');
const txtPiedraPreciosa = document.querySelector('#txtPiedraPreciosa');


const urlParams = new URLSearchParams(window.location.search);
const signoId = urlParams.get('id');

const tiempoInactividad = 180000;
let timeout;

btnLoad.addEventListener('click', function () {
    const archivo = txtArchi.files[0];
    const nomarch = archivo.name;
    if (archivo == null) {
        alert('Debe seleccionar una imagen');
    } else {
        const metadata = {
            contentType: archivo.type
        }
        const subir = container.child('zodiaco/' + nomarch).put(archivo, metadata);
        subir
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
                db.collection("datosZodiaco").add({
                    "posic": parseInt(txtPosic.value),
                    "signo": txtSigno.value,
                    "rango": txtRango.value,
                    "url": url,
                    "elemento": txtElemento.value,
                    "astroCeleste": txtAstroCeleste.value,
                    "piedraPreciosa": txtPiedraPreciosa.value,
                }).then(function (docRef) {
                    alert("ID del registro: " + docRef.id);
                    limpiar();
                }).catch(function (FirebaseError) {
                    alert("Error al subir la imagen: " + FirebaseError);
                });
            });
    }
});


function limpiar() {
    txtPosic.value = ''
    txtSigno.value = '';
    txtRango.value = '';
    txtArchi.value = '';
    txtPiedraPreciosa.value = '';
    txtAstroCeleste.value = '';
    txtElemento.value = '';
    txtPosic.focus();
}

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