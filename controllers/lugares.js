const { response } = require('express');
const Place = require('../models/place');
const User = require('../models/user');

// OBTENER TODAS LAS CATEGORIAS
// OBTENER TODAS LAS CATEGORIAS
const getLugares = async (req, res = response) => {

    try {
        console.log(req.query)
        // OBTENIENDO LA CATEGORIA
        const { category = 'all'} = req.query


        
        // SI NO ENVIAN PARAMETROS
        if (category === 'all' || category === undefined) {
            const lugares = await Place.find();
            const lugaresCount = await Place.countDocuments();


            // REGRESAMOS TODOS LOS LUGARES
            return res.status(200).json({
                ok: true,
                msg: 'Lista general de lugares',
                lugares,
                lugaresCount,
            });
        }

        // SI ENVIAN PARAMETROS
        const query = {}
        query[category] = true;
        const lugares = await Place.find(query);
        if (lugares.length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No hay lugares para esta categoria'
            });
        }
        return res.status(200).json({
            ok: true,
            msg: `Lista de lugares para la cateogria ${category}`,
            lugares,
        });      
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ah ocurrido un error, contacte al administrador'
        });
    }

}

 // OBTENER UNA CATEGORIA POR ID
const getLugar = async (req, res = response) => {

    const { id } = req.params;
    if (id === '') {
        return res.status(400).json({
            ok: false,
            msg: 'El id es obligatorio'
        });
    }

    const myPlace = await Place.findById(id).populate('uidOwner', 'name');

    if (!myPlace) {
        return res.status(400).json({
            ok: false,
            msg: 'El lugar no existe'
        });
    }
    return res.status(200).json({
        ok: true,
        msg: 'Lugar encontrado',
        myPlace
    });
    
}


const postLugar = async (req, res = response) => {

    const name = req.body.name;
    const place = await Place.findOne({ name });

    if (place) {
        return res.status(400).json({
            ok: false,
            msg: 'El lugar ya existe'
        });
    }

    if (!req.user.owner) {
        return res.status(400).json({
            ok: false,
            msg: 'No cuentas con un perfil de dueño'
        });
    }
    
    // Generar la data a guardar
    const data = {
        ...req.body,
        uidOwner: req.uid
    };

    // Guardar en la base de datos
    const lugar = new Place(data);
    await lugar.save();

    return res.status(200).json({
        ok: true,
        msg: 'Lugar creado con exito',
    });
}

const putLugar = async (req, res = response) => {
    const { id } = req.params;
    const place = await Place.findById(id);

    if (!place) {
        return res.status(400).json({
            ok: false,
            msg: 'El lugar no exite'
        });
    }

    if (!req.user.owner) {
        return res.status(400).json({
            ok: false,
            msg: 'No cuentas con un perfil de dueño'
        });
    }

    const newPlaceInformation = await Place.findOneAndUpdate(id, req.body, { new: true })
    return res.status(200).json({
        ok: true,
        msg: 'Lugar modificado con exito',
        newPlaceInformation
    });

};

const deleteLugar = async (req, res = response) => {
    const { id } = req.params;
    
    try {
        const deletePlace = await Place.findByIdAndDelete(id);
        if (!deletePlace) {
            return res.status(400).json({
                ok: false,
                msg: 'El lugar no exite'
            });
        }
        res.status(200).json({
            ok: true,
            ms: 'Lugar eliminado con exito',
        });

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ah ocurrido un error, contacte al administrador'
        });
    }
    


}

module.exports = {
    getLugares,
    getLugar,
    postLugar,
    putLugar,
    deleteLugar,
}