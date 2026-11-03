import nodemailer from "nodemailer";

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: false, 
  auth: {
    user: "sandboxteam75@gmail.com",
    pass: "oluqogwunrqbzzaf",
  },
});

// Send an email using async/await
export async function sendMail(to,subject,text,html) {
  const info = await transporter.sendMail({
    from: 'sandboxteam75@gmail.com',
    to,
    subject,
    text,
    html
  });
  return info;
};