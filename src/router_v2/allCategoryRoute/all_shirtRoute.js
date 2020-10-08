const mongoose=require('mongoose');
const allshortModal=require('../../models/categorymodal/shirtModal')
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




Router.route('/addAllshirts').post( imageUpload.array('allshirtimg',8),async(req,res)=>{

    try {
const {categoryname,description,brandname,price,slasher_price,deliverycharges,gst,filtergroup}=req.body

// console.log(Math.ceil((parseInt(price)/parseInt(slasher_price)) * 100))

    req.files.map(async(ele)=>{
        try {
            
       
       const result=await cloudinary.uploader.upload(ele.path,{width:500,height:450, quality: "auto" ,fetch_format:"auto",crop: "scale"})
        const newshirtData=new allshortModal()
        newshirtData.categoryname=categoryname
        newshirtData.brandname=brandname,
        newshirtData.description=description,

        newshirtData.public_id=result.public_id
        newshirtData.imgurl=result.url
        newshirtData.secure_url=result.secure_url

        newshirtData.price=price
        newshirtData.slasher_price=slasher_price
        newshirtData.discount=(Math.ceil((parseInt(price)/parseInt(slasher_price)) * 100)).toString()
        newshirtData.totalPrice=( parseInt(price)+parseInt(gst)+parseInt(deliverycharges)).toString()
        newshirtData.deliverycharges=parseInt(deliverycharges)
        newshirtData.gst=gst
        newshirtData.size.S='S'
        newshirtData.size.M='M'
        newshirtData.size.L="L"
        newshirtData.size.XL='XL'
        newshirtData.size.XXL='XXL'
        newshirtData.filtergroup=filtergroup

       await newshirtData.save()
    
      fs.unlinkSync(ele.path)
   

    } catch (error) {
            
         throw new httpError(`Failed${error}`,500)
    }

    })


    res.status(200).send({status:'upload success'})

    } catch (error) {

        if(req.files){
            res.files.map(ele=>{
                fs.unlinkSync(ele.path)
            })
        }

        res.status(500).send({status:'upload Failed'})
    }
})








module.exports=Router















