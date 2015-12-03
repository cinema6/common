# Common Libraries

This repositiory is setup to manage common libraries that will be accessed by many Cinema6 web applications.

If you have just cloned this repository, the first thing you will need to do is to load the submodules. You can do this with the following:

> __IMPORTANT__ In order to take full advantage of the features described below you need to have the command line version
of git installed on your machine, and in your PATH environment variable.

## Getting Started

(1) Begin by cloning the common repo, and changing to that directory.

```bash
$  git clone git@github.com:cinema6/common.git
$  cd common
```

(2) Next, run npm install to get all of the dependencies need to run Grunt.

```bash
$  npm install
```

(3) Initialize the project.

```bash
$  grunt init
```
Under the hood, the init task will call
* call
```
git submodules update --init
```
* setup the configured remotes for the submodules
* perform a status check on the current submodule versions

If init runs without errors, the final output of the task should look something like this.

```bash
Running "print-versions" task
-----------------------------
angular.js      :         v1.1.5-0-g9a7035e
c6ui            :      release12-0-g2d6c6d0
GreenSock-JS    :         1.10.3-0-g6c6c647
hammer.js       :       v1.0.5.a-0-g0a2968d
jquery          :          2.0.3-0-gf576d00
ui-router       :          0.2.0-0-g818b0d6
```

##Project structure
The goal for this repository is to help manage the maintenance, versioning, and publishing of third party javascript
libraries.  Tasks have been created to automate much of the git interactions around submodules, and the building of
the dependencies.

When you first clone the project you should see a directory structure like this.

```bash
_ Gruntfile.js
_ README.md
_ modules.json
_ package.json
_ src
  |___ angular  # (submodule)
  |___ c6ui
  |___ gsap
  ...
  |___ modernizr # (static)
       |___ modernizr.custom.<version>.js
       |___ modernizr.custom.<version>.js
  |___ requirejs
       |___ <version>
            |___ r.js
            |___ require.js
            |___ require.min.js
  |___ ui-router
```
The src directory will contain two types of content:
* submodules - Empty directories for the submodules
* static - Directories with sub-versioned folders and files for 3rd party code that we do not fork/build ourselves.

Once you run the ```grunt init``` command, the submodule directories will fill with the actual source.

Pulling specific versions of 3rd party code, building and deploying to our s3 servers can be managed
trough the modules file, and the grunt tasks described below.

##Modules file
The modules.json file is the "database" containing information about the submodules we will support.  It is maintained 
as a spearate file to minimize the necessity for editing the Gruntfile.js.  The module.json file will be imported
into the Gruntfile.js and fed to the various Grunt MultiTasks desribed in the next section.

####Example module record
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

####General record attributes
These attributes are used for multiple tasks.
* __repo__    - The (cinema6 forked) url of the submodule on github (or bitbucket).
* __path__    - The local directory where the submodule will be located.  This should be a path relative to this repo's root.  
* __remotes__ - One or more other repositories with which you might want to sync the repo.  The remotes attribute is required for the add_remotes and sync tasks.

####Build related attributes
These attributes are used by the build task.
* __npm__ - Set to true if the build should run npm for the submodule.
* __grunt__ - Array of arguments to pass to grunt.  Setting this to false will bypass the grunt portion of the task.
* __buildDir__ - The directory within a submodule where the build will occur.
* __target__ - The relative path (from this repo's root) where the build output should be copied.

##Tasks
Most of the tasks in the Grunt file are Multi Tasks, where each record in the modules.json file represents a single
task target.  If a grunt task is run without a target, it will be applied to all __submodules__ listed in modules.json.

```bash
# Example: To build all of the submodule libraries.
$  grunt build

# Example: To build only angular
$  grunt build:angular.js

```

#### The tasks
__add__ - Will add submodule(s) from modules.json to the repository.  Typically you would only call this after adding
a record to the modules.json file.  If a module has already been added, no error's will be raised.

__add_remotes__ - Add the configured remotes to the submodules.  This will be done automatically when you run 
```grunt init```.   After that you should only need to run this when the modules.json file is updated with new remotes.

__build__ - Build the submodule(s).  Output will be copied to a versioned subdirectory of the submodule's target folder.

__build-all__ - Build the submodule(s) and copy the static libraries to the target directory (configured in the Gruntfile.js copy configuration).

__checkout__ - Checkout the desired ref of a submodule.  While this is a multi-task, it should be run with a single target.  The desired ref is
added as a flag to the task target.  The option check.args can be configured to add git checkout command line arguments like -b from the Gruntfile.js

```bash
# Example: Checkout version 2.0.0 of jquery
$ grunt checkout:jquery:2.0.0

# Example: Undo changes made to a submodule's source
$ grunt checkout:hammer.js:.
```

__clean__ - Will remove the build output directory.  This is configured in the Gruntfile.js.

__copy__ - Will copy the static directories to the target directory.  Like clean, this is configured in the Gruntfile.js.

__init__ - Will setup the project.  Intended to be run just after you clone, but safe to call again later.

init will perform the following:

>
> 1. run the git submodule update command
> 2. run the add_remotes task.
> 3. run the status task to display the current state of the submodules.
>

__status__ - Display the current commits/tags of the submodules, viz-a-viz the git describe command.

```bash
$ grunt status
...
Running "print-versions" task
-----------------------------
angular.js      :         v1.1.5-0-g9a7035e
c6ui            :      release12-0-g2d6c6d0
GreenSock-JS    :         1.10.3-0-g6c6c647
hammer.js       :       v1.0.5.a-0-g0a2968d
jquery          :          2.0.3-0-gf576d00
ui-router       :          0.2.0-0-g818b0d6
```

__sync__ - Attempt to synchronize the target modules remote (upstream by default) to the forked repository (origin). 

sync will perform the following:

>  
> 1. Perform a fetch against the remote (upstream)
> 2. Checkout origin/master
> 3. Merge remote/master into origin/master
> 4. Push origin/master back up to origin (with the updates from the remote).
> 5. Checkout the commit that the submodule was on before the sync began.
>

__upload__ - An alias for s3.  Use the appropriate task target to specify the environment to which you are publishing the libs.

```bash
# Upload to the s3 test bucket
$  grunt upload:test
```

##Updating a submodule library version
Efforts should be made to keep our common libraries pointed to the most up-to-date versions our applications can support.
For example, the following procedure illustrates how to update angular from 1.1.5 to 2.0.0.

(1) Synchronize with the upstream.

```bash
$   grunt sync:angular.js
```

(2) Checkout the desired version.

```bash
$  grunt checkout:angular.js:2.0.0
```

(3) Build the new version.

```bash
$  grunt build:angular.js
```

(4) When your build completes, upload to s3.

```bash
$  grunt upload:test
```

At this point, running the ```git status``` command will show you something like this:

```bash

$ git status
# On branch master
# Changes not staged for commit:
#   (use "git add <file>..." to update what will be committed)
#   (use "git checkout -- <file>..." to discard changes in working directory)
#
#	modified:   src/angular (new commits)
#
no changes added to commit (use "git add" and/or "git commit -a")

```

If you want to save 2.0.0 as the new "current" version of the lib, commit the change back to the common repo.

```bash

$  git add src/angular
$  git commit -m "updated angular to 2.0.0"
$  git push origin master

```

Otherwise, revert back to the previous version.

```bash

$  grunt checkout:angular.js:v1.1.5
$  git status
# On branch master
nothing to commit (working directory clean)

```
