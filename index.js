import express from 'express'
import { MongoClient, ObjectId } from 'mongodb'

const dbName = 'college'
const url = "mongodb://localhost:27017"

const client = new MongoClient(url)


const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.set("view engine",'ejs')

client.connect().then((connection)=>{
   
   const db = connection.db(dbName);

    app.get('/api',async(req,res)=>{

          const collection = db.collection("students")
          const students = await collection.find().toArray();
          res.send(students)
    })
   
    app.get('/ui',async(req,res)=>{

          const collection = db.collection("students")
          const students = await collection.find().toArray();
          res.render('student',{students}) //in this first parameter is file name and second is data
    })

    app.get('/add-students',(req,res)=>{
        res.render('addStudent')
    })

    app.post('/store-students',async(req,res)=>{
        
          const collection = db.collection("students")
          const result = await collection.insertOne(req.body)
           console.log(result)
        //   const students = await collection.find().toArray();
          res.send("data Saved")
    })
    

    app.post('/add-student-api',async(req,res)=>{

      const {name,email,age}=req.body

      if(!name || !email || !age){
       res.send({message:"failed",success:"false"});
       return false     
      }

      const collection = db.collection("students")
      const result = await collection.insertOne(req.body)
      console.log(req.body)
      res.send({"message":"success",success:"true",result:result});
    })

    app.delete("/delete/:id",async(req,res)=>{

      const collection = db.collection("students")
      const result = await collection.deleteOne({_id: new ObjectId(req.params.id)})
      if(result)
      {
       res.send({message:"Student Data Deleted",success:true})
      }else{
         res.send({message:"Something Went Wrong",success:false})    
      }
      
    })

     app.get("/delete/:id",async(req,res)=>{

      const collection = db.collection("students")
      const result = await collection.deleteOne({_id: new ObjectId(req.params.id)})
      if(result)
      {
       res.send("<h1>Student data deleted</h1>")
      }else{
         res.send("<h1>Something went wrong</h1>")    
      }
      
    })


})



app.get('/',async(req,res)=>{

     await client.connect()
    const db = client.db(dbName)
    const collection = db.collection('students')

    const students = await collection.find().toArray()

    res.render('student',{students})
})

app.listen(3200)