const nodemailer = require("nodemailer");
const { emailTemplate } = require("./email-template");

exports.sendEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    host: "srv136.niagahoster.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailList = "manajemen@deltawibawabersama.com";

  mailOptions = {
    from: "Support DWB <support@deltawibawabersama.com>",
    to: mailList,
    subject: `[DWB] - COMPLAIN ${data.id}`,
    html: emailTemplate.complainEmailTemplate(data),
    // html: '<b>data</b>'
  };

  await transporter.sendMail(mailOptions);
};
