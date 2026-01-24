import { createTransport } from "nodemailer";
import envConfig from "../config/env";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: envConfig.NODEMAILER_USER,
    pass: envConfig.NODEMAILER_PASSWORD,
  },
});

/**
 * Function to send an email using nodemailer
 * @param to - The recipient's email address
 * @param subject - The subject line of the email
 * @param text - The body of the email
 */
export const sendMail = async (
  to: string,
  subject: string,
  text: string
): Promise<void> => {
  // Create the email message
  const message = {
    from: envConfig.NODEMAILER_USER,
    to,
    subject,
    text,
    // Generate the HTML body of the email
    html: httpGenerator(subject, text),
  };

  // Send the email
  await transporter.sendMail(message);
};

const httpGenerator = (subject: string, text: string) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f4f7f9; /* Lighter background for the "canvas" */
        color: #333333; /* Darker text for better legibility */
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff; /* White background for the card */
        border-radius: 8px;
        border: 1px solid #e0e0e0;
        overflow: hidden;
      }
      .header {
        background: #763af5; /* Keeping your primary purple */
        color: #ffffff;
        padding: 30px;
        text-align: center;
      }
      .body {
        padding: 40px;
        text-align: center;
        line-height: 1.6;
        color: #2d3436;
      }
      /* Highlight the OTP/Text specifically */
      .otp-text {
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 5px;
        color: #763af5; 
        margin: 20px 0;
      }
      .footer {
        background: #f8f9fa;
        padding: 20px;
        font-size: 12px;
        color: #636e72;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>${envConfig.APP_NAME}</h1>
      </div>
      <div class="body">
        <h2 style="color: #2d3436;">${subject}</h2>
        <div class="otp-text">${text}</div>
        <p>If you did not request this, please ignore this email.</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} ${envConfig.APP_NAME}. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`;
};
