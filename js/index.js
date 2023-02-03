document.addEventListener('DOMContentLoaded', () => {
    // Variables

    let carrito = [];
    const moneda = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const localStorage = window.localStorage;

    // Funciones
    //Funcion que asigna las caracteristicas de las cards y las arma
    function imprimirProductos() {
        productos.forEach((info) => {
            // Estructura
            const miNodo = document.createElement('div');
            miNodo.classList.add('card');
            // Body
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            // Titulo
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;
            // Imagen
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);
            // Precio
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${info.precio}${moneda}`;
            // Boton 
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn-add');
            miNodoBoton.textContent = '+';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', addProducto);
            // Insertamos
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }

    //Funcion que pushea/añade productos al array y por ende al carrito
    function addProducto(evento) {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Producto agregado correctamente!',
            showConfirmButton: false,
            timer: 1000
          })
        carrito.push(evento.target.getAttribute('marcador'))
        // Actualizamos el carrito 
        recargarCarrito();

        // Actualizamos el LocalStorage
        guardarLocalStorage();
        
    }


    // Dibuja todos los productos guardados en el carrito

    function recargarCarrito() {
        // Vaciamos todo el html
        DOMcarrito.textContent = '';
        // Quitamos los duplicados
        const carritoSinDuplicados = [...new Set(carrito)];
        // Generamos los Nodos a partir de carrito
        carritoSinDuplicados.forEach((item) => {
            // Obtenemos el item que necesitamos de la variable base de datos
            const miItem = productos.filter((itemBaseDatos) => {
                // ¿Coincide los id? Solo puede existir un caso
                return itemBaseDatos.id === parseInt(item);
            });
            // Cuenta el número de veces que se repite el producto
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                // Si coinciden los id Incremento el contador, en caso contrario lo mantengo
                return itemId === item ? ++total : total;
            }, 0);
            // Creamos el nodo del item del carrito
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${moneda}`;
            // Boton de borrar
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn-remove');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '10px';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            // Mezclamos nodos
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
        // Imprimimos el precio total en el HTML
        DOMtotal.textContent = calcularTotal();
    }

    //Borrar elemento
    function borrarItemCarrito(evento) {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Producto eliminado correctamente!',
            showConfirmButton: false,
            timer: 800
          })
        // Obtenemos el producto ID que hay en el boton pulsado
        const id = evento.target.dataset.item;
        // Borramos todos los productos
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        // volvemos a renderizar
        recargarCarrito();
        // Actualizamos el LocalStorage
        guardarLocalStorage();
    }

    //Calcular precio total
    function calcularTotal() {
        // Recorremos el array del carrito 
        return carrito.reduce((total, item) => {
            // De cada elemento obtenemos su precio
            const miItem = productos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            // Los sumamos al total
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    //Vaciar carrito
    function vaciarCarrito() {
        Swal.fire({
            title: 'Deseas vaciar el carrito?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Sí',
            denyButtonText: `No`,
          }).then((result) => {
            if (result.isConfirmed) {
                // Limpiamos los productos guardados
                carrito = [];
                // Renderizamos los cambios
                recargarCarrito();
                // Borrar LocalStorage
                localStorage.clear();
                Swal.fire('Has vaciado tu carrito!', '', 'success')
            } else if (result.isDenied) {
              Swal.fire('Salvaste tu carrito, no lo vaciamos!', '', 'info')
            }
          })
        
    }

    function guardarLocalStorage () {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    //Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);

    async function consultarProductosServer() {
        fetch("./productos.json")
        .then((response) => response.json())
        .then((data) => {
            productos = [...data]
            imprimirProductos();
        })
        .catch((error) => console.log(error));
    }

    //Inicio
    consultarProductosServer();
    //cargarLocalStorage();
    imprimirProductos();
    recargarCarrito();
})
