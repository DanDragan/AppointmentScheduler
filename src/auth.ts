import bcrypt from "bcrypt";

/**
 * Hash a password using bcrypt.
 * @param password - Plaintext password to hash.
 * @returns The hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare a plaintext password with a hashed password.
 * @param plaintext - The plaintext password.
 * @param hash - The hashed password.
 * @returns Whether the passwords match.
 */
export const verifyPassword = async (
  plaintext: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(plaintext, hash);
};
