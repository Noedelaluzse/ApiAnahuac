const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT } = require('../middlewares');
const { getComments, postComment, putComment, deleteComment } = require('../controllers/comments');

const router = Router();

router.get('/:id', [
    check('id', 'El id es obligatorio').not().isEmpty(),
    validarCampos
], getComments);

router.post('/',[
    validarJWT,
    check('text', 'El texto es obligatorio').not().isEmpty(),
    check('placeId', 'El id del lugar es obligatorio').not().isEmpty(),
    check('userId', 'El id del usuario es obligatorio').not().isEmpty(),
    validarCampos
], postComment);

router.put('/:id',[
    validarJWT,
    check('id', 'No es un id mongo válido').isMongoId(),
    validarCampos
], putComment);

router.delete('/:id',[ 
    validarJWT,  
    check('id', 'No es un id mongo válido').isMongoId(),
    validarCampos
], deleteComment);

module.exports = router;