const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10); // Standard salt rounds
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

const comparePassword = async (inputPassword, storedHash) => {
    return await bcrypt.compare(inputPassword, storedHash);
};

module.exports = { hashPassword, comparePassword };
// const password = 'Password123!'; // The password you want to hash
/* const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);
console.log('New bcrypt Hash:', hash); */

