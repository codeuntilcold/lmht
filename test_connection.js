const oracledb = require('oracledb');
const db = require('./config/db');

async function run() {

  try {

    let sql, binds, options, result;

    //
    // Query the data
    //

    connection = await db.connect()

    sql = `
      SELECT * 
      FROM TAI_KHOAN
      WHERE TEN='Gratia9'`;

    binds = {};

    // For a complete list of options see the documentation.
    options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
      // maxRows: 5,
      // extendedMetaData: true,               // get extra metadata
      // prefetchRows:     100,                // internal buffer allocation size for tuning
      //   fetchArraySize:   5                 // internal buffer allocation size for tuning
    };

    result = await connection.execute(sql, binds, options);

    console.log("Metadata: ");
    console.dir(result.metaData, { depth: null });
    console.log("Query results: ");
    console.dir(result.rows, { depth: null });

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

run();