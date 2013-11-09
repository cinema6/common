Common 3rd party dependencies

This repositiory is setup to manage common libraries that will be accessed by many Cinema6 web applications.

If you have just cloned this repository, the first thing you will need to do is to load the submodules. You can do this with the following:

```bash
$  git submodule update --init
```

This will download the source for each repository.

Modules file
The modules.json file is the "database" containing information about the submodules we will support.


Example module record
```json
    "angular.js"    : {
        "buildDir"  : "build",
        "grunt"     : ["package"],
        "npm"       : true,
        "path"      : "src/angular",
        "remotes"   : { "upstream"  : "https://github.com/angular/angular.js.git" }
        "repo"      : "git@github.com:cinema6/angular.js.git",
        "target"    : "lib/angular",
    }
```

General record attributes
repo - Used by submodule_add to locate the submodule on github (or bitbucket).

path - The local directory where the submodule will be located.  This should be a path relative to this repo's root.  

remotes - One or more other repositories with which you might want to sync the repo.  In this example, the remotes contains "upstream", the actual angular repository from which we forked ours.  This be used by the submodule_add_remotes and submodule_sync tasks.

Build related attributes

npm - Set to true if the build should run npm for the submodule.

grunt - Array of arguments to pass to grunt (used for build).  Setting this to false will bypass the grunt portion of the task.


buildDir - The directory within a submodule where the build will occur.

target - The relative path (from this repo's root).


Tasks
With the exception of versions, the following are all multi-tasks.  If you run a task with no parameter, it will be applied to every submodule in the modules.json file.  To run a task for a single mobulde, simply add the module name as the target.

For example:

#build angular
grunt build:angular.js

#build everything
grunt build

add - Will add submodule(s) from modules.json to the repository.  Note: if a module has already been added, no error's will be raised.

add_remotes - Add the target module(s) remotes.

build - Build the target module(s).  Output will be copied to a versioned subdirectory of the module's target folder.

clean - Will remove the latest build if one exists.

status - Display the current commits/tags of the submodules, viz-a-viz the git describe command.  You can run git submodule status for a similar view.

sync - Attempt to synchronize the target modules remote (upstream by default) to the forked repository (origin).  Basically a fetch, merge into the local master, then push up to origin master.  Finally, reset the submodule back to the commit it was at prior to the sync.  Note, depending on the state of the local repo, a sync may fail.

upload - An alias for s3.  Use the appropriate task target to specify the environment to which you are publishing the libs (ex:  grunt publish:test).

Submodule status
Efforts should be made to keep our common libraries pointed to the most up-to-date versions our applications can support.  The general method for doing this is as follows.

1. Synchronize with the upstream.
```bash
$   grunt sync
```
2. From the submodule directory of the library you are looking to update, run a git checkout on the appropriate branch or tag.
```bash
$  cd src/jquery
$  git checkout 2.0.4
$  ../..
```
3. Once you have updated the current commit of your library build it.
```bash
$  grunt build:jquery
```
4. When your build completes, upload to s3.
```bash
$  grunt publish:test
```
5. Finally, be sure to update the common repo with the new HEAD for the lib.
```bash
$  git add src/jquery
$  git commit -m "updated jquery to 2.0.4"
$  git push origin master
```

