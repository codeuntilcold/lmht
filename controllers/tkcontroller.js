const oracledb = require('oracledb');
const db = require('../config/db');
const express = require('express')
const tkrouter = express.Router()
const { response } = require('express');

//==========Cường================
tkrouter.get('/taikhoan', function(req, res, next){
    res.render('taikhoan');
});
tkrouter.post('/taikhoan/timkiem', async function(req, res, next){
    let username = req.body.username;
    try {
        let sql, binds, options, result;  
        connection = await db.connect()
        if(username != 'all'){
            sql = `
            select username,ten,email,xep_hang,cap,luong_tien
            from tai_khoan 
            where upper(username) like ` + "upper('%" + username + "%')";
            if(username.length == 0){
            sql = `
            select username,ten,email,xep_hang,cap,luong_tien 
            from tai_khoan`;
            }
        }
        else{
            sql = `
            select username,ten,email,xep_hang,cap,luong_tien 
            from tai_khoan`;
        }
        binds = {};
        console.log(sql);
        options = {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        };
        result = await connection.execute(sql, binds, options);
        if(result.rows.length == 0){
            res.render('taikhoan', {
                error: 'Không tồn tại tài khoản'
            });
        }
        else if(result.rows.length > 1){
            console.log(result.rows)
            res.render('thongtintk' , {
                record: result.rows,
                flag: 1
            })            
        }
        else {
            res.render('thongtintk' , {
                record: result.rows[0],
                flag: 0
            })
        }

      } catch (err) {
        console.error(err);
      }
  });
tkrouter.get('/taikhoan/taotk', function(req, res, next){
    res.render('taotk');
});

tkrouter.post('/taikhoan/taotk', async function(req, res, next){
    let username = req.body.username;
    let mat_khau = req.body.matkhau;
    let ten = req.body.ten;
    let email = req.body.email;
    let xep_hang = req.body.xephang;
    let cap = req.body.cap;
    let server_s = req.body.servers;
    let server_h = req.body.serverh;
    let luong_tien = req.body.luongtien;
    try {
        let sql, binds, options, result;  
        connection = await db.connect()
        sql = "insert into tai_khoan values('" + username + "', '" + mat_khau + "', '" + ten + "', '" + email+ "','" 
                                            + xep_hang + "', " + cap + ",'" + server_s + "','" + server_h + "'," + luong_tien + ")";
        binds = {};
        console.log(sql);
        options = {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        };
        result = await connection.execute(sql, binds, {autoCommit: true});
        res.render('taotk', {done: 'Tạo tài khoản thành công'});

    } catch (err) {
            if(username.length == 0)
                {res.render('taotk', {
                        error: 'Username không được để trống'
                });}
            else if(mat_khau.length == 0)
                {res.render('taotk', {
                    error: 'Mật khẩu không được để trống'
                });}
            else if(ten.length == 0)
                {res.render('taotk', {
                    error: 'Tên không được để trống'
                });}
            else if(email.length == 0)
                {res.render('taotk', {
                    error: 'Email không được để trống'
                });}
            else if(cap.length == 0)
                {res.render('taotk', {
                    error: 'Cấp không được để trống'
                });}
            else if(isNaN(Number(cap)) || Number(cap) < 1)
                {res.render('taotk', {
                    error: 'Cấp phải là một số lớn hơn hay bằng 1'
                });}
            else if(server_s.length == 0)
                {res.render('taotk', {
                    error: 'Server S không được để trống'
                });}    
            else if(server_h.length == 0)
                {res.render('taotk', {
                    error: 'Server H không được để trống'
                });}
            else if(luong_tien.length == 0)
                {res.render('taotk', {
                    error: 'Lượng tiền không được để trống'
                });}
            else if(isNaN(Number(luong_tien)) || Number(luong_tien) < 0)
                {res.render('taotk', {
                    error: 'Lượng tiền phải là một số lớn hơn hay bằng 0'
                });}     
            else{
                {res.render('taotk', {
                    error: 'Đã tồn tại username này vui lòng chọn username khác'
                });} 
            }                      
            console.error(err);
      }
  });

tkrouter.post('/taikhoan/thaydoi/:username', async function(req, res, next){
    let username = req.params.username
    if(req.body.ten){
        let sql = "update tai_khoan set ten = '" + req.body.ten + "' where upper(username) like upper('%" + username + "%')";
        console.log(sql);
        try{
            result = await connection.execute(sql, [], {autoCommit: true});}
        catch(err){}
    }
    if(req.body.email){
        let sql = "update tai_khoan set email = '" + req.body.email + "' where upper(username) like upper('%" + username + "%')";
        console.log(sql);
        try{
            result = await connection.execute(sql, [], {autoCommit: true});}
        catch(err){}
    }
    if(req.body.xephang){
        let sql = "update tai_khoan set xep_hang = '" + req.body.xephang + "' where upper(username) like upper('%" + username + "%')";
        console.log(sql);
        try{
            result = await connection.execute(sql, [], {autoCommit: true});}
        catch(err){}
    }
    if(req.body.cap){
        let sql = "update tai_khoan set cap = " + req.body.cap + " where upper(username) like upper('%" + username + "%')";
        console.log(sql);
        try{
            result = await connection.execute(sql, [], {autoCommit: true});}
        catch(err){}
    }
    if(req.body.luongtien){
        let sql = "update tai_khoan set luong_tien = " + req.body.luong_tien + " where upper(username) like upper('%" + username + "%')";
        console.log(sql);
        try{
            result = await connection.execute(sql, [], {autoCommit: true});}
        catch(err){}
    }
    let sql = "select username,ten,email,xep_hang,cap,luong_tien from tai_khoan where upper(username) like upper('%" + username + "%')";
    let options = {outFormat: oracledb.OUT_FORMAT_OBJECT,};
    result = await connection.execute(sql, [], options);
    res.render('thaydoithongtintk',{
        username: result.rows[0].USERNAME,
        ten: result.rows[0].TEN,
        email: result.rows[0].EMAIL,
        xephang: result.rows[0].XEP_HANG,
        cap: result.rows[0].CAP,
        luongtien: result.rows[0].LUONG_TIEN,
    })
  });

tkrouter.post('/taikhoan/xoa/:username', async function(req, res, next){
    let username = req.params.username;
    let sql = "delete from tai_khoan where upper(username) like upper('%" + username + "%')";
    console.log(sql);
    result = await connection.execute(sql, [], {autoCommit: true});
    res.render('taikhoan',{
        error: 'Tài khoản đã bị xóa'
    });
  });
tkrouter.post('/taikhoan/bauvat/:username', async function(req, res, next){
    let username = req.params.username;
    let sql = "select username, ten_bau_vat from so_huu_bau_vat natural join bau_vat where upper(username) like upper('%" + username + "%')";
    result = await connection.execute(sql, [], {outFormat: oracledb.OUT_FORMAT_OBJECT,});
    console.log(sql);
    res.render('chitietsohuubauvat' , {
        username: result.rows[0].USERNAME,
        record: result.rows
    })
  });
//===============================
module.exports = tkrouter
