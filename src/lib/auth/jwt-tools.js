import jwt from "jsonwebtoken";
import User from "../../api/users/model.js";
import createHttpError from "http-errors";

export const createAccessToken = (payload) =>
  new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "15min" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });

export const verifyAccessToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, originalPayload) => {
      if (err) reject(err);
      else resolve(originalPayload);
    });
  });

export const createRefreshToken = (payload) =>
  new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.REFRESH_SECRET,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });

export const verifyRefreshToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.REFRESH_SECRET, (err, originalPayload) => {
      if (err) reject(err);
      else resolve(originalPayload);
    });
  });

export const createTokens = async (user) => {
  const accessToken = await createAccessToken({ _id: user._id });
  const refreshToken = await createRefreshToken({ _id: user._id });
  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
};
