const mongoose=require('mongoose')



const CartSchema=mongoose.Schema({

    categoryname:{type:String,required:true},
    seriesname:{type:String,required:true},
    brandname:{type:String,require:true},
    description:{type:String},
    public_id:{type:String},
    imgurl:{type:String,require:true},
    secure_url:{type:String,require:true},
    price:{type:String},
    slasher_price:{type:String},
    discount:{type:String},
    gst:{type:String},
    deliverycharges:{type:String},
    totalPrice:{type:String},
    userid:{type:mongoose.Types.ObjectId,ref:"userDatav2"},
    itemid:{type:mongoose.Types.ObjectId}


})


const CartModel=mongoose.model('userscart',CartSchema)


module.exports=CartModel