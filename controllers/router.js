const express = require('express')
const router = express.Router()
const db = require('../config/db')
const oracledb = require('oracledb');
const skin = require('./skins.controller')
const champs = require('./champs.controller');
const { response } = require('express');

router.get('/', (req, res) => {

    res.render('index', {
        name: 'Ngo Le Quoc Dung',
        age: 20
    })
})

// router.get('/skins', skin.getSkins)

router.get('/trandau', function(req, res, next){
    res.render('trandau'); // Tên handlebars
  });
  
  
router.post('/trandau/view-history', async function(req,res){
      try {
          let name = req.body.name;
          let sql, binds, options, result;
          connection = await db.connect()
          sql = `
          SELECT TRAN_DAU.MA_TRAN_DAU, TUONG.TEN_TUONG, TRAN_DAU.MA_TRAN_DAU, NHAP_VAI.THANG_THUA, CHI_SO_LINH, NHAP_VAI.KILL, NHAP_VAI.DEATH, NHAP_VAI.ASSIST, tran_dau.thoi_gian_bat_dau, tran_dau.thoi_gian_ket_thuc
          FROM NHAP_VAI JOIN TAI_KHOAN ON NHAP_VAI.USERNAME = TAI_KHOAN.USERNAME
               JOIN TUONG ON NHAP_VAI.MA_TUONG = TUONG.MA_TUONG 
               JOIN TRAN_DAU ON TRAN_DAU.MA_TRAN_DAU = nhap_vai.ma_tran_dau
          WHERE TAI_KHOAN.TEN=` + `'` + name + `'`;
          
          binds = {};
          options = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
          };  
          result = await connection.execute(sql, binds, options);
  
          if(result.rows.length == 0){
            res.render('trandau', {
                error: 'Không tồn tại người chơi'
            });
          }
          else if(result.rows.length > 1){
            console.log(result.rows)
            res.render('view-history' , {
                user: result.rows,
            })            
          }
        } catch (err) {
          console.error(err);
        }
  })
  
  
  router.post('/trandau/chitiettrandau/:id', async function(req,res){
    try {
        let id = req.params.id
        let sql, binds, options, result;
        connection = await db.connect()
  
        sql = `
        SELECT TAI_KHOAN.TEN, NHAP_VAI.PHE, NHAP_VAI.THANG_THUA, TUONG.TEN_TUONG, CHI_SO_LINH, NHAP_VAI.KILL, NHAP_VAI.DEATH, NHAP_VAI.ASSIST, NHAP_VAI.MA_TRAN_DAU
        FROM NHAP_VAI JOIN TAI_KHOAN ON NHAP_VAI.USERNAME = TAI_KHOAN.USERNAME
            JOIN TRAN_DAU ON NHAP_VAI.MA_TRAN_DAU = TRAN_DAU.MA_TRAN_DAU
            JOIN TUONG ON NHAP_VAI.MA_TUONG = TUONG.MA_TUONG
        WHERE NHAP_VAI.MA_TRAN_DAU=` + id + 
        `ORDER BY PHE`;
        
        binds = {};
        options = {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        };  
  
        result = await connection.execute(sql, binds, options);
        console.log(result.rows)
        res.render('chitiettrandau',{
          user: result.rows,
        })
      } catch (err) {
        console.error(err);
      }
  })
  
  router.get('/champ/them', function(req, res, next){
    res.render('themtuong'); // Tên handlebars
  });

  router.post('/champ/them', async function(req, res, next){
    let ma_tuong = req.body.id;
    let ten_tuong = req.body.name;
    let mo_ta_tuong = req.body.mt;
    let gia_mua = req.body.gm;
    try {
        let sql, binds, options, result;  
        connection = await db.connect()
        sql = `INSERT INTO TUONG VALUES (` + ma_tuong + `, '` + ten_tuong
        + `' ,` + gia_mua + `, '` + mo_ta_tuong + `')` 
        binds = {};
        console.log(sql);
        options = {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        };
        result = await connection.execute(sql, binds, {autoCommit: true});
        res.render('themtuong', {done: 'Thêm tướng thành công'});
  
    } catch (err) {
            if(isNaN(Number(ma_tuong)) || (!isNaN(Number(ma_tuong)) && (Number(ma_tuong) > 9999999999 || Number(ma_tuong) < 1)))
            {res.render('themtuong', {
                    error: 'Mã tướng không thỏa mãn'
                });}
            else if(ten_tuong.length > 50 || ten_tuong.length == 0)
                {res.render('themtuong', {
                        error: 'Tên tướng không thỏa mãn'
                });}
            else if(mo_ta_tuong.length > 100 || mo_ta_tuong.length == 0)
                {res.render('themtuong', {
                    error: 'Mô tả tướng không thỏa mãn'
                });}
            else if(isNaN(Number(gia_mua)) || (!isNaN(Number(gia_mua)) && Number(gia_mua) <= 0))
                {res.render('themtuong', {
                    error: 'Giá mua không thỏa mãn'
                });}  
            else{
                {res.render('themtuong', {
                    error: 'Mã tướng đã được sử dụng'
                });} 
            }                      
            console.error(err);
      }
      finally {
        if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error(err);
          }
        }
      }
  });

  router.post('/champ/chinhsua/:id', async function(req, res, next){
    let id = req.params.id
    let connection = await db.connect()
    binds = {}
    if(req.body.ten){
        let sql = "UPDATE TUONG SET TEN_TUONG = '" + req.body.ten + "' WHERE MA_TUONG = " + id;
        console.log(sql);
        
        try{
            result = await connection.execute(sql, binds, {autoCommit: true});}
        catch(err){}
    }
    if(req.body.mt){
        let sql = "UPDATE TUONG SET MO_TA = '" + req.body.mt + "' WHERE MA_TUONG = " + id;
        console.log(sql);
        try{
            result = await connection.execute(sql, binds, {autoCommit: true});}
        catch(err){}
    }
    if(req.body.gm){
        let sql = "UPDATE TUONG SET GIA_MUA = " + req.body.gm + " WHERE MA_TUONG = " + id;
        console.log(sql);
        try{
            result = await connection.execute(sql, binds, {autoCommit: true});}
        catch(err){}
    }
    let sql = "SELECT * FROM TUONG WHERE MA_TUONG =" + id;
    options = {outFormat: oracledb.OUT_FORMAT_OBJECT,};
    result = await connection.execute(sql, binds, options);
    res.render('chinhsuatuong',{
        ma: result.rows[0].MA_TUONG,
        ten: result.rows[0].TEN_TUONG,
        mt: result.rows[0].MO_TA_TUONG,
        gm: result.rows[0].GIA_MUA
    })
  });

  router.post('/champ/xoa/:id', async function(req, res, next){
    try{    
        connection = await db.connect()
        let id = req.params.id;
        let sql, binds, options, result; 
        sql = "DELETE FROM TUONG WHERE MA_TUONG = " + id;
        binds = {};
        console.log(sql);
        options = {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        };
        result = await connection.execute(sql, binds, {autoCommit: true});
    }catch (err) {
        console.error(err);
    }
    
  });

router.get('/skins', (_, res) => res.render('skins'))
router.get('/skins/:champName', skin.getSkins)
// All request come to POST
router.post('/skins', skin.postSkin)

router.get('/champions', (_, res) => res.render('champs'))
router.post('/champions', champs.postChamp)



module.exports = router