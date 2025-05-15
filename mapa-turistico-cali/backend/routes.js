import express from 'express';
import { sitiosTuristicos } from './data.js';

export const sitesRouter = express.Router();

sitesRouter.get('/sites', (req, res) => {
    res.json({
        success: true,
        sites: sitiosTuristicos
    });
});

sitesRouter.get('/sites/:id', (req, res) => {
    const site = sitiosTuristicos.find(site => site.id === req.params.id);
    
    if (site) {
        res.json({
            success: true,
            site
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Sitio no encontrado'
        });
    }
});

