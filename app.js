const express = require('express')
const dataBase = require('./db/db')
const adminRouter = require('./routes/adminRouter')
const itemRouter = require('./routes/itemRouter')
const userRouter = require('./routes/userRouter')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 8000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended : true }))

dataBase()

app.use('/admin',adminRouter)
app.use('/item',itemRouter)
app.use('/user',userRouter)

app.get('/',(req,res) => {
    res.send("HELLO HEROKU ....")
})

app.listen(port, () => console.log(`Server is running on port : ${port}`))