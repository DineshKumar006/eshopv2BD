const mongoose=require('mongoose')

const BulkSchema=mongoose.Schema({

    name:{type:String,required:true},
    public_id:{type:String},
    imgurl:{type:String,require:true},
    secure_url:{type:String,require:true},

    price:{type:String},
    slasher_price:{type:String},
    discount:{type:String},
    gst:{type:String},
    deliverycharges:{type:String},
    totalPrice:{type:String},


    categoryname:{type:String,required:true},
    brandname:{type:String,require:true},
    description:{type:String},



})


const BulkModel=mongoose.model('bulk-data',BulkSchema)


module.exports=BulkModel