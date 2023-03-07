import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.urlencoded())
app.use(express.json())
app.use(cors())

// mongoose.connect("mongodb://localhost:27017/keeperapp", {useNewUrlParser: true, useUnifiedTopology: true}, () => console.log("DB connected"));

main().catch(err =>console.log(err));
async function main(){
  mongoose.set('strictQuery',false);
  await mongoose.connect("mongodb://127.0.0.1:27017/keeperapp");
  console.log("connected");
}


const keeperSchema = new mongoose.Schema({
    title:String,
    content:String
});

const keeper = new mongoose.model("keeper",keeperSchema);


app.get("/api/getAll", (req, res) => {
  keeper.find({}, (err, keeperList) => {
      if(err){
          console.log(err)
      } else {
          res.status(200).send(keeperList)
      }
  })

})

app.post("/api/addNew", (req, res) => {
    const { title, content} = req.body
    const keeperObj = new keeper({
        title,
        content
    })
    keeperObj.save( err => {
        if(err){
            console.log(err)
        }
        keeper.find({}, (err, keeperList) => {
            if(err){
                console.log(err)
            } else {
                res.status(200).send(keeperList)
            }
        })
    })

})

app.post("/api/delete",(req,res) =>{
    res.send("backend connected");
});


app.listen(3001,()=>{
    console.log("backend created");
})
