#! /usr/bin/env node

console.log(
  'This script populates some test Contas to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://admin:admin@cluster0.vuwkq.mongodb.net/ContaDeLuz?retryWrites=true&w=majority&appName=Cluster0"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Conta = require("./models/conta");

const contas = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createContas();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function contaCreate(
  index,
  data_da_leitura,
  numero_da_leitura,
  kw_gasto,
  valor_a_pagar,
  data_do_pagamento,
  media_de_consumo
) {
  const contadetail = {
    data_da_leitura: data_da_leitura,
    numero_da_leitura: numero_da_leitura,
    kw_gasto: kw_gasto,
    valor_a_pagar: valor_a_pagar,
    data_do_pagamento: data_do_pagamento,
    media_de_consumo: media_de_consumo,
  };
  if (kw_gasto < 0) contadetail.kw_gasto = 0;
  if (valor_a_pagar < 0) contadetail.valor_a_pagar = 0;
  if (media_de_consumo < 0) contadetail.media_de_consumo = 0;

  const conta = new Conta(contadetail);

  await conta.save();
  contas[index] = conta;
  console.log(`Adicionada conta: ${numero_da_leitura} ${data_da_leitura}`);
}

async function createContas() {
  console.log("Adicionando contas");
  await Promise.all([
    contaCreate(0, "2005-07-04", 4166, 460, 206.43, "2005-07-15", 15.33),
    contaCreate(1, "2005-08-02", 4201, 350, 157.07, "2005-08-15", 12.06),
  ]);
}

