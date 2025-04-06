import createHttpError from 'http-errors';

import mongoose from 'mongoose';

import { saveFileToCloudinary } from '../services/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import {
  fetchAllContacts,
  fetchContactById,
  createContact,
  removeContact,
  updateContact,
} from '../services/contacts.js';

export async function getAllContacts(req, res) {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const validSortOrders = ['asc', 'desc'];
  if (!validSortOrders.includes(sortOrder)) {
    throw createHttpError(400, 'Invalid sortOrder. Use "asc" or "desc".');
  }

  const validSortFields = ['name', 'email', 'phoneNumber'];
  if (!validSortFields.includes(sortBy)) {
    throw createHttpError(
      400,
      `Invalid sortBy. Use one of: ${validSortFields.join(', ')}`,
    );
  }
  const contacts = await fetchAllContacts({
    page: Number(page),
    perPage: Number(perPage),
    sortBy,
    sortOrder,
    type,
    isFavourite,
    userId: req.user._id,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function getContactById(req, res) {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(400, 'Invalid contact ID format');
  }

  const contact = await fetchContactById(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

// export const createContactController = async (req, res) => {
//   if (req.file) {
//     const photoUrl = await saveFileToCloudinary(req.file.path);
//     req.body.photo = photoUrl;
//   }

export const createContactController = async (req, res) => {
  console.log('🟨 REQ.FILE:', req.file);
  console.log('🟨 FILE PATH:', req.file?.path);

  if (req.file) {
    try {
      const photoUrl = await saveFileToCloudinary(req.file.path);
      req.body.photo = photoUrl;
    } catch (error) {
      console.error('❌ Error uploading to Cloudinary:', error);
      throw createHttpError(500, 'Failed to upload image to Cloudinary');
    }
  }

  const contact = await createContact(req.body, req.user._id);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(400, 'Invalid contact ID format');
  }
  const deleteContact = await removeContact(contactId, req.user._id);

  if (!deleteContact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  let photoUrl;

  if (req.file) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(req.file.path);
    } else {
      photoUrl = await saveFileToUploadDir(req.file);
    }
  }

  const updatedContact = await updateContact(
    contactId,
    {
      ...req.body,
      photo: photoUrl,
    },
    req.user._id,
  );

  if (!updatedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully updated contact!',
    data: updatedContact,
  });
};
