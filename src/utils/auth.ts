// utils/auth.ts
import crypto from "crypto";

/**
 * Hashes a password using the provided salt or generates a new one if not provided.
 * @param password The plain password to hash.
 * @param salt Optional existing salt. If not provided, a new one will be generated.
 * @returns An object containing the hashed password and salt.
 */
export const hashPassword = (password: string, salt?: string) => {
  const saltValue = salt || crypto.randomBytes(16).toString("hex");
  const hashedPassword = crypto
    .pbkdf2Sync(password, saltValue, 1000, 64, `sha512`)
    .toString(`hex`);
  return { hashedPassword, salt: saltValue };
};
