const express = require('express')
const { getConnection } = require('../database/db')
const categoryRoutes = express.Router()

categoryRoutes.get('/categories', async (req, res) => {
  try {
    const connection = await getConnection()
    connection.query('SELECT * FROM CATEGORIES', function(err, result, _fields){
      if(err){
        res.status(500).json(err)
      }
      if(result.length > 0){
        res.status(200).json(result)
      }else{
        res.status(503).json({'message': 'Not data saved yet'})
      }
    })
  } catch (error) {
    res.status(500).json(error)
  }
})

categoryRoutes.post('/category', async (req, res) => {
  if(req.session.user){
    try {
      const { name } = req.body
      if(!name || name === ''){
        res.status(409).json({'error': 'Please provide a category Name'})
      }else{
        const connection = await getConnection() 
        connection.query(`INSERT INTO CATEGORIES (NAME) VALUES ('${name}')`, function(err, result, _fields){
          if(err){
            res.status(500).json(err)
          }
          else{
            res.status(200).json({categorySaved: result.insertId})
          }
        })
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }else{
    res.status(401).json({ 'message': 'you must logIn first'})
  }
})

module.exports = categoryRoutes
