import express from 'express';
import { createCollector, deleteCollectorById, getAllCollectors, getCollectorById, updateCollectorById } from '../Controller/collector.controller.js';
import upload from '../Config/Multer.js';
import { protect } from '../Middleware/authMiddleware.js';
const router = express.Router();

router.post('/createcollector',upload.fields([{ name: "nicImage", maxCount: 1 },{ name: "profilePicture", maxCount: 1 },]),protect(["admin"]), createCollector)
router.get('/getcollectors',protect(["admin"]),getAllCollectors);
router.get('/getcollectors/:id',protect(["admin","collector"]),getCollectorById); 
router.delete('/deletecollector/:id',protect(["admin"]),deleteCollectorById);
router.put('/updatecollector/:id',protect(["admin"]),updateCollectorById);
export default router;
