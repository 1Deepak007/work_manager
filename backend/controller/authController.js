const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");
const verifyToken = require('../middleware/authMiddleware')

exports.signup = async (req,res) => {
    console.log('signup function called')
    try{
        const {name, email, password, contact} = req.body;

        if(!name || !email || !password ){
            return res.status(400).json({message: "All fields are required"});
        }

        // validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(email).toLowerCase())) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await prisma.user.findUnique({where: {email}});

        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        

        const newUser = await prisma.user.create({
            data: {
                name, email, password: hashedPassword, contact: contact||null,
            },
        });

        const token = jwt.sign(
            {id: newUser.id, email: newUser.email}, 
            process.env.JWT_SECRET, 
            {expiresIn: "2h"}
        );

        res.status(201).json({
            message: "Signup successful",
            accessToken: token,
            user: { id: newUser.id, name: newUser.name, email: newUser.email, contact: newUser.contact }
        })
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.status(200).json({
            message: "Login successful",
            accessToken: token,
            user: { id: user.id, name: user.name, email: user.email, contact: user.contact }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.logout = (req, res) => {
    verifyToken(req, res, () => {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    });
};
