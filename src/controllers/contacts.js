import { getAllContactsService, getContactByIdService,
  createContactService,
updateContactService,
deleteContactService } from '../services/contacts.js';
import createHttpError from 'http-errors';

export async function getAllContactsController(req, res, next) {
    const data = await getAllContactsService();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data,
    });
  }
export async function getContactByIdController(req, res, next) {
    const { contactId } = req.params;
    const item = await getContactByIdService(contactId);

    if (!item) return next(createHttpError(404, `Contact not found`));
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: item,
    });
  }

export async function createContactController(req, res, next) {
    const{name,phoneNumber,contactType} = req.body;
    if(!name || !phoneNumber || !contactType){
    return res.status(400).json({
      status: 400,
      message: 'Validation failed',
      data: 'The fields name, phoneNumber, contactType are required.',
    });
    }
    const create = await createContactService(req.body);
    res.status(201).json({
      status: 201,
      message: 'Contact created',
      data: created,
      });
  }

export async function updateContactController(req, res, next) {
    const { contactId } = req.params;
    const { name, phoneNumber } = req.body;
    if(!name || !phoneNumber){
      return res.status(400).json({
        status: 400,
        message: 'Validation failed',
        data: 'The fields name and phoneNumber are required.',
      });
      }
      const updated = await updateContactService(contactId, req.body);
      if (!updated) return next(createHttpError(404, `Contact not found`));
      res.status(200).json({
        status: 200,
        message: 'Contact updated',
        data: updated,
      });
  }

export async function deleteContactController(req, res, next) {
    const { contactId } = req.params;
    const removed = await deleteContactService(contactId);
    if (!removed) return next(createHttpError(404, `Contact not found`));
    res.status(204).end();
  }
