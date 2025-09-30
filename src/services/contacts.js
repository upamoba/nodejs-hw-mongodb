import { Contact } from '../models/contact.js';

export async function getContactsListService( params, userId) {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
  isFavourite
} = params;

  const filter = { userId };
  if (type && ['work', 'home', 'personal'].includes(type)) {
    filter.contactType = type;
  }
  let fav;
  if (typeof isFavourite === 'string') {
    const v = isFavourite.toLowerCase();
    if (v === 'true') fav = true;
    if (v === 'false') fav = false;
  } else if (typeof isFavourite === 'boolean') {
    fav = isFavourite;
  }
  if (typeof fav === 'boolean') filter.isFavourite = fav;

const pageNumber = Math.max(1, Number(page) || 1);
const limit = Math.max(1, Math.min(100, Number(perPage) || 10));
const skip = (pageNumber - 1) * limit;
const sortField =  sortBy === 'name' ? 'name' : 'name';
const direction = String(sortOrder).toLowerCase() === 'desc' ? -1 : 1;
const [totalItems, items] = await Promise.all([
  Contact.countDocuments(filter),
  Contact.find(filter)
    .sort({ [sortField]: direction })
    .skip(skip)
    .limit(limit)
    .lean()
]);
const totalPages = Math.max(1, Math.ceil(totalItems / limit));
return {
  data: items,
  page: pageNumber,
  perPage: limit,
  totalItems,
  totalPages,
  hasPreviousPage: pageNumber > 1,
  hasNextPage: pageNumber < totalPages
};
}

export async function getAllContactsService() {
  return Contact.find().lean();
};

export async function getContactByIdService(contactId, userId) {
  return Contact.findOne({ _id: contactId, userId }).lean();
};
export async function createContactService(payload, userId) {
  const doc = await Contact.create({ ...payload, userId });
  return doc.toObject();
}
export async function updateContactService(contactId, payload, userId) {
  return Contact.findOneAndUpdate({ _id: contactId, userId }, payload, { new: true, runValidators: true }).lean();
}
export async function deleteContactService(contactId, userId) {
  return Contact.findOneAndDelete({ _id: contactId, userId }).lean();
}
