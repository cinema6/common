var fs   = require('fs-extra'),
    path = require('path'),
    submodules = fs.readJsonSync(path.join(__dirname,"modules.json")),
    aws_auth;

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    
    if ((process.env.HOME) && (fs.existsSync(path.join(process.env.HOME,'.aws.json')))){
        aws_auth = grunt.file.readJSON(
                path.join(process.env.HOME,'.aws.json')
        );
    }
   
    submodules.options = {
        sync : {
            skipIfNoRemote : true
        }
    };

    grunt.initConfig({
        add         :  submodules,
        add_remotes :  submodules, 
        build       :  submodules,
        checkout    :  submodules,
        sync        :  submodules,
        
        submodule_version :      submodules,
        
        upload: {
            options: {
                key:    aws_auth.accessKeyId,
                secret: aws_auth.secretAccessKey,
                bucket: 'c6.dev',
                access: 'public-read',
                headers : { 'Cache-Control' : 'max-age=31536000' },
                maxOperations: 10 
            },
            test: {
                upload: [
                    {
                        src: 'lib/**',
                        dest: 'ext/',
                        rel : 'lib/'
                    }
                ]
            },
            production: {
                options: {
                    bucket: 'c6.ext'
                },
                upload: [
                    {
                        src: 'lib/**',
                        rel : 'lib/'
                    }
                ]
            }
        },

        clean: {
            lib: path.join(__dirname,'lib')
        },

        copy : {
            modernizr: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/modernizr',
                        dest: 'lib/modernizr',
                        src: '**'
                    },
                ]
            },
            requirejs: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/requirejs',
                        dest: 'lib/require',
                        src: '**'
                    },
                ]
            }
        }
    });

    grunt.task.renameTask('s3','upload');
    grunt.task.renameTask('submodule_add'           , 'add');
    grunt.task.renameTask('submodule_add_remotes'   , 'add_remotes');
    grunt.task.renameTask('submodule_build'         , 'build');
    grunt.task.renameTask('submodule_checkout'      , 'checkout');
    grunt.task.renameTask('submodule_sync'          , 'sync');
    
    grunt.registerTask('print-versions','Prints versions from submodule_version',function(){
        this.requires('status');
        this.requiresConfig('submodule_versions');

        var versionData = grunt.config('submodule_versions');

        for (var module in versionData){
            grunt.log.writelns((module + '                ').substr(0,16) + ': ' +
            ('                           ' + versionData[module]).slice(-25) );
        }
        return true;
    });

    grunt.registerTask('status',['submodule_version','print-versions']);

    grunt.registerTask('init',['submodule_update','add_remotes','status']);

    grunt.registerTask('build-all',['build','copy']);

    grunt.registerTask('default',['build-all']);
};

