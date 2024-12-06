const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(bodyParser.json());

// Base de datos simulada
let alumnos = [
    {
        id: 1,
        nombre: 'Juan Pérez',
        edad: 20,
        carrera: 'Ingeniería Informática',
        promedio: 8.5
    }
];

// Endpoint GET para obtener la lista de alumnos
app.get('/alumnos', (req, res) => {
    res.json(alumnos);
});

// Endpoint POST para agregar un alumno
app.post('/alumnos', (req, res) => {
    const { id, nombre, edad, carrera, promedio } = req.body;

    // Validación básica
    if (!id || !nombre || !edad || !carrera || promedio === undefined) {
        return res.status(400).json({ mensaje: 'Faltan datos del alumno (id, nombre, edad, carrera, promedio).' });
    }

    // Verificar si el alumno ya existe
    const alumnoExistente = alumnos.find(alumno => alumno.id === id);
    if (alumnoExistente) {
        return res.status(400).json({ mensaje: 'El alumno con este ID ya existe.' });
    }

    // Agregar el nuevo alumno
    const nuevoAlumno = { id, nombre, edad, carrera, promedio };
    alumnos.push(nuevoAlumno);

    res.status(201).json({ mensaje: 'Alumno agregado correctamente.', alumno: nuevoAlumno });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
