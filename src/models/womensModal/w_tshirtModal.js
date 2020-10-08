const mongoose=require('mongoose')



const womentshirtSchema=mongoose.Schema({

    name:{type:String,required:true},
    public_id:{type:String},
    imgurl:{type:String,require:true},
    secure_url:{type:String,require:true},
    brandId:{type:mongoose.Types.ObjectId, ref:"brands"}

})


const womentshirtModal=mongoose.model('women_tshirts',womentshirtSchema)


module.exports=womentshirtModal