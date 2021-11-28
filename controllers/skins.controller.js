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

    async handlePostSkin(req, res) {
        try {

            const champName = req.body.champName
            const method = req.body.clientMethod

            let sql, binds, options, result;

            //
            // Query the data
            //

            connection = await db.connect()

            binds = {}
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
                autoCommit: true
            }

            if (method === 'GET') {

                // VULNERABLE TO SQL INJECTION
                sql = `
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
                    ORDER BY TEN_TUONG, CHU_DE`


                result = await connection.execute(sql, binds, options);

                // console.log(result)
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
                `

                result = await connection.execute(sql)

                const matuong = result.rows[0][0]
                const matp = result.rows.length

                console.log(matuong, matp)

                sql = `
                INSERT INTO TRANG_PHUC VALUES (${matuong}, ${matp + 1}, '${nameofChamp.toUpperCase()}', '${skinPostfix}', '${date}', '${skinLevel}')
                `
                // console.log(sql)

                const finalresult = await connection.execute(sql, binds, options)

                console.log(finalresult)

                // res.render('skins')
                res.redirect('/skins/' + nameofChamp)
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
                res.render('skins')
                
                
            }
            else if (method === 'DELETE') {
                const champID = req.body.champID
                const skinID = req.body.skinID

                sql = `
                    DELETE FROM TRANG_PHUC
                    WHERE MA_TUONG = ${champID} AND MA_TRANG_PHUC = ${skinID}
                `

                // console.log(sql)
                result = await connection.execute(sql, binds, options)
                // console.log(result)
                res.render('skins')
                // res.redirect('skins/' + champName)
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