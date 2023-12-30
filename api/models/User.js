const mongoose = require('mongoose');

const {Schema,model} = mongoose;  //extracts Schema and model from mongoose and stores it in those 2 varaibles    

const UserSchema = new Schema({         //defines the userSchema - username and password
    username: {type: String, required: true, min: 4, unique: true },
    password: {type: String, required: true},
});

const UserModel = model('User' , UserSchema);

module.exports = UserModel;