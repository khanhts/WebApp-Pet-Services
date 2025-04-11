const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 25,
  secure: false,
  auth: {
    user: "4b30252124ebd0",
    pass: "cf3b0d7247df37",
  },
});
module.exports = {
  sendmail: async function (to, subject, URL) {
    return await transporter.sendMail({
      from: "NNPTDU@heheheh.com",
      to: to,
      subject: subject,
      html: `<p>Nhấn vào <a href=${URL}>đây</a> để đặt lại mật khẩu</p>`,
    });
  },
};
