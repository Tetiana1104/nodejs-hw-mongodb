import { Contact } from '../models/Contact.js';

export async function fetchAllContacts() {
  return await Contact.find();
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
