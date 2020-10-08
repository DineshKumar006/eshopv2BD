const mongoose=require('mongoose');
const gadgetsModel=require('../../models/electornicModal/newGadgets')
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




Router.route('/addGadgets').post( imageUpload.array('gadgets',8),async(req,res)=>{

    try {
const {categoryname,seriesname, description,brandname,price,slasher_price,deliverycharges,gst}=req.body


    req.files.map(async(ele)=>{
        try {
            
       
       const result=await cloudinary.uploader.upload(ele.path,{width:500,height:450, quality: "auto" ,fetch_format:"auto",crop: "scale"})
        const newData=new gadgetsModel()
        newData.categoryname=categoryname
        newData.brandname=brandname,
        newData.description=description,
        newData.seriesname=seriesname

        newData.public_id=result.public_id
        newData.imgurl=result.url
        newData.secure_url=result.secure_url

        newData.price=price
        newData.slasher_price=slasher_price
        newData.discount= (100 - Math.ceil((parseInt(price)/parseInt(slasher_price)) * 100)).toString()
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


Router.route('/getGadgets/:categoryname').get(async(req,res)=>{


    try {

        if(!req.query.pageno){

           throw new httpError("Plz provide page no",422) 

        }
        const itemperpage=6
        let lastindex= parseInt(req.query.pageno * itemperpage)
        const firstindex=lastindex-itemperpage
    

      const result=await gadgetsModel.find({categoryname:req.params.categoryname}).limit(itemperpage).skip(firstindex)
        // console.log(result)

        res.status(200).send({status:"Success",result})
        
    } catch (error) {

        if(error.message){
            return res.status(403).send({status:"fetch failed", message:error.message})
        }
        
        res.status(500).send({status:"internal fetch failed"})
    }

})






module.exports=Router















