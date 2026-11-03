import express from 'express';
import { 
    getAllResources, 
    createResource, 
    deleteResource,
    updateResource 
} from '../controller/resourceController.js';

const router = express.Router();

router.get('/', getAllResources);
router.post('/', createResource);
router.delete('/:id', deleteResource);
router.put('/:id', updateResource); 

export default router;