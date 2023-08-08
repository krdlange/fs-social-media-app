import bcrypt from "bcrypt"; //for encrypting passwords
import jwt from "jsonwebtoken"; //for sending a user a web token that they can use for authorization
import User from "../models/User.js";

// to register user
// we use async to make a call to mongo db similar to calling apis
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body; //destructuring parameters from the request body - a requirement for front end is to send an object back with these parameters

    const salt = await bcrypt.genSalt(); //random value or data that is combined with the password before hashing
    const passwordHash = await bcrypt.hash(password, salt); //function that hashes the password and salt. result is a secure hash that can be stored in a database or used for authentication. When a user attempts to log in, the entered password will be hashed using the same salt and compared to the stored hash in the database. If they match, the password is considered valid, and access is granted.

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends, 
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000)
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser); //201 code means something is created and we are going to turn savedUser into a json object so the frontend can receive this response
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// to log in user

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //use mongoose to find the user with the specified email
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist. "
        })

        //check if password is a match by comparing the password that was just sent against the password that was just saved in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. "});
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        //delete user password so it doesnt get sent back to front end
        delete user.password;
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
} 