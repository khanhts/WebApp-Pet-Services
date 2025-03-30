const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 465,
    secure: false,
    auth: {
        user: "2db9aa157d1f67",
        pass: "2b03a7ff7174ff",
    },
});
module.exports = {
    sendmail: async function (to, subject, URL) {
        return await transporter.sendMail({
            from: 'NNPTDU@heheheh.com',
            to: to,
            subject: subject,
            html: `<a href=${URL}>URL</a>`, // html body
        });
    }
}