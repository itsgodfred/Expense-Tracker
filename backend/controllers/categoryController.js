import pool from "../db.js";

export const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM category ORDER BY type, category_name"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("GetCategories error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createCategory = async (req, res) => {
  const { name, type, icon, color } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: "Name and type are required" });
  }
  if (!["income", "expense"].includes(type)) {
    return res.status(400).json({ message: "Type must be income or expense" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO category (category_name, type, icon, color, is_default) VALUES ($1, $2, $3, $4, false) RETURNING *",
      [name, type, icon || null, color || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ message: "Category with this name already exists" });
    }
    console.error("CreateCategory error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, icon, color } = req.body;
  try {
    const result = await pool.query(
      `
            UPDATE categories 
            SET category_name = COALESCE($1, name),
                icon = COALESCE($2, icon),
                color = COALESCE($3, color)
            WHERE id = $4
            RETURNING *`,
      [name, icon, color, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("UpdateCategory error:", error);
    res.status(500).json({ message: "Server error " });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
            DELETE FROM categories 
            WHERE id = $1
            RETURNING id;
        `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category successfully deleted." });
  } catch (error) {
    console.error("DeleteCategory error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
