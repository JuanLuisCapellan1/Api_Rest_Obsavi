const express = require('express')
const { getConnection } = require('../database/db')
const categoryRoutes = express.Router()

categoryRoutes.get('/category/all', async (_req, res) => {
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
        res.status(200).json({data: []})
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
    const {id} = req.query
    if(!id){
      res.status(409).json({'error': 'Please provide an id'})
    }
    else{
      const connection = await getConnection()
      const sqlSuggestions = 'DELETE FROM SUGGESTIONS WHERE category_id = ?'
      connection.query(sqlSuggestions, [id], function(errSuggestions, resultSuggestions, _fieldsSuggestions){
        if(errSuggestions){
          res.status(500).json(errSuggestions)
        }
        const sqlOptions = 'DELETE FROM OPTIONS WHERE category_id = ?'
        connection.query(sqlOptions, [id], function(errOptions, resOption, _fieldsOption){
          if(errOptions){
            res.status(500).json(errOptions)
          }
          else if(resOption.affectedRows > 0){
            const sqlCategory = 'DELETE FROM CATEGORIES WHERE id = ?'
            connection.query(sqlCategory, [id], function(error, result, _fields){
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
          else{
            res.status(401).json({'message': 'This option not exists'})
          }
        })
      })
    }
  } catch (error) {
    res.status(500).json(error)
  }
})


categoryRoutes.put('/category', async(req, res) => {
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
})

categoryRoutes.post('/category', async (req, res) => {
  try {
    const { name } = req.body
    if(!name || name === ''){
      res.status(409).json({'error': 'Please provide a category Name'})
    }else{
      const connection = await getConnection() 
      const sqlVerify ='SELECT * FROM CATEGORIES WHERE NAME = ?'
      connection.query(sqlVerify, [name], function(err, result, _fields){
        if(err){
          res.status(500).json(err)
        }
        else if(result.length > 0) {
          res.status(303).json({'message': 'This category already exists'})
        }
        else{
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
      })
    } 
  }catch (error) {
    res.status(500).json(error)
  }
})

module.exports = categoryRoutes
