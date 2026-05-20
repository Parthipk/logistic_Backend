const bcrypt = require("bcrypt");

exports.comparePassword = (enteredPassword, savedPassword) => {
    return bcrypt.compare(enteredPassword, savedPassword)
}