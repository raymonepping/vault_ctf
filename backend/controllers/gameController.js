const { v4: uuidv4 } = require("uuid");
const { getClusterCollection } = require("../services/couchbasePool");
const consulService = require("../services/consul");

// Start a new game
exports.startGame = async (req, res) => {
  const { playerName } = req.body;

  if (!playerName) {
    return res.status(400).json({ message: "Player name is required." });
  }

  try {
    // Fetch bucket, scope, and collection from Consul
    const bucket = await consulService.getKVValue("vault/couchbase/bucket");
    const scope = await consulService.getKVValue("vault/couchbase/scope");
    const collection = await consulService.getKVValue("vault/couchbase/game");

    // Get the Couchbase collection reference
    const { collection: collectionRef } = await getClusterCollection(collection, scope);

    // Generate game ID and random code
    const gameId = uuidv4();
    const code = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));

    // Save game data to Couchbase
    const gameData = {
      gameId,
      playerName,
      code,
      attempts: [],
      createdAt: new Date().toISOString(),
    };

    await collectionRef.insert(gameId, gameData);

    res.json({
      gameId,
      message: "Game started successfully! Try to unseal the Vault.",
    });
  } catch (error) {
    console.error("Error starting game:", error);
    res.status(500).json({ error: "Error starting game" });
  }
};

// Submit an attempt
exports.submitAttempt = async (req, res) => {
  const { gameId, codeAttempt } = req.body;

  if (!gameId || !codeAttempt || codeAttempt.length !== 4) {
    return res.status(400).json({ message: "Invalid request data." });
  }

  try {
    // Fetch bucket, scope, and collection from Consul
    const bucket = await consulService.getKVValue("vault/couchbase/bucket");
    const scope = await consulService.getKVValue("vault/couchbase/scope");
    const collection = await consulService.getKVValue("vault/couchbase/game");

    // Get the Couchbase collection reference
    const { collection: collectionRef } = await getClusterCollection(collection, scope);

    // Retrieve game data from Couchbase
    const gameDoc = await collectionRef.get(gameId);
    const gameData = gameDoc.content;

    if (!gameData) {
      return res.status(404).json({ message: "Game not found." });
    }

    // Step 1: Correct Positions
    const correctPositions = gameData.code.filter(
      (num, index) => num === codeAttempt[index]
    ).length;

    // Step 2: Correct Numbers (Ignoring Positions)
    const unmatchedCode = gameData.code.map((num, index) =>
      num !== codeAttempt[index] ? num : null
    );
    const unmatchedAttempt = codeAttempt.map((num, index) =>
      gameData.code[index] !== num ? num : null
    );

    let correctNumbers = 0;
    unmatchedAttempt.forEach((num) => {
      const index = unmatchedCode.indexOf(num);
      if (index !== -1) {
        correctNumbers++;
        unmatchedCode[index] = null; // Remove matched number to prevent duplicates
      }
    });

    // Record the attempt
    const attemptResult = {
      codeAttempt,
      correctNumbers,
      correctPositions,
      timestamp: new Date().toISOString(),
    };
    gameData.attempts.push(attemptResult);

    // Update game data in Couchbase
    await collectionRef.replace(gameId, gameData);

    // Check if the code is cracked
    if (correctPositions === 4) {
      return res.json({
        message: `Congratulations! You unsealed the Vault in ${gameData.attempts.length} attempts.`,
      });
    } else {
      return res.json({
        message: `${correctNumbers} number${correctNumbers !== 1 ? "s" : ""} correct, ${correctPositions} in the correct position.`,
      });
    }
  } catch (error) {
    console.error("Error submitting attempt:", error);
    res.status(500).json({ error: "Error submitting attempt" });
  }
};
