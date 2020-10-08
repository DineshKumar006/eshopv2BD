const userModel=require('../models/usermodal/userModel2')
const Router=require('express').Router()
const multer=require('multer')
const sharp=require('sharp');
const authMiddleware =require('../middleware/authmiddleware')
const {v4:uuid} =require('uuid')
const fs=require('fs')
const bcrypt=require('bcryptjs')
const HttpError=require('../errorModal/errorModal')

const cloudinary=require('cloudinary').v2

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

const MIME_TYPE={
    'image/png':"png",
    'image/jpg':"jpg",
    "image/jpeg":"jpeg"
}



const imageUpload=multer({
    limits:{
        fileSize:5000000
    },

    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null, 'src/avatar/images')
        },
        filename:(req,file,cb)=>{
            let ext=MIME_TYPE[file.mimetype]
            cb(null,uuid()+'.'+ext)
        }
    })
})


Router.route('/updateProfile').patch(authMiddleware, imageUpload.single('profile_image'), async(req,res)=>{
    try {
         console.log(req.file)

        const result=await cloudinary.uploader.upload(req.file.path,{width:500,height:450, quality: "auto" ,fetch_format:"auto",crop: "scale"})
        //  console.log(result.secure_url)
        req.validUser.avatarurl=result.secure_url
        req.validUser.public_id=result.public_id
       
        await req.validUser.save()

        if(req.file){
            fs.unlinkSync(req.file.path)
        }
        res.status(200).send({status:"Upload success",user:req.validUser})
    } catch (error) {
        if(req.file){
            fs.unlinkSync(req.file.path)
        }
        console.log(error)
        res.status(403).send({status:"Failed",error})
    }
})




Router.route('/signup').post(async(req,res)=>{

    // let dest=`./newavatar/images/${uuid()}.png`

try {

    const isMatch=await userModel.userExists(req.body.email)
    //  console.log(isMatch)
    if(isMatch){
        throw new HttpError("user already exists!",402)
    }

    const {username,password,phonenumber,email}=req.body
    let hashpassword
    try {
      hashpassword=await bcrypt.hash(password,12)  
    } catch (error) {
        throw new HttpError("failed")
    }

    const data={
        username:username,
        email:email,
        phonenumber:phonenumber,
        password:hashpassword,
        avatarurl:"https://cdn.pixabay.com/photo/2017/06/13/12/53/profile-2398782_1280.png",
        public_id:null
       
    }
const newUser=new userModel(data)
// const token=await newUser.generateToken()
await newUser.save();
res.status(200).send({status:"Success",userData:{_id:newUser._id,public_id:newUser.public_id, username:newUser.username, email:newUser.email,phonenumbers:newUser.phonenumber}})

} catch (error) {
    if(error.message){
      return  res.status(500).send({status:"Failed",message :error.message})  
    }
    res.status(500).send({status:"Failed"})
}    

});



Router.route('/login').post(async(req,res)=>{

    try {
        const isuserFound=await userModel.validateUser(req.body.email,req.body.password)
        const {_id,username,email,token,avatarurl,phonenumber,userOrders} =isuserFound
        res.status(200).send({status:"success",userData:{_id,username,email,token,avatarurl,phonenumber,totalorders:userOrders.length}})

    } catch (error) {

        if(error.message){
            return  res.status(500).send({status:"Login Failed",message :error.message})  
          }
          res.status(500).send({status:"Login Failed"})
        
    }
})

Router.route('/getuserCartItemid').get( authMiddleware,async(req,res)=>{
        try {

            const isUser=await userModel.findOne({_id:req.validUser._id}).exec()
            if(!isUser){
                throw new HttpError("user not found!",403)
            }
            // console.log(isUser)
            res.status(200).send({status:"Success",Item:isUser.userCartItemid})
            
        } catch (error) {
                // console.log(error)
                if(error.message){
            return res.status(200).send({status:"internal failed",message:error.message})

                }
                res.status(200).send({status:"internal failed",message:"internal failed"})

        }
})

















module.exports=Router
