import express from 'express'

const app = express()

app.get('/',(req,res)=>{
    res.send("Home Page")
})

app.listen(3200)