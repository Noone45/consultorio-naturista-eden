// --- 1. CARRUSEL HERO ---
const slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;
const slideInterval = 5000;

function nextSlide() {
    if (slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

if (slides.length > 0) {
    setInterval(nextSlide, slideInterval);
}

// --- 2. BUSCADOR GLOBAL PRUEBA GIT---
function buscarServicio() {
    const input = document.getElementById('search-input');
    if (!input) return;
    const query = input.value.trim();

    if (query !== "") {
        window.location.href = `productos.html?buscar=${encodeURIComponent(query)}`;
    }
}

// --- 3. RENDERING DE CATÁLOGO ---
function cargarCatalogo() {
    const contenedor = document.getElementById('grid-productos-completo');
    if (!contenedor || typeof listaProductos === 'undefined') return;

    contenedor.innerHTML = "";

    listaProductos.forEach(prod => {
        const mensajeWhatsApp = encodeURIComponent(
            `Hola, me interesa consultar la disponibilidad del producto:\n` +
            `• *Producto:* ${prod.nombre}\n` +
            `• *Código:* ${prod.id}\n` +
            `• *Precio de referencia:* Q${prod.precio.toFixed(2)}\n\n` +
            `¿Me podrían confirmar el precio actualizado y método de entrega?`
        );

        const cardHTML = `
            <div class="producto-card" data-categoria="${prod.categoria}">
                <div class="producto-img-box">
                    <img src="${prod.imagen}" alt="${prod.nombre}">
                </div>
                <div class="producto-info">
                    <span class="producto-categoria">${prod.categoria}</span>
                    <h3>${prod.nombre}</h3>
                    <p>${prod.descripcion}</p>
                    <div class="producto-footer">
                        <span class="producto-precio">Q ${prod.precio.toFixed(2)}</span>
                        <a href="https://wa.me/50234421601?text=${mensajeWhatsApp}" target="_blank" class="btn-producto">
                            <i class="fa-brands fa-whatsapp"></i> Pedir
                        </a>
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += cardHTML;
    });
}

// --- 4. FILTROS Y BÚSQUEDA EN PRODUCTOS.HTML ---
function filtrarProductosPagina() {
    const inputPagina = document.getElementById('search-input-page') || document.getElementById('search-input');
    if (!inputPagina) return;
    ejecutarFiltradoTexto(inputPagina.value);
}

function ejecutarFiltradoTexto(queryTexto) {
    const query = queryTexto.toLowerCase().trim();
    const cards = document.querySelectorAll('.producto-card');
    let coincidencias = 0;

    cards.forEach(card => {
        const texto = card.innerText.toLowerCase();
        if (query === "" || texto.includes(query)) {
            card.style.display = "flex";
            coincidencias++;
        } else {
            card.style.display = "none";
        }
    });

    const contenedor = document.getElementById('grid-productos-completo');
    let noResultadosMsg = document.getElementById('no-resultados-msg');

    if (coincidencias === 0 && query !== "") {
        if (!noResultadosMsg && contenedor) {
            noResultadosMsg = document.createElement('div');
            noResultadosMsg.id = 'no-resultados-msg';
            noResultadosMsg.className = 'no-resultados';
            noResultadosMsg.innerHTML = `
                <i class="fa-solid fa-seedling" style="font-size: 2.5rem; color: var(--color-salvia); margin-bottom: 1rem;"></i>
                <p>No encontramos productos que coincidan con <strong>"${queryTexto}"</strong>.</p>
                <small>Intenta buscar con otra palabra o explora nuestras categorías.</small>
            `;
            contenedor.appendChild(noResultadosMsg);
        }
    } else {
        if (noResultadosMsg) {
            noResultadosMsg.remove();
        }
    }
}

function filtrarCategoria(cat) {
    const buttons = document.querySelectorAll('.btn-filter');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }

    const cards = document.querySelectorAll('.producto-card');
    cards.forEach(card => {
        if (cat === 'todos' || card.getAttribute('data-categoria') === cat) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

// --- 5. RESERVA DE CITAS VÍA WHATSAPP ---
function enviarCitaWhatsApp(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const servicio = document.getElementById('servicio').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const notas = document.getElementById('notas').value;

    const numeroWhatsApp = "50234421601"; 

    let mensaje = `*NUEVA SOLICITUD DE CITA*\n\n`;
    mensaje += `*Nombre:* ${nombre}\n`;
    mensaje += `*Teléfono:* ${telefono}\n`;
    mensaje += `*Servicio:* ${servicio}\n`;
    mensaje += `*Fecha solicitada:* ${fecha}\n`;
    mensaje += `*Horario:* ${hora}\n`;
    
    if(notas.trim() !== "") {
        mensaje += `*Notas:* ${notas}\n`;
    }

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// --- 6. INICIALIZACIÓN DE LA PÁGINA Y SCROLL DE CATEGORÍAS ---
document.addEventListener("DOMContentLoaded", function () {
    // A. Cargar catálogo si existe el contenedor
    if (document.getElementById('grid-productos-completo')) {
        cargarCatalogo();
    }

    // B. Evaluar parámetros URL de búsqueda
    const urlParams = new URLSearchParams(window.location.search);
    const busqueda = urlParams.get('buscar');

    if (busqueda) {
        const inputPagina = document.getElementById('search-input-page') || document.getElementById('search-input');
        if (inputPagina) {
            inputPagina.value = busqueda;
        }
        ejecutarFiltradoTexto(busqueda);
    }

    // C. Scroll horizontal de categorías en PC
    const categoriasFilter = document.querySelector('.categorias-filter');

    if (categoriasFilter) {
        categoriasFilter.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                categoriasFilter.scrollLeft += e.deltaY;
            }
        });

        let isDown = false;
        let startX;
        let scrollLeft;

        categoriasFilter.addEventListener('mousedown', (e) => {
            isDown = true;
            categoriasFilter.style.cursor = 'grabbing';
            startX = e.pageX - categoriasFilter.offsetLeft;
            scrollLeft = categoriasFilter.scrollLeft;
        });

        categoriasFilter.addEventListener('mouseleave', () => {
            isDown = false;
            categoriasFilter.style.cursor = 'grab';
        });

        categoriasFilter.addEventListener('mouseup', () => {
            isDown = false;
            categoriasFilter.style.cursor = 'grab';
        });

        categoriasFilter.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - categoriasFilter.offsetLeft;
            const walk = (x - startX) * 2;
            categoriasFilter.scrollLeft = scrollLeft - walk;
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');

    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
            
            // Alterna entre el icono de barras y la equis (X)
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });
    }
});