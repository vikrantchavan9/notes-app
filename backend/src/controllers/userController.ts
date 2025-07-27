import { Request, Response } from 'express';
import { User } from '../models/User';
import otpGenerator from 'otp-generator';
import sendEmail from '../services/mailer';
import generateToken from '../utils/generateToken';

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

export const verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ 
        email, 
        otp, 
        otpExpires: { $gt: new Date() } 
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid OTP or it has expired.' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        dob: user.dob,
        token: generateToken(user._id.toString()),
    });
};