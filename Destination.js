import { Schema, model } from "mongoose";


const schema = new Schema({
    place:String,
    image:String,
    description:String,
    isDeleted:{
        type:Boolean,
        default:false
    }

})

const Destination  = model('place', schema);

export default Destination;