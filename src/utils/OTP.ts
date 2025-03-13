/**
 * Generates a 6-digit random OTP.
 *
 * @returns {string} a 6-digit random OTP.
 */
export const generateOTP = (): string => {
  return String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
};
