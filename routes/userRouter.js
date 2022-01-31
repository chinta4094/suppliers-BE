const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/userModel')
const Item = require('../models/itemModel')
const Cart = require('../models/cartModel')
const Payment = require('../models/paymentModel')
require('dotenv').config()

router.get('/', async(req,res) => {
    res.send({
        message : 'WELCOMR TO USERS PAGE',
        token : process.env.SECRET_KEY
    })
})

router.post('/signup', async(req,res) => {
    const record = req.body
    const addUser = await User.query().insert(record)
    if(!addUser){
        res.send('Not Inserted')
    }else{
        res.send({
            message : true,
            details : addUser
        })
    }
})

router.post('/login',async(req,res) => {
    const loginDetails = req.body
    const findDetails = await User.query().select('email').where('email',loginDetails.email)
    const token = jwt.sign({user : loginDetails.email},process.env.SECRET_KEY)
    if(!findDetails[0]){
        res.send({
            message : "No User Exists, Pls Signup First",
            details : "login failed"
        })
    }else{
        res.send({
            message : "User Exists",
            details : "success",
            token : token
        })
    }
})

router.post('/addToCart/:id/:quantity', async(req,res) => {
    var { id,quantity } = req.params
    const token = req.body.token
    if(token){
        const verifyToken = jwt.verify(process.env.TOKEN,process.env.SECRET_KEY)
        if(verifyToken){
            const findId = await Item.query().findById(id)
            const findNameInCart = await Cart.query().select('itemName','quantity')
            .where('itemName',findId.itemName)
            .where('email',verifyToken.user)
            if(findNameInCart.length == 0){
                const addToCart = await Cart.query().insert({
                    "email" : verifyToken.user,
                    "itemName" : findId.itemName,
                    "itemCost" : findId.itemCost,
                    "quantity" : parseInt(quantity),
                    "total" : findId.itemCost * parseInt(quantity)
                })
                if(!addToCart){
                    res.send(err)
                }else{
                    res.send('Add To Cart Successfully')
                }
            }else{
                const updateCart = await Cart.query().patch({"quantity" : parseInt(quantity),"total" : findId.itemCost * parseInt(quantity)})
                .where('email',verifyToken.user)
                .where('itemName',findId.itemName)
                if(updateCart){
                    res.send("Updated Successfully")
                }else{
                    res.send("Not Updated")
                }   
            }
        }
        else{
            res.send("Token Incorrect")
        }
    }else{
        res.send("Pls Provide Token")
    }
})

router.post('/totalAmount', async(req,res) => {
    const token = req.body.token
    const verifyToken = jwt.verify(process.env.TOKEN,process.env.SECRET_KEY)
    if(verifyToken){
        const email = verifyToken.user
        const total = await Cart.query().select('itemCost','quantity').where('email',email)
        var mul = [],sum = 0
        for(var i=0;i<total.length;i++){
            mul[i] = { details : total[i], total : total[i].itemCost * total[i].quantity }  
            sum = sum + mul[i].total
        }
        const findPaymentEmail = await Payment.query().select('email').where('email',email)
        var data = {
            "email" : email,
            "total" : sum
        }
        if(findPaymentEmail.length == 0){
            var insert = await Payment.query().insert(data)
            res.send(insert)
        }else{
            var updateTotal = await Payment.query().select('email','total').where('email',email)
            if(updateTotal[0].total == sum){
                res.send({
                    message : "Payment UPTO date",
                    details : updateTotal
                })
            }else{
                const updatePayment = await Payment.query().patch({"total" : data.total}).where('email',email)
                var update = await Payment.query().select('email','total').where('email',email)
                if(updatePayment){
                    res.send({
                        message : "Payment Updated Successfully",
                        details : update
                    })
                }else{
                    res.send({
                        message : "Payment Not Updated",
                        details : update
                    })
                }
            }
        }
    }else{
        res.send('INVALID TOKEN')
    }
})

router.get('/totalBill', async(req,res) => {
    const token = req.body.token
    const verifyToken = jwt.verify(process.env.TOKEN,process.env.SECRET_KEY)
    if(verifyToken){
        const email = verifyToken.user
        var total = await Payment.query().select('email','total').where('email',email)
        const getCartDetails = await Cart.query().select('itemName','itemCost','quantity','total')
        .where('email',email)
        res.send({
            email : email,
            itemDetails : getCartDetails,
            finalAmount : total[0].total
        })
    }else{
        res.send("Pls Provide Token")
    }
})

router.get('/getItems', async(req,res) => {
    const getitem = await Item.query().select('id','itemName','itemCost')
    res.send(getitem)
})

router.get('/cartItems',async(req,res) => {
    const token = req.body.token
    const verifyToken = jwt.verify(process.env.TOKEN,process.env.SECRET_KEY)
    if(verifyToken){
        const getCartDetails = await Cart.query().select('itemName','itemCost','quantity')
        .where('email',verifyToken.user)
        if(!getCartDetails){
            res.send('ERROR')
        }else{
            res.send({
                message : 'success',
                fullDetails : {
                    email : verifyToken.user,
                    details : getCartDetails
                }
            })
        }
    }else{
        res.send('INVALID TOKEN')
    }
})
module.exports = router