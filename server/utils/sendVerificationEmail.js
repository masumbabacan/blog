const sendEmail = require("./sendEmail");


const sendVerificationEmail = async ({name,email,verificationToken,origin}) => {

    const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`

    const message = `<p> Lütfen E-postanızı doğrulayabilmemiz için linki takip edin : <a href="${verifyEmail}">E-postayı Doğrula!</a> </p>`

    return sendEmail({
        to:email,
        subject : 'E-posta onayı',
        html : `<h4>Merhaba, ${name} </h4>
        ${message}
        `,
    })
}

module.exports = sendVerificationEmail;