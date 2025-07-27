import nodemailer from 'nodemailer';

const sendEmail = async (to: string, subject: string, text: string) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"notes-app" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email could not be sent');
    }
};

export default sendEmail;