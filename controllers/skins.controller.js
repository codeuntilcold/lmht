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

            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
            };

            result = await connection.execute(sql, binds, options);

            console.log(result)
            res.render('skins', result)

        } catch (err) {

            console.error(err);
            res.render('skins')

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

        async function getByChampName(connection, binds, options, champName) {
            
            // VULNERABLE TO SQL INJECTION
            const sql = `
                SELECT
                    MA_TUONG,
                    MA_TRANG_PHUC,
                    TEN_TUONG,
                    CHU_DE, 
                    BAC, 
                    NGAY_RA_MAT
                FROM TUONG NATURAL JOIN TRANG_PHUC
                ${champName &&
                    "WHERE TEN_TUONG = '" + champName.toUpperCase() + "'"
                }
                ORDER BY MA_TRANG_PHUC DESC`

            return await connection.execute(sql, binds, options);
        }



        try {

            const champName = req.body.champName
            const method = req.body.clientMethod

            let sql, binds, options, result;

            binds = {};
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
                autoCommit: true,   // save changes immediately
            };

            
            
            connection = await db.connect()

            if (method === 'GET') { 
                
                // VULNERABLE TO SQL INJECTION
                // sql = `
                //     SELECT
                //         MA_TUONG,
                //         MA_TRANG_PHUC,
                //         TEN_TUONG,
                //         CHU_DE, 
                //         BAC, 
                //         NGAY_RA_MAT
                //     FROM TUONG NATURAL JOIN TRANG_PHUC
                //     ${champName &&
                //         "WHERE TEN_TUONG = '" + champName.toUpperCase() + "'"
                //     }
                //     ORDER BY TEN_TUONG, CHU_DE`
                // result = await connection.execute(sql, binds, options);
                
                result = await getByChampName(connection, binds, options, champName)
                res.render('skins', result)
                
            }
            else if (method === 'POST') {

                // insert skin moi
                const nameofChamp = req.body.champName
                const skinPostfix = req.body.skinPostfix
                const skinLevel = req.body.skinLevel || 'Không'
                const date = req.body.date || '12-DEC-2021'

                sql = `
                    SELECT
                        MA_TUONG,
                        MA_TRANG_PHUC
                    FROM TRANG_PHUC
                    WHERE TEN_TUONG = '${nameofChamp.toUpperCase()}'
                    ORDER BY MA_TRANG_PHUC
                `

                result = await connection.execute(sql)
                // console.log(result)

                const matuong = result.rows[0][0]
                const matp = result.rows[result.rows.length - 1][1]

                sql = `
                    INSERT INTO TRANG_PHUC VALUES (${matuong}, ${matp + 1}, '${nameofChamp.toUpperCase()}', '${skinPostfix}', '${date}', '${skinLevel}')
                `

                const finalresult = await connection.execute(sql, binds, options)

                console.log(finalresult)

                res.render('skins', await getByChampName(connection, binds, options, champName))
            }
            else if (method === 'PUT') {

                const champID = req.body.champID
                const skinID = req.body.skinID
                const skinPostfix = req.body.skinPostfix
                const skinLevel = req.body.skinLevel

                sql = `
                    UPDATE TRANG_PHUC
                    SET CHU_DE = '${skinPostfix}', BAC = '${skinLevel}'
                    WHERE MA_TUONG = ${champID} AND MA_TRANG_PHUC = ${skinID}
                `

                console.log(await connection.execute(sql, binds, options))
                
                result = await getByChampName(connection, binds, options, champName)
                res.render('skins', result)
            }
            else if (method === 'DELETE') {

                const champID = req.body.champID
                const skinID = req.body.skinID

                sql = `
                    DELETE FROM TRANG_PHUC
                    WHERE MA_TUONG = ${champID} AND MA_TRANG_PHUC = ${skinID}
                `
                console.log(sql)

                result = await connection.execute(sql, binds, options)
                // console.log(result)
                // res.render('skins')
                res.render('skins', await getByChampName(connection, binds, options, champName))
            }

        } catch (err) {

            console.error(err);
            res.render('skins')

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