const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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

 const schoolTagSchema = new Schema({
    tag: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        required: true,
        default: 0,
    },
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
    },
    tags: {
        type: [schoolTagSchema],
        required: true,
        default: [],
    }
}, {
    timestamps: true,
});

schoolSchema.plugin(mongoosePaginate);

const schoolModel = model("school", schoolSchema);

module.exports = schoolModel;