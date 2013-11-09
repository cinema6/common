var fs   = require('fs-extra'),
    path = require('path'),
    modules = fs.readJsonSync(path.join(__dirname,"modules.json")),
    aws_auth;

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    
    if ((process.env.HOME) && (fs.existsSync(path.join(process.env.HOME,'.aws.json')))){
        aws_auth = grunt.file.readJSON(
                path.join(process.env.HOME,'.aws.json')
        );
    }
    
    grunt.initConfig({
        add :          modules,
        add_remotes :  modules, 
        build :        modules,
        sync :         modules,
        
        submodule_version :      modules,
        
        upload: {
            options: {
                key:    aws_auth.accessKeyId,
                secret: aws_auth.secretAccessKey,
                bucket: 'c6.dev',
                access: 'public-read',
                maxOperations: 4
            },
            test: {
                options: {
                    bucket: 'c6.dev'
                },
                upload: [
                    {
                        src: 'lib/**',
                        dest: 'ext/',
                        rel : 'lib/',
                        headers : { 'cache-control' : 'max-age=31536000' }
                    }
                ]
            }
        },

        clean: {
            lib: path.join(__dirname,'lib')
        },


    });

    grunt.task.renameTask('s3','upload');
    grunt.task.renameTask('submodule_add','add');
    grunt.task.renameTask('submodule_add_remotes','add_remotes');
    grunt.task.renameTask('submodule_build','build');
    grunt.task.renameTask('submodule_sync','sync');
    
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

    grunt.registerTask('default',['build']);


};

