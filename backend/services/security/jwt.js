const jwt = require('jsonwebtoken');
const { ServerError } = require('../utils/errors.js');

const options = {
    issuer: process.env.JWT_ISSUER,
    subject: process.env.JWT_SUBJECT,
    audience: process.env.JWT_AUDIENCE
};

const generateToken = async (payload) => {
    try {
        const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, options);
        return token;
    } catch (err) {
        throw new ServerError("Error encoding token!", 500);
    }
};

const verifyAndDecodeData = async (token) => {
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY, options);
        return decoded;
    } catch (err) {
        throw new ServerError("Error decoding token!", 500);
    }
};

const authorizeAndExtractToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw new ServerError('Missing authorization header!', 403);
        }
        const token = req.headers.authorization.split(" ")[1]; 

        const decoded = await verifyAndDecodeData(token);

        // set decoded token in state
        req.state = {
            decoded
        };

        next();
    } catch (err) {
        next(err);
    }
};




module.exports = {
    generateToken,
    authorizeAndExtractToken
};