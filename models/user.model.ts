require("dotenv").config();
import mongoose, {Document, Model, Schema} from "mongoose";
import bcrypt from "bcryptjs";
import  Jwt  from "jsonwebtoken";

const emailRegexPattern : RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface User extends Document{
    _id: string
    name: string;
    email: string;
    password: string;
    avatar:{
        public_id: string;
        url: string;
    };
    role: string;
    comparePassword: (password: string)=> Promise<boolean>;
    SignAccessToken: ()=> string;
    SignRefreshToken: ()=> string;
};

const userSchema: Schema<User> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        validate: {
            validator: function (value: string){
                return emailRegexPattern.test(value);
            },
            message: "Please enter a valid email"
        }
    },
    password: {
        type: String,
        
        minlength: [6, "Password must be 6 characters min."],
        select: false
    },
    avatar:{
        public_id: String,
        url: String
    },
    role: {
        type: String,
        default: "User"
    },
},{timestamps: true});


userSchema.methods.SignAccessToken = function(){
    return Jwt.sign({id: this._id}, process.env.ACCESS_TOKEN || '',{
        expiresIn: '5m'
    })
}

// sign refresh token 

userSchema.methods.SignRefreshToken = function(){
    return Jwt.sign({id: this._id}, process.env.REFRESH_TOKEN || '',{
        expiresIn: '3d'
    })
}


// hashe password 

userSchema.pre<User>('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// comapre password 

userSchema.methods.comparePassword = async function (enteredPassword: string) : Promise<boolean>{
    return await bcrypt.compare(enteredPassword, this.password);
};



const userModel : Model<User> = mongoose.model("User", userSchema);
export default userModel