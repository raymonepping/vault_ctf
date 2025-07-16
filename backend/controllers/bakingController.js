const { getConnection } = require("../services/couchbasePool");

exports.fetchIngredientData = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;

  try {
    const { cluster, bucket } = await getConnection();
    const scope = bucket.scope('baking');
    const collection = scope.collection('ingredients');

    const query = `
      SELECT META().id, *
      FROM \`demo\`.\`baking\`.\`ingredients\`
      ORDER BY name ASC
      LIMIT ${pageSize}
      OFFSET ${offset}`;

    const result = await cluster.query(query);

    const totalCountQuery = `
      SELECT COUNT(*)
      FROM \`demo\`.\`baking\`.\`ingredients\``;
    const countResult = await cluster.query(totalCountQuery);
    const totalCount = countResult.rows[0]["$1"];
    const totalPages = Math.ceil(totalCount / pageSize);

    res.json({
      ingredientData: result.rows,
      currentPage: parseInt(page, 10),
      totalPages: totalPages,
    });
  } catch (error) {
    console.error("Error fetching ingredient data:", error);
    res.status(500).json({ error: "Error fetching ingredient data" });
  }
};
