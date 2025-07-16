const express = require("express");
const router = express.Router();
const bakingController = require("../controllers/bakingController");

// Route to fetch ingredient data

/**
 * @swagger
 * /:
 *   get:
 *     summary: Fetch all ingredient data
 *     responses:
 *       200:
 *         description: A JSON array of ingredient data
 *       500:
 *         description: Internal server error
 */
router.get("/", bakingController.fetchIngredientData);

/**
 * @swagger
 * /ingredients/{id}:
 *   put:
 *     summary: Update an ingredient by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ingredient to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Ingredient successfully updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Ingredient not found
 *       500:
 *         description: Internal server error
 */
router.put("/ingredients/:id", bakingController.updateIngredientById);

module.exports = router;