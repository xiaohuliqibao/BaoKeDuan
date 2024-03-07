var express = require('express');
var userserver = require('../server/userserver');
const os = require('os');
const { exec } = require('child_process');
var router = express.Router();
var jwt = require('jsonwebtoken');
const { secretKey } = require('../config/defultconfig');


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

router.post('/login',function(req, res, next) {
    const number = req.body.number;
    const code = req.body.code;
    if (number !== '321' || code !== '123456') {
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
})

module.exports = router;
