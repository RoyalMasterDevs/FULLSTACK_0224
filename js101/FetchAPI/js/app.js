//FETCH API consume datos desde un txt

const cargarTxtBtn = document.querySelector('#cargarTxt');

cargarTxtBtn.addEventListener('click', obtenerDatos);

function obtenerDatos() {

    fetch('data/datos.txt').then(respuesta => {
        console.log(respuesta);

        console.log(respuesta.headers.get("Content-Type"));
        console.log(respuesta.status);
        console.log(respuesta.statusText);
        console.log(respuesta.url);
        console.log(respuesta.type);

        return respuesta.text();
    })
        .then(datos => {
            console.log(datos);
        })
        .catch(error => {
            console.log(error)
        })

}

//Fetch API JSON Empleado



//Fetch API JSON empleados


//Fetch API consume datos de una API
const cargarAPIBtn = document.querySelector('#cargarAPI');

cargarAPIBtn.addEventListener('click', obtenerDatos2);

function obtenerDatos2() {
    fetch('https://picsum.photos/list')
        .then(respuesta => {
            return respuesta.json()
        })
        .then(resultado => {
            mostrarHTML(resultado);
            console.log(resultado)
        })
}

function mostrarHTML(datos) {
    const contenido = document.querySelector('#contenido');

    let html = '';

    datos.forEach(perfil => {
        const { author, post_url } = perfil;

        html += `
        <p>Autor: ${author}</p>
        <a href="${post_url}" target="_blank">Ver Imagen</a>
        `
    });

    contenido.innerHTML = html;

}
