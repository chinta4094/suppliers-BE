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
    const getDetails = await User.query().select()
    res.send(getDetails)
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

router.post('/login/:loginDetails',async(req,res) => {
    var email = req.params.loginDetails
    const findDetails = await User.query().select('email','password').where('email',email)
    const token = jwt.sign({ user : email } ,process.env.SECRET_KEY)
    if(!findDetails[0]){
        res.status(400).send({
            message : "No User Exists, Pls Signup First",
            details : "login failed"
        })
    }else{
        const findTokenDetails = await Token.query().findById('1')
        if(findTokenDetails == undefined){
            const addDetails = await Token.query().insert({
                "id" : 1,
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
            const findEmail = await Token.query().select('email').findById('1')
            if(findEmail.email === email){
                const updateToken = await Token.query().patch({ secretToken : token }).where('email',email)

                res.status(200).send({
                    message : "User Exists",
                    email : findDetails[0].email,
                    details : "success",
                    token : token
                })
            }
            else{
                const findEmail2 = await Token.query().findById('1')
                res.send({
                    status : 204,
                    message : "User With " + findEmail2.email + "exists, logout for login..."
                })
                console.log(findEmail2)
            }
        }
    }
})

router.post('/addToCart/:id/:quantity', async(req,res) => {
    const findToken = await Token.query().findById('1')
    const verifyToken = jwt.verify(findToken.secretToken,process.env.SECRET_KEY)
    const email = verifyToken.user
    if(verifyToken){
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
                res.send({
                    details : "success",
                    message : 'Add To Cart Successfully'
                })
            }
        }else{
            const updateCart = await Cart.query().patch({"quantity" : parseInt(quantity),"total" : findId.itemCost * parseInt(quantity)})
            .where('email',email)
            .where('itemName',findId.itemName)
            if(updateCart){
                res.send({
                    details : "success",
                    message : "Updated Successfully"
                })
            }else{
                res.send("Not Updated")
            }   
        }
    }else{
        res.send("TOKEN VERIFICATION FAILED")
    }
        
})

router.post('/totalAmount', async(req,res) => {
    const findToken = await Token.query().findById('1')
    const verifyToken = jwt.verify(findToken.secretToken,process.env.SECRET_KEY)
    const email = verifyToken.user
    if(verifyToken){
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
            res.send({
                details : "success",
                message : "Inserted"
            })
        }else{
            var updateTotal = await Payment.query().select('email','total').where('email',email)
            if(updateTotal[0].total == sum){
                res.send({
                    details : "success",
                    message : "updated1"
                })
            }else{
                const updatePayment = await Payment.query().patch({"total" : data.total}).where('email',email)
                var update = await Payment.query().select('email','total').where('email',email)
                if(updatePayment){
                    res.send({
                        details : "success",
                        message : "updated2"
                    })
                }else{
                    res.send({
                        details : "Payment Not Updated"
                    })
                }
            }
        }
    }else{
        res.send("TOKEN VERIFICATION FAILED")
    }
})

router.get('/totalBill', async(req,res) => {
    const findToken = await Token.query().findById('1')
    const verifyToken = jwt.verify(findToken.secretToken,process.env.SECRET_KEY)
    const email = verifyToken.user
    if(verifyToken){
        var total = await Payment.query().select('email','total').where('email',email)
        const getCartDetails = await Cart.query().select('itemName','itemCost','quantity','total')
        .where('email',verifyToken.user)
        if(getCartDetails[0]){
            res.send({
                email : verifyToken.user,
                finalAmount : total[0].total,
                details : "success"
            })
        }else{
            res.send("Amount ")
        }
    }else{
        res.send("TOKEN VERIFICATION FAILED")
    }
})

router.get('/getItems', async(req,res) => {
    const getitem = await Item.query().select('id','itemName','itemCost','image')
    res.send(getitem)
})

router.get('/cartItems',async(req,res) => {
    const findToken = await Token.query().findById('1')
    const verifyToken = jwt.verify(findToken.secretToken,process.env.SECRET_KEY)
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
        res.send("TOKEN VERIFICATION FAILED")
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

router.delete('/logout', async(req,res) => {
    const deleteToken = await Token.query().delete().findById('1')
    if(deleteToken){
        res.send({
            message : "LOGOUT SUCCESFULLY",
            details : "success",
            delete : deleteToken
        })
    }else{
        res.send({
                message : "LOGIN NOW ... ",
                details : "failed"
            })
    }
    
})

router.get('/userDetails',async(req,res) => {
    const findAll = await Token.query().findById('1')
    if(findAll == null){
        res.send({
            details : [ {
                firstName : "******",
                lastName : "*******"
            }],
            message : "failed"
        })
    }else{
        const findEmail = await User.query().select('firstName','lastName','email').where('email',findAll.email)
        res.send({
            message : "success",
            details : findEmail
        })
    }
})

router.get('/cartDetails', async(req,res) => {
    const findEmail = await Token.query().findById('1')
    const getCartDetails = await Cart.query().select('itemName','itemCost','quantity','total').where('email',findEmail.email)
    res.send(getCartDetails)
})

module.exports = router