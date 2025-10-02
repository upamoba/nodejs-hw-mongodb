;
import createHttpError from 'http-errors';
import * as service from '../services/contacts.js';

export async function getAllContactsController(req, res)  {
    const { page , perPage , sortBy , sortOrder , type, isFavourite } = req.query;
    const data = await service.getContactsListService({
      userId: req.user._id,
      page,
      perPage,
      sortBy,
      sortOrder,
      isFavourite: typeof isFavourite === 'string' ? isFavourite === 'true' : isFavourite,
      type,
    });
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts',
      data,
    });
  }
export async function getContactByIdController(req, res, next) {
const { contactId } = req.params;


  const contact = await service.getContactByIdService({ contactId, userId: req.user._id });
  if (!contact) throw new createHttpError.NotFound(`Contact not found`);
  res.status(200).json({
    status: 200,
      message: `Successfully found contact with id ${req.params.id}!`,
      data: contact,
    });
  }

export async function createContactController(req, res, next) {
    const created = await service.createContactService({ payload: req.body, userId: req.user._id });
    res.status(201).json({
      status: 201,
      message: 'Contact successfully created',
      data: created,
      });
  }

export async function updateContactController(req, res) {
  const { contactId } = req.params;
    const updated = await service.updateContactService({ contactId, payload: req.body, userId: req.user._id });
    if (!updated) throw new createHttpError.NotFound(`Contact not found`);
    res.status(200).json({
        status: 200,
        message: 'Contact successfully updated',
        data: updated,
      });
  }

export async function deleteContactController(req, res) {
  const { contactId } = req.params;
  const removed = await service.deleteContactService({ contactId, userId: req.user._id });
  if (!removed) throw new createHttpError.NotFound(`Contact not found`);
  res.status(204).end();
};
