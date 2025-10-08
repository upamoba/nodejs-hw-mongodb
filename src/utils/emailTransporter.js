import nodemailer from 'nodemailer';



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
