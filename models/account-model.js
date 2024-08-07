const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

/* *****************************
*   Update account
* *************************** */
async function updateAccount(account) {


    try {
        const sql =
            "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
        const result = await pool.query(sql, [
            account.account_firstname,
            account.account_lastname,
            account.account_email,
            account.account_id
        ]);
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

/* *****************************
*   Update Password
* *************************** */
async function updatePassword(account) {

    try {
        const sql =
            "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
        const result = await pool.query(sql, [
            account.hashedPassword,
            account.account_id
        ]);
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
            [account_email])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}
/* *****************************
* Return account data using id
* ***************************** */
async function getAccountById(id) {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
            [id])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
    console.log("email " + account_email)
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        return email.rowCount
    } catch (error) {
        return error.message
    }
}

/* **********************
 *   return id for email
 * ********************* */
async function getId(account_email) {
    console.log("email " + account_email);
    try {
        const sql = "SELECT account_id FROM account WHERE account_email = $1";
        const result = await pool.query(sql, [account_email]);
        if (result.rowCount > 0) {
            return parseInt(result.rows[0].account_id, 10);
        } else {
            throw new Error("Account not found");
        }
    } catch (error) {
        return error.message;
    }
}


module.exports = { registerAccount, getAccountByEmail, checkExistingEmail, updateAccount, updatePassword, getId }