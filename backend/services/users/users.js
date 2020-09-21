const express = require('express');
const router = express.Router();
const pool = require('../../config/db.js');
const utils = require('../utils/utils.js');
const { authorizeAndExtractToken } = require('../security/jwt.js');
const { authorizeRoles } = require('../security/roles.js');

//get user information
router.get('/', authorizeAndExtractToken, authorizeRoles('admin'), (req, resp, next) => {
    //by username
    // localhost:4000/users?username=irina
    if (req.query.hasOwnProperty('username')) {
        const username = req.query.username;
        let selectStm = {
            text: 'SELECT * from public.users WHERE username=$1',
            values: [username]
        }
        pool.query(selectStm, (queryErr, queryResp) => {
            if (queryErr) {
                resp.status(403).send(utils.GENERAL_ERR);
                return;
            } 
            if (queryResp.rows.length == 0) {
                resp.status(403).send(utils.USER_NOT_EXISTS);
                return;
            } 
            const user = queryResp.rows[0];
            delete user.password
            return resp.send(utils.success(user));
        })
    }
    else {
        //all users
        let statement = 'SELECT * from public.users';
        pool.query(statement, (queryErr, queryResp) => {
            if (queryErr) {
                queryResp.status(404).send(utils.ERR_GET_USERS);
                return;
            } 

            //remove sensitive information from query, such as password
            let users = queryResp.rows.map((current) => {delete current.password; return current;})
            resp.send(utils.success(users));
        });
    }
});

router.get('/my-account', authorizeAndExtractToken, authorizeRoles('student', 'admin'), async (req, resp, next) => {
    let token = req.state.decoded;
    let userId = token.userId;

    let selectStm = {
        text: 'SELECT * from public.users WHERE id=$1',
        values: [userId]
    }

    pool.query(selectStm, (queryErr, queryResp) => {
        if (queryErr) {
            resp.status(403).send(utils.GENERAL_ERR);
            return;
        } 
        if (queryResp.rows.length == 0) {
            resp.status(403).send(utils.USER_NOT_EXISTS);
            return;
        } 
        const user = queryResp.rows[0];
        delete user.password
        return resp.send(utils.success(user));
    })
})

//get user by id
//localhost:4000/users/1
router.get('/:id', authorizeAndExtractToken, authorizeRoles('admin'), (req, resp, next) => {
    const id = parseInt(req.params.id);
    let selectStm = {
        text: 'SELECT * from public.users WHERE id=$1',
        values: [id]
    }
    pool.query(selectStm, (queryErr, queryResp) => {
        if (queryErr) {
            resp.status(403).send(utils.GENERAL_ERR);
            return;
        } 
        if (queryResp.rows.length == 0) {
            resp.status(403).send(utils.USER_NOT_EXISTS);
            return;
        } 
        const user = queryResp.rows[0];
        delete user.password
        return resp.send(utils.success(user));
    })
});

//update user information
router.put('/:id', authorizeAndExtractToken, authorizeRoles('admin'), (req, resp, next) => {
    //can update only name and password
    const id = parseInt(req.params.id);
    const updateText = 'UPDATE users SET';
    const values = [];

    if (req.body.hasOwnProperty('name')) {
        updateText += ` name=${req.body.name}`;
        values.push(req.body.name);
    }
    if (req.body.hasOwnProperty('password')) {
        updateText += ` password=${req.body.password}`;
        values.push(req.body.password);
    }

    if (values.length > 0) {
        //have information to update
        updateText += ` WHERE id=${id}`;
        const updateUserStm = {
            text: updateText,
            values: values
        }

        pool.query(updateUserStm, (queryErr, queryResp) => {
            if (queryErr) {
                resp.status(403).send(utils.GENERAL_ERR);
                return;
            } 
            return resp.send(utils.UPDATE_OK);
        })
    } else {
        return resp.status(403).send(utils.WRONG_PARAMS);
    }
});

router.delete('/:id', authorizeAndExtractToken, authorizeRoles('admin'), (req, resp, next) => {
    const id = parseInt(req.params.id);

    const deleteUserStm = {
        text: 'DELETE FROM public.users WHERE id=$1',
        values: [id]
    }
    pool.query(deleteUserStm, (queryErr, queryResp) => {
        if (queryErr) {
            resp.status(403).send(utils.GENERAL_ERR);
            return;
        } 
        return resp.send(utils.DELETE_OK);
    })

});

module.exports = router;