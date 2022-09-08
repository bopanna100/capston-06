import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// console.log(process.env.MONGO_URL);
const app = express();

const port=process.env.port||3000;

const MONGO_URL= process.env.MONGO_URL;


async function createconnection(){
    const clint=new MongoClient(MONGO_URL);
 await clint.connect();
console.log("mongo is connected");
return clint;
}
const clint = await createconnection();

app.use(express.json());
app.get("/", (req, res) =>
  res.send(`Server Running`)
);

app.get("/products",async function(request,response){
    
  const product=await clint
  .db("product36")
  .collection("product")
  .find({}).toArray();
  response.send(product);
});

app.get("/products/:id", async function (request,response){
    const{id}=request.params;
    console.log(request.params,id);
    // const product=products.find((mv) => mv.id===id);
    // console.log(product);
    
    const product=await clint
    .db("product36")
    .collection("product")
    .findOne({id:id})
    product 
    ? response.send(product) 
    : response.status(404).send({msg:"product not found"});
});

app.post("/products",async function(request,response){
   const data = request.body;
   const result =await clint
   .db("product36")
   .collection("product")
   .insertMany(data);
  
  response.send(result);
});

app.delete("/products/:id", async function (request,response){
  
  
  const{id}=request.params;
  console.log(request.params,id);
 
  const result=await clint
  .db("product36")
  .collection("product")
  .deleteOne({id:id})
  result.deletedCount >0
  ? response.send({msg:"product successfuly deleted"}) 
  : response.status(404).send({msg:"product not found"});
});

app.put("/products/:id", async function (request,response){
  const{id}=request.params;
  console.log(request.params,id);
 const data=request.body;
  
  const result=await clint
  .db("product36")
  .collection("product")
  .updateOne({id:id},{$set:data});

  result.modifiedCount >0
  ? response.send({msg:"product successfuly updated"}) 
  : response.status(400).send({msg:"product not updated"});
});


app.listen(port,()=>console.log(`app is started in ${port}`));