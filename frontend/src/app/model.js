const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var createschema = new Schema ({
    username : {type: String,required:true,index: {unique: true, dropDups: true}},
    password : {type: String},
    status : {type: Boolean, default: true},
    role : {type: String, default: 'user'},
    moneyLeft: {type: Number, default:100},
    onHold: {type: Number, default:50},
    item: {type: String},
    price:{type:Number},
    quantity:{type:Number}
})

var userdetails = new Schema ({
    mobile : {type:String},
    email : {type: String},
    sku : {type: String},
    description: {type: String},
    instock: {type: Number},
    createdby: {type:Schema.ObjectId,ref:'test'}
})

module.exports = {
    firstmethod : mongoose.model('test', createschema),
    secondmethod : mongoose.model('mani',userdetails)
}

