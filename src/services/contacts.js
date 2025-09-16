import { Contact } from '../models/contact.js';

export async function getAllContactsService() {
  return Contact.find().lean();
};

export async function getContactByIdService(contactId) {
  return Contact.findById(contactId).lean();
};
export async function createContactService(payload)
{
  const doc = await Contact.create(payload);
  return doc.toObject();
}
export async function updateContactService(contactId, payload) {
  return Contact.findByIdAndUpdate(contactId, payload, { new: true }).lean();
}
export async function deleteContactService(contactId) {
  return Contact.findByIdAndDelete(contactId).lean();
}
