const express = require('express')
const { getConnection } = require('../database/db')
const categoryRoutes = express.Router()

categoryRoutes.get('/categories', async (_req, res) => {
  try {
    const connection = await getConnection()
    let sql = 'SELECT * FROM CATEGORIES'
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

categoryRoutes.get('/category', async (req, res) => {
  try {
    const {id} = req.query
    if(id){
      res.status(409).json({'error': 'Please provide an id'})
    }
    else{
      const sql = `SELECT * FROM CATEGORIES WHERE id = ?`
      const connection = await getConnection()
      connection.query(sql, [id], function(error, result, _fields){
        if(error){
          res.status(500).json(error)
        }
        else if(result.length > 0){
          res.status(200).json({"data": result[0]})
        }
        else{
          res.status(401).json({'message': 'This category not exists'})
        }
      })
    }
    
  } catch (error) {
    res.status(500).json(error)
  }
})

categoryRoutes.delete('/category', async (req, res) => {
  try {
    if(req.session.user){
      const {id} = req.query
      if(!id){
        res.status(409).json({'error': 'Please provide an id'})
      }
      else{
        const sql = `DELETE FROM CATEGORIES WHERE id = ?`
        const connection = await getConnection()
        connection.query(sql, [id], function(error, result, _fields){
          if(error){
            res.status(500).json(error)
          }
          else if(result.affectedRows > 0){
            res.status(200).json({'affectedRows': result.affectedRows})
          }else{
            res.status(401).json({'message': 'This category not exists'})
          }
        }) 
      }
    }
    else{
      res.status(401).json({ 'message': 'you must logIn first'})
    }
  } catch (error) {
    res.status(500).json(error)
  }
})


categoryRoutes.put('/category', async(req, res) => {
  if(req.session.user){
    try {
      const {name, id} = req.body
      if(!name || !id || name === '' || id === null){
        res.status(409).json({'error': 'Please provide a name and id'})
      }
      else{
        const sql = 'UPDATE CATEGORIES SET NAME = ? WHERE ID = ?'
        const connection = await getConnection()
        connection.query(sql, [name, id], function(error, result, _fields){
          if(error){
            res.status(500).json(error)
          }
          else if(result.affectedRows > 0){
            res.status(200).json({'affectedRows': result.affectedRows})
          }else{
            res.status(401).json({'message': 'This category not exists'})
          }
        })
      } 
    } catch (error) {
      res.status(500).json(error)
    }
  }
  else{
    res.status(401).json({ 'message': 'you must logIn first'})
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
        let sql = 'INSERT INTO CATEGORIES (NAME) VALUES (?)'
        connection.query(sql, [name], function(err, result, _fields){
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
