const pool = require("../database/")
const accountModel = require("../models/account-model")

let model = {}

/* *****************************
* Return message data by id
* ***************************** */
model.getMessageById = async function (id) {
    try {
        const result = await pool.query(
            `SELECT 
                m.message_id,
                m.message_from,
                m.message_subject,
                m.message_body,
                m.message_created,
                a.account_firstname,
                a.account_lastname,
                m.message_read,
                m.message_archived
            FROM message m
            JOIN account a ON m.message_from = a.account_id
            WHERE m.message_id = $1`,
            [id]
        );
        console.log("getMessagebyId id:" + id);
        console.log("getMessagebyId result:", result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error("Error fetching message by ID:", error.message);
        throw new Error("Message could not be found");
    }
};

/* *****************************
* Return messages where user id is the recipient
* *****************************/
model.getInbox = async (userId) => {
    console.log("userId " + userId);
    try {
        const result = await pool.query(
            `SELECT
                m.message_id,
                m.message_from,
                m.message_subject,
                m.message_created,
                a.account_firstname,
                a.account_lastname,
                m.message_read,
                m.message_archived
            FROM message m
            JOIN account a ON m.message_from = a.account_id
            WHERE m.message_to = $1
            ORDER BY m.message_created DESC
`,
            [userId]
        );
        console.log("database queried")
        if (result.rows.length == 0) {
            return []
        }

        return result.rows
    } catch (error) {
        console.error("Error fetching inbox:", error.message);
        throw new Error("Messages could not be retrieved")
    }
}

/* *****************************
* Returns a count of how many messages are in the inbox
* *****************************/
model.getInboxCount = async (userId) => {
    try {
        const sql = "SELECT COUNT(*) FROM message WHERE message_to = $1";
        const result = await pool.query(sql, [userId]);

        return result.rows[0].count;
    } catch (error) {
        console.error("Error counting messages in inbox:", error.message);
        throw new Error("Could not count messages.");
    }
};



/* *****************************
* Return messages where user id is the recipient
* *****************************/
// model.getInbox = async (userId) => {
//     try {
//         let result = ('SELECT * FROM messages WHERE receiver_id = ? ORDER BY timestamp DESC',
//             [userId]);
//         return result.rows[0]
//     } catch (error) {
//         console.error("Error fetching messages by UserId:", error.message);
//         throw new Error("Messages could not be retrieved")
//     }
// }
/* *****************************
*   Save Message to database
* *************************** */
model.saveMessage = async function (message_subject, message_body, message_to, message_from, message_created) {
    try {
        console.log(message_created);

        const sql = "INSERT INTO message (message_subject, message_body, message_to, message_from, message_created) VALUES ($1, $2, $3, $4, $5) RETURNING *";
        return await pool.query(sql, [message_subject, message_body, message_to, message_from, message_created]);
    } catch (error) {
        console.error("Error saveMessages:", error.message);
        throw new Error("Message could not be sent.");
    }
}

model.getRecipients = async function () {
    try {
        const sql = `
            SELECT account_id, account_firstName, account_lastName 
            FROM account 
            WHERE account_id < 4
        `;
        const result = await pool.query(sql);
        return result.rows; // Return the rows of the result
    } catch (error) {
        console.error("Error fetching recipients:", error.message);
        throw new Error("Could not fetch recipients");
    }
}



module.exports = model