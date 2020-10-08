const Router=require('express').Router()

const brandModal=require('../../models/brandModal/brandModal')



Router.route("/addBrand").post(async(req,res)=>{
try {
    // Jack & Jones

    const name=req.body.brandName.toLowerCase().trim().split(' ').join('')
    console.log(name)
        const data={
            brandName:name,
            menJeans:[],
            menTshirts:[],
            menShirts:[],
            womenJeans:[],
            womenTshirts:[],
            womenShirts:[]
        }

    const brandData=new brandModal(data)
    await brandData.save()

    res.status(200).send({status:"brand added success",result:brandData})    
} catch (error) {

    res.status(500).send({status:"brand added Failed!!",message:error})    

}


})


Router.route('/getBrand/:brandname').get(async(req,res)=>{

    const currpageno=parseInt(req.query.pageno);

    try {
        const itemperPage=1;
        const lastIndex=itemperPage * currpageno
        const firstIndex=lastIndex-itemperPage;

        const name=req.params.brandname.toLowerCase().trim().split(' ').join('')
        const brandData=await brandModal.find({brandName:name}).populate({
            path:'menTshirts',options:{limit:itemperPage,skip:firstIndex}}).populate({
            path:'menShirts',options:{limit:itemperPage,skip:firstIndex}}).populate({
            path:'menJeans',options:{limit:itemperPage,skip:firstIndex}}).populate({
            path:'womenJeans',options:{limit:itemperPage,skip:firstIndex}}).populate({
            path:'womenTshirts',options:{limit:itemperPage,skip:firstIndex}}).populate({
            path:'womenShirts',options:{limit:itemperPage,skip:firstIndex}}).exec()
    

console.log(await brandModal.countDocuments())
                let newarr=[]
            brandData.forEach(ele=>{
                
                newarr.push(ele.menJeans,...ele.menTshirts,...ele.menShirts,...ele.womenJeans,...ele.womenTshirts,...ele.womenShirts)
            })
               
            
        res.status(200).send({status:"success",result:newarr,len:newarr.length})    
    } catch (error) {
        console.log(error)
        res.status(500).send({status:"Fetch Failed!!",message:error})   
    }
})


module.exports=Router