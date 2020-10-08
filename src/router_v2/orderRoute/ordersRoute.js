
const Router=require('express').Router()
const orderModal=require('../../models/orderModal/orderModal')

const authMiddleware=require('../../middleware/authmiddleware')
const mongoose=require('mongoose')
const userModalv2=require('../../models/usermodal/userModel2')
const httpError=require('../../errorModal/errorModal')

Router.route('/Createorder').post( authMiddleware, async(req,res)=>{    
    // const {id,username,email}=req.body.orderBy
const {brandname,price,paymentmode,quantity,secure_url,_id,description,totalPrice} =req.body.productdetails

const {username,zipcode,address,phonenumber,email,city}=req.body.address

    try {

        await orderModal.generateMail(email,req.body.productdetails)


     const isUser=await userModalv2.findOne({_id:req.validUser._id}).exec()
        if(!isUser){
            throw new httpError('User not found',402)
        }
        
        const neworder=new orderModal();


        neworder.orderBy={
            userid:req.validUser._id,
            username:req.validUser.username,
            email:req.validUser.email
        },
    
        neworder.productdetails={
            productname:brandname,
            price,
            paymentmode:paymentmode?paymentmode:'COD',
            quantity:quantity?quantity:1,
            productLink:secure_url,
            cartid:"123",
            itemid:_id,
            description,
            totalPrice
        },
        neworder.address={
            username,
            email,
            phonenumber,
            address,
            city,
            zip_code:zipcode
        }
        
        // try {
        //     await userModalv2.generateMail(req.body.email,req.body.productdetails)
        // } catch (error) {
        //     throw new httpError("Mail send failed",500)
        // }
        
        const session=await mongoose.startSession()
        session.startTransaction()
        const result=await neworder.save({session:session})
        await isUser.userOrders.push(result)
        await isUser.save({session:session})
        await session.commitTransaction()



        res.status(200).send({status:"order placed success",result})
    } catch (error) {
        console.log(error)


        if(error.message){
            return  res.status(500).send({status:"Failed",message :error.message})  
          }
        res.status(500).send({status:"internal Failed"})
        
    }


})



Router.route('/userorders').get(authMiddleware,async(req,res)=>{

    const currpageno=parseInt(req.query.pageno);
    console.log(req.query.pageno)

    let itemperPage
    let lastIndex
    let firstIndex

    if(currpageno==1){
         itemperPage=2;
         lastIndex=itemperPage * currpageno
         firstIndex=null
    }else{
         itemperPage=2;
         lastIndex=itemperPage * currpageno
         firstIndex=lastIndex-itemperPage;
    }
   
    try {

        if(!req.query.pageno){
            throw new httpError("plz provide page number",403)
        }
        const result=await userModalv2.findOne({_id:req.validUser._id},'-password').populate({
            path:'userOrders',options:{limit:itemperPage,skip:firstIndex}
        })
        if(result.userOrders.length===0){
            throw new httpError("No more order found",403)
        }
        // console.log(result.userOrders.length)
        res.status(200).send({status:"success",result})        
    } catch (error) {

        if(error.message){
            return res.status(403).send({status:"failed",message:error.message})
        }
         res.status(500).send({status:"internal failed"})

    }
})

module.exports=Router