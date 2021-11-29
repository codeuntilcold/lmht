const exphbs = require('express-handlebars')
const express = require('express')
const app = express()

const oracledb = require('oracledb');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(__dirname + '/public'))

const PORT = process.env.PORT || 4000

const router = require('./controllers/router')
app.use('/', router)

const tkrouter = require('./controllers/tkcontroller')
app.use('/', tkrouter)

//=========Trung Tuan============
const db = require('./config/db');

app.get('/trangbi', function(req, res, next){
    res.render('trangbi'); // Tên handlebars
});
app.post('/trangbi/timkiem', async function(req, res, next){
    let id = req.body.id;
    try {
        let sql, binds, options, result;  
        connection = await db.connect()
        if(!isNaN(Number(id))){
            sql = `
            SELECT * 
            FROM TRANG_BI
            WHERE MA_TRANG_BI = ` + id;
            if(id.length == 0){
            sql = `
            SELECT * 
            FROM TRANG_BI`;
            }
        }
        else if(id == 'all'){
            sql = `
            SELECT * 
            FROM TRANG_BI`;
        }
        else {
            sql = `
            SELECT * 
            FROM TRANG_BI
            WHERE UPPER(TEN_TRANG_BI) LIKE ` + "UPPER('%" + id + "%')"; 
        }
        binds = {};
        console.log(sql);
        options = {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        };
        result = await connection.execute(sql, binds, options);
        if(result.rows.length == 0){
            res.render('trangbi', {
                error: 'Không tồn tại'
            });
        }
        else if(result.rows.length > 1){
            console.log(result.rows)
            res.render('chitiettrangbi' , {
                user: result.rows,
                flag: 1
            })            
        }
        else {
            res.render('chitiettrangbi' , {
                user: result.rows[0],
                flag: 0
            })
        }

      } catch (err) {
        console.error(err);
      }
  });

app.get('/trangbi/them', function(req, res, next){
    res.render('themtrangbi'); // Tên handlebars
});

app.post('/trangbi/them', async function(req, res, next){
    let ma_trang_bi = req.body.id;
    let ten_trang_bi = req.body.name;
    let mo_ta_trang_bi = req.body.mt;
    let hieu_ung = req.body.hu;
    let gia_mua = req.body.gm;
    try {
        let sql, binds, options, result;  
        connection = await db.connect()
        sql = "INSERT INTO TRANG_BI VALUES (" + ma_trang_bi 
                + ", '" + ten_trang_bi
                + "', '" + mo_ta_trang_bi
                + "', '" + hieu_ung
                + "', " + gia_mua
                + ")";
        binds = {};
        console.log(sql);
        options = {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        };
        result = await connection.execute(sql, binds, {autoCommit: true});
        res.render('themtrangbi', {done: 'Thêm trang bị thành công'});

    } catch (err) {
            if(isNaN(Number(ma_trang_bi)) || (!isNaN(Number(ma_trang_bi)) && (Number(ma_trang_bi) > 9999999999 || Number(ma_trang_bi) < 1)))
            {res.render('themtrangbi', {
                    error: 'Mã trang bị không thỏa mãn'
                });}
            else if(ten_trang_bi.length > 50 || ten_trang_bi.length == 0)
                {res.render('themtrangbi', {
                        error: 'Tên trang bị không thỏa mãn'
                });}
            else if(mo_ta_trang_bi.length > 100 || mo_ta_trang_bi.length == 0)
                {res.render('themtrangbi', {
                    error: 'Mô tả trang bị không thỏa mãn'
                });}
            else if(hieu_ung.length > 100)
                {res.render('themtrangbi', {
                    error: 'Hiệu ứng không thỏa mãn'
                });}
            else if(isNaN(Number(gia_mua)) || (!isNaN(Number(gia_mua)) && Number(gia_mua) <= 0))
                {res.render('themtrangbi', {
                    error: 'Giá mua không thỏa mãn'
                });}  
            else{
                {res.render('themtrangbi', {
                    error: 'Mã trang bị đã được sử dụng'
                });} 
            }                      
            console.error(err);
      }
  });

