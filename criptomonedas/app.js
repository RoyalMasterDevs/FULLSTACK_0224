const criptomonedasSelect = document.querySelector('#criptomodenas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

//Promises
const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

//Consulta la API para obtener un listado de Criptomonedas

function consultarCriptomonedas() {

    //Ir AtoPLISTS y Despues MArket Capp

    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json()) //Conulta exitosa...
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
        .catch(error => console.log(error));
}

//Llena el select
function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        //Insertar el HTML
        criptomonedasSelect.appendChild(option);
    })
}

function leerValor(e) {
    objBusquedaj[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();

    //Extraer los valores
    const { moneda, criptomoneda } = objBusqueda;

    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta(`Ambos campos son obligatorios`);
        return;
    }
    constarAPI();
}

function mostrarAlerta(mensaje) {
    //Crear el div
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('error');

    //Mensaje de error
    divMensaje.textContent = mensaje;

    //Insertar en el DOM
    formulario.appendChild(divMensaje);

    //Quitar la alerta despues de 3 segundos
    setTimout(() => {
        divMensaje.remove();
    }, 3000);
}

function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        });
}

function mostrarCotizacionHTML(cotizacion) {
    limpiarHTML();

    console.log(cotizacion);
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `<p>El precio es <span> ${PRICE} </span></p>`

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>El precio más alto del día es: <span>${HIGHDAY}</span></p>`

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>El precio más bajo del día es: <span>${LOWDAY}</span></p>`

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Última Actualización: <span>${LASTUPDATE}</span></p>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioB);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function mostrarSpinner() {
    limpriarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    `;
    resultado.appendChild(spinner);
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}