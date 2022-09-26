const express = require('express')
const { getConnection } = require('../database/db')
const suggestionRoutes = express.Router()

suggestionRoutes.post('/suggestions', async (req, res) => {
  try {
    const { idDepartment, idCategory, idOption, surveys } = req.body
    if(!idDepartment || idDepartment === '' || !idCategory || idCategory === null || !idOption || idOption === null || !surveys || surveys === null){
      res.status(409).json({'error': 'Please provide a correct data'})
    }else{
      const connection = await getConnection() 
      let sql = 'INSERT INTO suggestions (category_id, option_id, surveys_id, department_id) VALUES (?, ?, ? , ?)'
      connection.query(sql, [idCategory, idOption, surveys, idDepartment], function(err, result, _fields){
        if(err){
          res.status(500).json(err)
        }
        else{
          res.status(200).json({suggestionsSaved: result.insertId})
        }
      })
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

suggestionRoutes.get('/distinctSuggestions', async (req, res) => {
  try {
    const {categoryId} = req.query
    if(!categoryId || categoryId === null){
      res.status(409).json({'error': 'Please provide a categoryId'})
    }
    else{
      const sql = `SELECT DISTINCT(UPPER(O.NAME)) AS 'OPTIONS' FROM SUGGESTIONS AS S JOIN OPTIONS AS O ON S.OPTION_ID = O.ID JOIN CATEGORIES AS C ON S.CATEGORY_ID = C.ID WHERE S.CATEGORY_ID = ?`
      const connection = await getConnection()
      connection.query(sql, [categoryId], function(error, result, _fields){
        if(error){
          res.status(500).json(error)
        }
        else if(result.length > 0){
          res.status(200).json({"data": result})
        }
        else{
          res.status(401).json({'message': 'This suggestion not exists'})
        }
      }) 
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

suggestionRoutes.get('/distinctCategoryInSuggestions', async (_req, res) => {
  try {
    const sql = `SELECT DISTINCT(UPPER(C.NAME)) AS 'CATEGORIES' FROM SUGGESTIONS AS S JOIN CATEGORIES AS C ON S.CATEGORY_ID = C.ID`
    const connection = await getConnection()
    connection.query(sql, function(error, result, _fields){
      if(error){
        res.status(500).json(error)
      }
      else if(result.length > 0){
        res.status(200).json({"data": result})
      }
      else{
        res.status(401).json({'message': 'This suggestion not exists'})
      }
    }) 
  } catch (error) {
    res.status(500).json(error)
  }
})

suggestionRoutes.get('/countOptions', async (req, res) => {
  try{
    const {name, categoryId} = req.query
    if(!categoryId || categoryId === null || !name || name === null){
      res.status(409).json({'error': 'Please provide a categoryId and name'})
    }
    else{
      const sql = `SELECT COUNT(UPPER(O.NAME)) AS 'OPTIONS' FROM SUGGESTIONS AS S JOIN OPTIONS AS O ON S.OPTION_ID = O.ID JOIN CATEGORIES AS C ON S.CATEGORY_ID = C.ID WHERE S.CATEGORY_ID = ? AND UPPER(O.NAME) = ?`
      const connection = await getConnection()
      connection.query(sql, [categoryId, name], function(error, result, _fields){
        if(error){
          res.status(500).json(error)
        }
        else if(result.length > 0){
          res.status(200).json({"data": result})
        }
        else{
          res.status(401).json({'message': 'This suggestion not exists'})
        }
      }) 
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

suggestionRoutes.get('/countCategories', async (req, res) => {
  try{
    const {categoryId} = req.query
    if(!categoryId || categoryId === null){
      res.status(409).json({'error': 'Please provide a categoryId'})
    }
    else{
      const sql = `SELECT COUNT(UPPER(C.NAME)) AS 'CATEGORIES' FROM SUGGESTIONS AS S JOIN CATEGORIES AS C ON S.CATEGORY_ID = C.ID WHERE S.CATEGORY_ID = ?`
      const connection = await getConnection()
      connection.query(sql, [categoryId], function(error, result, _fields){
        if(error){
          res.status(500).json(error)
        }
        else if(result.length > 0){
          res.status(200).json({"data": result})
        }
        else{
          res.status(401).json({'message': 'This suggestion not exists'})
        }
      }) 
    }
  } catch (error) {
    res.status(500).json(error)
  }
})


module.exports = suggestionRoutes
