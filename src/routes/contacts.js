import { Router } from 'express';
import { getAllContactsController,
    getContactByIdController,
createContactController,
updateContactController,
 deleteContactController} from '../controllers/contacts.js';
 import { ctrlWrapper } from '../utils/ctrlWrapper.js';
 import { validateBody } from '../middlewares/validateBody.js';
import  {isValidId} from '../middlewares/isValidId.js';
import { createContactSchema,updateContactSchema } from '../validation/contactSchemas.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getAllContactsController));
contactsRouter.get('/:contactId', isValidId('contactId'), ctrlWrapper(getContactByIdController));
contactsRouter.post('/',authenticate,upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(createContactController));
contactsRouter.patch('/:contactId',authenticate, upload.single('photo'), isValidId('contactId'), validateBody(updateContactSchema), ctrlWrapper(updateContactController));
contactsRouter.delete('/:contactId', isValidId('contactId'), ctrlWrapper(deleteContactController));

export default contactsRouter;
