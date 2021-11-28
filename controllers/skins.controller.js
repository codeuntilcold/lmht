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


    async getSkins(req, res) {

        try {

            let champName = req.params.champName
            console.log(champName)

            let sql, binds, options, result;

            //
            // Query the data
            //

            connection = await db.connect()



            // VULNERABLE TO SQL INJECTION
            sql = `
                SELECT 
                    TEN_TUONG,
                    CHU_DE, 
                    BAC, 
                    NGAY_RA_MAT
                FROM TUONG NATURAL JOIN TRANG_PHUC
                ${champName &&
                    "WHERE TEN_TUONG = '" + champName.toUpperCase() +"'"
                }
                ORDER BY TEN_TUONG, CHU_DE`
                ;

            binds = {};

            // For a complete list of options see the documentation.
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
                // maxRows: 5,
                // prefetchRows:     100,                // internal buffer allocation size for tuning
                // fetchArraySize:   5                 // internal buffer allocation size for tuning
            };

            result = await connection.execute(sql, binds, options);

            console.log(result)
            res.render('skins', result)

        } catch (err) {

            console.error(err);

        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    },

    async postSkin(req, res) {
        try {

            let champName = req.body.champName
            let method = req.body.clientMethod

            let sql, binds, options, result;

            //
            // Query the data
            //

            connection = await db.connect()



            // VULNERABLE TO SQL INJECTION
            sql = `
                SELECT 
                    TEN_TUONG,
                    CHU_DE, 
                    BAC, 
                    NGAY_RA_MAT
                FROM TUONG NATURAL JOIN TRANG_PHUC
                ${champName &&
                    "WHERE TEN_TUONG = '" + champName.toUpperCase() + "'"
                }
                ORDER BY TEN_TUONG, CHU_DE`
                ;

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
            res.render('skins', result)

        } catch (err) {

            console.error(err);

        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

}