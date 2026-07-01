// routes/matches.js
//
// POST /api/matches/invitar/:userId   → invitar a alguien (crea o actualiza match)
// GET  /api/matches                   → todos los matches del usuario logueado
// GET  /api/matches/estado/:userId    → estado del match con un usuario puntual

const express         = require("express");
const Match           = require("../models/Match");
const Usuario         = require("../models/Usuario");
const verificarToken  = require("../middleware/auth");

const router = express.Router();

// Ordena dos IDs siempre igual, para que el par (A,B) sea siempre el mismo
// documento sin importar quién invitó primero
function ordenarPar(idA, idB) {
  const a = idA.toString();
  const b = idB.toString();
  return a < b ? [a, b] : [b, a];
}

// ─── POST /api/matches/invitar/:userId ─────────────────────────
router.post("/invitar/:userId", verificarToken, async (req, res) => {
  try {
    const yo = req.usuario._id.toString();
    const otroId = req.params.userId;

    if (yo === otroId) {
      return res.status(400).json({ error: "No podés invitarte a vos mismo." });
    }

    const otroUsuario = await Usuario.findById(otroId);
    if (!otroUsuario) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const [usuario1, usuario2] = ordenarPar(yo, otroId);
    const yoSoyUsuario1 = (yo === usuario1);

    let match = await Match.findOne({ usuario1, usuario2 });

    if (!match) {
      // Primera invitación entre estos dos usuarios
      match = await Match.create({
        usuario1,
        usuario2,
        iniciador: yo,
        usuario1Invito: yoSoyUsuario1,
        usuario2Invito: !yoSoyUsuario1,
        estado: "pendiente"
      });
    } else {
      // Ya existe un documento: marcar que yo también invité
      if (yoSoyUsuario1) match.usuario1Invito = true;
      else match.usuario2Invito = true;

      // Si ambos invitaron → ¡Hay Mate!
      if (match.usuario1Invito && match.usuario2Invito && match.estado !== "matched") {
        match.estado = "matched";
        match.matchedAt = new Date();
      }

      await match.save();
    }

    const hayMatch = match.estado === "matched";

    res.json({
      match,
      hayMatch,
      mensaje: hayMatch ? "¡Hay Mate! 🧉" : "Invitación enviada."
    });

  } catch (error) {
    console.error("Error en /api/matches/invitar:", error);
    res.status(500).json({ error: "Error al procesar la invitación." });
  }
});

// ─── GET /api/matches ───────────────────────────────────────────
// Todos los matches (pendientes y confirmados) del usuario logueado
router.get("/", verificarToken, async (req, res) => {
  try {
    const yo = req.usuario._id.toString();

    const matches = await Match.find({
      $or: [{ usuario1: yo }, { usuario2: yo }]
    })
      .populate("usuario1", "nombre avatar")
      .populate("usuario2", "nombre avatar");

    res.json({ matches });

  } catch (error) {
    console.error("Error en GET /api/matches:", error);
    res.status(500).json({ error: "Error al obtener matches." });
  }
});

// ─── GET /api/matches/estado/:userId ────────────────────────────
// Consulta rápida: ¿cómo está el match entre yo y otro usuario puntual?
router.get("/estado/:userId", verificarToken, async (req, res) => {
  try {
    const yo = req.usuario._id.toString();
    const otroId = req.params.userId;

    const [usuario1, usuario2] = ordenarPar(yo, otroId);
    const match = await Match.findOne({ usuario1, usuario2 });

    if (!match) {
      return res.json({ estado: "ninguno" });
    }

    res.json({ estado: match.estado, match });

  } catch (error) {
    console.error("Error en /api/matches/estado:", error);
    res.status(500).json({ error: "Error al consultar el estado." });
  }
});

module.exports = router;