app.post('/trangbi/chinhsua/:id', async function(req, res, next){
    let id = req.params.id
    if(req.body.ten){
        let sql = "UPDATE TRANG_BI SET TEN_TRANG_BI = '" + req.body.ten + "' WHERE MA_TRANG_BI = " + id;
        console.log(sql);
        try{
            result = await connection.execute(sql, [], {autoCommit: true});}
        catch(err){}
    }
    if(req.body.mt){
        let sql = "UPDATE TRANG_BI SET MO_TA_TRANG_BI = '" + req.body.mt + "' WHERE MA_TRANG_BI = " + id;
        console.log(sql);
        try{
            result = await connection.execute(sql, [], {autoCommit: true});}
        catch(err){}
    }
    if(req.body.hu){
        let sql = "UPDATE TRANG_BI SET HIEU_UNG = '" + req.body.hu + "' WHERE MA_TRANG_BI = " + id;
        console.log(sql);
        try{
            result = await connection.execute(sql, [], {autoCommit: true});}
        catch(err){}
    }
    if(req.body.gm){
        let sql = "UPDATE TRANG_BI SET GIA_MUA = " + req.body.gm + " WHERE MA_TRANG_BI = " + id;
        console.log(sql);
        try{
            result = await connection.execute(sql, [], {autoCommit: true});}
        catch(err){}
    }
    let sql = "SELECT * FROM TRANG_BI WHERE MA_TRANG_BI =" + id;
    let options = {outFormat: oracledb.OUT_FORMAT_OBJECT,};
    result = await connection.execute(sql, [], options);
    res.render('chinhsuatrangbi',{
        ma: result.rows[0].MA_TRANG_BI,
        ten: result.rows[0].TEN_TRANG_BI,
        mt: result.rows[0].MO_TA_TRANG_BI,
        hu: result.rows[0].HIEU_UNG,
        gm: result.rows[0].GIA_MUA
    })
  });

app.post('/trangbi/xoa/:id', async function(req, res, next){
    let id = req.params.id;
    let sql = "DELETE FROM TRANG_BI WHERE MA_TRANG_BI = " + id;
    console.log(sql);
    result = await connection.execute(sql, [], {autoCommit: true});
    res.render('trangbi',{
        error: 'Đã xóa 1 trang bị'
    });
  });
app.post('/trangbi/thongke/:id', async function(req, res, next){
    let id = req.params.id;
    let sql1 = "SELECT B.MA_TRAN_DAU, COUNT(*) AS TK1, A.TEN_TRANG_BI FROM TRANG_BI A JOIN TRANG_BI_DUOC_SU_DUNG B ON A.MA_TRANG_BI = B.MA_TRANG_BI " 
                + "WHERE A.MA_TRANG_BI = "
                + id
                + " GROUP BY B.MA_TRAN_DAU, A.TEN_TRANG_BI";
    let sql2 = "SELECT MA_TRAN_DAU FROM TRAN_DAU" 
                + " GROUP BY MA_TRAN_DAU";
    let sql3 = "SELECT B.XEP_HANG "
                + "FROM TRANG_BI_DUOC_SU_DUNG A JOIN TAI_KHOAN B ON A.USERNAME = B.USERNAME "
                + "WHERE A.MA_TRANG_BI = " + id
                + " GROUP BY A.MA_TRAN_DAU, A.USERNAME, B.XEP_HANG";
    result1 = await connection.execute(sql1, [], {outFormat: oracledb.OUT_FORMAT_OBJECT,});
    result2 = await connection.execute(sql2, [], {outFormat: oracledb.OUT_FORMAT_OBJECT,});
    result3 = await connection.execute(sql3, [], {outFormat: oracledb.OUT_FORMAT_OBJECT,});
    let so_tran_dau = 0;
    let so_luot_su_dung = 0;
    let tong_so_tran_dau = 0;
    let rank = 0, dong = 0, bac = 0, vang = 0, bk = 0, kc = 0 ;
    let hang;
    for (const i of result1.rows) {  
        so_tran_dau = so_tran_dau + 1;
        so_luot_su_dung = so_luot_su_dung + i.TK1;
      }
    for (const i of result2.rows) {  
        tong_so_tran_dau = tong_so_tran_dau + 1;
      }
    for (const i of result3.rows) {  
        if(i.XEP_HANG.includes("Đồng")){
            dong = dong + 1;
            if(dong > rank){rank = dong; hang = "Đồng";}}
        if(i.XEP_HANG.includes("Bạc")){
            bac = bac + 1;
            if(bac > rank){rank = bac; hang = "Bạc";}}
        if(i.XEP_HANG.includes("Vàng")){
            vang = vang + 1;
            if(vang > rank){rank = vang; hang = "Vàng";}}
        if(i.XEP_HANG.includes("Bạch kim")){
            bk = bk + 1;
            if(bk > rank){rank = bk; hang = "Bạch kim";}}
        if(i.XEP_HANG.includes("Kim cương")){
            kc = kc + 1;
            if(kc > rank){rank = kc; hang = "Kim cương";}}
      }
    console.log(rank);
    let ty_le_xuat_hien = Math.round(so_tran_dau * 10000 / tong_so_tran_dau) / 10000;
    let tan_suat_su_dung = Math.round(so_luot_su_dung *100 / tong_so_tran_dau) / 100;
    res.render('thongke', {
        ma: id, 
        ten: result1.rows[0].TEN_TRANG_BI,
        rank: hang,
        chitiet: result1.rows,
        so_tran: so_tran_dau,
        so_luot: so_luot_su_dung,
        ty_le: ty_le_xuat_hien*100,
        tan_suat: tan_suat_su_dung
    })
  });
//===============================

app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT)
})