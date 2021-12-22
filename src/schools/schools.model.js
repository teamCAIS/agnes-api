const {Schema, model} = require('mongoose');

const pointSchema = new Schema({
    type: {
       type: String,
       enum: ['Point'],
       required: true
    },
    coordinates: {
       type: [Number],
       required: true
    }
 });

const schoolSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    location: {
        type: pointSchema,
        index: '2dsphere',
    },
    grade: {
        type: Number,
        required: false,
        default: 0.0,
    }
}, {
    timestamps: true,
});

const schoolModel = model("school", schoolSchema);

module.exports = schoolModel;