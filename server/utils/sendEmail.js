import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html, devLink }) => {
  // Dev fallback: no email credentials, so print the link in the terminal
  if (!process.env.EMAIL_USER) {
    console.log(`\n[DEV] Email to ${to}: ${devLink}\n`);
    return;
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
};

export default sendEmail;