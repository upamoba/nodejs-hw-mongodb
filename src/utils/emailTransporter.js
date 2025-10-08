import nodemailer from 'nodemailer';

// import { getEnvVariable } from './env.js';

// const transport = nodemailer.createTransport({

//   host: getEnvVariable('SMTP_HOST'),
//   port: getEnvVariable('SMTP_PORT'),
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: getEnvVariable('SMTP_USER'),
//     pass: getEnvVariable('SMTP_PASSWORD'),
//   },
// });

// export async function sendMail(mail) {
//   mail.from = "genasisoev82@gmail.com"; // sender address

//   await transport.sendMail(mail);
// }

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
export async function sendMail(mail) {
  mail.from = "genasisoev82@gmail.com"; // sender address

  await transport.sendMail(mail);
}
