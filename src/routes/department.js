const express = require('express')
const { getConnection } = require('../database/db')
const departmentRoutes = express.Router()

departmentRoutes.get('/department', async (req, res) => {
  try {
    const connection = await getConnection()
    let sql = 'SELECT * FROM DEPARTMENT'
    connection.query(sql, function(err, result, _fields){
      if(err){
        res.status(500).json(err)
      }
      if(result.length > 0){
        res.status(200).json(result)
      }else{
        res.status(503).json({'message': 'Not exist this department'})
      }
    })
  } catch (error) {
    res.status(500).json(error)
  }
})


module.exports = departmentRoutes
