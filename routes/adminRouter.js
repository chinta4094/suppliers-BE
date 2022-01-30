const express = require('express')
const router = express.Router()
const Admin = require('../models/adminModel')
const Cart = require('../models/cartModel')
const Item = require('../models/itemModel')

router.get('/', async(req,res) => {
    res.send('WELCOME TO HOMEPAGE')
})

router.post('/signup', async(req,res) => {
    var record = req.body;
    const insert = await Admin.query().insert(record)
    res.send(insert)
})

router.post('/addItem', async(req,res) => {
    const record = req.body
    const addItem = await Item.query().insert(record)
    if(!addItem){
        res.send('Not Inserted')
    }else{
        res.send({
            message : true,
            details : addItem
        })
    }
})

router.delete('/deleteCart/:id',async(req,res) => {
    const { id } = req.params
    const deleteCart = await Cart.query().deleteById(id)
    if(deleteCart){
        res.send("DELETED SUCCESFULLY")
    }else{
        res.send("Enter The Write Id")
    }
})

module.exports = router