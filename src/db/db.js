const mongoose=require('mongoose')
const url='mongodb+srv://root:root@cluster0-gxjis.gcp.mongodb.net/eshoppingv2?retryWrites=true&w=majority'


mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false}).then(()=>{

    console.log('connection online...')
}).catch((e)=>{
    console.log('something went wrong! check the internet connection!')

})
var db=mongoose.connection

db.once('open',()=>{
    console.log('db is connected')
})