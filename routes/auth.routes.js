const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validarJWT');
const router = Router();

router.post('/new', [
    check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
    check('password', 'El password debe tener al menos 4 caracteres.').not().isEmpty().isLength(4),
    check('email', 'El email no es valido.').isEmail(),
    validarCampos
], crearUsuario);


router.post('/', [
    check('password', 'El password debe tener al menos 4 caracteres.').not().isEmpty().isLength(4),
    check('email', 'El email no es valido.').isEmail(),
    validarCampos
], login);

router.get('/renew', validarJWT, renewToken);


module.exports = router;