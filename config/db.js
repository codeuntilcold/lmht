const oracledb = require('oracledb')
require('dotenv').config()

async function connect() {
    try {
        return oracledb.getConnection({
            user          : process.env.NODE_ORACLEDB_USER || "lmht",
            password      : process.env.NODE_ORACLEDB_PASSWORD,
            connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "localhost/xe",
        })
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = { connect }