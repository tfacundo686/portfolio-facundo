CREATE DATABASE IF NOT EXISTS bibliotec_eest5 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bibliotec_eest5;

CREATE TABLE IF NOT EXISTS especialidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_carrera VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    anio INT NOT NULL,
    division INT NOT NULL,
    especialidad_id INT NOT NULL,
    FOREIGN KEY (especialidad_id) REFERENCES especialidades(id)
);

CREATE TABLE IF NOT EXISTS profesores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(120) NOT NULL,
    contrasenia VARCHAR(255) NOT NULL,
    requiere_cambio_clave TINYINT(1) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS archivos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    ruta_archivo VARCHAR(255) NOT NULL,
    tipo_archivo VARCHAR(20) NOT NULL,
    profesor_id INT NOT NULL,
    curso_id INT NOT NULL,
    fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profesor_id) REFERENCES profesores(id),
    FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

INSERT IGNORE INTO especialidades (id, nombre_carrera) VALUES
(1, 'Informática Personal y Profesional'),
(2, 'Programación'),
(3, 'Maestro Mayor de Obra');

INSERT IGNORE INTO cursos (id, anio, division, especialidad_id) VALUES
(1, 4, 1, 1), (2, 4, 2, 2), (3, 4, 3, 3),
(4, 5, 1, 1), (5, 5, 2, 2), (6, 5, 3, 3),
(7, 6, 1, 1), (8, 6, 2, 2), (9, 6, 3, 3),
(10, 7, 1, 1), (11, 7, 2, 2), (12, 7, 3, 3);

INSERT IGNORE INTO profesores (id, dni, nombre, contrasenia, requiere_cambio_clave) VALUES
(1, '12345678', 'Prof. Martín Gómez', '12345678', 0),
(2, '23456789', 'Prof. Laura Méndez', '23456789', 0),
(3, '34567890', 'Prof. Carlos Ruiz', '34567890', 0),
(4, '45678901', 'Arq. Diego Pereyra', '45678901', 0);

INSERT IGNORE INTO archivos (id, titulo, ruta_archivo, tipo_archivo, profesor_id, curso_id, fecha_subida) VALUES
(1, 'Guía Práctica HTML5, CSS3 y Flexbox', '#demo-1', 'pdf', 1, 11, '2026-11-18 10:00:00'),
(2, 'Ejercicios Resueltos PHP + MySQL PDO', '#demo-2', 'zip', 2, 11, '2026-11-15 11:30:00'),
(3, 'Arquitectura de Redes y Subnetting IPv4', '#demo-3', 'pdf', 3, 10, '2026-11-12 09:15:00'),
(4, 'Plano Estructural Vivienda Unifamiliar', '#demo-4', 'dwg', 4, 12, '2026-11-10 14:20:00'),
(5, 'Introducción a Python y CustomTkinter', '#demo-5', 'pdf', 2, 8, '2026-11-08 08:45:00'),
(6, 'Simulador de Circuitos Digitales y Compuertas', '#demo-6', 'exe', 3, 7, '2026-11-04 16:00:00'),
(7, 'Cálculo de Hormigón Armado — Vigas y Columnas', '#demo-7', 'pdf', 4, 9, '2026-11-01 13:10:00'),
(8, 'Fundamentos de JavaScript y DOM', '#demo-8', 'pdf', 1, 5, '2026-10-28 10:05:00'),
(9, 'Mantenimiento Preventivo de Hardware PC', '#demo-9', 'mp4', 3, 4, '2026-10-24 15:40:00'),
(10, 'Instalaciones Sanitarias y Desagües', '#demo-10', 'dwg', 4, 6, '2026-10-20 12:00:00'),
(11, 'Lógica de Programación y Pseudocódigo (PSeInt)', '#demo-11', 'pdf', 1, 2, '2026-10-15 09:30:00'),
(12, 'Sistemas Operativos: Windows y Linux Básico', '#demo-12', 'pdf', 3, 1, '2026-10-11 11:10:00'),
(13, 'Dibujo Técnico: Normas IRAM y Acotaciones', '#demo-13', 'pdf', 4, 3, '2026-10-05 14:00:00');
