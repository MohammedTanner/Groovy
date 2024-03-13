const User = require("../model/User")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const jwtSecret = "0d70c93345480686f6a693904dc7b1b89cf4592b19fc74040a9b8dfea131cf87b158fd"

exports.register = async (req, res, next) => {
    const { username, password } = req.body
    if (password.length < 6) {
        return res.status(400).json({ message: "Password less than 6 characters" })
    }
    try {
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hash }).then((user) => {
            const maxAge = 3 * 60 * 60;
            const token = jwt.sign(
                { id: user._id, username, role: user.role },
                jwtSecret,
                { expiresIn: maxAge, }
            )
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000,
            });
        });
        res.status(201).json({ message: "User successfully created", user });
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
        const user = await User.findOne({ username })
        if (!user) {
            res.status(400).json({
                message: "Login not successful",
                error: "User not found",
            })
        } else {
            // compare given password with hashed password
            bcrypt.compare(password, user.password).then(function (result) {
                if (result) {
                    const maxAge = 3 * 60 * 60;
                    const token = jwt.sign(
                        { id: user._id, username, role: user.role },
                        jwtSecret,
                        {
                            expiresIn: maxAge,
                        }
                    );
                    res.cookie("jwt", token, {
                        httpOnly: true,
                        maxAge: maxAge * 1000, 
                    });
                    res.status(201).json({ message: "Login successful", user: user._id, })
                } else {
                    res.status(400).json({ message: "Login not successful" });
                }
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
        if (id) {
            // Second - Verifying if the value of role is admin
            const user = await User.findById(id);

            // Third - Verifies the user is not an admin
                if (user.role === "basic") {
                    user.role = "admin";
                    await user.save();
                    res.status(201).json({ message: "Update successful", user });
                } else {
                    user.role = "basic";
                    await user.save();
                    res.status(201).json({ message: "Update successful", user });
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

exports.getUsers = async (req, res, next) => {
    await User.find({})
    .then(users => {
        const userFunction = users.map(user => {
            const container = {}
            container.username = user.username
            container.role = user.role
            container.id = user.id
            return container
        })
        res.status(200).json({ user: userFunction })
    })
    .catch(err =>
        res.status(401).json({ message: "Not successful", error: err.message })
        )
}