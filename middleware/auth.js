const jwt = require("jsonwebtoken")
const jwtSecret = "0d70c93345480686f6a693904dc7b1b89cf4592b19fc74040a9b8dfea131cf87b158fd"

exports.adminAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          if (decodedToken.role !== "admin") {
            return res.status(401).json({ message: "Not authorized" })
          } else {
            next()
          }
        }
      })
    } else {
      return res
        .status(401)
        .json({ message: "Not authorized, token not available" })
    }
  }

  exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          if (decodedToken.role !== "Basic") {
            return res.status(401).json({ message: "Not authorized" })
          } else {
            next()
          }
        }
      })
    } else {
      return res
        .status(401)
        .json({ message: "Not authorized, token not available" })
    }
  }