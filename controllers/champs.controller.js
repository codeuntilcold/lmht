const oracledb = require('oracledb');
const db = require('../config/db');

module.exports = {

    /*
        Quản lý các API liên quan đến skin, bao gồm:
            
            Các skin + đa sắc skin
            Tướng nào có skin nào
            
            Từng ni là đủ ròi :v
            Sở hữu skin

    */


    async postChamp(req, res) {
        try {

            const champName = req.body.champName
            const method = req.body.clientMethod

            let sql, binds, options, result;

            //
            // Query the data
            //

            connection = await db.connect()

            // VULNERABLE TO SQL INJECTION
            sql = `
                SELECT
                    MA_TUONG,
                    TEN_TUONG,
                    GIA_MUA,
                    MO_TA
                FROM TUONG
                WHERE TEN_TUONG = '${champName.toUpperCase()}'
            `;

            binds = {};

            // For a complete list of options see the documentation.
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
                // maxRows: 5,
                // prefetchRows:     100,                // internal buffer allocation size for tuning
                // fetchArraySize:   5                 // internal buffer allocation size for tuning
            };

            if (method === 'GET') { 
                result = await connection.execute(sql, binds, options);
            }

            console.log(result)
            res.render('champs', {
                id: result.rows[0]?.MA_TUONG,
                name: result.rows[0]?.TEN_TUONG,
                price: result.rows[0]?.GIA_MUA,
                desc: result.rows[0]?.MO_TA,
            })

        } catch (err) {

            console.error(err);
            res.render('champs')

        }
    }

}