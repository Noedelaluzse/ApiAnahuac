const { Schema, model } = require("mongoose");

const CommentSchema = Schema({
    
    text: {
        type: String,
        require: [true, 'El texto es obligatorio'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
        require: true
    }
});

CommentSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Comment', CommentSchema);