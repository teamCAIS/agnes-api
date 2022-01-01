const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: 'STUDENT'
    },
    photo: {
        type: String,
        default: "",
    },
    school: {
        type: Schema.Types.ObjectId,
        ref: 'school',
        required: true,
    },
}, {
    timestamps: true,
});

userSchema.plugin(mongoosePaginate);

const userModel = model("user", userSchema);

module.exports = userModel;