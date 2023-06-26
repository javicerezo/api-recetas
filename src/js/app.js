
    // VARIABLES
    
    const resultadosContenedor = document.querySelector('.js-resultados__contenedor');
    const modalContenedor = document.querySelector('.js-modal');
    const contenedorMensaje = document.querySelector('.js-mensaje__contenedor');
    
    const selectCategorias = document.querySelector('#categorias');
    
    
    //EVENTOS
    // evento para iniciar la app
    document.addEventListener('DOMContentLoaded', () => {
        iniciarApp();
    });
    
    //evento para rellenar el select desde la peticion a la API
    selectCategorias.addEventListener('change', e => {
        seleccionarCategoria(e);
    });
    
    // evento para mostrar cada receta
    resultadosContenedor.addEventListener('click', (e) => {
        if(e.target.classList.contains('js-boton')){
            const id = e.target.getAttribute('id');
            seleccionarReceta(id, modalContenedor);    
        }
    })
    
    // evento para el modal de cada receta
    modalContenedor.addEventListener('click', (e) => {
        if(e.target.classList.contains('fa-xmark') || e.target.classList.contains('c-modal__screen')){
            limpiarHTML(modalContenedor);
        }
        //boton de favoritos
        if(e.target.classList.contains('js-boton')) {
            const receta = {
                id : document.querySelector('.c-modal__boton').getAttribute('data-id'),
                titulo : document.querySelector('.c-modal__h2').textContent,
                imagen : document.querySelector('.js-modal__img').getAttribute('src')
            }
            
            const existe = existeFavoritos(receta.id);
            if (!existe) {
                agregarFavoritos(receta);
                imprimirAlerta(contenedorMensaje, 'exito', 'Agregado correctamente');
                e.target.textContent = 'Eliminar Favoritos';
            } else {
                eliminarFavoritos(receta.id);
                imprimirAlerta(contenedorMensaje, 'error', 'Eliminado correctamente');
                e.target.textContent = 'Agregar Favoritos';
            }
        }
    });

