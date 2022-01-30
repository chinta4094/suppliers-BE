const express = require('express')
const router = express.Router()
const Item = require('../models/itemModel')

router.get('/', async(req,res) => {
    res.send('WELCOMR TO ITEMS PAGE')
})



module.exports = router