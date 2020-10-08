const shirtModal=require('../../models/womensModal/w_shirtModal')
const multer=require('multer')
const {v4:uuid}=require('uuid')
const sharp=require('sharp')
const Router=require('express').Router()
let cloudinary=require('cloudinary').v2
const httpError=require('../../errorModal/errorModal')
const fs=require('fs')
const brandModal=require('../../models/brandModal/brandModal')
const mongoose=require('mongoose')
// console.log(process.env.CLOUD_NAME)
cloudinary.config({
     cloud_name:process.env.CLOUD_NAME,
     api_key:process.env.CLOUD_API_KEY,
     api_secret:process.env.CLOUD_API_SECRET
})

 const wshirtImage=multer({
     limits:{
         fileSize:5000000
     },
     
     storage:multer.diskStorage({
         destination:(req,file,cb)=>{
                cb(null,'uploads/images')
         },
         filename:(req,file,cb)=>{
            cb(null,uuid()+'.'+'png')
         }
     })
     
 })

Router.route('/addWomenShirt/:brandname').post(wshirtImage.single("shirtImg"),async(req,res)=>{

    // console.log(req.file)

    try {

        const brandname=req.params.brandname.toLowerCase().trim().split(' ').join('')

         const brandData=await brandModal.findOne({brandName:brandname}).exec()
        const result=await cloudinary.uploader.upload(req.file.path ,{width:500,height:450, quality: "auto" ,fetch_format:"auto",crop: "scale"})
        // console.log(result)
        const {asset_id,public_id,url,secure_url}=result
        const data={
            public_id,
            name:req.body.name,
            public_id,
            imgurl:url,
            secure_url,
             brandId:brandData._id,
             price:req.body.price?parseInt(req.body.price):0,
             slasher_price:req.body.slasher_price?parseInt(req.body.slasher_price):0,
             discount:Math.ceil((parseInt(req.body.price)/parseInt(req.body.slasher_price)) * 100)
        }
        const newData=new shirtModal(data)
            // await newData.save()

        const session=await mongoose.startSession()
        session.startTransaction()
        const newresult= await newData.save({session:session})
        await brandData.womenShirts.push(newresult)
        await brandData.save({session:session})
        await session.commitTransaction()

        if(req.file){
            fs.unlinkSync(req.file.path)
        }
        res.status(200).send({status:'success',newresult})
        
    } catch (error) {
        console.log(error)
        if(req.file){
            fs.unlinkSync(req.file.path)
        }
        res.status(500).send({status:'Failed',error})
    }
})

const prevNextpages=(firstindex,currpage)=>{
    let result={}
    if(firstindex>1){

    result.prevPage={
        prevPage:currpage-1,
        limit:itemperpage
    }
}else{
    result.prevPage={
        prevPage:null,
        limit:itemperpage
    }
}

    result.nextPage={
        nextPage:currpage+1,
        limit:itemperpage
    }
}

Router.route('/getWomenShirts').get(async(req,res)=>{
    try {
        const page=parseInt(req.query.pageno);
        if(!page){
            throw new httpError("Page number not provided") 
        }
        const itemperpage=6;
        let lastindex=page*itemperpage;
        let firstindex=lastindex-itemperpage

        const data=await shirtModal.find({}).limit(itemperpage).skip(firstindex).exec()
        const totalpages= Math.ceil(await shirtModal.countDocuments().exec()/itemperpage)
        result={
            totalpages,
            data
        }
        
        res.status(200).send({status:'success',result})

    } catch (error) {
        if(error.message){
         return   res.status(500).send({status:'failed',error:error.message})
        }
        res.status(500).send({status:'internal failed'})
    }
})





Router.route('/deleteWomenShit/:id').delete(async(req,res)=>{
    try {
        
        const data= await shirtModal.findOneAndDelete({_id:req.params.id}).exec()
        console.log(data)
        if(data){
            const result=await cloudinary.uploader.destroy(data.public_id)

        }else{
            throw new httpError('deletion failed,product not found check id',403)
        }
       
        res.status(200).send({status:'delete success',data})

    } catch (error) {
        if(error.message){
          return  res.status(403).send({status:'delete failed',error:error.message})

        }
        res.status(500).send({status:'delete failed',error})
    }
})


module.exports=Router


