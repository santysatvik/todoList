// pacakage requier basic seeting

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const app = express();
app.set('view engine',"ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const _ = require('lodash');

const password = encodeURIComponent("9idH307m1HxP9T3B");

//database connection
main().catch(err =>console.log(err));

async function main(){
  mongoose.set('strictQuery',false);
  await mongoose.connect("mongodb://127.0.0.1:27017/DairyDB",{useNewUrlParser: true,
useUnifiedTopology: true});
  console.log("connected");
}





// ***************************************************default data**************************************
const itemSchema = new mongoose.Schema({
  name:String
});

const Item = mongoose.model("Item",itemSchema);

const item_1 =new Item({
  name:"Welcome to toDoList"
});

const item_2 =new Item({
  name:"+ to add item"
});

const item_3 =new Item({
  name:"<-- TO delete item"
});

const defaultItem = [item_1, item_2,item_3];

 const listSchema = new mongoose.Schema({
   name:String,
   items :[itemSchema]
 });

const List = mongoose.model("List",listSchema);

// *****************************************************get rout/home***********************************************
app.get("/",function(req,res){

Item.find({} ,function(err ,foundItem)
{
  if(foundItem.length === 0){
    Item.insertMany(defaultItem, function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("sucesfullay saved item");
      }
      res.redirect("/");
    });
  }
  else{
    res.render("list", {ListTittles : "Today" ,newListItem :foundItem});
  }
});


});

//post

// ***********************************************post home********************************

app.post("/",function(req,res){
  const itemName=req.body.newItem;
  const listName = req.body.list;
  const item =new Item({
    name:itemName
  });
if(listName === "Today"){

  item.save();
  res.redirect("/");
}else{
  List.findOne({name:listName} ,function(err,foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/" + listName);
  })


}

  //console.log(req.body.button);

})


// ***************************************for delete post ***********************************
app.post("/delete",function(req,res){
  const check_id = req.body.checkbox;
  const listName = req.body.listName;
  if(listName == "Today"){
    Item.findByIdAndRemove(check_id, function(err){
      if(!err){
        console.log("deleted");
      }
    });
    res.redirect("/");
  }
  else{
    List.findOneAndUpdate({name:listName},{$pull :{items: {_id:check_id}}},function(err,foundList){
      if(!err){
        res.redirect("/" + listName);
      }
    });
  }

});



// *******************************dynamic route**************************
app.get("/:customListName",function(req,res){


  const  customListName = _.capitalize(req.params.customListName);
    List.findOne({name:customListName},function(err,foundList){
      if(!err){
        if(!foundList)
        {
          const list = new List({
            name:customListName,
            items:defaultItem
          });
          list.save();
          res.redirect("/" + customListName);


        }
        else{

          res.render("list", {ListTittles : foundList.name ,newListItem :foundList.items});
        }
      }
    });


});




app.listen(3000,function(){
  console.log("started");

})

// mongoose.connection.close();
