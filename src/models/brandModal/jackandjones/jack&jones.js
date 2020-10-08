const mongoose=require('mongoose')


const brandSchema=mongoose.Schema({
    brandname:{type:String},
    public_id:{type:String},
    imgurl:{type:String,require:true},
    secure_url:{type:String,require:true},
    price:{type:Number},
    slasher_price:{type:Number},
    discount:{type:Number}

})


const brandModal=mongoose.model("jack_and_jones",brandSchema)


module.exports=brandModal