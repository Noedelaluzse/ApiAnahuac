const { Schema, model } = require('mongoose');
const LocationSchema = require('./location');
const CategorySchema = require('./category');
const ClassificationSchema = require('./clasification');

const LugarSchema = Schema({

    name: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
        unique: true
        
    },
    comments: {
        type: String,
    },
    description: {
        type: String,
        require: [true, 'La descripcion es obligatoria'],
    },
    phone: {
        type: String,
        require
    },
    address: {
        type: Object,
        require: [true, 'La direccion es obligatoria'],
        LocationSchema
    },
    uidOwner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    restaurant:{
        type: Boolean,
    },
    bar:{
        type: Boolean,
    },
    cafe:{
        type: Boolean,
    },
    nightclub: {
        type: Boolean,
    },
    live_music: {
        type: Boolean,
    },
    sports_bar: {
        type: Boolean,
    },
    park: {
        type: Boolean,
    },
    img: {
        type: String,
    }
});

LugarSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Place', LugarSchema);


