const express=require('express');
const http =require('http');
const app=express();


// const server=http.createServer(app)

const cors=require('cors')
const path=require('path')
const bodyParser=require('body-parser')
require('./src/db/db')
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const server=http.createServer(app)
require('dotenv').config()

const PORT=process.env.PORT || 8080

const userRoute=require('./src/router_v2/userRoute')
const shirtRoute=require('./src/router_v2/mensRoute/shirtsRoute')
const tshirtRoute=require('./src/router_v2/mensRoute/tshirtRoute')
const jeansRoute=require('./src/router_v2/mensRoute/jeansRoute')
const brandRoute=require('./src/router_v2/brandRoute/brandRoute')

const W_shirtRoute=require('./src/router_v2/womenRoute/w_shirtsRoute')
const W_tshirtRoute=require('./src/router_v2/womenRoute/w_tshirtRoute')
const W_jeansRoute=require('./src/router_v2/womenRoute/w_jeansRoute')

const Jeck_and_JonesRoute=require('./src/router_v2/brandRoute/jack&jones')
const LevisRoute=require('./src/router_v2/brandRoute/levisRoute')
const AllshirtsRoute=require('./src/router_v2/allCategoryRoute/all_shirtRoute')
const MobileRoute=require('./src/router_v2/electonicRoute/mobileGadget')
const gadgetsRoute=require('./src/router_v2/electonicRoute/gadgetsRoute')
const ordersRouteV2=require('./src/router_v2/orderRoute/ordersRoute')
const cartRouterV2=require('./src/router_v2/cartRoute/cartRoute')

const bulkRouter=require('./src/router_v2/bulk route/bulkRoute')

app.use('/newavatar/images',express.static(path.join('newavatar','images')))
app.use('/api/eshop',shirtRoute)
app.use('/api/eshop',tshirtRoute)
app.use('/api/eshop',jeansRoute)

app.use('/api/eshop',brandRoute)

app.use('/api/eshop',W_jeansRoute)
app.use('/api/eshop',W_shirtRoute)
app.use('/api/eshop',W_tshirtRoute)



app.use('/api/eshop',LevisRoute)

app.use('/api/eshop',Jeck_and_JonesRoute)


app.use('/api/eshop',AllshirtsRoute)

app.use('/api/eshop/mobile',MobileRoute)

app.use('/api/eshop/gadgets',gadgetsRoute)

app.use('/api/eshop/order/',ordersRouteV2)
app.use('/api/eshop/users',userRoute)
app.use('/api/eshop/mycart',cartRouterV2)


app.use('/api/eshop/bulk',bulkRouter)
app.use((req,res,next)=>{
    res.status(404).send("url not found")
})

app.get('/',async(req,res)=>{
  
    res.send('EshoppingV2 app')
})


app.listen(PORT,()=>{
    console.log('Servering runnning on Port:',PORT);  
})