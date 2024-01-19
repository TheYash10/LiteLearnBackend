const nodemailer = require('nodemailer');

const mailService = (id, resetPasswordToken, toEmail) => {

	return new Promise((resolve, reject) => {
		try {
			let mailTransporter =
				nodemailer.createTransport(
					{
						service: 'gmail',
						auth: {
							user: 'litelearnofficial@gmail.com',
							pass: 'fdla jkvk rcey ncuu'
						}
					}
				);

			let mailDetails = {
				from: 'litelearnofficial@gmail.com',
				to: toEmail,
				subject: 'Reset Your Password',
				text: `http://localhost:5173/reset-password/${id}/${resetPasswordToken}`
			};

			mailTransporter
				.sendMail(mailDetails,
					function (err, data) {
						if (err) {
							reject(err);
						} else {
							resolve(data);
						}
					});

		} catch (error) {
			console.log(err);
		}
	}).then((response) => {
		return response;
	}).catch(err => console.log(err));
}


module.exports = mailService
