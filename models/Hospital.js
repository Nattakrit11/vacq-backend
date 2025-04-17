const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50,'Name cannot be >50 charactes']
    },
    address: {
        type: String,
        required: [true,'Please add an address']
    },
    district: {
        type: String,
        required: [true,'Please add a district']
    },
    province: {
        type: String,
        required: [true,'Please add a province']
    },
    postalcode: {
        type: String,
        required: [true,'Please add a postalcode'],
        maxlength: [5,'Name cannot be >5 digits']
    },
    tel: {
        type: String,
    },
    region: {
        type: String,
        required: [true,'Please add a region']
    }
},{
    toJSON: {virtuals:true},
    toObject:{virtuals:true}
});

//Reverse populate with virtuals
HospitalSchema.virtual('appointments',{
    ref: 'Appointment',
    localField: '_id',
    foreignField:'hospital',
    justone:false
});

module.exports = mongoose.model('Hospital',HospitalSchema)