const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs')
const httpError=require('../../errorModal/errorModal')
const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true, 
    },
    email:{
        type:String,
        unique:true,
        lowercase:true,
        required:true,
        validate(value){
           if(!validator.isEmail(value)){
            throw new Error('not a valid email')
           }
        }
    },

    password:{
        type:String,
        required:true,
        minlenght:6,
        trim:true,
        validate(value){
            let str=value.toLowerCase().includes('password')
            if(str){
                throw new Error('password should not be password')
            }
        }
    
    },

    phonenumber:{type:Number,
        required:true,
        trim:true,
        validate(value){
            if(value<7){
                throw new Error('not a valid phone number')
            }
        }
    },

    token:{type:String},
    avatarurl:{type:String},
    public_id:{type:String},

    userOrders:[{type:mongoose.Types.ObjectId, ref:'ordersv2'}],
    userCart:[{type:mongoose.Types.ObjectId,ref:'userscart'}],
    userCartItemid:[{type:mongoose.Types.ObjectId}]

    },
    {
    timestamps:true
    })







userSchema.statics.validateUser=async function(email,password){

   const userExists=await userModel.findOne({email:email});
    if(userExists){
        const validUser=await bcrypt.compare(password, userExists.password)
        console.log(validUser)
        if(validUser){
            userExists.generateToken();
            return userExists
        }else{
            throw new httpError("Password wrong,plz try again",403)
        }
    }else{
        throw new httpError('User not found',403)
    }

}




userSchema.statics.userExists=async(email)=>{
    const userExists=await userModel.findOne({email}).exec()
    console.log(userExists)
    if(userExists){
        return true
    }
    return false

}


userSchema.methods.generateToken=async function(){
    //  console.log(this._id.toString())
    // const token=jwt.sign({_id:this._id.toString()},'eshopping', {expiresIn:'1d'})
    const token=jwt.sign({_id:this._id.toString()},'my eshopping',{expiresIn:'1h'})
    this.token=token
    await this.save();
    return token
}


const userModel=mongoose.model('userDatav2', userSchema)


module.exports=userModel