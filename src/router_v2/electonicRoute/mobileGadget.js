const mongoose=require('mongoose');
const mobileModel=require('../../models/electornicModal/mobileGadgetModel')
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


const imageUpload=multer({
    limits:{
        fileSize:500000
    },

    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'uploads/images')
        },

        filename:(req,file,cb)=>{
            cb(null,uuid()+'.png')
        }
    })
})




Router.route('/addMobiles').post( imageUpload.array('mobiles',8),async(req,res)=>{

    try {
const {categoryname,seriesname, description,brandname,price,slasher_price,deliverycharges,gst,filtergroup}=req.body


    req.files.map(async(ele)=>{
        try {
            
       
       const result=await cloudinary.uploader.upload(ele.path,{width:500,height:450, quality: "auto" ,fetch_format:"auto",crop: "scale"})
        const newData=new mobileModel()
        newData.categoryname=categoryname
        newData.brandname=brandname,
        newData.description=description,
        newData.seriesname=seriesname

        newData.public_id=result.public_id
        newData.imgurl=result.url
        newData.secure_url=result.secure_url

        newData.price=price
        newData.slasher_price=slasher_price
        newData.discount=(Math.ceil((parseInt(price)/parseInt(slasher_price)) * 100)).toString()
        newData.totalPrice=( parseInt(price)+parseInt(gst)+parseInt(deliverycharges)).toString()
        newData.deliverycharges=parseInt(deliverycharges)
        newData.gst=gst

       await newData.save()
    
      fs.unlinkSync(ele.path)
   

    } catch (error) {
            
         throw new httpError(`Failed${error}`,500)
    }

    })


    res.status(200).send({status:'upload success'})

    } catch (error) {
        console.log(error)

        if(req.files){
            res.files.map(ele=>{
                fs.unlinkSync(ele.path)
            })
        }

        res.status(500).send({status:'upload Failed'})
    }
})








module.exports=Router















