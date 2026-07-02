// routes/perfiles.js
//
// GET /api/perfiles  → lista de perfiles compatibles (excluye al usuario actual)
//                      con % de afinidad calculado, ordenados de mayor a menor

const express        = require("express");
const Usuario        = require("../models/Usuario");
const verificarToken = require("../middleware/auth");

const router = express.Router();

// ─── Algoritmo de afinidad (0-100) ────────────────────────────
function calcularAfinidad(userA, userB) {
  let score = 0;

  // Estilo de viaje — 30 pts
  const compatibles = {
    mochilero: ["mochilero", "social"],
    confort:   ["confort", "cultural"],
    social:    ["social", "mochilero"],
    cultural:  ["cultural", "confort"]
  };
  if (userA.estiloViaje === userB.estiloViaje) score += 30;
  else if (compatibles[userA.estiloViaje]?.includes(userB.estiloViaje)) score += 15;

  // Presupuesto — 25 pts
  const nivelPresupuesto = { economico: 1, medio: 2, premium: 3 };
  const diff = Math.abs(nivelPresupuesto[userA.presupuesto] - nivelPresupuesto[userB.presupuesto]);
  if (diff === 0) score += 25;
  else if (diff === 1) score += 12;

  // Regiones en común — 20 pts
  const regionesComunes = (userA.regiones || []).filter(r => (userB.regiones || []).includes(r));
  score += Math.min(regionesComunes.length * 10, 20);

  // Fechas que se solapan — 15 pts
  if (userA.fechaInicio && userA.fechaFin && userB.fechaInicio && userB.fechaFin) {
    const startA = new Date(userA.fechaInicio), endA = new Date(userA.fechaFin);
    const startB = new Date(userB.fechaInicio), endB = new Date(userB.fechaFin);
    if (startA <= endB && startB <= endA) score += 15;
  }

  // Intereses en común — 10 pts
  const interesesComunes = (userA.intereses || []).filter(i => (userB.intereses || []).includes(i));
  score += Math.min(interesesComunes.length * 3, 10);

  return Math.round(score);
}

// ─── GET /api/perfiles ─────────────────────────────────────────
router.get("/", verificarToken, async (req, res) => {
  try {
    const usuarioActual = req.usuario;

    const otrosUsuarios = await Usuario.find({ _id: { $ne: usuarioActual._id } });

    const Match = require("../models/Match");
    
    // Función auxiliar para ordenar IDs (igual que en matches.js)
    function ordenarPar(idA, idB) {
      const a = idA.toString();
      const b = idB.toString();
      return a < b ? [a, b] : [b, a];
    }

    const perfilesBrutos = await Promise.all(otrosUsuarios.map(async (u) => {
      const afinidad = calcularAfinidad(usuarioActual, u);
      
      const [usuario1, usuario2] = ordenarPar(usuarioActual._id, u._id);
      const matchDoc = await Match.findOne({ usuario1, usuario2 });
      
      let matchStatus = "ninguno";
      if (matchDoc) {
        if (matchDoc.estado === "matched") {
          matchStatus = "matched";
        } else {
          const yoSoyUsuario1 = (usuarioActual._id.toString() === usuario1);
          if (yoSoyUsuario1) {
            matchStatus = matchDoc.usuario1Invito ? "enviado" : "recibido";
          } else {
            matchStatus = matchDoc.usuario2Invito ? "enviado" : "recibido";
          }
        }
      }

      return { ...u.toJSON(), afinidad, matchStatus };
    }));

    // Filtrar: Ocultar si ya son "matched" o si el estado es "enviado" (ya le mandé).
    // Mostrar si es "ninguno" o si es "recibido" (me mandaron, debo verlos para devolver el mate).
    const perfilesConAfinidad = perfilesBrutos.filter(p => 
      p.matchStatus === "ninguno" || p.matchStatus === "recibido"
    );

    perfilesConAfinidad.sort((a, b) => b.afinidad - a.afinidad);

    res.json({ perfiles: perfilesConAfinidad });

  } catch (error) {
    console.error("Error en /api/perfiles:", error);
    res.status(500).json({ error: "Error al obtener perfiles." });
  }
});

module.exports = router;
