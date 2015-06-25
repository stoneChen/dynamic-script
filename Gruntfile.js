module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        connect: {
            all: {
                options: {
                    port: 3000,
                    open: 'http://localhost:3000/test.html',
                    middleware: function (connect, options, middlewares) {
                        return [
                            function (req, res, next) {
                                if(req.originalUrl !== '/test.html'){//指定需要动态处理的url，否则执行下一个中间件
                                    return next();
                                }
                                var indexHTML = grunt.file.read('test/test.html');//找到相应的html文件，这里硬编码指定
                                var scriptTags = '<script src="/dynamic.js"></script>';//待插入的script标签
                                var injectedHTML = indexHTML.replace(/<\/body>/, function(w) {//找到body尾标签，插入上面的标签
                                    return scriptTags + w ;
                                });
                                res.end(injectedHTML);//返回给客户端
                            },
                            connect.static('test')//把test目录作为一个web目录
                        ]
                    }
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('default', 'connect:all:keepalive');

};
