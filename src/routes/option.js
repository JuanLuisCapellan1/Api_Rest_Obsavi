const express = require('express')
const { getConnection } = require('../database/db')
const optionRoutes = express.Router()

optionRoutes.get('/options', async (_req, res) => {
  try {
    const connection = await getConnection()
    let sql = 'SELECT * FROM OPTIONS'
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

optionRoutes.get('/option', async (req, res) => {
  try {
    const {id} = req.query
    if(!id){
      res.status(409).json({'error': 'Please provide a categoryId'})
    }
    else{
      const sql = `SELECT * FROM OPTIONS WHERE id = ?`
      const connection = await getConnection()
      connection.query(sql, [id], function(error, result, _fields){
        if(error){
          res.status(500).json(error)
        }
        else if(result.length > 0){
          res.status(200).json({"data": result[0]})
        }
        else{
          res.status(401).json({'message': 'This option not exists'})
        }
      }) 
    }
  } catch (error) {
    res.status(500).json(error)
  }
})


optionRoutes.get('/optionByCategory', async (req, res) => {
  try {
    const {categoryId} = req.query
    if(!categoryId || categoryId === null){
      res.status(409).json({'error': 'Please provide a categoryId'})
    }
    else{
      const sql = `SELECT * FROM OPTIONS WHERE category_id = ?`
      const connection = await getConnection()
      connection.query(sql, [categoryId], function(error, result, _fields){
        if(error){
          res.status(500).json(error)
        }
        else if(result.length > 0){
          res.status(200).json({"data": result})
        }
        else{
          res.status(401).json({'message': 'This option not exists'})
        }
      }) 
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

optionRoutes.get('/optionSelectedByCategoryId', async (req, res) => {
  try {
    const {categoryId} = req.query
    if(!categoryId || categoryId === null){
      res.status(409).json({'error': 'Please provide a categoryId'})
    }
    else{
      const sql = `SELECT * FROM OPTIONS WHERE category_id = ? AND SELECTED = 1`
      const connection = await getConnection()
      connection.query(sql, [categoryId], function(error, result, _fields){
        if(error){
          res.status(500).json(error)
        }
        else if(result.length > 0){
          res.status(200).json({"data": result})
        }
        else{
          res.status(401).json({'message': 'This option not exists'})
        }
      }) 
    }
  } catch (error) {
    res.status(500).json(error)
  }
})



optionRoutes.post('/option', async (req, res) => {
  if(req.session.user){
    try {
      const { name, categoryId } = req.body
      if(!name || name === '' || !categoryId || categoryId === null){
        res.status(409).json({'error': 'Please provide a option Name and categoryId'})
      }else{
        const connection = await getConnection() 
        let sqlVerify = 'SELECT * FROM OPTIONS WHERE NAME = ?'
        connection.query(sqlVerify, [name], function(err, result, _fields) {
          if(err) {
            res.status(500).json(err)
          }
          else if(result.length > 0) {
            res.status(303).json({'message': 'This option already exists'})
          }
          else{
            let sql = 'INSERT INTO OPTIONS (NAME, CATEGORY_ID) VALUES (?, ?)'
            connection.query(sql, [name, categoryId], function(err, result, _fields){
              if(err){
                res.status(500).json(err)
              }
              else{
                res.status(200).json({optionSaved: result.insertId})
              }
            })
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

optionRoutes.delete('/option', async (req, res) => {
  try {
    if(req.session.user){
      const {id} = req.query
      if(!id){
        res.status(409).json({'error': 'Please provide an id'})
      }
      else{
        const sql = `DELETE FROM OPTIONS WHERE id = ?`
        const connection = await getConnection()
        connection.query(sql, [id], function(error, result, _fields){
          if(error){
            res.status(500).json(error)
          }
          else if(result.affectedRows > 0){
            res.status(200).json({'affectedRows': result.affectedRows})
          }else{
            res.status(401).json({'message': 'This option not exists'})
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

optionRoutes.put('/option', async (req, res) => {
  if(req.session.user){
    try {
      const {name, id} = req.body
      if(!name || !id || name === '' || id === null){
        res.status(409).json({'error': 'Please provide a name and id'})
      }
      else{
        const sql = 'UPDATE OPTIONS SET NAME = ? WHERE ID = ?'
        const connection = await getConnection()
        connection.query(sql, [name, id], function(error, result, _fields){
          if(error){
            res.status(500).json(error)
          }
          else if(result.affectedRows > 0){
            res.status(200).json({'affectedRows': result.affectedRows})
          }else{
            res.status(401).json({'message': 'This option not exists'})
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


module.exports = optionRoutes
