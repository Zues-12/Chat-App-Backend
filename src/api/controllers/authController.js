const User = require("../models/User");
const { generateToken } = require('../../utils/authUtils');

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email, username });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        await User.create({ username, email, password });
        return res.status(201).json({ message: "Sign up Succesfull" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        const token = generateToken(user._id);
        return res
            .cookie("token", token, {
                maxAge: 99999999,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            })
            .json({ user });

    } catch (error) {
        res.status(500).json({ message: err.message });
    }
}


exports.logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        return res.status(200).json({ message: "Successfully logged out" });

    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}