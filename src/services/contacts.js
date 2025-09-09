import { Contact } from '../models/contact.js';

export async function getAllContactsService() {
  const items = await Contact.find().lean();
  return items;
};

export async function getContactByIdService(contactId) {
  const item = await Contact.findById(contactId).lean();
  return item;
};
