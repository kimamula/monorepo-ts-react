var gulp = require('gulp');
var browserify = require('browserify');
var tsify = require('tsify');
var ts = require('gulp-typescript');
var source = require('vinyl-source-stream');
var util = require('gulp-util');
var argv = require('yargs').argv;
var fs = require('fs');
var path = require('path');
var merge = require('merge2');
var del = require('del');
var child = require("child_process");
var async = require("async");

var packagesLoc = './packages';
var currentVersion = fs.readFileSync('./VERSION', 'utf8').trim();

gulp.task('build-app', function() {
  return browserify({entries: ['./index.tsx', './typings/bundle.d.ts']})
    .plugin(tsify)
    .bundle()
    .pipe(source('index.js'))
    .on('error', util.log)
    .pipe(gulp.dest('.'));
});

gulp.task('build', function(cb) {
  var allPackageDirNames = getAllPackageDirNames(), packageDirNames;
  if (argv.package) {
    if (allPackageDirNames.indexOf(argv.package) < 0) {
      throw new Error('No such package dir: ' + argv.package);
    }
    packageDirNames = [argv.package];
  } else {
    packageDirNames = getPackagesSortedByDependency(allPackageDirNames)
      .map(function(package) {
        return package.dir;
      });
  }
  return tsc(0);

  function tsc(index) {
    var packageDirName = packageDirNames[index];
    if (!packageDirName) {
      return cb();
    }
    var packageDir = [packagesLoc, packageDirName].join('/'),
      tsStream = gulp.src([packageDir + '/**/*.ts?(x)', './typings/bundle.d.ts'])
        .pipe(ts(ts.createProject('./tsconfig.json'))),
      hasErrors = false;
    del([
      packageDir + '/**/*.js',
      packageDir + '/**/*.d.ts',
      '!' + packageDir + '/node_modules/**/*.js',
      '!' + packageDir + '/node_modules/**/*.d.ts'
    ]);
    merge(
      tsStream.js
        .on('error', function() {
          hasErrors = true;
        })
        .on('end', function() {
          if (hasErrors) {
            console.log(packageDirName + ': build failed');
            return process.exit(1);
          }
        }),
      tsStream.dts
    )
      .pipe(gulp.dest(packageDir))
      .on('end', function() {
        console.log(packageDirName + ': build succeeded');
        tsc(index + 1);
      });
  }
});

gulp.task('bootstrap', function(cb) {
  var packages = getPackagesSortedByDependency(getAllPackageDirNames());
  installDependencies(0);

  function installDependencies(index) {
    var package = packages[index];
    if (!package) {
      return cb();
    }
    async.each(Object.keys(package.dependencies), function(dependency, done) {
      // npm link packages in this repository
      var dependencyPackage = packages.find(function(package) {
        return package.name === dependency;
      });
      if (!dependencyPackage) {
        return done();
      }
      var ver = package.dependencies[dependency];
      if (ver[0] !== '^' || ver[1] !== currentVersion[0]) {
        return done();
      }
      child.exec('npm link ' + dependencyPackage.name, {
        cwd: path.join(packagesLoc, package.dir)
      }, function (err, stdout, stderr) {
        if (err) {
          done(stderr);
        } else {
          done();
        }
      });
    }, function(err) {
      if (err) {
        cb(err);
      } else {
        child.exec('npm install && npm link', {
          cwd: path.join(packagesLoc, package.dir)
        }, function (err, stdout, stderr) {
          if (err) {
            cb(stderr);
          } else {
            console.log(package.name + ' got ready');
            installDependencies(index + 1);
          }
        });
      }
    });
  }
});

function getAllPackageDirNames() {
  return fs.readdirSync(packagesLoc)
    .filter(function(dir) {
      return fs.existsSync(path.join(packagesLoc, path.basename(dir), 'package.json'));
    })
    .map(function(dir) {
      return path.basename(dir);
    });
}

function getPackagesSortedByDependency(packageDirNames) {
  // get packages
  var packages = packageDirNames.map(function (package) {
    var pkg = require([packagesLoc, package, 'package.json'].join('/'));
    return {
      dir: package,
      dependencies: Object.assign({}, pkg.dependencies, pkg.devDependencies),
      name: pkg.name
    };
  });

  // sort packages according to dependencies
  function compare(a, b) {
    return depends(a, b) ? 1 : (depends(b, a) ? -1 : 0);
  }
  function depends(depender, dependee) {
    return Object.keys(depender.dependencies)
      .some(function(dependency) {
        if (dependency === dependee.name) {
          return true;
        }
        var dependencyPackage = packages.find(function(package) {
          return package.name === dependency;
        });
        if (!dependencyPackage) {
          return false;
        }
        return depends(dependencyPackage, dependee);
      });
  }

  return packages.sort(compare);
}
