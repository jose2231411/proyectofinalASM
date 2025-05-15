import express from 'express';
import cors from 'cors';
import { sitesRouter } from './routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración CORS más específica
const corsOptions = {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Rutas
app.use('/api', sitesRouter);

// Ruta para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'API de Sitios Turísticos de Cali funcionando correctamente',
        endpoints: {
            getAllSites: '/api/sites',
            searchSites: '/api/sites/search?term=nombre',
            getSiteById: '/api/sites/:id'
        }
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Para probar la API, visita http://localhost:${PORT}/api/sites`);
});