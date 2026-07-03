const mongoose = require("mongoose");

const mensajeSchema = new mongoose.Schema({
  emisor:   { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  receptor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  texto:    { type: String, required: true },
  fecha:    { type: Date, default: Date.now }
});

module.exports = mongoose.model("Mensaje", mensajeSchema);
