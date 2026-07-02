// seed.js — Poblar MongoDB con 10 perfiles de prueba
// Ejecutar UNA SOLA VEZ: node seed.js

require("dotenv").config();

const mongoose = require("mongoose");
const Usuario  = require("./models/Usuario");

const perfiles = [
  {
    nombre: "Tomás", email: "tomas@mate.com", password: "mate1234",
    edad: 28, ubicacion: "Córdoba, Argentina",
    avatar: "https://i.pravatar.cc/150?img=11",
    bio: "Me encanta conocer culturas, hacer trekking y descubrir nuevos destinos. ¡Busco alguien activo para armar ruta!",
    estiloViaje: "mochilero", presupuesto: "economico", estiloCompanero: "aventura",
    regiones: ["noa", "patagonia"], destino: "Tailandia",
    fechaInicio: "2026-11-10", fechaFin: "2026-11-25",
    intereses: ["Trekking", "Fotografía", "Comida local"],
    idiomas: ["Español", "Inglés"], progresoPerfil: 100, esSeedProfile: true
  },
  {
    nombre: "Sofía", email: "sofia@mate.com", password: "mate1234",
    edad: 25, ubicacion: "Buenos Aires, Argentina",
    avatar: "https://i.pravatar.cc/150?img=32",
    bio: "Busco relajarme en la Patagonia, conocer cafeterías de especialidad y compartir buenas charlas.",
    estiloViaje: "confort", presupuesto: "medio", estiloCompanero: "confort",
    regiones: ["patagonia"], destino: "Bariloche",
    fechaInicio: "2026-07-08", fechaFin: "2026-07-18",
    intereses: ["Cultura", "Café", "Senderismo suave"],
    idiomas: ["Español", "Inglés"], progresoPerfil: 100, esSeedProfile: true
  },
  {
    nombre: "Martín", email: "martin@mate.com", password: "mate1234",
    edad: 31, ubicacion: "Mendoza, Argentina",
    avatar: "https://i.pravatar.cc/150?img=60",
    bio: "Fan de la naturaleza salvaje, peñas folclóricas y acampar bajo las estrellas.",
    estiloViaje: "mochilero", presupuesto: "economico", estiloCompanero: "aventura",
    regiones: ["noa", "cuyo"], destino: "Salta / NOA",
    fechaInicio: "2026-06-10", fechaFin: "2026-06-25",
    intereses: ["Camping", "Folclore", "Trekking"],
    idiomas: ["Español"], progresoPerfil: 100, esSeedProfile: true
  },
  {
    nombre: "Caro", email: "caro@mate.com", password: "mate1234",
    edad: 27, ubicacion: "Rosario, Argentina",
    avatar: "https://i.pravatar.cc/150?img=5",
    bio: "Me encanta descubrir ruinas históricas, visitar museos locales y conocer la selva.",
    estiloViaje: "cultural", presupuesto: "economico", estiloCompanero: "aventura",
    regiones: ["nea"], destino: "Misiones",
    fechaInicio: "2026-08-15", fechaFin: "2026-08-25",
    intereses: ["Historia", "Caminatas", "Museos"],
    idiomas: ["Español", "Portugués"], progresoPerfil: 100, esSeedProfile: true
  },
  {
    nombre: "Juan", email: "juan@mate.com", password: "mate1234",
    edad: 34, ubicacion: "CABA, Argentina",
    avatar: "https://i.pravatar.cc/150?img=12",
    bio: "Priorizo el buen comer, el relax y los paseos organizados. Planeando Ushuaia con todas las comodidades.",
    estiloViaje: "confort", presupuesto: "premium", estiloCompanero: "confort",
    regiones: ["patagonia"], destino: "Ushuaia",
    fechaInicio: "2026-07-10", fechaFin: "2026-07-20",
    intereses: ["Gastronomía", "Esquí", "Relax"],
    idiomas: ["Español", "Inglés"], progresoPerfil: 100, esSeedProfile: true
  },
  {
    nombre: "Lucía", email: "lucia@mate.com", password: "mate1234",
    edad: 22, ubicacion: "La Plata, Argentina",
    avatar: "https://i.pravatar.cc/150?img=20",
    bio: "Lo mío es la playa, las rondas de mate en la arena y conocer gente nueva en hostels.",
    estiloViaje: "social", presupuesto: "economico", estiloCompanero: "aventura",
    regiones: ["pampeana"], destino: "Costa Atlántica",
    fechaInicio: "2027-01-01", fechaFin: "2027-01-15",
    intereses: ["Playa", "Fiesta", "Amigos"],
    idiomas: ["Español"], progresoPerfil: 100, esSeedProfile: true
  },
  {
    nombre: "Nico", email: "nico@mate.com", password: "mate1234",
    edad: 29, ubicacion: "Neuquén, Argentina",
    avatar: "https://i.pravatar.cc/150?img=59",
    bio: "Vivo para los deportes extremos y subir cerros. Busco un compañero ágil para senderos difíciles.",
    estiloViaje: "mochilero", presupuesto: "economico", estiloCompanero: "aventura",
    regiones: ["noa", "patagonia"], destino: "Jujuy",
    fechaInicio: "2026-09-05", fechaFin: "2026-09-15",
    intereses: ["Alpinismo", "Trail Running", "Camping"],
    idiomas: ["Español"], progresoPerfil: 100, esSeedProfile: true
  },
  {
    nombre: "Valentina", email: "valentina@mate.com", password: "mate1234",
    edad: 26, ubicacion: "Salta, Argentina",
    avatar: "https://i.pravatar.cc/150?img=47",
    bio: "Quiero conocer el Valle de Uco, degustar vinos de altura y hospedarme en lugares premium.",
    estiloViaje: "confort", presupuesto: "premium", estiloCompanero: "confort",
    regiones: ["cuyo"], destino: "Mendoza",
    fechaInicio: "2026-10-12", fechaFin: "2026-10-20",
    intereses: ["Vinos", "Gourmet", "Paisajes"],
    idiomas: ["Español", "Inglés"], progresoPerfil: 100, esSeedProfile: true
  },
  {
    nombre: "Ana", email: "ana@mate.com", password: "mate1234",
    edad: 30, ubicacion: "Corrientes, Argentina",
    avatar: "https://i.pravatar.cc/150?img=25",
    bio: "Apasionada de la cultura guaraní, la música litoraleña y los esteros del Iberá.",
    estiloViaje: "cultural", presupuesto: "medio", estiloCompanero: "confort",
    regiones: ["nea", "pampeana"], destino: "Iberá",
    fechaInicio: "2026-06-20", fechaFin: "2026-07-05",
    intereses: ["Naturaleza", "Fotografía", "Historia"],
    idiomas: ["Español"], progresoPerfil: 100, esSeedProfile: true
  },
  {
    nombre: "Felipe", email: "felipe@mate.com", password: "mate1234",
    edad: 33, ubicacion: "San Juan, Argentina",
    avatar: "https://i.pravatar.cc/150?img=52",
    bio: "Me gustan los viñedos, las rutas de montaña y conocer gente de todo el mundo. Hablo tres idiomas.",
    estiloViaje: "social", presupuesto: "medio", estiloCompanero: "aventura",
    regiones: ["cuyo", "noa"], destino: "Ruta del Vino",
    fechaInicio: "2026-11-01", fechaFin: "2026-11-15",
    intereses: ["Vinos", "Idiomas", "Montaña"],
    idiomas: ["Español", "Inglés", "Portugués"], progresoPerfil: 100, esSeedProfile: true
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mate_travel");
    console.log("✅ MongoDB conectado\n");

    let creados = 0, omitidos = 0;

    for (const datos of perfiles) {
      const existe = await Usuario.findOne({ email: datos.email });
      if (existe) {
        console.log(`⚠️  ${datos.email} ya existe, omitiendo...`);
        omitidos++;
        continue;
      }
      await Usuario.create(datos);
      console.log(`✅ ${datos.nombre} (${datos.email})`);
      creados++;
    }

    console.log(`\n🧉 Seed completado: ${creados} creados, ${omitidos} omitidos`);
    console.log("Credenciales de prueba: tomas@mate.com / mate1234");

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
