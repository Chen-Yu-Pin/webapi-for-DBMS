const express=require('express');
const querystring = require("querystring"); 
const app=express();
const port=3000;
const mysql=require('mysql');
const fs=require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.static(__dirname));
console.log(__dirname.toString());
const con=mysql.createConnection({
    host:'localhost',
    user:'bing',
    password:'********',
    database:'9ay',
    port:3301,
    timezone:'08:00'
});
con.connect((err)=>{
    if(err) throw err;
    console.log('database connect success');
});
var index;
fs.readFile('peko.html','utf-8',(err,data)=>{
        index=data;
        
    })
app.get('/',(req,res)=>{})
app.get('/gay',(req,res)=>{
    console.log(req.query);
    let Time=req.query.date.toString();
    let behavior=req.query.detail.toString();
    let ee=`%${behavior}%`;
    if(Time&&Time!="null"){
        con.query(`select * from whathedo where  TO_DAYS(Time) = TO_DAYS( ? ) and WhatHeDo like ?`,[Time,ee],(err,result)=>{
            if(err) throw err;
                res.setHeader("Content-Type","text/html");
                res.send(result)
                return;
            });
    }else if(Time=='null'||ee=='null'){
        console.log('ss');
        con.query(`select * from whathedo `,(err,result)=>{
            if(err) throw err;
            res.setHeader("Content-Type","text/html");
            console.log(result);
            res.send(result)
            return;
        });
    }else{
        con.query(`select * from whathedo where WhatHeDo like ? `,ee,(err,result)=>{
            if(err) throw err;
            res.setHeader("Content-Type","text/html");
            console.log(result);
            res.send(result)
            return;
        });
    }
})
app.get('/gay/:date',(req,res)=>{

    let peko=req.params.date;
    console.log(peko);
    //res.send(index)
    con.query(`select * from whathedo where  TO_DAYS(Time) =  TO_DAYS( ? ) `,peko,(err,result)=>{
        if(err) throw err;
            res.setHeader("Content-Type","text/html");
            res.send(result)
            return;
        });
    
})
app.post('/gay',(req,res)=>{
    let fin=''
    req.on('data',(data)=>{
        fin=JSON.parse(data);
        console.log(fin);
        let addTime=fin.date.toString();
        let addBehaivor=fin.detail.toString();
        if(addTime&&addBehaivor){
            con.query(`INSERT INTO whathedo (Time, whathedo)VALUES ( ? , ? );`,[`${addTime}`,`${addBehaivor}`],(err,result)=>{
                if(err){
                    res.send('資料有誤，請輸入完整資料')
                    return;
                } 
                res.setHeader("Content-Type","text/html");
                res.send('新增成功')
                return;
            });
        }else{
            res.send('請輸入完整資料');
        }
    })
})
app.put('/gay',(req,res)=>{
    req.on('data',(data)=>{
        tt=JSON.parse(data).date.toString();
        dodo=JSON.parse(data).detail.toString();
        current=JSON.parse(data).current.toString();
        if(tt&&dodo){
            con.query(`update whathedo set Time= ? ,WhatHeDo= ? where Time =? `,[`${tt}`,`${dodo}`,`${current}`],(err,result)=>{
                if(err)throw err;
                res.send("已更新");
            })
        }else if(!tt&&dodo){
            con.query(`update whathedo set WhatHeDo= ? where Time =? `,[`${dodo}`,`${current}`],(err,result)=>{
                if(err)throw err;
                res.send("已更新");
            })    
        }else if(tt&&!dodo){
            con.query(`update whathedo set Time= ?  where Time =? `,[`${tt}`,`${current}`],(err,result)=>{
                if(err)throw err;
                res.send("已更新");
            })    
        }else{
            res.send("請填寫更改資料");
        }
    })
})
app.delete('/gay',(req,res)=>{
    req.on('data',(data)=>{
        let fin=JSON.parse(data).date.toString();
        con.query(`DELETE FROM whathedo WHERE Time= ? `,`${fin}`,(err,result)=>{
            if(err)throw err;
            res.send("已刪除")
        })
    })
})
app.listen(port,()=>{
    console.log(`listening on ${port}`);
}) 
