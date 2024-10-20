const bcrypt = require("bcrypt");

function encryptPassword(password) {
    return bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));
}

module.exports = {
    encryptPassword,
}