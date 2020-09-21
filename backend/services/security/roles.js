const { ServerError } = require('../utils/errors.js');

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        console.log(roles);
        console.log(req.state.decoded);
        for (let i = 0; i < roles.length; i++) {
            if (req.state.decoded.userRole === roles[i]) { // request.state contains the value sent by the previous middleware
                    return next();
            }
        }
        throw new ServerError('You are not authorized to access the resource!', 401);
    }
};

module.exports = {
    authorizeRoles
}