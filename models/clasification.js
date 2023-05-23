const { Schema, model } = require('mongoose');

const ClassificationSchema = new Schema({
    family: {
        type: Boolean,
        default: false
    },
    friends: {
        type: Boolean,
        default: false
    },
    couple: {
        type: Boolean,
        default: false
    },
    business: {
        type: Boolean,
        default: false
    },
    single: {
        type: Boolean,
        default: false
    },
    kids: {
        type: Boolean,
        default: false
    }
});  

module.exports = model('Classification', ClassificationSchema);