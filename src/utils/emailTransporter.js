import nodemailer from 'nodemailer';

import { getEnvVariable } from './env.js';

const transport = nodemailer.createTransport({

  host: getEnvVariable('SMTP_HOST'),
  port: getEnvVariable('SMTP_PORT'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: getEnvVariable('SMTP_USER'),
    pass: getEnvVariable('SMTP_PASSWORD'),
  },
});

export async function sendMail(mail) {
  mail.from = "genasisoev82@gmail.com"; // sender address

  await transport.sendMail(mail);
}
