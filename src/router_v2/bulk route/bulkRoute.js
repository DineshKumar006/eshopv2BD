const BulkModel =require('../../models/bulkModal/bulkModal')
const Router=require('express').Router()



const multer=require('multer')
const {v4:uuid}=require('uuid')
// const sharp=require('sharp')
let cloudinary=require('cloudinary').v2
const httpError=require('../../errorModal/errorModal')
const fs=require('fs')

cloudinary.config({
     cloud_name:process.env.CLOUD_NAME,
     api_key:process.env.CLOUD_API_KEY,
     api_secret:process.env.CLOUD_API_SECRET
})

 const AllImage=multer({
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

 Router.route('/addBulkdata').post(AllImage.single("img"),async(req,res)=>{

    const {categoryname, description,brandname,price,slasher_price,deliverycharges,gst}=req.body
    try {
        const result=await cloudinary.uploader.upload(req.file.path ,{width:500,height:450, quality: "auto" ,fetch_format:"auto",crop: "scale"})
        const {asset_id,public_id,url,secure_url}=result
        const data={
            
            name:req.body.name,
            public_id,
            imgurl:url,
            secure_url,
            description:description,
            categoryname:categoryname,

            brandname:brandname,
            price:price,
            slasher_price:slasher_price,
            discount: (100 - Math.ceil((parseInt(price)/parseInt(slasher_price)) * 100)).toString(),
            totalPrice:( parseInt(price)+parseInt(gst)+parseInt(deliverycharges)).toString(),
            deliverycharges:parseInt(deliverycharges),
            gst:gst
        }
        const newData=new BulkModel(data)
        await newData.save()
        if(req.file){
            fs.unlinkSync(req.file.path)
        }
        res.status(200).send({status:'success',newData})
        
    } catch (error) {
        if(req.file){
            fs.unlinkSync(req.file.path)
        }
        if(error.message){
            return   res.status(500).send({status:'failed',message:error.message})
        }
        res.status(500).send({status:'internalFailed',message:error})
    }
});




Router.route('/getSearchdata/:name').get(async(req,res)=>{
    let cname=req.params.name.toLowerCase()
    if(cname.endsWith('s')){
        cname=cname
    }else{
        cname=cname+'s'
    }

   
    try {
        const page=parseInt(req.query.pageno);
        if(!page){
            throw new httpError("Page number not provided") 
        }
        const itemperpage=6;
        let lastindex=page*itemperpage;
        let firstindex=lastindex-itemperpage

     const result=await BulkModel.find({categoryname:cname}).limit(lastindex).skip(firstindex).exec()
        if(result.length===0){
            throw new httpError('Sorry No Items Found')
        }
     console.log(result)

     res.status(200).send({status:"success",result})
        
    } catch (error) {

        if(error.message){
           return    res.status(403).send({status:"failed",message:error.message})
 
        }
      res.status(500).send({status:"internal failed",message:error})

        
    }

})

module.exports=Router