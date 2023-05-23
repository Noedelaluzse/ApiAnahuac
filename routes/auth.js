/**
 * Rutas de Usuarios / Auth
 * host + /api/auth
 */

const {Router} = require('express');
const { check } = require('express-validator');
const router = Router();
const { crearUsuario,
        loginUsuario,
        revalidarToken,
        getUser,
        googleSignIn }  = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.post('/new', 
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('phone', 'El telefono es obligatorio').isMobilePhone(),
        check('password', 'El passwor debe de ser de 6 caracteres').isLength({min: 6}),
        validarCampos

    ],
    crearUsuario );

router.post('/login', 
    [
        check('phone', 'El telefono es necesario').isMobilePhone(),
        validarCampos
    ],
     loginUsuario );

router.get('/user/:id',getUser );

router.post( '/google',
    [
        check('id_token', 'El token de Google es necesario').not().isEmpty(),
        validarCampos
    ],
    googleSignIn
);
router.get('/renew', validarJWT, revalidarToken );



module.exports = router;