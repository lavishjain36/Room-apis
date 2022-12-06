import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import {MongoClient} from "mongodb"
dotenv.config();

const app=express();
const MONGO_URL=process.env.MONGO_URL;
const PORT=process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

//Create a mongo connection 
const createConnection=async()=>{
    const client=new MongoClient(MONGO_URL)
    await client.connect();
    console.log("Connect to mongo database is established!");
    return client;
}

const client=await createConnection();

app.get("/",(req,res)=>{
    res.send("<h1>App is working  fine!</h1>");
})

//create a room
app.post("/create_room",async(req,res)=>{
    const data =req.body;

    const result=await client
    .db("booking")
    .collection("create_room")
    .insertOne(data)

    result.acknowledged
    ?res.status(200).send({msg:"rooms created sucessfully"})
    :res.status(400).send({msg:"Something went wrong!please try again later"})
})

// 2.Booking a room
// 1.customer name
// 2.Date
// 3.Start time
// 4.End time
// 5.Room ID
app.post("/book_room",async(req,res)=>{
    const data=req.body;

    // const dateCheck=await client
    // .db("booking")
    // .collection("book_room")
    // .findOne({booking_date:data["booking_date"]});

    // if(dateCheck.booking_date){
    //     res.send({
    //         msg:"The room is booked for this date.Please select another date"
    //     });
    //     return ;
    // }

    const result=await client
    .db("booking")
    .collection("book_room")
    .insertOne(data)

    const test=await client
    .db("booking")
    .collection("create_room")
    .updateOne(
       {id:"638f5f7ccd46ef47675076ba"} ,
       {$inc:{rooms_available:-1}}
    );

    result.acknowledged
    ?res.status(200).send({msg:"room booked sucessfully"})
    :res
    .status(400)
    .send({msg:"something went wrong!please try again after sometime"})
})



//List down all the booked room details 
app.get("/booked_rooms",async(req,res)=>{
    const result=await client 
    .db("booking")
    .collection("book_room")
    .find(req.query)
    .toArray();

    res.status(200).send(result)
})




//List of customer details 
app.get("/customers_info",async(req,res)=>{
    const result=await client 
    .db("booking")
    .collection("book_room")
    .find()
    .toArray();
    res.status(200).send(result)
})







app.listen(PORT,()=>console.log("Server is running at port " +PORT));