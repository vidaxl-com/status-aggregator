const redis = require("ioredis");

module.exports = (config, parameters) =>new Promise(async (resolve, reject)=>{
    let status;
    let redisInstance = new redis({
        port: config.port,
        host: config.host,
        password: config.password
    });
    redisInstance.on('error', function (err) {
        status = 'bad';
        redisInstance.disconnect();
        resolve({status, err});
    });
    redisInstance.on('connect', function () {
        status = 'ok';
        redisInstance.disconnect();
        resolve({status});
    });
});