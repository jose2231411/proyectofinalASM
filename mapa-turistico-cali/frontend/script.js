let map;
let markers = [];
let currentSites = [];

const API_URL = 'http://localhost:3000/api';

// Datos de respaldo (fallback) para cuando el servidor no está disponible
const FALLBACK_SITES = [
    {
        id: "tres-cruces",
        nombre: "Cerro de las Tres Cruces",
        descripcionCorta: "Cerro icónico de Cali con vistas panorámicas, senderos naturales y tres cruces simbólicas en la cima. Ideal para caminatas y deportes al aire libre.",
        descripcion: "El Cerro de las Tres Cruces es uno de los íconos más emblemáticos de Cali, tanto por su significado religioso como por su valor paisajístico y deportivo. Ubicado al oeste de la ciudad, este cerro recibe su nombre por las tres grandes cruces que coronan su cima, instaladas originalmente en la década de 1930 como símbolo de protección espiritual para los caleños. Además de su valor simbólico, el cerro se ha convertido en un popular destino para caminatas y entrenamiento físico, especialmente los fines de semana, cuando cientos de personas ascienden por sus senderos naturales. Desde la cima, los visitantes pueden disfrutar de una impresionante vista panorámica de la ciudad y del Valle del Cauca, haciendo de esta experiencia una combinación perfecta entre ejercicio, naturaleza y cultura.",
        coordenadas: [3.4700, -76.5350],
        thumbnail: "img/thumbnails/CTC.png",
        imagen: "img/full/CTC_F.png",
        video: "https://www.youtube.com/embed/fjHqywBIA90?si=5NvR3mHcWOPXLOkV&amp",
        ubicacion: "Cerro de las Tres Cruces, Oeste de Cali, Valle del Cauca, Colombia",
        horario: "Abierto todos los días de 5:00 a.m. a 6:00 p.m.",
        actividades: "Caminatas ecológicas, entrenamiento físico, fotografía, avistamiento de aves.",
        datoCurioso: "Las tres cruces originales fueron hechas de guadua y luego reemplazadas por estructuras de concreto que pesan más de 3 toneladas cada una."
    },
    {
        id: "san-antonio",
        nombre: "Barrio San Antonio",
        descripcionCorta: "Barrio histórico y cultural de Cali, con arquitectura colonial, arte callejero, gastronomía local y una vista espectacular desde su colina central.",
        descripcion: "San Antonio es uno de los barrios más antiguos, encantadores y culturales de Cali. Ubicado en una colina cerca del centro histórico, este sector es conocido por su arquitectura colonial, sus calles empedradas y su ambiente bohemio. El corazón del barrio es la iglesia de San Antonio, construida en el siglo XVIII, rodeada por un parque frecuentado por artistas, cuenteros y músicos que llenan el lugar de vida y tradición. Además, San Antonio es famoso por su variada oferta gastronómica, con cafés, restaurantes y tiendas artesanales que conservan el sabor local. Su mezcla de historia, arte y vistas espectaculares lo convierten en un lugar imperdible para quienes desean descubrir el alma auténtica de Cali.",
        coordenadas: [3.4480, -76.5420],
        thumbnail: "img/thumbnails/SA.png",
        imagen: "img/full/SA_F.jpeg",
        video: "https://www.youtube.com/embed/ddRH0lmTEJc?si=sYk4mh_puyWDJzXL&amp",
        ubicacion: "Barrio San Antonio, Cali, Valle del Cauca, Colombia",
        horario: "Espacio abierto al público las 24 horas. Restaurantes y tiendas: de 9:00 a.m. a 10:00 p.m.",
        actividades: "Caminatas culturales, visitas guiadas, fotografía, gastronomía, cuentería y eventos artísticos.",
        datoCurioso: "El parque de San Antonio es uno de los lugares más populares para escuchar cuenteros al aire libre en todo el país."
    },
    {
        id: "rio-cali",
        nombre: "Río Cali",
        descripcionCorta: "Río urbano que cruza Cali, rodeado de parques, monumentos y arte. Un lugar para caminar, relajarse y conectarse con la naturaleza en plena ciudad.",
        descripcion: "El Río Cali es una de las principales corrientes hídricas que atraviesan la ciudad y uno de los símbolos naturales más importantes para los caleños. Naciendo en los Farallones de Cali y fluyendo hacia el norte, este río ha sido testigo del desarrollo urbano de la ciudad y actualmente es eje de varios espacios culturales y recreativos. A lo largo de su recorrido se pueden encontrar parques, senderos peatonales, monumentos y lugares emblemáticos como el Bulevar del Río, el Museo La Tertulia y el Gato del Río. El río no solo ofrece un paisaje natural dentro del entorno urbano, sino también un lugar de encuentro para el arte, la historia y el descanso en medio del bullicio de la ciudad.",
        coordenadas: [3.4530, -76.5280],
        thumbnail: "img/thumbnails/BUL.png",
        imagen: "img/full/BUL_F.webp",
        video: "https://www.youtube.com/embed/lRpQVx-_Hr0?si=cXbGffQVyYZ_1R0x&amp",
        ubicacion: "A lo largo del Bulevar del Río, desde la Avenida Colombia hasta el Zoológico de Cali",
        horario: "Abierto todos los días. Recomendado de 6:00 a.m. a 8:00 p.m.",
        actividades: "Caminatas, ciclismo, fotografía, arte urbano, visitas culturales, eventos al aire libre.",
        datoCurioso: "El monumento del Gato del Río, diseñado por el artista Hernando Tejada, cuenta con más de 15 'gatas' creadas por diferentes artistas que lo acompañan en el recorrido del río."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    setupEventListeners();
    loadAllSites();
});

