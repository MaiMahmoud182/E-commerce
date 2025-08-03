const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = (email, token) => {
  const url = `http://localhost:5000/api/auth/verify-email?token=${token}`;

  return transport.sendMail({
    from: '"E-Shop" <no-reply@eshop.com>',
    to: email,
    subject: "Verify Your Email",
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`
  });
};

module.exports = { sendVerificationEmail };
