const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(bodyParser.json());

// Base de datos simulada
let users = [
    {
        id_usuario: 1,
        nombre: 'Laia',
        apellido_pat: 'Nieves',
        apellido_mat: 'Luna',
        num_casa: 1,
        correo: 'lainilu@gmail.com',
        password: '123456',
        tel_casa: "4491572244",
        cel: "4491572244"
    },
    {
        id_usuario: 2,
        nombre: 'Fernando',
        apellido_pat: 'Rojas',
        apellido_mat: 'Ruiz',
        no_casa: 2,
        correo: 'ferouz@gmail.com',
        password: 'hola12',
        tel_casa: "4491572275",
        cel: "44915448215"
    },
    {
        id_usuario: 3,
        nombre: 'Perla',
        apellido_pat: 'Sanchez',
        apellido_mat: 'Lopez',
        no_casa: 2,
        correo: 'perlasa@hotmail.com',
        password: 'perla123',
        tel_casa: "4491572244",
        cel: "4491572244"
    }
];

// Endpoint GET para obtener la lista de users
app.get('/users', (req, res) => {
    res.json(users);
});

// Endpoint POST para recibir correo y contraseña
app.post('/users/login', (req, res) => {
    const { correo, password } = req.body;  // Extraemos correo y contraseña del cuerpo de la solicitud

    // Asegurarnos de que ambos campos estén presentes
    if (!correo || !password) {
        return res.status(400).json({ message: 'Faltan credenciales' });
    }

    // Buscar el usuario por correo
    const user = users.find(u => u.correo === correo);

    if (!user) {
        // Si no se encuentra el usuario
        return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Compara las contraseñas (sin cifrado, solo para probar)
    if (user.password === password) {
        // Si las contraseñas coinciden, devolvemos la información del usuario
        res.json(users);
    } else {
        // Si las contraseñas no coinciden
        return res.status(401).json({ message: 'Contraseña incorrecta' });
    }
});




// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