// Inicializar el mapa de Leaflet
function initMap() {
    map = L.map('map').setView([3.4516, -76.5320], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

function setupEventListeners() {
    
    document.querySelectorAll('.predefined-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const site = e.target.getAttribute('data-site');
            
            document.querySelectorAll('.predefined-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            
            if (site === 'todos') {
                loadAllSites();
            } else {
                searchSites(site);
            }
        });
    });
}

// Cargar todos los sitios turísticos
async function loadAllSites() {
    try {
        // Intentar obtener datos del servidor
        const response = await fetch(`${API_URL}/sites`, { timeout: 5000 });
        const data = await response.json();
        
        if (data.success) {
            displaySites(data.sites);
            addMarkersToMap(data.sites);
        } else {
            showError('Error al cargar los sitios turísticos');
        }
    } catch (error) {
        console.error('Error de conexión con el servidor:', error);
        console.log('Usando datos de respaldo locales');
        displaySites(FALLBACK_SITES);
        addMarkersToMap(FALLBACK_SITES);
    }
}

// Buscar sitios turísticos
async function searchSites(term) {
    try {
        // Intentar buscar en el servidor
        const response = await fetch(`${API_URL}/sites/search?term=${encodeURIComponent(term)}`, { timeout: 5000 });
        const data = await response.json();
        
        if (data.success) {
            displaySites(data.sites);
            addMarkersToMap(data.sites);
        } else {
            showError('No se encontraron resultados');
        }
    } catch (error) {
        console.error('Error de conexión con el servidor:', error);
        // Realizar búsqueda local en los datos de respaldo
        const results = FALLBACK_SITES.filter(site => {
            const termLower = term.toLowerCase();
            return (
                site.id.includes(termLower) ||
                site.nombre.toLowerCase().includes(termLower) ||
                site.descripcion.toLowerCase().includes(termLower) ||
                site.descripcionCorta.toLowerCase().includes(termLower)
            );
        });
        
        if (results.length > 0) {
            displaySites(results);
            addMarkersToMap(results);
        } else {
            showError('No se encontraron resultados');
        }
    }
}

// Mostrar los sitios en la lista de resultados
function displaySites(sites) {
    currentSites = sites;
    const resultsContainer = document.getElementById('results-list');
    resultsContainer.innerHTML = '';
    
    if (sites.length === 0) {
        resultsContainer.innerHTML = '<p>No se encontraron resultados</p>';
        return;
    }
    
    sites.forEach(site => {
        const siteElement = document.createElement('div');
        siteElement.className = 'result-item';
        siteElement.innerHTML = `
            <img src="${site.thumbnail}" alt="${site.nombre}" class="result-image" style="width: 150px; height: auto;">
            <div class="result-content">
                <h3 class="result-title">${site.nombre}</h3>
                <p class="result-description">${site.descripcionCorta}</p>
                <button class="view-more-btn" data-id="${site.id}">Ver más</button>
            </div>
        `;
        
        resultsContainer.appendChild(siteElement);
    });
    
    // Añadir event listeners a los botones "Ver más"
    document.querySelectorAll('.view-more-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const siteId = e.target.getAttribute('data-id');
            const site = currentSites.find(s => s.id === siteId);
            if (site) {
                showSiteDetails(site);
            }
        });
    });
}
function getMarkerColorById(id) {
    const colorMap = {
        'tres-cruces': 'green',
        'san-antonio': 'red',
        'rio-cali': 'blue'
    };
    return colorMap[id] || 'green'; // color por defecto
}

