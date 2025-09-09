import { Contact } from '../models/contact.js';

export const getAllContacts = async () => {
  const contacts = await Contact.find().lean();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId).lean();
  return contact;
};
