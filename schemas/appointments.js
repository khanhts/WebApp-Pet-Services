let mongoose = require('mongoose');
let appointmentsSchema = mongoose.Schema({
    checkupDate:{
        type:Date,
        required:true
    },
    customer:{
        type:mongoose.Types.ObjectId,
        ref:'users',
        required:true
    },
    vet:{
        type:mongoose.Types.ObjectId,
        ref:'users',
        required:true
    },
    petInfo:{
        type:String,
        default:"",
    },
    description:{
        type:String,
        default:"",
    },
    status:{
        type:String,
        enum:['pending','approved','completed','cancelled'],
        default:'pending'
    },
    isDelete:{
        type:Boolean,
        default: false,
    }
},{
    timestamps:true
})
module.exports = mongoose.model('appointments',appointmentsSchema)