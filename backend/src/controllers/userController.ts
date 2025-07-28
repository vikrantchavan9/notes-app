import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import otpGenerator from 'otp-generator';
import sendEmail from '../services/mailer';
import generateToken from '../utils/generateToken';

export const registerUser = async (req: Request, res: Response) => {
    const { name, email, dob } = req.body;
    
    if (!name || !email || !dob) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // console.log("STEP 2: "+ name +" : "+ dob +" : "+ email)

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

    // console.log("STEP 3: ", otp , otpExpires)

    const user = new User({
        name,
        email,
        dob,
        otp,
        otpExpires,
    });

    // console.log("STEP 4: ", user)

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

    const user = await User.findOne<IUser>({ email, otp, otpExpires: { $gt: new Date() } });

    if (!user) {
        return res.status(400).json({ message: 'Invalid OTP or OTP has expired' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user),
    });
};

export const loginUser = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne<IUser>({ email });

    if (!user) {
        return res.status(404).json({ message: 'User with this email not found.' });
    }

    // Generate a new OTP for login
    const otp = otpGenerator.generate(6, { 
        upperCaseAlphabets: false, 
        lowerCaseAlphabets: false, 
        specialChars: false 
    });
    
    // Set the new OTP and its expiration on the user's record
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes
    
    try {
        await user.save();
        await sendEmail(email, 'Your Login Code', `Your login verification code is: ${otp}`);

        res.status(200).json({
            message: 'OTP has been sent to your email for verification.',
            userId: user._id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while sending OTP.' });
    }
};