// FUNCIONES
//funcion para inciar la app
function iniciarApp () {
    // listadoFavoritos = JSON.parse(localStorage.getItem('listadoFavoritos')) || [];
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
        selectCategorias.appendChild(option);
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

function seleccionarReceta (id, contenedorModal) {
    const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    fetch (url)
        .then ( respuesta => respuesta.json())
        .then ( resultado => mostrarRecetaModal(resultado.meals[0], contenedorModal))
}

function mostrarRecetaModal (receta, contenedor) {
    const {idMeal, strInstructions, strMeal, strMealThumb} = receta;
    const screenModal = document.createElement('DIV');
    screenModal.classList.add('c-modal__screen');
    screenModal.innerHTML = `
        <div class='c-modal__contenedor'>
            <h2 class='c-modal__h2'>${strMeal}</h2>
            <div class='c-modal__contenedor-contenido'>
                <div class='c-modal__img'>
                    <img class='js-modal__img' src='${strMealThumb}' alt='imagen producto'>
                </div>
                <h3 class='c-modal__h3'>Instrucciones</h3>
                <p class='c-modal__p'>${strInstructions}</p>
                <h3 class='c-modal__h3'>Ingredientes y cantidades</h3>
                <ul class='c-modal__ul js-modal__ul'>

                </ul>
            </div>
            <button class='c-modal__boton c-boton js-boton' data-id=${idMeal}>Guardar Favoritos</button>
            <div class='c-modal__close'>
                <i class='fa-solid fa-xmark'></i>
            </div> 
        </div>
    `;
    contenedor.appendChild(screenModal);
    contenedor.classList.add('c-modal--mod');

    // iteramos los ingredientes que tienen contenido y sus cantidades
    const ingredientesUl = document.querySelector('.js-modal__ul');
    for (let i=1; i<=20; i++) {
        if (receta[`strIngredient${i}`]) {
            const ingrediente = receta[`strIngredient${i}`];
            const cantidad = receta[`strMeasure${i}`];

            const li = document.createElement('LI');
            li.classList.add('c-modal__li');
            li.textContent = `${ingrediente} - ${cantidad}`;
            ingredientesUl.appendChild(li);
        }
    }

    // Comprobamos receta está en listado favoritos y cambiamos entre guardar/eliminar favoritos
    const existe = existeFavoritos(idMeal);
    if (existe) {
        document.querySelector('.c-modal__boton').textContent = 'Eliminar Favoritos';
    }
}

function limpiarHTML (contenedor) {
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild)
    }
}

function imprimirAlerta (contenedorMensaje, tipo, mensaje) {
    contenedorMensaje.parentNode.classList.add('c-mensaje__contenedor--mod');
    if(contenedorMensaje.childElementCount === 0) {
        const p = document.createElement('p');
        p.classList.add('u-mensaje');
        p.textContent = mensaje;
        if (tipo === 'exito') {
            p.classList.add(`u-mensaje--${tipo}`);
        }
        if (tipo === 'error') {
            p.classList.add(`u-mensaje--${tipo}`);
        }
        if (tipo === 'alerta') {
            p.classList.add(`u-mensaje--${tipo}`);
        }
        contenedorMensaje.appendChild(p);
        
        setTimeout((e) => {
            limpiarHTML(contenedorMensaje);
            contenedorMensaje.parentNode.classList.remove('c-mensaje__contenedor--mod');
        }, 5000);
    }
}

function agregarFavoritos (receta) {
    const listadoFavoritos = JSON.parse(localStorage.getItem('listadoFavoritos')) || [];
    localStorage.setItem('listadoFavoritos', JSON.stringify([...listadoFavoritos, receta]));
}
function eliminarFavoritos (id) {
    const listadoFavoritos = JSON.parse(localStorage.getItem('listadoFavoritos')) || [];
    const nuevoFavoritos = listadoFavoritos.filter( favorito => favorito.id !== id);
    localStorage.setItem('listadoFavoritos', JSON.stringify(nuevoFavoritos));
    
}
function existeFavoritos (id) {
    const listadoFavoritos = JSON.parse(localStorage.getItem('listadoFavoritos')) || [];
    return listadoFavoritos.some( favorito => favorito.id === id); 
}

function cargarFavoritos (arrayfavoritos = []) {
    const contenedorUl = document.createElement('UL');
    contenedorUl.classList.add('c-favoritos__ul');
    favoritosContenedor.appendChild(contenedorUl);
    
    arrayfavoritos.forEach( favorito => {
        const {titulo, imagen, id} = favorito;
        const li = document.createElement('LI');
        li.classList.add('c-favoritos__li');
        li.innerHTML = `
            <div class="c-favoritos__li-imagen">
                <img src=${imagen} alt="imagen receta ${imagen}">
            </div>
            <div class="c-favoritos__li-contenido">
                <h3 class="c-favoritos__titulo">${titulo}</h3>
                <button class="c-favoritos__boton c-boton js-boton" id=${id}>Ver receta</button>
            </div>
        `;
        contenedorUl.appendChild(li);
    });
}