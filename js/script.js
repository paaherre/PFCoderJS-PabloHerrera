var destacados = new Array;
var $total = document.querySelector('#total');

var request = new XMLHttpRequest();
request.open('GET', 'json/productos.json');
request.responseType = 'json';
request.send();
request.onload = function(baseDeDatos) {
  var baseDeDatos = request.response;
  crearDestacados(baseDeDatos);
  //console.log(baseDeDatos);
  crearProductos(baseDeDatos);
}

function crearDestacados(base){
    //console.log(base);
    for (let item of base){
        if (item.destacado == true){
            destacados.push(item);
        }
    }
    //console.log(destacados);
    for (let item of destacados){
        var nodoCarousel = document.createElement ('div');
        if (item.id == 1){            
            nodoCarousel.classList.add('carousel-item', 'active', 'mx-auto');
        }else            
            nodoCarousel.classList.add('carousel-item');
        // estructura carousel
        let carouselEstructura = document.createElement('div');
        carouselEstructura.classList.add('col-xs-4', 'col-sm-4', 'col-md-4', 'col-lg-4', 'mx-auto');
        // Card //
        let carouselCard = document.createElement('div');
        carouselCard.classList.add('card', 'mb-2');
        // view overlay //
        let cardView = document.createElement('div');
        cardView.classList.add('view', 'overlay');
        // insert IMG //
        let cardImg = document.createElement('img');
        cardImg.classList.add('card-img-top', 'img-fluid');        
        cardImg.setAttribute('src', item.imagen);
        //card Detalle //
        let cardDetalle = document.createElement('div');
        cardDetalle.classList.add('card-body', 'p-3');
        //Card Nombre//
        let cardName = document.createElement('h6');
        cardName.classList.add('card-title', 'font-weight-bold','text-danger', 'mb-0');
        cardName.textContent = item.nombre;
        //card Categoría//
        let cardCategoria = document.createElement('p');
        cardCategoria.classList.add('card-text');
        cardCategoria.textContent = item.categoria;
        //card Precio//
        let cardPrecio = document.createElement('p');
        cardPrecio.classList.add('card-precio');
        cardPrecio.textContent = '$ ' + item.precio;
        // card Boton + //
        let cardBoton = document.createElement('button');
        cardBoton.classList.add('btn', 'btn-primary');
        cardBoton.textContent= '+';
        cardBoton.setAttribute('marcador', item.id);////////////////////////////////////////////////////////////////
        cardBoton.addEventListener('click', sumarCarrito); //////////////////////////////////////////////////////////////////

        var $items = document.querySelector('#items');

        carouselEstructura.appendChild(carouselCard);
        carouselCard.appendChild(cardView);        
        cardView.appendChild(cardImg);
        cardView.appendChild(cardDetalle);
        cardDetalle.appendChild(cardName);
        cardDetalle.appendChild(cardCategoria);
        cardDetalle.appendChild(cardPrecio);
        cardDetalle.appendChild(cardBoton);
        nodoCarousel.appendChild(carouselEstructura);
        $items.appendChild(nodoCarousel);
    }
}

function crearProductos(base){
    for (let item of base){
        // Estructura
        let nodoProductos = document.createElement ('div');
        nodoProductos.classList.add('col-xs-4', 'col-sm-4', 'col-md-4', 'col-lg-4');
        // Card
        let productosCard = document.createElement('div');
        productosCard.classList.add('card', 'mb-2');
        // Card Vista
        let productosView = document.createElement('div');
        productosView.classList.add('view', 'overlay');
        // Imagenes
        let productosImg = document.createElement('img');
        productosImg.classList.add('card-img-top', 'img-fluid');        
        productosImg.setAttribute('src', item.imagen);
        //card Detalle //
        let cardDetalle = document.createElement('div');
        cardDetalle.classList.add('card-body', 'p-3');
        //Card Nombre//
        let cardName = document.createElement('h6');
        cardName.classList.add('card-title', 'font-weight-bold','text-danger', 'mb-0');
        cardName.textContent = item.nombre;
        //card Categoría//
        let cardCategoria = document.createElement('p');
        cardCategoria.classList.add('card-text');
        cardCategoria.textContent = item.categoria;
        //card Precio//
        let cardPrecio = document.createElement('p');
        cardPrecio.classList.add('card-precio');
        cardPrecio.textContent = '$ ' + item.precio;
        // card Boton + //
        let cardBoton = document.createElement('button');
        cardBoton.classList.add('btn', 'btn-primary');
        cardBoton.textContent= '+';
        cardBoton.setAttribute('marcador', item.id);
        cardBoton.addEventListener('click', sumarCarrito); 

        var $productos = document.querySelector('#productos');

        nodoProductos.appendChild(productosCard);
        productosCard.appendChild(productosView);
        productosView.appendChild(productosImg);
        productosView.appendChild(cardDetalle);
        cardDetalle.appendChild(cardName);
        cardDetalle.appendChild(cardCategoria);
        cardDetalle.appendChild(cardPrecio);
        cardDetalle.appendChild(cardBoton);
        $productos.appendChild(nodoProductos);
    }
}

