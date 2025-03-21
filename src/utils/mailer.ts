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
    <title>${envConfig.APP_NAME} Email</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #5e6f85;
        color: #a604f2;
        text-align: center;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background: #0a0d17;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background: #763af5;
        color: #fff;
        text-align: center;
        padding: 20px;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .body {
        padding: 20px;
        line-height: 1.6;
      }
      .body h2 {
        color: #f2a104;
      }
      .footer {
        background: #2f3542;
        text-align: center;
        padding: 10px;
        font-size: 14px;
        color: #777;
      }
      @media (max-width: 600px) {
        .email-container {
          width: 100%;
        }
        .body {
          padding: 15px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <!-- Header -->
      <div class="header">
        <h1>${envConfig.APP_NAME}</h1>
      </div>

      <!-- Body -->
      <div class="body">
        <h2>${subject},</h2>
        <p>${text}</p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>
          &copy; ${new Date().getFullYear()} ${
    envConfig.APP_NAME
  }. All rights reserved.
        </p>
      </div>
    </div>
  </body>
</html>
`;
};
