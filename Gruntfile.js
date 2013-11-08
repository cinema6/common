var fs   = require('fs-extra'),
    path = require('path'),
    modules = {
        "angular.js"    : {
            "grunt"     : ["package"], 
            "buildDir"  : "build",
            "repo"      : "git@github.com:cinema6/angular.js.git",
            "path"      : path.join(__dirname,'src','angular'),
            "target"    : path.join(__dirname,'lib','angular'),
            "remotes"   : [
                { "upstream"  : "https://github.com/angular/angular.js.git" }
            ]
        },
        "GreenSock-JS"  : {
            "buildDir"  : "src/minified", 
            "npm"       : false, 
            "grunt"     : false ,
            "repo"      : "git@github.com:cinema6/GreenSock-JS.git",
            "path"      : path.join(__dirname,'src','gsap'),
            "target"    : path.join(__dirname,'lib','gsap'),
            "remotes"   : [
                { "upstream"  : "https://github.com/greensock/GreenSock-JS.git"}
            ]
        },
        "hammer.js"     : {
            "grunt"     : ["build"],
            "buildDir"  : "dist",
            "path"      : path.join(__dirname,'src','hammer.js'),
            "target"    : path.join(__dirname,'lib','hammer.js'),
            "repo"      : "git@github.com:cinema6/hammer.js.git",
            "remotes"   : []
        },
        "jquery"        : {
            "grunt"     : [],
            "buildDir"  : "dist",
            "repo"      : "git@github.com:cinema6/jquery.git",
            "path"      : path.join(__dirname,'src','jquery'),
            "target"    : path.join(__dirname,'lib','jquery'),
            "remotes"   : [
                { "upstream"  : "https://github.com/jquery/jquery.git" }
            ]
        },
        "ui-router"     : {
            "grunt"     : [],
            "buildDir"  : "build",
            "repo"      : "git@github.com:cinema6/ui-router.git",
            "path"      : path.join(__dirname,'src','ui-router'),
            "target"    : path.join(__dirname,'lib','ui-router'),
            "remotes"   : [
                { "upstream"  : "https://github.com/angular-ui/ui-router.git" }
            ]
        }
    };

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


    grunt.initConfig({
        
        submodule_add :          modules,

        submodule_add_remotes :  modules, 

        submodule_build :        modules

    });

    grunt.registerTask('printCommit',function(){
        grunt.log.writelns('LastCommit: ' + grunt.config('git_last_commit').commit);
    });

    grunt.registerTask('default',['git_last_commit','printCommit'])

};

