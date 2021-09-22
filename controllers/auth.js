const Usuario = require("../models/usuario");
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res) => {
    const { email, password } = req.body;


    try {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                msg: 'El correo ya está registrado'
            });
        }
        const usuario = new Usuario(req.body);

        //Encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();
        const token = await generarJWT(usuario.id);

        res.status(200).json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error
        });
    }

}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {

        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                msg: 'El Email no se encuentra registrado'
            });
        }
        //validar password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'La contraseña no es valida'
            });
        }
        const token = await generarJWT(usuarioDB.id);

        return res.status(200).json({
            msg: 'login',
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }

}

const renewToken = async (req, res) => {
    const uid = req.uid;
    const token = await generarJWT(uid);
    const usuario = await Usuario.findById(uid);

    res.status(200).json({
        ok: true,
        usuario,
        token
    });
}



module.exports = { crearUsuario, login, renewToken };