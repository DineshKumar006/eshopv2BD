const mongoose=require('mongoose')



const womenshirtSchema=mongoose.Schema({

    name:{type:String,required:true},
    public_id:{type:String},
    imgurl:{type:String,require:true},
    secure_url:{type:String,require:true},
    brandId:{type:mongoose.Types.ObjectId, ref:"brands"}

})


const womenshirtModal=mongoose.model('women_shirts',womenshirtSchema)


module.exports=womenshirtModal