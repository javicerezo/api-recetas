
    const favoritosContenedor = document.querySelector('.js-favoritos__contenedor');
    const modalContenedorFavoritos = document.querySelector('.js-modal');
    const contenedorMensajeFavoritos = document.querySelector('.js-mensaje__contenedor');
    let listadoFavoritos = [];
    
    document.addEventListener('DOMContentLoaded', () => {
        listadoFavoritos = JSON.parse(localStorage.getItem('listadoFavoritos')) || [];
        cargarFavoritos(listadoFavoritos);
    })
    
    favoritosContenedor.addEventListener('click', (e) => {
        if(e.target.classList.contains('js-boton')){
            const id = e.target.getAttribute('id');
            seleccionarReceta(id, modalContenedorFavoritos);    
        }
    });
    
    modalContenedorFavoritos.addEventListener('click', (e) => {
        if(e.target.classList.contains('fa-xmark') || e.target.classList.contains('c-modal__screen')){
            limpiarHTML(modalContenedorFavoritos);
            limpiarHTML(favoritosContenedor);
            const listadoFavoritos = JSON.parse(localStorage.getItem('listadoFavoritos')) || [];
            cargarFavoritos(listadoFavoritos);
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
                imprimirAlerta(contenedorMensajeFavoritos, 'exito', 'Has agregado la receta a favoritos');
                e.target.textContent = 'Eliminar Favoritos';
            } else {
                eliminarFavoritos(receta.id);
                imprimirAlerta(contenedorMensajeFavoritos, 'error', 'Has eliminado la receta de favoritos');
                e.target.textContent = 'Agregar Favoritos';
            }
        }
    });
