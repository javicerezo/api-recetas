// VARIABLES

const resultadosContenedor = document.querySelector('.js-resultados__contenedor');
const modalContenedor = document.querySelector('.js-modal');

const selectCategorias = document.querySelector('#categorias');
const subnav = document.querySelector('.js-nav__subnav');
const burger = document. querySelector('.js-nav__li-burger');


//EVENTOS
selectCategorias.addEventListener('change', seleccionarCategoria);

burger.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa') || e.target.classList.contains('js-nav__li-burger')) {
        subnav.classList.toggle('c-nav__subnav--mod')
    }
})

resultadosContenedor.addEventListener('click', (e) => {
    if(e.target.classList.contains('js-boton')){
        const id = e.target.getAttribute('id');
        seleccionarReceta(id);    
    }
})

modalContenedor.addEventListener('click', (e) => {
    if(e.target.classList.contains('fa-xmark') || e.target.classList.contains('c-modal__screen')){
        limpiarHTML(modalContenedor);
    }
});

    // evento para iniciar la app
document.addEventListener('DOMContentLoaded', iniciarApp);

// FUNCIONES
    //funcion para inciar la app
function iniciarApp () {
    obtenerCategorias();
}

function obtenerCategorias () {
    const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
    fetch (url)
        .then(respuesta => respuesta.json())
        .then (resultado => mostrarCategorias(resultado.categories))
}

function mostrarCategorias (categorias = []) {
    categorias.forEach( categoria => {
        const {strCategory} = categoria;
        const option = document.createElement('OPTION');
        option.value = strCategory;
        option.textContent = strCategory;
        selectCategorias.appendChild(option)

        const li = document.createElement('LI');
        li.classList.add('c-nav__subnav-li');
        li.textContent = strCategory;
        subnav.children[0].appendChild(li);
    })
}

function seleccionarCategoria (e) {
    const categoria = e.target.value;
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;
    
    fetch (url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarRecetas(resultado.meals));
}

function mostrarRecetas (recetas = []) {
    limpiarHTML(resultadosContenedor);
    
    const h2 = document.createElement('H2');
    h2.textContent = recetas.length ? 'Resultados': 'No hay resultados';
    h2.classList.add('c-resultados__h2');

    const contenedorUl = document.createElement('UL');
    contenedorUl.classList.add('c-resultados__ul');

    resultadosContenedor.appendChild(h2);
    resultadosContenedor.appendChild(contenedorUl);

    //iterarmos y mostramos los resultados
    recetas.forEach(receta => {
        const {strMeal, strMealThumb, idMeal} = receta;
        const li = document.createElement('LI');
        li.classList.add('c-resultados__li');
        li.innerHTML = `
            <div class="c-resultados__li-imagen">
                <img src=${strMealThumb} alt="imagen receta ${strMealThumb}">
            </div>
            <div class="c-resultados__li-contenido">
                <h3 class="c-resultados__titulo">${strMeal}</h3>
                <button class="c-resultados__boton c-boton js-boton" id=${idMeal}>Ver receta</button>
            </div>
        `;
        contenedorUl.appendChild(li);
    })
}

function seleccionarReceta (id) {
    const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    
    fetch (url)
        .then ( respuesta => respuesta.json())
        .then ( resultado => mostrarRecetaModal(resultado.meals[0]))
}

function mostrarRecetaModal (receta) {
    const {idMeal, strInstructions, strMeal, strMealThumb} = receta;

    const screenModal = document.createElement('DIV');
    screenModal.classList.add('c-modal__screen');
    screenModal.innerHTML = `
        <li class='c-modal__li'>
            <h2 class='c-modal__h2'>${strMeal}</h2>
            <div class='c-modal__li-contenido'>
                <div class='c-modal__img'>
                    <img src='${strMealThumb}' alt='imagen producto'>
                </div>
                <h3 class='c-modal__h3'>Instrucciones</h3>
                <p class='c-modal__p'>${strInstructions}</p>   
            </div>
                <button class='c-modal__boton c-boton js-boton' data-id=${idMeal}>Guardar Favoritos</button>
            <div class='c-modal__close'>
                <i class='fa-solid fa-xmark'></i>
            </div>
            <div class='c-modal__mensaje'>
            </div> 
        </li>
    `;
    modalContenedor.appendChild(screenModal);
    modalContenedor.classList.add('c-modal--mod');

}

function limpiarHTML (contenedor) {
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild)
    }
}

