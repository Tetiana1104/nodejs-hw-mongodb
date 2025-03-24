import { UserCollection } from '../models/user';

export const createUser = async (userData) => {
  return await UserCollection.create(userData);
};
