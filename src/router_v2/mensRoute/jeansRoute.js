const jeansModal=require('../../models/mensModal/jeansModal')
const multer=require('multer')
const {v4:uuid}=require('uuid')
// const sharp=require('sharp')
const Router=require('express').Router()
let cloudinary=require('cloudinary').v2
const httpError=require('../../errorModal/errorModal')
const fs=require('fs')

cloudinary.config({
     cloud_name:process.env.CLOUD_NAME,
     api_key:process.env.CLOUD_API_KEY,
     api_secret:process.env.CLOUD_API_SECRET
})

 const jeansImage=multer({
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

Router.route('/addjeans').post(jeansImage.single("jeansImg"),async(req,res)=>{

    // console.log(req.file)
    const {categoryname, description,brandname,price,slasher_price,deliverycharges,gst}=req.body


    try {
        if(req.body.name.toLowerCase()!=="men_jeans"){
            throw new httpError("uploading wrong item, plz check!",403)
        }

        const result=await cloudinary.uploader.upload(req.file.path ,{width:500,height:450, quality: "auto" ,fetch_format:"auto",crop: "scale"})
        // console.log(result)
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
        const newData=new jeansModal(data)
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
});



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

Router.route('/getMenjeans').get(async(req,res)=>{
    try {
        const page=parseInt(req.query.pageno);
        if(!page){
            throw new httpError("Page number not provided") 
        }
        const itemperpage=6;
        let lastindex=page*itemperpage;
        let firstindex=lastindex-itemperpage

        const data=await jeansModal.find({}).limit(itemperpage).skip(firstindex).exec()
        const totalpages= Math.ceil(await jeansModal.countDocuments().exec()/itemperpage)
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





Router.route('/deleteMenjeans/:id').delete(async(req,res)=>{
    try {
        
        const data= await jeansModal.findOneAndDelete({_id:req.params.id}).exec()
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


