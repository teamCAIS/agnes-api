const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const tagSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

tagSchema.plugin(mongoosePaginate);

const tagModel = model("tag", tagSchema);

module.exports = tagModel;