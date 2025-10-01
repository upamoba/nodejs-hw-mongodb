import { getContactsListService, getContactByIdService,
  createContactService,
updateContactService,
deleteContactService } from '../services/contacts.js';
import createHttpError from 'http-errors';

export async function getAllContactsController(req, res) {
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;
    const fav = typeof isFavourite === 'string' ? isFavourite.toLowerCase() === 'true' ? true : isFavourite.toLowerCase() === 'false' ? false : undefined : undefined;
    const result = await getContactsListService({
      page,
      perPage,
      sortBy,
      sortOrder,
      type,
      isFavourite: fav,
    });
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts',
      data: result,
    });
  }
export async function getContactByIdController(req, res, next) {
    const { contactId } = req.params;
    const item = await getContactByIdService(contactId);
if (!item) throw createHttpError(404, `Contact not found`);
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: item,
    });
  }

export async function createContactController(req, res, next) {
    const{name,phoneNumber,contactType} = req.body;
    if(!name || !phoneNumber || !contactType){
    throw createHttpError(400, 'The fields name, phoneNumber, contactType are required.');
    }
    const created = await createContactService(req.body);
    res.status(201).json({
      status: 201,
      message: 'Contact created',
      data: created,
      });
  }

export async function updateContactController(req, res) {
    const { contactId } = req.params;
    const { name, phoneNumber } = req.body;
    if(!name || !phoneNumber){
      throw createHttpError(400, 'The fields name and phoneNumber are required.');
    }
    const updated = await updateContactService(contactId, req.body);
    if (!updated) throw createHttpError(404, `Contact not found`);
    res.status(200).json({
        status: 200,
        message: 'Contact updated',
        data: updated,
      });
  }

export async function deleteContactController(req, res,) {
    const { contactId } = req.params;
    const removed = await deleteContactService(contactId);
    if (!removed) throw createHttpError(404, `Contact not found`);
    res.status(204).end();
  }

// GET /contacts
const result = await getContactsListService(req.query, req.user._id);
res.status(200).json({ status: 200, message: 'Contacts found!', data: result });

// GET /contacts/:contactId
const item = await getContactByIdService(req.params.contactId, req.user._id);
if (!item) throw createHttpError(404, 'Contact not found');
res.status(200).json({ status: 200, message: `Contact with id ${req.params.contactId} found!`, data: item });

// POST /contacts
const created = await createContactService(req.body, req.user._id);
res.status(201).json({ status: 201, message: 'Contact created successfully!', data: created });

// PATCH /contacts/:contactId
const updated = await updateContactService(req.params.contactId, req.body, req.user._id);
if (!updated) throw createHttpError(404, 'Contact not found');
res.status(200).json({ status: 200, message: 'Contact updated successfully!', data: updated });

// DELETE /contacts/:contactId
const removed = await deleteContactService(req.params.contactId, req.user._id);
if (!removed) throw createHttpError(404, 'Contact not found');
res.status(204).end();
