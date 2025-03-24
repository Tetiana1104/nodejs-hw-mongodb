import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
} from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const newUser = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: newUser,
  });
};

export const loginUserController = async (req, res) => {
  const { accessToken, refreshToken, sessionId } = await loginUser(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken },
  });
};

export const refreshUserSessionController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;

  const {
    accessToken,
    refreshToken: newRefreshToken,
    sessionId: newSessionId,
  } = await refreshUserSession({ refreshToken, sessionId });

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  res.cookie('sessionId', newSessionId, {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
};

export const logoutUserController = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await logoutUser(sessionId);
  }
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).send();
};
