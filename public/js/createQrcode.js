var fs = require('fs');
var request = require('request');

var AccessToken = {
    grant_type: 'client_credential',
    appid: "wx073c636af12a37bd",
    secret: "1cf6a1bbde0bde4edb557c70b6ac6359"
}
var wx_gettoken_url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=' + AccessToken.grant_type + '&appid=' + AccessToken.appid + '&secret=' + AccessToken.secret;
var create_time = 0,
    now = 0,
    token = '';
//获取微信的token  
var getWxToken = function() {
    var that = this;
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            url: wx_gettoken_url
        }, function(err, res, body) {
            if (res) {
                create_time = new Date().getTime();
                token = JSON.parse(body);
                resolve({
                    isSuccess: true
                });
            } else {
                resolve({
                    isSuccess: false
                });
            }
        })
    });
}

var createQrcode = {
    create: function() {
        var that = this;
        if (this.isInTwoHours()) {
            this.getQrcode();
        } else {
            getWxToken().then(res => {
                if (res.isSuccess) {
                    // that.getQrcode();
                    that.sendMsg();
                    // that.getSessionKey().then(res => {
                    //     console.log(res);
                    // })
                } else {
                    console.log('获取token出错');
                }
            })
        }
    },
    //判断是否超过两个小时，将token存储起来，减少token请求。  
    isInTwoHours: function() {
        console.log('fn:isTwoHours');
        now = new Date().getTime();
        var diffHours = (now - create_time) / (60 * 1000);
        console.log('diffHours：' + diffHours);
        if (diffHours < 2) {
            return true;
        } else {
            return false;
        }
    },
    //生成二维码  
    getQrcode: function() {
        new Promise(function(resolve, reject) {
            resolve(
                request({
                    method: 'POST',
                    url: 'https://api.weixin.qq.com/wxa/getwxacode?access_token=' + token.access_token,
                    body: JSON.stringify({
                        "path": "pages/index/index",
                        "width": "400"
                    })
                }))
        }).then(data => {
            //将微信返回的东西装到文件中。  
            data.pipe(fs.createWriteStream('./public/images/index1.png'));
        })

    },
    // 获取模板库模板消息
    getMsg() {
        request({
            method: 'POST',
            url: 'https://api.weixin.qq.com/cgi-bin/wxopen/template/library/get?access_token=' + token.access_token,
            body: JSON.stringify({
                "id": "AT0002"
            })
        }, function(err, res, body) {
            if (res) {
                console.log(body)
            } else {
                console.log(err)
            }
        })
    },
    say() {
        console.log("say");
    },
    // 发送模板消息
    sendMsg() {
        request({
            method: 'POST',
            url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + token.access_token,
            body: JSON.stringify({
                "touser": "oJhZV4yhO_5JUHYBhSY4u7SXLFGc",
                "template_id": "zpRjfrW_Lv6FHJB6PQDuMn0wOsA5iPWgJoC4RN52IGo",
                "page": "pages/index/index",
                "form_id": "FORMID",
                "data": {}
            })
        }, function(err, res, body) {
            if (res) {
                console.log(body)
            } else {
                console.log(err)
            }
        })
    },
    // 通过code换取session_key
    getSessionKey() {
        return new Promise(function(resolve, reject) {
            request({
                method: 'get',
                url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + AccessToken.appid + '&secret=' + AccessToken.secret + '&js_code=011wo5o50ARSBJ1KSrl50zUmo50wo5o5&grant_type=authorization_code',
            }, function(err, res, body) {
                if (res) {
                    resolve(body);
                } else {
                    reject(err)
                }
            })
        })
    }
}

module.exports = createQrcode;