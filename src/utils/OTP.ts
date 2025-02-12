export const generateOTP = () => {
  return String(Math.floor(Math.random() * 1000000));
};
