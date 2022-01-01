const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const evaluationSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    school: {
        type: Schema.Types.ObjectId,
        ref: 'school',
        required: true,
    },
    grade: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    tags: {
        type: [Schema.Types.ObjectId],
        ref: 'tag',
        default: [],
    },
}, {
    timestamps: true,
});

evaluationSchema.plugin(mongoosePaginate);

const evaluationModel = model("evaluation", evaluationSchema);

module.exports = evaluationModel;