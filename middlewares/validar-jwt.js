const { response } = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const validarJWT = async(req, res = response, next) => {

    // x-token headers
    const token = req.header('x-token');
    if ( !token ) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay token en la petición'
        })
    }
    
    try {
        const { uid, name } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        // Leer el usuario que corresponde al uid
        const usuario = await User.findById(uid);


        if (!usuario) {
            return res.status(401).json({
                ok: false,
                msg: 'Token no válido - usuario no existe en DB'
            });
        }

        if (!usuario.status) {  
            return res.status(401).json({
                ok: false,
                msg: 'Token no válido - usuario con estado: false'
            });
        }
        req.user = usuario;
        req.uid = uid;
        req.name = name;


    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    next();

}

module.exports = {
    validarJWT
}