function addMarkersToMap(sites) {
   
}

// Añadir marcadores al mapa
function addMarkersToMap(sites) {
    // Limpiar marcadores existentes
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    sites.forEach(site => {
        const color = getMarkerColorById(site.id);
        const customIcon = L.icon({
            iconUrl: `https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-${color}.png`,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });

        const marker = L.marker(site.coordenadas, { icon: customIcon }).addTo(map);
        marker.bindPopup(`...`);
        markers.push(marker);
    
        // Crear popup con información básica
        marker.bindPopup(`
            <div style="text-align: center;">
                <strong>${site.nombre}</strong><br>
                ${site.descripcionCorta}<br>
                <button 
                    onclick="window.showSiteFromMap('${site.id}')" 
                    style="
                        background: #4CAF50; 
                        color: white; 
                        padding: 5px 10px; 
                        margin-top: 5px; 
                    "
                >
                    Ver más información
                </button>
            </div>
        `);
        
        markers.push(marker);
    });
    
    if (markers.length > 1) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    } else if (markers.length === 1) {
        map.setView(sites[0].coordenadas, 15);
    }
}

// Mostrar detalles de un sitio
function showSiteDetails(site) {
    // Llenar la tarjeta con la información del sitio
    document.getElementById('card-title').textContent = site.nombre;
    document.getElementById('card-subtitle').textContent = site.descripcionCorta;
    
    const cardBody = document.getElementById('card-body');
    cardBody.innerHTML = `
        <p>${site.descripcion}</p>
        
        <div class="media-container">
            <div class="image-container">
                <img src="${site.imagen}" alt="${site.nombre}">
            </div>
            <div class="video-container">
                <iframe src="${site.video}" title="${site.nombre}" allowfullscreen></iframe>
            </div>
        </div>
        
        <div class="info-section">
            <h3>Información de interés</h3>
            
            <div class="info-item">
                <div>
                    <strong>Ubicación:</strong> ${site.ubicacion}
                </div>
            </div>
            
            <div class="info-item">
                <div>
                    <strong>Horario:</strong> ${site.horario}
                </div>
            </div>
            
            <div class="info-item">
                <div>
                    <strong>Actividades:</strong> ${site.actividades}
                </div>
            </div>
            
            <div class="info-item">
                <div>
                    <strong>Dato curioso:</strong> ${site.datoCurioso}
                </div>
            </div>
        </div>
    `;
    
    // Mostrar la tarjeta
    document.getElementById('info-card').style.display = 'block';
    
    // Desplazarse a la tarjeta
    document.getElementById('info-card').scrollIntoView({
        behavior: 'smooth'
    });
    
    // Centrar el mapa en el sitio seleccionado
    map.setView(site.coordenadas, 16);
    
    // Abrir el popup del marcador correspondiente
    markers.forEach(marker => {
        const markerLatLng = marker.getLatLng();
        if (markerLatLng.lat === site.coordenadas[0] && markerLatLng.lng === site.coordenadas[1]) {
            marker.openPopup();
        }
    });
}

// Cerrar la tarjeta de información
function closeCard() {
    document.getElementById('info-card').style.display = 'none';
    
    // Desplazarse de vuelta al mapa
    document.getElementById('map').scrollIntoView({
        behavior: 'smooth'
    });
}

// Mostrar un mensaje de error
function showError(message) {
    const resultsContainer = document.getElementById('results-list');
    resultsContainer.innerHTML = `<p class="error-message">${message}</p>`;
}

window.showSiteFromMap = function(siteId) {
    const site = currentSites.find(s => s.id === siteId);
    if (site) {
        showSiteDetails(site);
    }
};

