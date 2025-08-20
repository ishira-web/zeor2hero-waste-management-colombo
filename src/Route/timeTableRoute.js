import express from 'express';
import { createTimeTable, getActiveTimeTables, getAllTimeTables, getTimeTableById, updateTimeTableById } from '../Controller/timeTable.controller.js';

export const timeRoute = express.Router();

timeRoute.post('/create',createTimeTable);
timeRoute.get('/all', getAllTimeTables);
timeRoute.get('/timetable/:id', getTimeTableById);
timeRoute.put('/:id', updateTimeTableById);
timeRoute.get('/gettimetable',getActiveTimeTables);


