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

// Endpoint POST para recibir usuario y contraseña
app.post('/users/login', (req, res) => {
    const { nombre, password } = req.body; // Extraemos usuario y password del cuerpo de la solicitud

    // Buscar el usuario en la lista de usuarios
    const user = users.find(u => u.nombre === nombre && u.password === password);

    if (user) {
        // Si el usuario y la contraseña coinciden, devolvemos la información completa
        res.json(user);
    } else {
        // Si no se encuentra el usuario o la contraseña es incorrecta
        res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
