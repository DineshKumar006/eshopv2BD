const mongoose= require('mongoose') 



const womenjeansSchema=mongoose.Schema({

    name:{type:String,required:true},
    public_id:{type:String},
    imgurl:{type:String,require:true},
    secure_url:{type:String,require:true},
    brandId:{type:mongoose.Types.ObjectId, ref:"brands"}



})


const womenjeansModal=mongoose.model('women_jeans',womenjeansSchema)

module.exports=womenjeansModal