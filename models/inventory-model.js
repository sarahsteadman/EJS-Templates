const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}



/* ***************************
*  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
            JOIN public.classification AS c 
            ON i.classification_id = c.classification_id 
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        console.log(data);
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

async function getInventoryById(id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory WHERE inv_id = $1`, [id]
        );
        // console.log("Query Result:", data);
        if (data.rows.length === 0) {
            throw new Error("Sorry, no matching vehicles could be found.");
            return false;
        }
        return data.rows
    } catch (error) {
        console.error("getInventoryById error " + error)
    }
}

async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
        const result = await pool.query(sql, [classification_name]);
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

async function addInventory(inventory) {
    try {
        const sql = `
            INSERT INTO inventory (
                inv_make,
                inv_model,
                inv_year,
                inv_description,
                inv_image,
                inv_thumbnail,
                inv_price,
                inv_miles,
                inv_color,
                classification_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;
        const result = await pool.query(sql, [
            inventory.inv_make,
            inventory.inv_model,
            inventory.inv_year,
            inventory.inv_description,
            inventory.inv_image,
            inventory.inv_thumbnail,
            inventory.inv_price,
            inventory.inv_miles,
            inventory.inv_color,
            inventory.classification_id
        ]);
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

async function updateInventory(inventory) {
    try {
        console.log(inventory)
        const sql =
            "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
        const result = await pool.query(sql, [
            inventory.inv_make,
            inventory.inv_model,
            inventory.inv_description,
            inventory.inv_image,
            inventory.inv_thumbnail,
            inventory.inv_price,
            inventory.inv_year,
            inventory.inv_miles,
            inventory.inv_color,
            inventory.classification_id,
            inventory.inv_id
        ]);
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
        return null;
    }
}
async function deleteInventory(inventory) {
    try {
        console.log(inventory)
        const sql = 'DELETE FROM inventory WHERE inv_id = $1';
        const data = await pool.query(sql, [
            inventory.inv_id
        ]);
        return data;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}


module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById, addClassification, addInventory, updateInventory, deleteInventory }