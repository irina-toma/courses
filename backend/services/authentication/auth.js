const express = require('express');
const router = express.Router();
const pool = require('../../config/db.js');
const utils = require('../utils/utils.js');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { generateToken } = require('../security/jwt');

const saltRounds = 10;

router.post('/register', (req, resp) => {
    const params = req.body;
    if (params.hasOwnProperty('name') && params.hasOwnProperty('email') &&
        params.hasOwnProperty('username') && params.hasOwnProperty('password')) {
        
        const name = params.username;
        const email = params.email;
        const username = params.username;
        const password = params.password;

        // validate email and username
        const checkCredentialsStm = {
            text: 'SELECT * FROM public.users WHERE username=$1 OR email=$2',
            values: [username, email]
        }

        pool.query(checkCredentialsStm, (queryError, queryResp) => {
            if (queryError) {
                resp.status(403).send(utils.GENERAL_ERR);
                return;
            } 
            if (queryResp.rows.length > 0) {
                resp.status(403).send(utils.USER_EXISTS);
                return;
            }

            //email and username do not exist, proceed with adding the user in the db

            //crypt password
            bcrypt.hash(password, saltRounds, (cryptErr, cryptResp) => {            
                
                //add user
                const insertUserStm = {
                    text: 'INSERT INTO users(name, email, password, active, activation_token, username) VALUES($1, $2, $3, $4, $5, $6)',
                    values: [name, email, cryptResp, true, uuidv4(), username]
                }

                pool.query(insertUserStm, (queryErr, queryResp) => {
                    if (queryErr) {
                        resp.status(403).send(utils.GENERAL_ERR);
                        return;
                    } else {
                        resp.send(REGISTER_OK)
                    }  
                })
            });
        })
    } else {
        resp.status(403).send(utils.MISSING_PARAMS);
    }
})

router.post('/login', (req, resp) => {
    const params = req.body;

    if (params.hasOwnProperty('username') && params.hasOwnProperty('password')) {
        const username = params.username;
        const password = params.password;

        //validate parameters
        //1. username should be text
        //2. username should not contain special characters
        //3. username.length between x and y

        const checkUserStm = {
            text: 'SELECT * FROM public.users WHERE username=$1',
            values: [username]
        }
        pool.query(checkUserStm, (queryErr, queryResp) => {
            if (queryErr) {
                resp.status(403).send(utils.GENERAL_ERR);
                return;
            }
            if (queryResp.rows.length == 0) {
                resp.status(404).send(utils.USER_NOT_EXISTS);
                return;
            }

            const currentUser = queryResp.rows[0];

            bcrypt.compare(password, currentUser.password, async (cryptErr, cryptResp) => {
                if (cryptResp) {
                    //success
                    // delete currentUser.password
                    // resp.send(utils.success(currentUser));
                    let token = await generateToken({
                        userId: currentUser.id,
                        userRole: 'student' //user.role
                    })
                    resp.send(utils.success(token));
                } else {
                    resp.status(403).send(utils.WRONG_PASSWD);
                }
            })
        });
    } else {
        resp.status(403).send(utils.MISSING_PARAMS);
    }
})


module.exports = router;