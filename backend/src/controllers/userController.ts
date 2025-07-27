import { Request, Response } from 'express';
import { User } from '../models/User';
import otpGenerator from 'otp-generator';
import sendEmail from '../services/mailer';

export const registerUser = async (req: Request, res: Response) => {
    const { name, email, dob } = req.body;

    if (!name || !email || !dob) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User with this email already exists' });
    }

    const otp = otpGenerator.generate(6, { 
        upperCaseAlphabets: false, 
        lowerCaseAlphabets: false, 
        specialChars: false 
    });

    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

    const user = new User({
        name,
        email,
        dob,
        otp,
        otpExpires,
    });

    try {
        await user.save();
        await sendEmail(email, 'Your Verification Code', `Your verification code is: ${otp}`);
        
        res.status(201).json({
            message: 'Registration successful. Please check your email for the OTP.',
            userId: user._id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};