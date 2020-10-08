const jack_and_jonesModal=require('../../models/brandModal/jackandjones/jack&jones')
const multer=require('multer')
const {v4:uuid}=require('uuid')
const Router=require('express').Router()
let cloudinary=require('cloudinary').v2
const httpError=require('../../errorModal/errorModal')
const fs=require('fs')

cloudinary.config({
     cloud_name:process.env.CLOUD_NAME,
     api_key:process.env.CLOUD_API_KEY,
     api_secret:process.env.CLOUD_API_SECRET
})

 const j_and_j=multer({
     limits:{
         fileSize:5000000
     },
     
     storage:multer.diskStorage({
         destination:(req,file,cb)=>{
                cb(null,'src/uploads/images')
         },
         filename:(req,file,cb)=>{
            cb(null,uuid()+'.'+'png')
         }
     })
     
 })

Router.route('/addJ&JBrand').post(j_and_j.single("Img"),async(req,res)=>{

    // console.log(req.file)
    const bname=req.body.name.toLowerCase().trim().split(' ').join('')
    try {

        if(bname!=="jack&jones"){
            throw new httpError("upload not allowed",402)
        }
     
        const result=await cloudinary.uploader.upload(req.file.path ,{width:500,height:450, quality: "auto" ,fetch_format:"auto",crop: "scale"})
        // console.log(result)
        const {asset_id,public_id,url,secure_url}=result
        const data={
            public_id,
            brandname:req.body.name,
            public_id,
            imgurl:url,
            description:req.body.description,
            secure_url,
            price:req.body.price?parseInt(req.body.price):0,
            slasher_price:req.body.slasher_price?parseInt(req.body.slasher_price):0,
            discount: 100- Math.ceil((parseInt(req.body.price)/parseInt(req.body.slasher_price)) * 100)
        }
        const newData=new jack_and_jonesModal(data)
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
        res.status(500).send({status:'internalFailed',message:"failed",error})
    }
})



Router.route('/getJ&JBrand').get(async(req,res)=>{
    try {
        const page=parseInt(req.query.pageno);
        if(!page){
            throw new httpError("Page number not provided") 
        }
        const itemperpage=6;
        let lastindex=page*itemperpage;
        let firstindex=lastindex-itemperpage

        const data=await jack_and_jonesModal.find({}).limit(itemperpage).skip(firstindex).exec()
        const totalpages= Math.ceil(await jack_and_jonesModal.countDocuments().exec()/itemperpage)
        result={
            totalpages,
            data
        }
        
        res.status(200).send({status:'success',result})

    } catch (error) {
        if(error.message){
         return   res.status(500).send({status:'failed',message:error.message})
        }
        res.status(500).send({status:'internal failed',message:"failed"})
    }
})





Router.route('/deleteJ&JBrand/:id').delete(async(req,res)=>{
    try {
        
        const data= await jack_and_jonesModal.findOneAndDelete({_id:req.params.id}).exec()
        console.log(data)
        if(data){
            const result=await cloudinary.uploader.destroy(data.public_id)

        }else{
            throw new httpError('deletion failed,product not found check id',403)
        }
       
        res.status(200).send({status:'delete success',data})

    } catch (error) {
        if(error.message){
          return  res.status(403).send({status:'delete failed',message:error.message})

        }
        res.status(500).send({status:'delete failed',message:"failed",error})
    }
})


module.exports=Router


