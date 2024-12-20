//一个开发的api接口，在调用api的时候需要验证appkey，appkey值存储再db中，appkey值可以自定义，appkey值可以设置过期时间，appkey值可以设置调用次数，appkey值可以设置调用频率
var express = require('express');
var router = express.Router();

//引入appkeyserver.js的appkey_info模块命名为appkeyinfoserver
const appkeyinfoserver = require('../server/appkeyserver').appkey_info;

//router 中间件用于验证appkey
const appkey = function (req, res, next) {
    const appkey = req.query.appkey;

    //从appkeyinfoserver的isExistAppkey方法通过传递appkey，判断appkey是否存在
    const t_appkey = appkeyinfoserver.isExistAppkey(appkey, function (err, result) {
        if (err) {
            return res.status(500).json({ code: 9500, message: 'server error' });
        }
        if (!result) {
            return res.status(401).json({ code: 9401, message: 'appkey is not exist' });
        }
    })
    //验证appkey是否禁用
    if (t_appkey.appkey_status == 0) {
        return res.status(401).json({ code: 9401, message: 'appkey is limited' });
    }
    //验证appkey是否正确
    if(t_appkey.appkey != appkey){
        return res.status(401).json({ code: 9401, message: 'appkey is invalid' });
    }
    next();
}

//router 中间件用于验证appkey
router.get('/test', appkey, function (req, res, next) {
    const appkey = req.query.appkey;
    res.json({ code: 200, message: 'appkey' });
})

/* 接口 /addkey 添加appkey
* 请求方式：POST
* 请求参数： appkey_user_id
*/
router.post('/addappkey', function (req, res, next) {
    const appkey_user_id = req.body.appkey_user_id;
    //验证appkey_user_id是否为空
    if (!appkey_user_id) {
        return res.status(401).json({ code: 9401, message: 'appkey_user_id is required' });
    }
    appkeyinfoserver.addAppkeyInfoByAppkeyUserId(appkey_user_id, function (err, result) {
        if (err) {
            return res.status(500).json({ code: 9500, message: err.message });
        }
        res.json({ code: 7200, message: 'add appkey success' });
    })

})
module.exports = router;