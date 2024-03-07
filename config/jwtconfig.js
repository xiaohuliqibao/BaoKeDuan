const expressJwt = require("express-jwt");

const params = {
    secret: 'baokeyuan.kagerou.top@xiaohuliqibao',
    algorithms:["HS256"]
}

const unless_path = ['/api/login'
                    ,'/api/register']

const jwtAuth = expressJwt.expressjwt(params).unless({path: unless_path});

module.exports = jwtAuth;