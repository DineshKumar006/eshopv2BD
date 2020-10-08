
const jwt=require('jsonwebtoken');
const userModel=require('../models/usermodal/userModel2')
const httpError=require('../errorModal/errorModal')

const authmiddleWare= async(req,res,next)=>{
try {
    const headerToken=req.header('Authorization').replace('Bearer ','')

    if(!headerToken){
        throw new httpError("Failed authorised!, provide token",402)
    }
    // console.log(headerToken)
    const isMatch=jwt.verify(headerToken,'my eshopping')
    // console.log(isMatch)

   const isUser=await userModel.findOne({_id:isMatch._id,token:headerToken});
    if(!isUser){
        throw new httpError("you are not authorised!",402)
    }
    // req.validToken=headerToken
    req.validUser=isUser
    req.headerToken=headerToken
     next();

} catch (error) {

    if(error.message){
        return res.status(402).send({status:"failed",message:error.message})
    }

    return res.status(400).send('not a valid token')
}

}




module.exports=authmiddleWare