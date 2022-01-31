const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/userModel')
const Item = require('../models/itemModel')
const Cart = require('../models/cartModel')
const Payment = require('../models/paymentModel')
const Token = require('../models/tokenModel')
const HUHU = require('../models/huhuModel')
require('dotenv').config()

router.get('/', async(req,res) => {
    res.send({
        message : 'WELCOMR TO USERS PAGE'
    })
})

router.get('/signup', async(req,res) => {
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

router.get('/login/:loginDetails',async(req,res) => {
    const email = req.params.loginDetails
    const findDetails = await User.query().select('email').where('email',email)
    const token = jwt.sign({ user : email } ,process.env.SECRET_KEY)
    if(!findDetails[0]){
        res.send({
            message : "No User Exists, Pls Signup First",
            details : "login failed"
        })
    }else{
        const findTokenDetails = await Token.query().select('email').where('email',email)
        if(!findTokenDetails[0]){
            const addDetails = await Token.query().insert({
                "email" : email,
                "secretToken" : token
            })
            res.send({
                message : "User Exists",
                email : findDetails[0].email,
                details : "success",
                token : token
            })
        }else{
            const updateToken = await Token.query().patch({ secretToken : token }).where('email',email)
            res.send({
                message : "User Exists",
                email : findDetails[0].email,
                details : "success",
                token : token
            })
        }
    }
})

router.get('/addToCart/:id/:quantity:email', async(req,res) => {
    const email = req.params.email
    var { id,quantity } = req.params
    const findId = await Item.query().findById(id)
    const findNameInCart = await Cart.query().select('itemName','quantity')
    .where('itemName',findId.itemName)
            .where('email',email)
            if(findNameInCart.length == 0){
                const addToCart = await Cart.query().insert({
                    "email" : email,
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
                .where('email',email)
                .where('itemName',findId.itemName)
                if(updateCart){
                    res.send("Updated Successfully")
                }else{
                    res.send("Not Updated")
                }   
            }
        
})

router.get('/totalAmount:email', async(req,res) => {
    const email = req.params.email
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
})

router.get('/totalBill/:email', async(req,res) => {
    const email = req.params.email
    const token = req.body.token
    var total = await Payment.query().select('email','total').where('email',email)
        const getCartDetails = await Cart.query().select('itemName','itemCost','quantity','total')
        .where('email',email)
        res.send({
            email : email,
            itemDetails : getCartDetails,
            finalAmount : total[0].total
        })
})

router.get('/getItems/:email', async(req,res) => {
    const getitem = await Item.query().select('id','itemName','itemCost')
    res.send(getitem)
})

router.get('/cartItems/:email',async(req,res) => {
    const email = req.params.email
    const token = await Token.query().select('id','email','token').where('email',email)
    const getCartDetails = await Cart.query().select('itemName','itemCost','quantity')
    .where('email',email)
    if(!getCartDetails){
        res.send('ERROR')
    }else{
        res.send({
            message : 'success',
            fullDetails : {
                email : email,
                details : getCartDetails
            }
        })
    }
})

router.get('/huhu', async(req,res) => {
    const verifyToken = jwt.verify(process.env.TOKEN,process.env.SECRET_KEY)
    if(verifyToken){
        const email = verifyToken.user
        const addRecord = await HUHU.query().insert({
            "id" : 2,
            "string" : "bhaskar",
            "number" : 21
        })
        res.send(addRecord)
    }else{
        res.send("Pls Provide Token")
    }
})

module.exports = router