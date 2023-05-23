const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../firebase/google-verify');

const crearUsuario = async(req, res = response) => {

    const {phone, password} = req.body;     

    try {
        let usuario = await User.findOne({phone});
        if ( usuario ) {
            return res.status(400).json ({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            })
        }
        usuario  = User(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name, 
            phone: usuario.phone,
            img: usuario.img,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Sucedio un error, hable con el administrador'
        })
    }

}

const loginUsuario = async (req, res = response) => {

    
    const {phone, password} = req.body; 

    try {

        let usuario = await User.findOne( { phone });

        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese telefono'
            });
        }

        // confirmar los passwords
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            phone: usuario.phone,
            img: usuario.img,
            token
        });


    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Sucedio un error, hable con el administrador'
        })
    }
}

const getUser = async(req, res = response) => {

    const { id } = req.params; 

    try {
        const usuario = await User.findById(id);

        if ( !usuario ) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }
        //let user = usuario[0]
        res.json({
            ok: true,
            usuario
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error en la peticion'
        })
    }

}

const revalidarToken = async(req, res = response) => {
    
    const { uid, name } = req; 

    // Generar un nuevo JWT y retornarlo en la petición
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        token
    })
}

const googleSignIn = async(req, res = response) => {
    const { id_token } = req.body;

    try {
        const { nombre, img, correo } = await googleVerify(id_token);

        let usuario = await User.findOne({email: correo});

        if ( !usuario ) {
            // Tengo que crearlo
            const data = {
                name: nombre,
                email: correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new User(data);
            await usuario.save();
        }

        // Si el usuario en DB
        if ( !usuario.status ) {
            return res.status(401).json({
                ok: false,
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);
        return res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Token de Google no es correcto'
        })
    }

    
}
// TODO: ACTUALIZAR DATOS USUARIOS

// TODO: SUBIR FOTO DE PERFIL

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
    googleSignIn,
    getUser
}