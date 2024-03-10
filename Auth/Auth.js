const User = require("../model/User")
const bcrypt = require("bcryptjs")

exports.register = async (req, res, next) => {
    const { username, password } = req.body
    if (password.length < 6) {
        return res.status(400).json({ message: "Password less than 6 characters" })
    }
    try {
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hash });
        res.status(200).json({ message: "User successfully created", user });
    } catch (error) {
        res.status(400).json({ message: "User not successfully created", error: error.message });
    }
    }


exports.login = async (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({
            message: "Username or Password not present",
        })
    }
    try {
        const user = await User.findOne({ username, password })
        if (!user) {
            res.status(401).json({
                message: "Login not successful",
                error: "User not found", 
            })
        } else {
            res.status(200).json({
                message: "Login successful",
                user,
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "An error occured",
            error: error.message,
        })
    }
}

exports.update = async (req, res, next) => {
    const { role, id } = req.body;

    try {
        // First - Verifying if role and id are present
        if (role && id) {
            // Second - Verifying if the value of role is admin
            if (role === "admin") {
                // Finds the user with the id
                const user = await User.findById(id);

                // Third - Verifies the user is not an admin
                if (user.role !== "admin") {
                    user.role = role;
                    await user.save();
                    res.status(201).json({ message: "Update successful", user });
                } else {
                    res.status(400).json({ message: "User is already an Admin" });
                }
            } else {
                res.status(400).json({ message: "Role is not admin" });
            }
        } else {
            res.status(400).json({ message: "Role or ID not present" });
        }
    } catch (error) {
        res.status(400).json({ message: "An error occurred", error: error.message });
    }
};


exports.deleteUser = async (req, res, next) => {
    const { id } = req.body
    await User.findById(id)
        .then(user => user.deleteOne())
        .then(user =>
            res.status(201).json({ message: "User successfuly deleted", user })
        )
        .catch(error => res.status(400).json({ message: "An error occurred", error: error.message })
        )
}