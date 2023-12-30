const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post')
const bcrypt = require('bcryptjs')      /* this module is used to encrypt the password */
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware =  multer({ dest: 'uploads/ '});
const fs = require('fs');


const salt = bcrypt.genSaltSync(10);    
const secret = 'asdasdar32132r23312r4ybxre63';


app.use(cors({credentials:true, origin:'http://localhost:3000'}));        /* to remove CORS error */
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://messiaarlio:3bVbWP1GhLfbGydY@cluster0.8nrxexl.mongodb.net/?retryWrites=true&w=majority');

app.post('/register', async (req,res)=>{           /* when the server recieves a post request at /register endpoint, it sends back a response with string "OK"  */
    const {username,password} = req.body;
    try{
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password,salt),
        });     
        res.json(userDoc);
    }catch (e){
        res.status(400).json(e);        /* returns status code as 400 if any error */
    }
});

app.post('/login', async (req,res) => {
    const {username,password} = req.body;
    const userDoc = await User.findOne({username});     /* checks if the username is in the database */
    const passOk = bcrypt.compareSync(password,userDoc.password);   /* checks if the hashes of the password is same as the one within the database */
    /*res.json(passOk); - passOk returns true or false */
    if (passOk){
        /* below line is the payload of the JWT. It includes the username and id of the user obtained from the userDoc */
        /* the secret is a key used to sign the JWT */
        jwt.sign({username, id:userDoc._id}, secret, {}, (err,token) => {
            if (err) throw err;     /* error handler */
            res.cookie('token',token).json({
                id: userDoc._id,
                username,
        });   /* sets a cookie with the token in it */
        })
    } else {
        res.status(400).json('wrong credentials');
    }
});

app.get('/profile' ,(req,res) => {  /* after logging in... this endpoint is used */

    const {token} = req.cookies;
    jwt.verify(token, secret, {} , (err,info) => {
        if (err) throw err;
        res.json(info) 
    });    
});

app.post('/logout', (req,res) => {
    res.cookie('token','').json('ok');
});

app.post('/post', uploadMiddleware.single('file') ,async (req,res) => {
    const { originalname,path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length -1];
    const newPath = path+'.'+ext ;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token,secret,{}, async (err,info) => {
            if (err) throw err;
            const {title,summary,content} = req.body;
            const postDoc = await Post.create({
            title,
            summary,
            content,
            cover:newPath,
            author:info.id,
        });
        res.json(postDoc);
    });

});

app.put('/post', uploadMiddleware.single('file') ,async (req,res) => {
    let newPath = null;
    if (req.file){
        const { originalname,path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length -1];
        newPath = path+'.'+ext ;
        fs.renameSync(path, newPath);
    }

    const {token} = req.cookies;
    jwt.verify(token,secret,{}, async (err,info) => {
        if (err) throw err;  
        const {id,title,summary,content} = req.body;
        const postDoc = await Post.findById(id);

        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        res.json({isAuthor,postDoc,info});

        if(!isAuthor) {
            return res.status(400).json('you are not the author');
        }

        await postDoc.update({
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        });

        res.json(postDoc);
    });
});




app.get('/post', async (req,res) => {
    const posts = await Post.find()
                    .populate('author', ['username'])
                    .sort({createdAt: -1})
                    .limit(20)
                            
    res.json(posts);
});

app.get('/post/:id', async (req,res) =>{
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author',['username']);
    res.json(postDoc);
});

app.listen(4000);


