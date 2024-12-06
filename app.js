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
    const { correo, password } = req.body; // Extraemos correo y password del cuerpo de la solicitud

    // Verificamos si los parámetros necesarios están presentes
    if (!correo || !password) {
        return res.status(400).json({ message: 'Faltan credenciales' });
    }

    // Buscar el usuario en la lista de usuarios (simulación de base de datos)
    const user = users.find(u => u.correo === correo); 

    if (user) {
        // Verificamos si la contraseña coincide con la almacenada (usando bcrypt)
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                // Si la contraseña es correcta, devolvemos los datos del usuario
                res.json(user);
            } else {
                // Si la contraseña es incorrecta
                res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
            }
        });
    } else {
        // Si no se encuentra el usuario
        res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
});



// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
