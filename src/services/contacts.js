import { Contact } from '../models/Contact.js';
import mongoose from 'mongoose';

export async function fetchAllContacts({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite,
  userId,
}) {
  const skip = (page - 1) * perPage;
  const filter = { userId };

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
    .limit(perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages: Math.ceil(totalItems / perPage),
    hasPreviousPage: page > 1,
    hasNextPage: page * perPage < totalItems,
  };
}

export async function fetchContactById(contactId, userId) {
  return await Contact.findOne({
    _id: contactId,
    userId:
      typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId,
  });
}

export const createContact = async (payload, userId) => {
  const contact = await Contact.create({ ...payload, userId });
  return contact;
};

export const removeContact = async (contactId, userId) => {
  const deleteContact = await Contact.findOneAndDelete({
    _id: contactId,
    userId:
      typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId,
  });
  return deleteContact;
};

export const updateContact = async (contactId, payload, userId) => {
  const contact = await Contact.findOneAndUpdate(
    {
      _id: contactId,
      userId:
        typeof userId === 'string'
          ? new mongoose.Types.ObjectId(userId)
          : userId,
    },
    payload,
    { new: true },
  );
  return contact;
};