var carrito = [];    
var $carrito = document.querySelector('#carrito');
var total = 0;


function sumarCarrito(){
    // Tomar el ID del producto por medio del botón el botón //
    carrito.push(this.getAttribute('marcador'));
    //console.log(carrito);
    //Consultar nuevamente a la base y crear los items del carrito        
    consultaCarrito();

}


function consultaCarrito(){
    // nueva consulta a la base ya que no pude tomar los datos de la consulta anterior
    var request = new XMLHttpRequest();
    request.open('GET', 'json/productos.json');
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        var baseDeDatos = request.response;
        crearCarrito(baseDeDatos);
        // calcular el total del carrito//
        calcularTotal(baseDeDatos);
    }

    function crearCarrito(base){
        // Vaciamos todo el html
        $carrito.textContent = '';
        // Quitamos los duplicados
        let carritoSinDuplicados = [...new Set(carrito)];
        // Generamos los Nodos a partir de carrito
        carritoSinDuplicados.forEach(function (item) {
            // Obtenemos el item que necesitamos de la variable base de datos
            let miItem = base.filter(function(itemBaseDatos) {
                return itemBaseDatos['id'] == item;
            });
            // Cuenta el número de veces que se repite el producto
            let numeroUnidadesItem = carrito.reduce(function (total, itemId) {
                return itemId === item ? total += 1 : total;
            }, 0);
            // Creamos el nodo del item del carrito
            let nodoCarrito = document.createElement('li');
            nodoCarrito.classList.add('list-group-item');//, 'text-right', 'mx-2'
            let totalProducto = 0;
            totalProducto = numeroUnidadesItem * miItem[0]['precio'];
            nodoCarrito.textContent = `${numeroUnidadesItem} x ${miItem[0]['nombre']} - $ ${miItem[0]['precio']} = $ ${totalProducto}`;
            // Boton de borrar
            let miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.setAttribute('item', item);
            miBoton.addEventListener('click', borrarItemCarrito);
            
            nodoCarrito.appendChild(miBoton);
            $carrito.appendChild(nodoCarrito);
        })
    }
}

function calcularTotal(base) {
    // Limpiamos precio anterior
    total = 0;
    // Recorremos el array del carrito
    for (let item of carrito) {
        // De cada elemento obtenemos su precio
        let miItem = base.filter(function(itemBase) {
            return itemBase['id'] == item;
        });
        total = total + miItem[0]['precio'];
    }

    // Formateamos el total para que solo tenga dos decimales
    let totalDosDecimales = total.toFixed(2);
    // Renderizamos el precio en el HTML
    $total.textContent = totalDosDecimales;
}

function borrarItemCarrito() {    
    // Obtenemos el producto ID que hay en el boton pulsado
    let id = this.getAttribute('item');
    // Borramos todos los productos
    carrito = carrito.filter(function (carritoId) {
        return carritoId !== id;
    });
    // Armamos de nuevo el carrito
    consultaCarrito();    
}

function vaciarCarrito() {
    // Limpiamos los productos guardados
    carrito = [];
    // Renderizamos los cambios
    consultaCarrito();    
}