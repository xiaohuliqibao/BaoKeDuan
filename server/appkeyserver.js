const sqlite3 = require('sqlite3').verbose();
const daname = 'mysqlite'
const db = new sqlite3.Database(daname);

db.serialize(function() {
    const createsql = `CREATE TABLE IF NOT EXISTS appkey_info 
                (id INTEGER PRIMARY KEY AUTOINCREMENT, appkey TEXT,appkey_use_times INTEGER,appkey_user_id TEXT,appkey_status TEXT,appkey_remark TEXT)`
    db.run(createsql);
});     

class appkey_info
{
    constructor(appkey,appkey_use_times,appkey_user_id,appkey_status,appkey_remark)
    {
        // this.appkey = appkey;
        // this.appkey_use_times = appkey_use_times;
        // this.appkey_user_id = appkey_user_id;
        // this.appkey_status = appkey_status;
        // this.appkey_remark = appkey_remark;
    }

    /*
    * 获取所有的appkey_info
    * 参数：无
    * 返回：rd
    * */
    static getappkeyinfo(rd)
    {
        db.all(`SELECT * FROM appkey_info`,rd)
    }

    /*
    * 添加appkey_info
    * 参数：appkey,appkey_use_times,appkey_user_id,appkey_status,appkey_remark
    * 返回：无
    */
    static addAppkeyInfo(appkey,appkey_use_times,appkey_user_id,appkey_status,appkey_remark,rd)
    {
        db.run(`INSERT INTO appkey_info(appkey,appkey_use_times,appkey_user_id,appkey_status,appkey_remark) VALUES(?,?,?,?,?)`,[appkey,appkey_use_times,appkey_user_id,appkey_status,appkey_remark],rd)
    }

    /*
    * 通过appkey获取appkey_info
    * 参数：appkey
    * 返回：appkeyInfo
    *   
    **/
    static getAppkeyInfoByAppkey(appkey,appkeyInfo)
    {
        db.get(`SELECT * FROM appkey_info WHERE appkey = ?`,[appkey],appkeyInfo,(err,rows) =>
        {
          if(err){
            console.log(err)
          }else
          {
            appkeyInfo(rows)
          }
        }
        )
    }

    /*
    * 通过appkey_user_id获取appkey_info
    * 参数：appkey_user_id
    * 返回：appkeyInfo
    */
    static getAppkeyInfoByAppkeyUserId(appkey_user_id,appkeyInfo)
    {
        db.get(`SELECT * FROM appkey_info WHERE appkey_user_id = ?`,[appkey_user_id],appkeyInfo,(err,rows) =>
        {
          if(err){
            console.log(err)
          }else
          {
            appkeyInfo(rows)
          }
        }
        )
    }

    /* 通过appkey更新appkey_info中的appkey_status
    * 参数：appkey,appkey_status
    * 返回：无
    */
    static updateAppkeyStatusByAppkey(appkey,appkey_status,rd)
    {
        db.run(`UPDATE appkey_info SET appkey_status = ? WHERE appkey = ?`,[appkey_status,appkey],rd)
    }

    /*
    * 通过appkey_user_id添加appkey_info
    * 参数：appkey_user_id
    * 返回：无
    */
    static addAppkeyInfoByAppkeyUserId(appkey_user_id,rd)
    {
        //随机一个16为UUID的key
        let appkey = 'xiaohuli_qibao';
        //默认使用次数为0
        let appkey_use_times = 0;
        //默认状态为1
        let appkey_status = 1;
        //默认备注为空
        let appkey_remark = "";
        db.run(`INSERT INTO appkey_info(appkey,appkey_use_times,appkey_user_id,appkey_status,appkey_remark) VALUES(?,?,?,?,?)`,[appkey,appkey_use_times,appkey_user_id,appkey_status,appkey_remark],rd)
    }

    /* 查询数据库是否存在此appkey
    * 参数：appkey
    * 返回：rd
    */
    static isExistAppkey(appkey,appkey_info)
    {
        db.get(`SELECT * FROM appkey_info WHERE appkey = ?`,[appkey],appkey_info)
    }
}

//导出模块
module.exports.appkey_info = appkey_info;