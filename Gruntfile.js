var fs   = require('fs-extra'),
    path = require('path'),
    moduleData = {
        "angular.js"    : {
            "upstream"  : "https://github.com/angular/angular.js.git"
        },
        "GreenSock-JS"  : {
            "upstream"  : "https://github.com/greensock/GreenSock-JS.git"
        },
        "hammer.js"     : {
            "upstream"  : ""
        },
        "jquery"        : {
            "upstream"  : "https://github.com/jquery/jquery.git"
        },
        "ui-router"     : {
            "upstream"  : "https://github.com/angular-ui/ui-router.git"
        }
    };

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


    grunt.initConfig({


    });

    grunt.registerTask('printCommit',function(){
        grunt.log.writelns('LastCommit: ' + grunt.config('gitLastCommit').commit);
    });

    grunt.registerTask('default',['gitLastCommit','printCommit'])

};

