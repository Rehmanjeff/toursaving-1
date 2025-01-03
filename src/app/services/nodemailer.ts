import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
   service: process.env.NODEMAILER_SERVICE,
   auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASS
   }
});

export const mailOptions = {
   from: process.env.NODEMAILER_EMAIL
};