const _ = require('lodash')
const redis = require("ioredis");

module.exports = (config, parameters) =>new Promise(async (resolve, reject)=>{
    let result = {
        status: '',
        msg: '',
        config: _.omit(config, 'password')
    }
    let redisInstance = new redis({
        port: config.port,
        host: config.host,
        password: config.password
    });
    redisInstance.on('error', function (err) {
        result.status = 'bad';
        result.msg = err;
        redisInstance.disconnect();
        resolve(result);
    });
    redisInstance.on('connect', function () {
        result.status = 'ok';
        redisInstance.disconnect();
        resolve(result);
    });
});