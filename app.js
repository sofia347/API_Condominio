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

let visitantes = [
    {
        id_visitante: 1,
        num_visit: 4,
        fecha_visit: '29-07-2024',
        id_usuario: 2,
    }
];

let Morosos = [
    {
        id_moroso: 1,
        casa: 4,
        descripcion_fecha: "Enero 2024",
        detalle: "Mantenimiento",
        cantidad: 500
    },
    {
        id_moroso: 2,
        casa: 3,
        descripcion_fecha: "Enero, Febrero 2024",
        detalle: "Mantenimiento",
        cantidad: 1000
    },
    {
        id_moroso: 3,
        casa: 1,
        descripcion_fecha: "Abril 2024",
        detalle: "Renta de inmobiliario",
        cantidad: 350
    }
]

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

// Endpoint POST para agregar una nueva reservación
app.post('/reservaciones', (req, res) => {
    const { id_reservacion, horainicio, horacierre, cant_visit, id_servicio, fecha, id_usuario } = req.body;

    // Validamos que todos los campos estén presentes
    if (!id_reservacion || !horainicio || !horacierre || !cant_visit || !id_servicio || !fecha || !id_usuario) {
        return res.status(400).json({ message: 'Faltan datos para crear la reservación' });
    }

    // Verificamos que el ID de la reservación no exista ya
    const reservationExists = reservaciones.find(r => r.id_reservacion === id_reservacion);
    if (reservationExists) {
        return res.status(409).json({ message: 'Ya existe una reservación con este ID' });
    }

    // Creamos la nueva reservación
    const newReservation = { id_reservacion, horainicio, horacierre, cant_visit, id_servicio, fecha, id_usuario };
    
    // Agregamos la nueva reservación a la lista
    reservaciones.push(newReservation);

    res.status(201).json({ message: 'Reservación creada exitosamente', reservacion: newReservation });
});

// Endpoint PUT para actualizar una reservación
app.put('/reservaciones/:id', (req, res) => {
    const { id } = req.params; // ID de la reservación desde los parámetros de la URL
    const updatedData = req.body; // Nuevos datos enviados en el cuerpo de la solicitud

    // Buscamos la reservación por su ID
    const reservationIndex = reservaciones.findIndex(r => r.id_reservacion === parseInt(id));

    if (reservationIndex === -1) {
        // Si no se encuentra la reservación
        return res.status(404).json({ message: 'Reservación no encontrada' });
    }

    // Actualizamos solo los campos enviados en el cuerpo
    reservaciones[reservationIndex] = { ...reservaciones[reservationIndex], ...updatedData };

    // Enviamos la respuesta con los datos actualizados
    res.json({
        message: 'Reservación actualizada exitosamente',
        reservacion: reservaciones[reservationIndex]
    });
});

// Endpoint DELETE para eliminar una reservación
app.delete('/reservaciones/:id', (req, res) => {
    const { id } = req.params; // ID de la reservación desde los parámetros de la URL

    // Buscamos la reservación por su ID
    const reservationIndex = reservaciones.findIndex(r => r.id_reservacion === parseInt(id));

    if (reservationIndex === -1) {
        // Si no se encuentra la reservación
        return res.status(404).json({ message: 'Reservación no encontrada' });
    }

    // Eliminamos la reservación
    reservaciones.splice(reservationIndex, 1);

    res.json({ message: 'Reservación eliminada exitosamente' });
});

app.get('/visitantes', (req, res) => {
    res.json(visitantes);
});

// Endpoint POST para agregar un nuevo visitante
app.post('/visitantes', (req, res) => {
    const { id_visitante, num_visit, fecha_visit, id_usuario } = req.body;

    // Validamos que todos los campos estén presentes
    if (!id_visitante || !num_visit || !fecha_visit || !id_usuario) {
        return res.status(400).json({ message: 'Faltan datos para crear el visitante' });
    }

    // Verificamos que el ID del visitante no exista ya
    const visitanteExists = visitantes.find(v => v.id_visitante === id_visitante);
    if (visitanteExists) {
        return res.status(409).json({ message: 'Ya existe un visitante con este ID' });
    }

    // Creamos el nuevo visitante
    const newVisitante = { id_visitante, num_visit, fecha_visit, id_usuario };

    // Agregamos el nuevo visitante a la lista
    visitantes.push(newVisitante);

    res.status(201).json({ message: 'Visitante creado exitosamente', visitante: newVisitante });
});

// Endpoint PUT para actualizar un visitante
app.put('/visitantes/:id', (req, res) => {
    const { id } = req.params; // ID del visitante desde los parámetros de la URL
    const updatedData = req.body; // Nuevos datos enviados en el cuerpo de la solicitud

    // Buscamos el visitante por su ID
    const visitanteIndex = visitantes.findIndex(v => v.id_visitante === parseInt(id));

    if (visitanteIndex === -1) {
        // Si no se encuentra el visitante
        return res.status(404).json({ message: 'Visitante no encontrado' });
    }

    // Actualizamos solo los campos enviados en el cuerpo
    visitantes[visitanteIndex] = { ...visitantes[visitanteIndex], ...updatedData };

    // Enviamos la respuesta con los datos actualizados
    res.json({
        message: 'Visitante actualizado exitosamente',
        visitante: visitantes[visitanteIndex]
    });
});

// Endpoint DELETE para eliminar un visitante
app.delete('/visitantes/:id', (req, res) => {
    const { id } = req.params; // ID del visitante desde los parámetros de la URL

    // Buscamos el visitante por su ID
    const visitanteIndex = visitantes.findIndex(v => v.id_visitante === parseInt(id));

    if (visitanteIndex === -1) {
        // Si no se encuentra el visitante
        return res.status(404).json({ message: 'Visitante no encontrado' });
    }

    // Eliminamos el visitante
    visitantes.splice(visitanteIndex, 1);

    res.json({ message: 'Visitante eliminado exitosamente' });
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
