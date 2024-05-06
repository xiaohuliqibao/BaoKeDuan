const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const daname = 'mysqlite'
const db = new sqlite3.Database(daname);

db.serialize(function() {
    const createsql = `CREATE TABLE IF NOT EXISTS fileinfo 
                (id INTEGER PRIMARY KEY AUTOINCREMENT, filename TEXT,fileext TEXT, filepath TEXT,filesize TEXT,filecreatetime TEXT,fileuploadtime TEXT, fileuploaduser TEXT,filefullinfo TEXT)`
    db.run(createsql);
});

class fileinfo{
    
    constructor(filename,fileext,filepath,filesize,filecreatetime,fileuploaduser,fileuploadtime,filefullinfo){
        // //完成构造函数内部
        // this.filename = filename;
        // this.fileext = fileext;
        // this.filepath = filepath;
        // this.filesize = filesize;
        // this.filecreatetime = filecreatetime;
        // this.fileuploaduser = fileuploaduser;
        // this.fileuploadtime = fileuploadtime;
        // this.filefullinfo = filefullinfo;
    }

    //获取所有文件列表
    static getAllFileInfo(rd){
        db.all(`SELECT * FROM fileinfo`,rd)
    }
    //新增一个文件
    static addFileInfo(filename,fileext,filepath,filesize,filecreatetime,fileuploaduser,fileuploadtime,filefullinfo,rd){
        db.run(`INSERT INTO fileinfo (filename,fileext,filepath,filesize,filecreatetime,fileuploaduser,fileuploadtime,filefullinfo) 
            VALUES (?,?,?,?,?,?,?,?)`,filename,fileext,filepath,filesize,filecreatetime,fileuploaduser,fileuploadtime,filefullinfo,rd);
    }
    //通过filefullinfo删除一个文件
    static deleteFileInfoByFileFullInfo(filefullinfo,rd){
        db.run(`DELETE FROM fileinfo WHERE filefullinfo = ?`,filefullinfo,rd);
    }

    //通过filefullinfo获取一个文件
    static getFileInfoByFileFullInfo(filefullinfo,rd){
        db.get(`SELECT * FROM fileinfo WHERE filefullinfo = ?`,filefullinfo,(err,rows)=>{
            if(err){
                console.log(err);
            }else{
                rd(rows);
            }
        })
    }

    //获取当前目录下所有文件信息，通过系统文件操作
    static addFiles(filedir){
        fs.readdirSync(filedir).map(file => {
            const filePath = path.join(filedir,file)
            const fileStat = fs.statSync(filePath)
            if(fileStat.isDirectory()){
                fileinfo.addFiles(filePath)
            }
            if(fileStat.isFile()){
                console.log(path.resolve(filePath));
                fileinfo.addFileInfo(path.basename(filePath),path.extname(filePath),path.resolve(filePath),fileStat.size,fileStat.ctime.toLocaleDateString(),'qibao',new Date().toLocaleDateString(),filePath)
            }
        })
    }

}

//导出fileinfo
module.exports.fileinfo = fileinfo;