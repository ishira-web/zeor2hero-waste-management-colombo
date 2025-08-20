import express from 'express';
import { createRoute, deleteRouteById, getAllRoutes, getRouteById, updateRouteById } from '../Controller/route.controller';

const colRoutes = express.Router();

colRoutes.post('/createRoutes',createRoute);
colRoutes.get('/getAllRoutes', getAllRoutes);
colRoutes.get('/getRouteById/:id', getRouteById);
colRoutes.put('/updateRouteById/:id', updateRouteById);
colRoutes.delete('/deleteRouteById/:id', deleteRouteById);