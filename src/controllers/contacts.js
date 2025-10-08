
import createHttpError from 'http-errors';
import * as service from '../services/contacts.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

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
  const { _id: userId } = req.user;
 const payload = { ...req.body, userId };

  if (req.file) {
    try {
      console.log('uploading file', {
        field: req.file.fieldname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });
      const { secure_url } = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname || 'photo'
      );
      payload.photo = secure_url;
    } catch (e) {
      console.error(e);
      throw createHttpError(400, 'Invalid image file');
    }
  }
    const created = await service.createContactService(payload);
    res.status(201).json({
      status: 201,
      message: 'Contact successfully created',
      data: created,
      });
  }

export async function updateContactController(req, res) {

  const { contactId } = req.params;
  const update = { ...req.body };
  if (req.file) {
    console.log('updating photo', {
      field: req.file.fieldname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    const { secureUrl } = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname || 'photo',
    );
    update.photo = secureUrl;
  }

    const updated = await service.updateContactService( {contactId, userId: req.user._id,payload: update,}

      );
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
