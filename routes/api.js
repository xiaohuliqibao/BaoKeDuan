var express = require('express');
const os = require('os');
const { exec } = require('child_process');
var router = express.Router();

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

module.exports = router;
