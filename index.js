const express = require('express')
const app = express()
const port = 3000
const mongoose =require('mongoose')

//White list 추가해야함.
mongoose.connect('mongodb+srv://hyeonsu:abcd1234@boilerplate.6yspr.mongodb.net/boilerplate?retryWrites=true&w=majority',{
    useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:false
}).then(()=>console.log('MongoDB connected..')).catch(err=> console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!~ 안녕하세요')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})