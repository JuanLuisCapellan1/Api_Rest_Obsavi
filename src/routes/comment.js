const express = require('express')
const { getConnection } = require('../database/db')
const commentRoutes = express.Router()

commentRoutes.get('/comment', async (req, res) => {
  try {
    const connection = await getConnection()
    let sql = 'SELECT * FROM COMMENTS'
    connection.query(sql, function(err, result, _fields){
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


commentRoutes.get('/commentById', async (req, res) => {
  try {
    const{id} = req.query
    if(!id || id === ''){
      res.status(409).json({'error': 'Please provide an id'})
    }
    else{
      const connection = await getConnection()
      let sql = 'SELECT * FROM COMMENTS WHERE ID = ?'
      connection.query(sql, [id], function(err, result, _fields){
        if(err){
          res.status(500).json(err)
        }
        if(result.length > 0){
          res.status(200).json(result)
        }else{
          res.status(503).json({'message': 'This comment not exists'})
        }
      })
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

commentRoutes.post('/comment', async (req, res) => {
  try {
    const { author, message } = req.body
    if(!author || author === '' || !message || message === ''){
      res.status(409).json({'error': 'Please provide an author and message'})
    }else{
      const connection = await getConnection() 
      let sql = 'INSERT INTO COMMENTS (MESSAGE, AUTHOR) VALUES (?, ?)'
      connection.query(sql, [message, author], function(err, result, _fields){
        if(err){
          res.status(500).json(err)
        }
        else{
          res.status(200).json({commentSaved: result.insertId})
        }
      })
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

commentRoutes.post('/comment/image', async (req, res) => {
  try {
    const { author, message, image } = req.body
    if(!author || author === '' || !message || message === '' || !image || image === ''){
      res.status(409).json({'error': 'Please provide an author and message and image'})
    }else{
      const connection = await getConnection() 
      let sql = 'INSERT INTO COMMENTS (MESSAGE, AUTHOR, IMAGE) VALUES (?, ?, ?)'
      connection.query(sql, [message, author, image], function(err, result, _fields){
        if(err){
          res.status(500).json(err)
        }
        else{
          res.status(200).json({commentSaved: result.insertId})
        }
      })
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = commentRoutes
