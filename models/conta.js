const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const ContaSchema = new Schema({
  data_da_leitura: { type: Date },
  numero_da_leitura: { type: Number },
  kw_gasto: { type: Number },
  valor_a_pagar: { type: Number },
  data_do_pagamento: { type: Date },
  media_de_consumo: { type: Number },
});

// Campo virtual "valor unitário" da Conta
ContaSchema.virtual("valor_unitario").get(function () {
  // To avoid errors in cases where an Conta does not have either a kw_gasto or valor_a_pagar
  // We want to make sure we handle the exception by returning a valor zero for that case
  let valor_unitario_calculado = 0;
  if (this.kw_gasto && this.valor_a_pagar) {
    valor_unitario_calculado = valor_a_pagar / kw_gasto;
  }

  return valor_unitario_calculado;
});

// Virtual for Conta's URL
ContaSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/conta/${this._id}`;
  // return `/catalog/contas`;
});

ContaSchema.virtual("data_da_leitura_formatada").get(function () {
  return DateTime.fromJSDate(this.data_da_leitura).toLocaleString(
    DateTime.DATE_SHORT
  );
});

ContaSchema.virtual("data_do_pagamento_formatada").get(function () {
  return DateTime.fromJSDate(this.data_do_pagamento).toLocaleString(
    DateTime.DATE_SHORT
  );
});

// Export model
module.exports = mongoose.model("Conta", ContaSchema);
