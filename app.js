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
        num_casa: 2,
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
        num_casa: 2,
        correo: 'perlasa@hotmail.com',
        password: 'perla123',
        tel_casa: "4491572244",
        cel: "4491572244"
    }
];

let reservaciones = [
    {
        id_reservacion: 1,
        horainicio: '08:00',
        horacierre: '14:00',
        cant_visit:  4,
        id_servicio: 1,
        fecha: '29-07-2024',
        id_usuario: 2,
    }
];

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
        // Si las contraseñas coinciden, devolvemos solo la información del usuario
        return res.json({
            id_usuario: user.id_usuario,
            nombre: user.nombre,
            apellido_pat: user.apellido_pat,
            apellido_mat: user.apellido_mat,
            num_casa: user.num_casa,
            password: user.password,
            correo: user.correo,
            tel_casa: user.tel_casa,
            cel: user.cel
        });
    } else {
        // Si las contraseñas no coinciden
        return res.status(401).json({ message: 'Contraseña incorrecta' });
    }
});

// Endpoint POST para agregar un nuevo usuario
app.post('/users/insert', (req, res) => {
    const { id_usuario, nombre, apellido_pat, apellido_mat, num_casa, correo, password, tel_casa, cel } = req.body;

    if (!id_usuario || !nombre || !apellido_pat || !apellido_mat || !num_casa || !correo || !password || !tel_casa || !cel) {
        return res.status(400).json({ message: 'Faltan datos para crear el usuario' });
    }

    const userExists = users.find(u => u.correo === correo);
    if (userExists) {
        return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    const newUser = {
        id_usuario,
        nombre,
        apellido_pat,
        apellido_mat,
        num_casa,
        correo,
        password,
        tel_casa,
        cel
    };

    users.push(newUser);

    res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser });
});

// Endpoint PUT para actualizar la información de un usuario
app.put('/users/:id', (req, res) => {
    const { id } = req.params; // Extraemos el ID del usuario desde los parámetros de la URL
    const updatedData = req.body; // Nuevos datos enviados en el cuerpo de la solicitud

    // Buscar el usuario por su ID
    const userIndex = users.findIndex(u => u.id_usuario === parseInt(id));

    if (userIndex === -1) {
        // Si el usuario no existe
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizamos solo los campos enviados en el cuerpo
    users[userIndex] = { ...users[userIndex], ...updatedData };

    // Enviamos la respuesta con los datos actualizados
    res.json({
        message: 'Usuario actualizado exitosamente',
        user: users[userIndex]
    });
});

// Endpoint PATCH para actualizar la contraseña de un usuario
app.patch('/users/:id/password', (req, res) => {
    const { id } = req.params; // ID del usuario desde los parámetros de la URL
    const { currentPassword, newPassword } = req.body; // Contraseña actual y nueva contraseña del cuerpo de la solicitud

    // Validar que ambas contraseñas estén presentes
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Debe proporcionar la contraseña actual y la nueva contraseña' });
    }

    // Buscar el usuario por su ID
    const user = users.find(u => u.id_usuario === parseInt(id));

    if (!user) {
        // Si el usuario no existe
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Validar la contraseña actual
    if (user.password !== currentPassword) {
        return res.status(401).json({ message: 'La contraseña actual es incorrecta' });
    }

    // Actualizar la contraseña
    user.password = newPassword;

    // Responder con éxito
    res.json({
        message: 'Contraseña actualizada exitosamente',
        user: {
            id_usuario: user.id_usuario,
            nombre: user.nombre,
            correo: user.correo
        }
    });
});

app.get('/reserva', (req, res) => {
    res.json(reservaciones);
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
