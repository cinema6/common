var fs   = require('fs-extra'),
    path = require('path'),
    modules = fs.readJsonSync(path.join(__dirname,"modules.json"));

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        
        submodule_add :          modules,

        submodule_add_remotes :  modules, 

        submodule_build :        modules,
        
        submodule_version :      modules,

        build:                   modules

    });

    grunt.task.renameTask('submodule_build','build');

    grunt.registerTask('print-versions',function(){
        var versionData = grunt.config('submodule_versions');
        if (!versionData){
            grunt.log.errorlns('Failed to obtain version data.');
            return false;
        }

        for (var module in versionData){
            grunt.log.writelns(module + ': ' + versionData[module]);
        }
        return true;
    });

    grunt.registerTask('show-versions',['submodule_version','print-versions']);

    grunt.registerTask('printCommit',function(){
        grunt.log.writelns('LastCommit: ' + grunt.config('git_last_commit').commit);
    });

    grunt.registerTask('default',['git_last_commit','printCommit'])

};

