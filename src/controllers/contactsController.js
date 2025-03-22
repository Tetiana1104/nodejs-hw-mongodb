import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import {
  fetchAllContacts,
  fetchContactById,
  createContact,
  removeContact,
  updateContact,
} from '../services/contacts.js';

export async function getAllContacts(req, res) {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      type,
      isFavourite,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const itemsPerPage = parseInt(perPage, 10);

    if (isNaN(pageNumber) || isNaN(itemsPerPage)) {
      throw createHttpError(400, 'Invalid pagination parameters');
    }

    const contacts = await fetchAllContacts({
      page: pageNumber,
      perPage: itemsPerPage,
      sortBy,
      sortOrder,
      type,
      isFavourite,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message || 'Something went wrong',
    });
  }
}

export async function getContactById(req, res) {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(400, 'Invalid contact ID format');
  }

  const contact = await fetchContactById(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

export const createContactController = async (req, res) => {
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const deleteContact = await removeContact(contactId);

  if (!deleteContact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};
