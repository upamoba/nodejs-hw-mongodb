import { getAllContactsService, getContactByIdService } from '../services/contacts.js';

export async function getAllContactsController(req, res, next) {
  try {
    const data = await getAllContactsService();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function getContactByIdController(req, res, next) {
  try {
    const { contactId } = req.params;
    const item = await getContactByIdService(contactId);

    if (!item) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: item,
    });
  } catch (err) {

    next(err);
  }
}
