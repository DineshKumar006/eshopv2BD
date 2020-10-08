const mongoose=require('mongoose')



const AllCategory=mongoose.Schema({

    categoryname:{type:String,required:true},
    brandname:{type:String,require:true},
    description:{type:String},
    public_id:{type:String},
    imgurl:{type:String,require:true},
    secure_url:{type:String,require:true},
    brandId:{type:mongoose.Types.ObjectId, ref:"brands"},
    price:{type:Number},
    slasher_pice:{type:Number},
    discount:{type:Number},

})


const AllCategoryModal=mongoose.model('allcategory',AllCategory)


module.exports=AllCategoryModal