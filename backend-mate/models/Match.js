// models/Match.js

const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  usuario1: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  usuario2: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },

  // estado: 'pendiente' = uno invitó, el otro todavía no
  //         'matched'   = los dos se invitaron (¡Hay Mate!)
  estado: { type: String, enum: ["pendiente", "matched"], default: "pendiente" },

  iniciador:        { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  usuario1Invito:   { type: Boolean, default: false },
  usuario2Invito:   { type: Boolean, default: false },
  afinidad:         { type: Number, default: 0 },
  matchedAt:        { type: Date, default: null }

}, { timestamps: true });

// Evita duplicados: solo puede existir un match por par de usuarios
matchSchema.index({ usuario1: 1, usuario2: 1 }, { unique: true });

module.exports = mongoose.model("Match", matchSchema);
