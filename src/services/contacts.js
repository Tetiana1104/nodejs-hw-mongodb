import { Contact } from '../models/Contact.js';

export async function fetchAllContacts({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite,
}) {
  const pageNumber = parseInt(page, 10);
  const itemsPerPage = parseInt(perPage, 10);
  const skip = (pageNumber - 1) * itemsPerPage;

  if (isNaN(pageNumber) || isNaN(itemsPerPage)) {
    throw new Error('Invalid pagination parameters');
  }

  const filter = {};

  if (type) {
    filter.contactType = type;
  }
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === 'true';
  }

  const totalItems = await Contact.countDocuments(filter);
  const contacts = await Contact.find(filter)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(itemsPerPage);

  return {
    data: contacts,
    page: pageNumber,
    perPage: itemsPerPage,
    totalItems,
    totalPages: Math.ceil(totalItems / itemsPerPage),
    hasPreviousPage: pageNumber > 1,
    hasNextPage: pageNumber * itemsPerPage < totalItems,
  };
}

export async function fetchContactById(contactId) {
  return await Contact.findById(contactId);
}

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const removeContact = async (contactId) => {
  const deleteContact = await Contact.findByIdAndDelete(contactId);
  return deleteContact;
};

export const updateContact = async (contactId, payload) => {
  const contact = await Contact.findByIdAndUpdate(contactId, payload, {
    new: true,
  });
  return contact;
};
