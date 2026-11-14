import pool from "../db.js";

export const getTransactions = async (req, res) => {
  const userId = req.user.id;
  const {
    startDate,
    endDate,
    category_id,
    type,
    search,
    limit = 50,
    offset = 0,
  } = req.query;

  const conditions = ["t.user_id = $1"];
  const values = [req.user.id];
  let idx = 2;

  if (startDate) {
    conditions.push(`t.transaction_date >= $${idx++}`);
    values.push(startDate);
  }
  if (endDate) {
    conditions.push(`t.transaction_date <= $${idx++}`);
    values.push(endDate);
  }

  if (category_id) {
    conditions.push(`t.category_id = $${idx++}`);
    values.push(category_id);
  }

  if (type) {
    conditions.push(`t.type = $${idx++}`);
    values.push(type);
  }

  if (search) {
    conditions.push(`(t.description ILIKE $${idx} OR t.notes ILIKE $${idx})`);
    values.push(`%${search}%`);
    idx++;
  }

  values.push(limit, offset);

  try {
    const result = await pool.query(
      `
            SELECT t.*, 
                   c.category_name AS category_name, 
                   c.icon AS category_icon, 
                   c.color AS category_color
            FROM transactions t
            LEFT JOIN category c ON t.category_id = c.id
            WHERE ${conditions.join(" AND ")}
            ORDER BY t.transaction_date DESC, t.id DESC
            LIMIT $${idx++} OFFSET $${idx}`,
      values
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error in getTransactions:", error);
    res
      .status(500)
      .json({ message: "Server error while querying transactions." });
  }
};

export const createTransaction = async (req, res) => {
  const { category_id, amount, type, description, transaction_date } = req.body;

  if (!amount || !type || !description || !transaction_date) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  if (!["income", "expense"].includes(type)) {
    return res
      .status(400)
      .json({ message: "Type must be 'income' or 'expense'." });
  }

  try {
    const result = await pool.query(
      `
            INSERT INTO transactions (user_id, category_id, amount, type, description, transaction_date)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
      [
        req.user.id,
        category_id || null,
        amount,
        type,
        description,
        transaction_date,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error in createTransaction:", error);
    res
      .status(500)
      .json({ message: "Server error while creating transaction." });
  }
};

export const getTransactionById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
            SELECT t.*, 
                   c.category_name AS category_name, 
                   c.icon AS category_icon, 
                   c.color AS category_color
            FROM transactions t
            LEFT JOIN category c ON t.category_id = c.id
            WHERE t.id = $1 AND t.user_id = $2;
        `,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error in getTransactionById:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching transaction." });
  }
};

export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { category_id, amount, type, description, transaction_date } = req.body;

  try {
    const result = await pool.query(
      `
            UPDATE transactions
            SET category_id = COALESCE($1, category_id),
                amount = COALESCE($2, amount),
                type = COALESCE($3, type),
                description = COALESCE($4, description),
                transaction_date = COALESCE($5, transaction_date)
            WHERE id = $6 AND user_id = $7
            RETURNING *;
        `,
      [
        category_id,
        amount,
        type,
        description,
        transaction_date,
        id,
        req.user.id,
      ]
    );
    console.log(category_id);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found " });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error in updateTransaction:", error);
    res
      .status(500)
      .json({ message: "Server error while updating transaction." });
  }
};
