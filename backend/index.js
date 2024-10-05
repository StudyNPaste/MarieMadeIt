const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");
const { log, error } = require("console");
const { MongoClient } = require('mongodb');
const { Client } = require('square');
const bodyParser = require('body-parser');


app.use(express.json());
app.use(cors());
app.use(express.static('upload'))
app.use(bodyParser.json());

//Database Connection with MongoDB
mongoose.connect("mongodb+srv://MarieMadeIt:Chabot18@cluster0.7yuld6z.mongodb.net/MarieMadeIt?retryWrites=true&w=majority&appName=Cluster0")

//mongodb-square sync
//setting up mongodb connection
const uri = "mongodb+srv://MarieMadeIt:Chabot18@cluster0.7yuld6z.mongodb.net/MarieMadeIt?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function connectToDatabase() {
    await client.connect();
    const database = client.db('MarieMadeIt');
    const inventoryCollection = database.collection('products');
    return inventoryCollection;
}
//fetching inventory from square
const squareClient = new Client({
    accessToken: 'EAAAl83GtlYaN7WYBHx0_vvbheN698_R5NMXPC5TY-GfQOQqzOf6ypFs78hClKfu',
    environment: 'sandbox'  // Use 'production' in a live environment
});

async function fetchSquareInventory() {
    const response = await squareClient.inventoryApi.batchRetrieveInventoryCounts({
        locationIds: ['L31SCEWEPFDK2'],
    });

    if (response.result.counts) {
        return response.result.counts;
    } else {
        console.error('Error fetching inventory from Square');
        return [];
    }
}

//sync inv from square to mongodb
async function syncInventoryToMongoDB() {
    const squareInventory = await fetchSquareInventory();
    const inventoryCollection = await connectToDatabase();

    squareInventory.forEach(async (item) => {
        const update = {
            $set: {
                quantity: item.quantity,
                updatedAt: new Date(item.updatedAt)
            }
        };

        await inventoryCollection.updateOne(
            { itemId: item.catalogObjectId },
            update,
            { upsert: true }
        );
    });
}
//syncing mongodb inv w/ square
async function updateSquareInventory(itemId, newQuantity) {
    const response = await squareClient.inventoryApi.batchChangeInventory({
        changes: [
            {
                type: 'ADJUSTMENT',
                adjustment: {
                    catalogObjectId: itemId,
                    fromState: 'IN_STOCK',
                    toState: 'IN_STOCK',
                    quantity: newQuantity.toString(),
                    locationId: 'L31SCEWEPFDK2'
                }
            }
        ]
    });

    if (response.result.changes) {
        console.log('Inventory updated in Square');
    } else {
        console.error('Error updating Square inventory');
    }
}

//square webhook  
// Your Square Webhook Signature Key
const SQUARE_SIGNATURE_KEY = 'sPN6qtNwqW9O6ExYluxuLA';

// Function to verify webhook signature
function verifySquareSignature(signature, requestBody, webhookUrl) {
    const hmac = crypto.createHmac('sha256', sPN6qtNwqW9O6ExYluxuLA);
    hmac.update(webhookUrl + requestBody);
    const generatedSignature = hmac.digest('base64');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(generatedSignature));
}

// Webhook endpoint to receive inventory updates
app.post('/webhooks/inventory-update', (req, res) => {
    const signature = req.headers['x-square-signature']; // The signature Square sends
    const webhookUrl = 'https://mariemadeit.com/webhooks/inventory-update'; // Your public URL

    // Verify the signature to ensure the request is from Square
    if (verifySquareSignature(signature, JSON.stringify(req.body), webhookUrl)) {
        const webhookData = req.body;

        console.log('Webhook received:', webhookData);
        // Process the event data (e.g., update inventory in your system)
        
        res.status(200).send('Webhook received successfully');
    } else {
        console.error('Invalid signature');
        res.status(403).send('Forbidden');
    }
});

//paired...now displaying sdk

//


//Api Creation

app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

//Image Storage Engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//Creating Upload EndPoint for images

app.use('/images',express.static('/upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`https://backend.mariemadeit.com/images/${req.file.filename}`
    })
})

//Schema for Creating Products

const Product = mongoose.model("Product", {
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    color:{
        type:String,
        require:true,
    },
    size:{
        type:String,
        require:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    }
})
app.post('/addproduct',async (req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0)
    {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        color:req.body.color,
        size:req.body.size,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

// Creating API For deleting Product

app.post('/removeproduct', async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

//Creation API for getting all products
app.get('/allproducts',async (req,res)=>{
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

// Shema creating for User Model
const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

// Creating Endpoint for registering the user
app.post('/signup',async (req,res)=>{

    let check = await Users.findOne({email:req.body.email});
    if (check) {
        return res.status(400).json({success:false,errors:'existing user found with same email address'})
    }
    let cart ={};
    for (let i = 0; i < 300; i++) {
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})

})

//creating endpoint for user login
app.post('/login',async (req,res) =>{
    let user = await Users.findOne({email:req.body.email});
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data ={
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrong Password"})
        }
    }
    else {
        res.json({success:false,errors:"Wrong Email Id"})
    }
})

// creating endpoint for new collection data
app.get('/newcollections', async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products /*.slice(-10).slice(0);*/
    console.log('NewCollection Fetched');
    res.send(newcollection);
})

//creating endpoint for popular in women section
app.get('/popularitems', async (req,res)=>{
    let products =await Product.find({category:'accessories'});
    let popular_on_site = products.slice(0,4);
    console.log("Popular items fetched");
    res.send(popular_on_site);
})

//creating middleware to fetch user
    const fetchUser = async (req,res,next)=>{
        const token = req.header('auth-token');
        if (!token){
            res.status(401).send({errors:"Please authenticate using valid token"})
        }
        else {
            try {
                const data = jwt.verify(token,'secret_ecom');
                req.user = data.user;
                next();
            } catch (error) {
                res.status(401).send({errors:"Please authenticate using valid token"})
            }
        }
    }

//creating endpoint for adding products in cartdata
app.post('/addtocart',fetchUser,async (req,res)=>{
    console.log('Added',req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")
})

//creating endpoint to remove product from cartdata
app.post('/removefromcart',fetchUser,async (req,res)=>{
    console.log('removed',req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0);
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed")
})

//creating endpoint to get cartdata
app.post('/getcart',fetchUser,async (req,res)=>{
    console.log('GetCart');
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

app.listen(port,(error)=>{
    if (!error) {
        console.log("Server Running on Port "+port)
    }
    else
    {
        console.log("Error :"+error)
    }
})