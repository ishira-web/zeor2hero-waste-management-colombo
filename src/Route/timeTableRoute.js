import express from 'express';
import { createTimeTable, getActiveTimeTables, getAllCrewMembers, getAllTimeTables, getTimeTableById, getTimeTablesByCollectorId, updateTimeTableById } from '../Controller/timeTable.controller.js';
import { protect } from '../Middleware/authMiddleware.js';

export const timeRoute = express.Router();

timeRoute.post('/create',createTimeTable);
timeRoute.get('/all', getAllTimeTables);
timeRoute.get('/timetable/:id', getTimeTableById);
timeRoute.put('/:id', updateTimeTableById);
timeRoute.get('/gettimetable',getActiveTimeTables);
timeRoute.get('/getCrewMembers/:id',protect(["collector"]),getAllCrewMembers);
timeRoute.get('/getTimetablebyCollector/:id',protect(["collector"]),getTimeTablesByCollectorId)

