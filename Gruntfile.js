var fs   = require('fs-extra'),
    path = require('path'),
    modules = {
        "angular.js"    : {
            "grunt"     : ["package"], 
            "buildDir"  : "build",
            "repo"      : "git@github.com:cinema6/angular.js.git",
            "path"      : path.join('src','angular'),
            "target"    : path.join('lib','angular'),
            "remotes"   : { "upstream"  : "https://github.com/angular/angular.js.git" }
        },
        "GreenSock-JS"  : {
            "buildDir"  : "src/minified", 
            "npm"       : false, 
            "grunt"     : false ,
            "repo"      : "git@github.com:cinema6/GreenSock-JS.git",
            "path"      : path.join('src','gsap'),
            "target"    : path.join('lib','gsap'),
            "remotes"   : { "upstream"  : "https://github.com/greensock/GreenSock-JS.git"}
        },
        "hammer.js"     : {
            "grunt"     : ["build","--force"],
            "buildDir"  : "dist",
            "path"      : path.join('src','hammer.js'),
            "target"    : path.join('lib','hammer.js'),
            "repo"      : "git@github.com:cinema6/hammer.js.git",
            "remotes"   : { "upstream" : "git@github.com:EightMedia/hammer.js.git" }
        },
        "jquery"        : {
            "grunt"     : [],
            "buildDir"  : "dist",
            "repo"      : "git@github.com:cinema6/jquery.git",
            "path"      : path.join('src','jquery'),
            "target"    : path.join('lib','jquery'),
            "remotes"   : { "upstream"  : "https://github.com/jquery/jquery.git" }
        },
        "ui-router"     : {
            "grunt"     : [],
            "buildDir"  : "build",
            "repo"      : "git@github.com:cinema6/ui-router.git",
            "path"      : path.join('src','ui-router'),
            "target"    : path.join('lib','ui-router'),
            "remotes"   : { "upstream"  : "https://github.com/angular-ui/ui-router.git" }
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

