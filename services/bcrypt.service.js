const bcrypt = require('bcrypt')

const hashRounds = parseInt(process.env.HASH_ROUNDS) || 10;

const generateHash = async (value) => {
    const salt = await bcrypt.genSalt(hashRounds)
    const hashedValue = await bcrypt.hash(value, salt)
    return hashedValue;
}

const compareHash = async (plainText, hashValue) => {
    return await bcrypt.compare(plainText, hashValue);
}


module.exports = { generateHash, compareHash }