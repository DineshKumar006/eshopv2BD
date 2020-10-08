const mongoose=require('mongoose')


const brandSchema=mongoose.Schema({
    brandName:{type:String},
    menJeans:[{type:mongoose.Types.ObjectId, ref:"menjeans"}],
    menTshirts:[{type:mongoose.Types.ObjectId, ref:"mentshirts"}],
    menShirts:[{type:mongoose.Types.ObjectId, ref:"menshirts"}],
    womenJeans:[{type:mongoose.Types.ObjectId, ref:"women_jeans"}],
    womenTshirts:[{type:mongoose.Types.ObjectId, ref:"women_tshirts"}],
    womenShirts:[{type:mongoose.Types.ObjectId, ref:"women_shirts"}],

})


const brandModal=mongoose.model("brands",brandSchema)


module.exports=brandModal