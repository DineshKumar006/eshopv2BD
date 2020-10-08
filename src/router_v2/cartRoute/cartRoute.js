const cartModal =require('../../models/cartModal/cartModal')
const Router=require('express').Router()
const authMiddleware=require('../../middleware/authmiddleware')
const mongoose=require('mongoose')
const httpError=require('../../errorModal/errorModal')
const userModalv2=require('../../models/usermodal/userModel2')



Router.route('/addCartItems').post(authMiddleware,async(req,res)=>{
    try {
 const {categoryname,seriesname, description,brandname,price,
    slasher_price,deliverycharges,gst,discount,totalPrice,public_id,
    secure_url,imgurl,_id,name}=req.body

        const isUser=await userModalv2.findOne({_id:req.validUser._id},'-password').exec()
        if(!isUser){
            throw new httpError('User not found',402)
        }
        const newCartdata=new cartModal()
        newCartdata.categoryname=categoryname?categoryname:'NAN'
        newCartdata.brandname=brandname,
        newCartdata.description=description,
        newCartdata.seriesname=seriesname?seriesname:name?name:'NAN'

        newCartdata.public_id=public_id
        newCartdata.imgurl=imgurl
        newCartdata.secure_url=secure_url

        newCartdata.price=price
        newCartdata.slasher_price=slasher_price
        newCartdata.discount= discount
        newCartdata.totalPrice=totalPrice
        newCartdata.deliverycharges=deliverycharges
        newCartdata.gst=gst

        newCartdata.userid=req.validUser._id
        newCartdata.itemid=_id


        await newCartdata.save()
        const session=await mongoose.startSession();
        session.startTransaction()
        const result=await newCartdata.save({session:session})
        await isUser.userCart.push(result)
        await isUser.userCartItemid.push(_id)
        await isUser.save({session:session})
        await session.commitTransaction()

        res.status(200).send({status:"sucess",result})

        

    } catch (error) {
console.log(error)
        if(error.message){
            return res.status(403).send({status:"failed",message:error.message})
        }

        return res.status(500).send({status:"failed",message:"Internal failed"})
    }
});



Router.route('/getCartData').get(authMiddleware,async(req,res)=>{

    const currpageno=parseInt(req.query.pageno);
    console.log(req.query.pageno)

    let itemperPage
    let lastIndex
    let firstIndex

    if(currpageno==1){
         itemperPage=3;
         lastIndex=itemperPage * currpageno
         firstIndex=null
    }else{
         itemperPage=3;
         lastIndex=itemperPage * currpageno
         firstIndex=lastIndex-itemperPage;
    }

    try {
        

        if(!req.query.pageno){
            throw new httpError("plz provide page number",403)
        }

        const isUser=await userModalv2.findOne({_id:req.validUser._id},['-password','-token','-userOrders','-avatarurl','-public_id','-createdAt','-updatedAt','-userCartItemid'])
        .populate({
            path:"userCart",options:{limit:itemperPage,skip:firstIndex}
        })

      if(isUser.userCart.length===0){
            throw new httpError('No items in cart!',403)
        }


        res.status("200").send({status:"success",isUser})
    } catch (error) {

         console.log(error)
        if(error.message){
            return res.status(403).send({status:"failed",message:error.message})
        }
        return res.status(500).send({status:"failed",message:"internal failed"})
        
    }
})



Router.route("/deleteCartItem/:itemid").delete(authMiddleware,async(req,res)=>{

    const id=req.params.itemid
    try {
        
        const cartData=await cartModal.findOne({itemid:id}).populate('userid').exec();
        //  console.log(cartData)
        if(!cartData){
            throw new httpError("No data found",403)
        }
        const session=await mongoose.startSession()
        session.startTransaction()
        const result=await cartData.remove({session:session})
        await cartData.userid.userCart.pull(result)
        await cartData.userid.userCartItemid.pull(id)
        await cartData.userid.save({session:session})
        await session.commitTransaction()
        res.status(200).send({status:"success", message:"delete success"})

    } catch (error) {

         console.log(error)

        if(error.message){
            return  res.status(403).send({status:"Failed",message:error.message})
        }
        
        res.status(500).send({status:"Failed",message:"Internal Failed"})
    }


})


module.exports=Router


