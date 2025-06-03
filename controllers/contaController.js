const Conta = require("../models/conta");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of Contas counts (in parallel)
  const [
    numContas,
  ] = await Promise.all([
    Conta.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Contas de Luz - Principal",
    conta_count: numContas,
  });
});

// Display list of all contas.
exports.conta_lista = asyncHandler(async (req, res, next) => {
  const allContas = await Conta
    .find()
    .sort({ numero_da_leitura: 1 })
    .exec();
  
  res.render("conta_lista", {
    titulo: "Lista de contas",
    conta_lista: allContas,
  });

});

// Display detail page for a specific conta.
exports.conta_detail = asyncHandler(async (req, res, next) => {
  // Get details of conta
  const [conta] = await Promise.all([Conta.findById(req.params.id).exec()]);

  if (conta === null) {
    // No results.
    const err = new Error("Conta não encontrada.");
    err.status = 404;
    return next(err);
  }

  res.render("conta_detail", {
    title: "Detalhes da conta",
    conta,
  });
});

// Display conta create form on GET.
exports.conta_create_get = asyncHandler(async (req, res, next) => {
  res.render("conta_form", { titulo: "Criar conta" });
});

// Handle conta create on POST.
exports.conta_create_post = [
  // Validate and sanitize fields.
  body("data_da_leitura", "data inválida.")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("numero_da_leitura", "Número inválido.")
    .isInt({ gt: 0 })
    .withMessage("Número da leitura deve ser maior que 0."),
  body("kw_gasto", "quantidade inválida.")
    .isInt({ gt: -1 })
    .withMessage("Quantidade de kw gasto deve ser 0 ou maior."),
  body("valor_a_pagar", "valor inválido.")
    .isDecimal({ gt: -1, locale: "pt-BR" })
    .withMessage("valor_a_pagar deve ser 0 ou maior."),
  body("data_do_pagamento", "data inválida.")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("media_de_consumo", "valor inválido.")
    .isDecimal({ gt: -1, locale: "pt-BR" })
    .withMessage("Média de consumo deve ser 0 ou maior."),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Author object with escaped and trimmed data
    const conta = new Conta({
      data_da_leitura: req.body.data_da_leitura,
      numero_da_leitura: req.body.numero_da_leitura,
      kw_gasto: req.body.kw_gasto,
      valor_a_pagar: req.body.valor_a_pagar,
      data_do_pagamento: req.body.data_do_pagamento,
      media_de_consumo: req.body.media_de_consumo,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("conta_form", {
        titulo: "Criar conta",
        conta,
        errors: errors.array(),
      });
      console.log(errors);
      return;
    }
    // Data from form is valid.

    // Save conta.
    await conta.save();
    // Redirect to new conta record.
    res.redirect(conta.url);
  }),
];

// Display conta delete form on GET.
exports.conta_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of conta
  const conta = await Conta.findById(req.params.id).exec();

  if (conta === null) {
    // No results.
    res.redirect("/catalog/contas");
  }

  res.render("conta_delete", {
    titulo: "Remover Conta",
    conta,
  });
});

// Handle conta delete on POST.
exports.conta_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of conta and all their books (in parallel)
  const conta = await Conta.findById(req.params.id).exec();

  // Conta. Delete object and redirect to the list of Contas.
  await Conta.findByIdAndDelete(req.body.contaid);
  res.redirect("/catalog/contas");
});

// Display conta update form on GET.
exports.conta_update_get = asyncHandler(async (req, res, next) => {
  // Get details of conta
  const conta = await Conta.findById(req.params.id).exec();

  if (conta === null) {
    // No results.
    res.redirect("/catalog/contas");
  }

  res.render("conta_form", {
    titulo: "Alterar Conta",
    conta,
  });
});

// Handle conta update on POST.
exports.conta_update_post = [
  // Validate and sanitize fields.
  body("data_da_leitura", "data inválida.")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("numero_da_leitura", "Número inválido.")
    .isInt({ gt: 0 })
    .withMessage("Número da leitura deve ser maior que 0."),
  body("kw_gasto", "quantidade inválida.")
    .isInt({ gt: -1 })
    .withMessage("Quantidade de kw gasto deve ser 0 ou maior."),
  body("valor_a_pagar", "valor inválido.")
    .isDecimal({ gt: -1, locale: "pt-BR" })
    .withMessage("valor_a_pagar deve ser 0 ou maior."),
  body("data_do_pagamento", "data inválida.")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("media_de_consumo", "valor inválido.")
    .isDecimal({ gt: -1, locale: "pt-BR" })
    .withMessage("Média de consumo deve ser 0 ou maior."),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Author object with escaped and trimmed data
    const conta = new Conta({
      data_da_leitura: req.body.data_da_leitura,
      numero_da_leitura: req.body.numero_da_leitura,
      kw_gasto: req.body.kw_gasto,
      valor_a_pagar: req.body.valor_a_pagar,
      data_do_pagamento: req.body.data_do_pagamento,
      media_de_consumo: req.body.media_de_consumo,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("conta_form", {
        titulo: "Alterar conta",
        conta,
        errors: errors.array(),
      });
      return;
    }
    // Data from form is valid.

    // Update record.
    const updatedConta = await Conta.findByIdAndUpdate(req.params.id, conta, {});

    // Redirect to conta detail page.
    res.redirect(conta.url);
  }),
];
