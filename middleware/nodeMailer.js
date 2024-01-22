const nodemailer = require("nodemailer");

const mailService = (id, userName, resetPasswordToken, toEmail) => {
  return new Promise((resolve, reject) => {
    try {
      let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "litelearnofficial@gmail.com",
          pass: "fdla jkvk rcey ncuu",
        },
      });

      // http://localhost:5173/reset-password/${id}/${resetPasswordToken}

      let mailDetails = {
        from: "litelearnofficial@gmail.com",
        to: toEmail,
        subject: "Reset Your Password - LiteLearn",
        text: `Dear ${userName},
        
        We hope this message finds you well. It seems like you've requested a password reset for your account with LiteLearn. Don't worry, we've got you covered!
        
        To reset your password, please click on the following link:
        
        http://localhost:5173/reset-password/${id}/${resetPasswordToken}
        
        Please note that this link is valid for the next 5 minutes. If you didn't request this password reset or if you have any concerns about the security of your account, please contact our support team immediately at litelearnofficial@gmail.com or call us at 9512888760.
        
        For your security, please do not share this email with anyone. We take the protection of your account seriously and appreciate your cooperation.
        
        Thank you for choosing LiteLearn. We're here to help you with any questions or concerns you may have.
        
        Best regards,
        
        LiteLearn Support Team
        litelearnofficial@gmail.com
        9512888760`,
      };

      mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    } catch (error) {
      console.log(err);
    }
  })
    .then((response) => {
      return response;
    })
    .catch((err) => console.log(err));
};

module.exports = mailService;
