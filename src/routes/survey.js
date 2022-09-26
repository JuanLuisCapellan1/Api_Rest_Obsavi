const express = require('express')
const { getConnection } = require('../database/db')
const surveyRoutes = express.Router()

surveyRoutes.post('/survey', async (req, res) => {
  try {
    const { name } = req.body
    if(!name || name === ''){
      res.status(409).json({'error': 'Please provide a name'})
    }else{
      const connection = await getConnection() 
      let sql = 'INSERT INTO SURVEYS (NAME) VALUES (?)'
      connection.query(sql, [name], function(err, result, _fields){
        if(err){
          res.status(500).json(err)
        }
        else{
          res.status(200).json({surveySaved: result.insertId})
        }
      })
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = surveyRoutes
