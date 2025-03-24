import { SessionsCollection } from '../models/session';

export const createSession = async (sessionData) => {
  return await SessionsCollection.create(sessionData);
};
