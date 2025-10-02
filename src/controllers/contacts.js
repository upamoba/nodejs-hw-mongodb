import { getContactsListService, getContactByIdService,
  createContactService,
updateContactService,
deleteContactService } from '../services/contacts.js';
import createHttpError from 'http-errors';

export async function getAllContactsController(req, res) {
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;
    const result = await service.getContactsListService({
      userId: req.user._id,
      page : req.query.page,
      perPage: req.query.perPage,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      type: req.query.type,
      isFavourite: req.query.isFavourite === 'true' ? true : req.query.isFavourite === 'false' ? false : undefined,
    });
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts',
      data: result,
    });
  }
export async function getContactByIdController(req, res, next) {

    const contact = await service.getContactByIdService(req.params.id, req.user._id);
if (!contact) throw new createHttpError.NotFound(`Contact not found`);
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${req.params.id}!`,
      data: contact,
    });
  }

export async function createContactController(req, res, next) {
   const payload = { ...req.body, userId: req.user._id };
    const created = await service.createContactService(payload);
    res.status(201).json({
      status: 201,
      message: 'Contact successfully created',
      data: created,
      });
  }

export async function updateContactController(req, res) {
    const updated = await service.updateContactService(req.params.id, req.user._id, req.body);
    if (!updated) throw new createHttpError.NotFound(`Contact not found`);
    res.status(200).json({
        status: 200,
        message: 'Contact successfully updated',
        data: updated,
      });
  }

export async function deleteContactController(req, res,) {
    const removed = await service.deleteContactService(req.params.id, req.user._id);
    if (!removed) throw new createHttpError.NotFound(`Contact not found`);
    res.status(204).end();
  }

// // GET /contacts
// const result = await getContactsListService(req.query, req.user._id);
// res.status(200).json({ status: 200, message: 'Contacts found!', data: result });

// // GET /contacts/:contactId
// const item = await getContactByIdService(req.params.contactId, req.user._id);
// if (!item) throw createHttpError(404, 'Contact not found');
// res.status(200).json({ status: 200, message: `Contact with id ${req.params.contactId} found!`, data: item });

// // POST /contacts
// const created = await createContactService(req.body, req.user._id);
// res.status(201).json({ status: 201, message: 'Contact created successfully!', data: created });

// // PATCH /contacts/:contactId
// const updated = await updateContactService(req.params.contactId, req.body, req.user._id);
// if (!updated) throw createHttpError(404, 'Contact not found');
// res.status(200).json({ status: 200, message: 'Contact updated successfully!', data: updated });

// // DELETE /contacts/:contactId
// const removed = await deleteContactService(req.params.contactId, req.user._id);
// if (!removed) throw createHttpError(404, 'Contact not found');
// res.status(204).end();
