const express = require('express')
const { getConnection } = require('../database/db')
const { encryptPassword, matchPassword } = require('../helpers/validatorPass')
const userRoutes = express.Router()

userRoutes.post('/signUp', async (req, res) => {
  try {
    let { username, email, password } = req.body;
    if(!username || username === ''){
      res.status(409).json({'error': 'Please provide a username'})
    }else if(!email || email === ''){
      res.status(409).json({'error': 'Please provide a email'})
    }else if(!password || password === ''){
      res.status(409).json({'error': 'Please provide a password'})
    }else{
      const connection = await getConnection();
      const passwordEncrypted = await encryptPassword(password)
      
      let sqlSelectEmail = 'SELECT * FROM USERS WHERE email = ?'
      connection.query(sqlSelectEmail, [email], function(err, result, _fields){
        if(err){
          res.status(500).json(err)
        }
        if(result.length > 0){
          res.status(303).json({'message': 'This email is already in use'})
        }
        else{
          let sqlSelect = 'SELECT * FROM USERS WHERE username = ?'
          connection.query(sqlSelect, [username], function(err, result, _fields){
            if(err){
              res.status(500).json(err)
            }
            if(result.length > 0){
              res.status(303).json({'message': 'This username is already in use'})
            }
            else{
              let sql = 'INSERT INTO USERS (username, email, password) VALUES (?, ?, ?)'
              connection.query(sql, [username, email, passwordEncrypted],
                function(error, _results, _fields) {
                  if(error){
                    res.status(500).json(error)
                  }
                  res.status(200).json({'message': 'inserted successfully'})
                }
              )
            }
          })
        }
      })
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

userRoutes.post('/signIn', async (req, res) => {
  try {
    const {email, username, password} = req.body
    if(!password || password === ''){
      res.status(409).json({'error': 'Please provide a password'})
    }
    else if(email && password){      
      if (email === '' || password === '') {
        res.status(409).json({'error': 'Please provide a email'})
      }else {
        const connection = await getConnection();
        let sql = 'SELECT * FROM USERS WHERE email = ?'
        connection.query(sql, [email], 
          async function(err, result, _fields){
            if (err) {
              res.status(500).json(err)
            }
            if (result.length > 0) {
              if(!await matchPassword(password, result[0].password)){
                res.status(401).json({'message': "Invalid Credentials, passwords don't match "});
              }
              else {
                req.session.user = result[0].id
                res.status(200).json({'message': 'login successfully'})
              }
            }else{
              res.status(401).json({'message': 'This email not exists'})
            }
          }
        )
      }
    }
    else if(username && password){
      if (username === '' || password === '') {
        res.status(409).json({'error': 'Please provide a username'})
      }else {
        const connection = await getConnection();
        let sqlUsername = 'SELECT * FROM USERS WHERE username = ?'
        connection.query(sqlUsername, [username], 
          async function(err, result, fields){
            if (err) {
              res.status(500).json(err)
            }
            if (result.length > 0) {
              if(!await matchPassword(password, result[0].password)){
                res.status(401).json({'message': "Invalid Credentials, passwords don't match "});
              }
              else {
                req.session.user = result[0].id
                res.status(200).json({'message': 'login successfully'})
              }
            }else{
              res.status(401).json({'message': 'This username not exists'})
            }
          }
        )
      }
    }
    else{
      res.status(409).json({'error': 'Please provide a email or username'})
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

userRoutes.post('/logOut', (req, res) => {
  req.session.destroy()
  res.json({'message': 'loggedOut'})
})

userRoutes.get('/profile', (req, res) => {
  if(req.session.user){
    res.json(req.session)
  }else{
    res.status(401).json({ 'message': 'you must logIn first'})
  }
})

module.exports = userRoutes
