const express = require("express");

// Require controller modules.
const conta_controller = require("../controllers/contaController");

const router = express.Router();

// GET catalog home page.
router.get("/", conta_controller.index);

/// CONTA ROUTES ///

// GET request for list of all contas.
router.get("/contas", conta_controller.conta_lista);

// GET request for creating conta. NOTE This must come before route for id (i.e. display conta).
router.get("/conta/create", conta_controller.conta_create_get);

// POST request for creating conta.
router.post("/conta/create", conta_controller.conta_create_post);

// GET request to delete conta.
router.get("/conta/:id/delete", conta_controller.conta_delete_get);

// POST request to delete conta.
router.post("/conta/:id/delete", conta_controller.conta_delete_post);

// GET request to update conta.
router.get("/conta/:id/update", conta_controller.conta_update_get);

// POST request to update conta.
router.post("/conta/:id/update", conta_controller.conta_update_post);

// GET request for one conta.
router.get("/conta/:id", conta_controller.conta_detail);

module.exports = router;
