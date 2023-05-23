const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT } = require('../middlewares');
const { getLugares, getLugar, postLugar, putLugar, deleteLugar } = require('../controllers/lugares');

const router = Router();

router.get('/', getLugares);
router.get('/:id', [
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('id', 'El id debe ser un id valido').isMongoId(),
    validarCampos
], getLugar);

router.post('/',[
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('description', 'La descripcion es obligatoria').not().isEmpty(),
    check('address', 'La direccion es obligatoria').not().isEmpty(),
    check('phone', 'El telefono es obligatorio').not().isEmpty(),
    check('phone', 'El telefono debe tener 10 digitos').isLength({ min: 10, max: 10 }),
    check('address', 'La direccion debe tener una calle').not().isEmpty(),
    check('address', 'La direccion debe tener una colonia').not().isEmpty(),
    check('address', 'La direccion debe tener una ciudad').not().isEmpty(),
    check('address', 'La direccion debe tener un estado').not().isEmpty(),
    check('address', 'La direccion debe tener un pais').not().isEmpty(),
    check('address', 'La direccion debe tener un codigo postal').not().isEmpty(),
    validarCampos,
], postLugar);
router.put('/:id',[
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('description', 'La descripcion es obligatoria').not().isEmpty(),
    check('address', 'La direccion es obligatoria').not().isEmpty(),
    check('phone', 'El telefono es obligatorio').not().isEmpty(),
    check('phone', 'El telefono debe tener 10 digitos').isLength({ min: 10, max: 10 }),
    check('address', 'La direccion debe tener una calle').not().isEmpty(),
    check('address', 'La direccion debe tener una colonia').not().isEmpty(),
    check('address', 'La direccion debe tener una ciudad').not().isEmpty(),
    check('address', 'La direccion debe tener un estado').not().isEmpty(),
    check('address', 'La direccion debe tener un pais').not().isEmpty(),
    check('address', 'La direccion debe tener un codigo postal').not().isEmpty(),
    validarCampos,
], putLugar);
router.delete('/:id',[
    validarJWT,    
    check('id', 'No es un id mongo válido').isMongoId(),
    validarCampos],
 deleteLugar);

module.exports = router;