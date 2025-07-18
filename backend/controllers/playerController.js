const { getClusterCollection } = require('../services/couchbasePool');

const getPlayerState = async (req, res) => {
  try {
    const username = req.params.username;
    const { collection } = await getClusterCollection();
    const getResult = await collection.get(username);
    const player = getResult.content;
    res.status(200).json(player);
  } catch (error) {
  }
};

const upsertPlayer = async (req, res) => {
  try {
    const playerDoc = req.body;
    const username = playerDoc.username;
    const { collection } = await getClusterCollection();
    await collection.upsert(username, playerDoc);
    res.status(200).json({ message: 'Player created/updated', player: playerDoc });
  } catch (error) {
  }
};

module.exports = { getPlayerState, upsertPlayer };
