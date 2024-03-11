const sqlite3 = require('sqlite3').verbose();

const daname = 'mysqlite'
const db = new sqlite3.Database(daname);

db.serialize(function() {
    const createsql = `CREATE TABLE IF NOT EXISTS users 
                (id INTEGER PRIMARY KEY AUTOINCREMENT, number TEXT, code TEXT)`
    db.run(createsql);
});

class users{
    constructor(number, code){
        
    }
    //获取所有用户
    static getAll(rd){
        db.all('SELECT * FROM users',rd)
    }
    //根据number获取用户
    static getByNumber(number,rd){
        db.get('SELECT * FROM users WHERE number=?',number,rd)
    }
    //根据number更新code
    static updateCode(number,code,rd){
        db.run('UPDATE users SET code=? WHERE number=?',code,number,rd)
    }
    //根据number删除user,如果number不存在返回错误‘缺失number参数’
    static deleteByNumber(number,rd){
        if(!number) return rd('缺失number参数')
        db.run('DELETE FROM users WHERE number=?',number,rd)
    }
    //新增一个user
    static add(number,code,rd){
        db.run('INSERT INTO users (number,code) VALUES (?,?)',number,code,rd)   
    }
}

//导出user
module.exports.users = users;