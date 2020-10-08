const mongoose=require('mongoose')



const AllshirtSchema=mongoose.Schema({

    categoryname:{type:String,required:true},
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


    filtergroup:{type:String},

    color:{type:String},
    size:{
        S:  {type:String},
        M:  {type:String},
        L: {type:String},
        XL: {type:String},
        XXL:{type:String}
    }

})


const AllshirtModal=mongoose.model('all_shirts',AllshirtSchema)


module.exports=AllshirtModal