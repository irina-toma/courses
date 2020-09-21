jsonPayload = (msg, success=true) => {
    return {message: msg, success}
}

success = (params, msg='OK') => {
    return {message: msg, success: true, data: params}
}

MISSING_PARAMS = jsonPayload('Missing parameters!', false);
USER_EXISTS = jsonPayload('Please select a different username or email!', false);
GENERAL_ERR = jsonPayload('Error processing request.', false);
REGISTER_OK = jsonPayload('Successful registration.');
USER_NOT_EXISTS = jsonPayload('Username does not exist.', false);
LOGIN_OK = jsonPayload('Successful login.');
WRONG_PASSWD = jsonPayload('Wrong password.', false);
ERR_GET_USERS = jsonPayload('Error loading users', false);
UPDATE_OK = jsonPayload('Successful update.');
WRONG_PARAMS = jsonPayload('Wrong parameters.', false);
DELETE_OK = jsonPayload('Successful delete.');

module.exports = {
    success, MISSING_PARAMS, USER_EXISTS, GENERAL_ERR, REGISTER_OK,
    USER_NOT_EXISTS, LOGIN_OK, WRONG_PASSWD, ERR_GET_USERS, UPDATE_OK, 
    WRONG_PARAMS, DELETE_OK
};