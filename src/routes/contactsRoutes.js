import express from 'express';
import {
  getAllContacts,
  getContactById,
  createContactController,
  deleteContactController,
  upsertContact,
  patchContact,
} from '../controllers/contactsController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getAllContacts));
router.get('/:contactId', ctrlWrapper(getContactById));
router.post('/contacts', ctrlWrapper(createContactController));
router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));
router.put('/contacts/:contactId', ctrlWrapper(upsertContact));
router.patch('/contacts/:contactId', ctrlWrapper(patchContact));

export default router;
