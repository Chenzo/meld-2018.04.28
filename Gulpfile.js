

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    pump = require('pump'),
	wait = require('gulp-wait'),
    replace = require('gulp-replace'),
    spritesmith = require('gulp-spritesmith'),
    babel = require('gulp-babel'),
	fs = require('fs'),
    path = require('path'),
    flatmap = require('gulp-flatmap'),
    iconfontCSS = require('gulp-iconfont-CSS'),
    iconfont = require('gulp-iconfont'),
    imagemin= require('gulp-imagemin');

var browserSync = require('browser-sync').create();
var scriptsPath = './src/js/';
var fontName = 'demo-icons';



//Loop through a directory and get the directories within...
function getFolders(dir){
    return fs.readdirSync(dir)
    .filter(function(file){
        return fs.statSync(path.join(dir, file)).isDirectory();
    });
}





//Task - compiles SCSS files into a single compressed CSS file with a sourcemap
gulp.task('styles', function() {
    gulp.src('./src/scss/**/*.scss')
        .pipe(wait(500))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write('/maps'))
        .pipe(gulp.dest('./www/css/'))
        .pipe(browserSync.stream());        
});






//Task - finds and updates chacheBusterNumber PHP variable in global with current time.
gulp.task('updateCacheBuster', function(){
    var timeInMs = Date.now();
    console.log("refreshing cacheBuster with timeStamp: " + timeInMs);
  	gulp.src(['./www/includes/globals.php'])
	    .pipe(replace(/\$cacheBusterNumber="\d+\";/g, '$cacheBusterNumber="' +  timeInMs + '";'))
	    .pipe(gulp.dest('./www/includes/'))
});




/*
* This task takes all files in their individual folders in the /src/js folder
* and merges them into a single minified JS file with the name of the folder
* and creates a source map and places them in /www/js
*/

gulp.task('javascripting', function() {
	var folders = getFolders(scriptsPath);

	folders.map(function(folder) {
		return gulp.src(path.join(scriptsPath, folder, '/*.js'))
        .pipe(sourcemaps.init())
        /* uncomment to use babel
		.pipe(babel({
			presets: ['env', 'react']
        }).on('error', console.error.bind(console)))
        */
		.pipe(concat(folder + '.js'))
		.pipe(gulp.dest('./www/js'))
		.pipe(uglify()).on('error', console.error.bind(console))
		.pipe(rename(folder + '.min.js'))
		.pipe(sourcemaps.write('/maps'))
		.pipe(gulp.dest('./www/js/'));
    });
    
    console.log("js merged and minified");
    browserSync.reload;
});




gulp.task('sprite', function () {
  var spriteData = gulp.src('./src/sprites/sprite_pngs/*.png').pipe(spritesmith({
    retinaSrcFilter: ['./src/sprites/sprite_pngs/*@2x.png'],
    imgName: 'spritesheet.png',
    cssName: '_spritesheet.scss',
    retinaImgName: 'spritesheet@2x.png',
    padding: 4
  }));
  return spriteData.pipe(gulp.dest('./src/sprites/sprite_temp/'));
});


//This moves the spirtes to the /images/ui folder and
//moves the sass to the correct folder and renames the path to the IMAGE
gulp.task('move_sprites', ['sprite'], function() {
    gulp.src('./src/sprites/sprite_temp/*.png')
    .pipe(gulp.dest('./www/images/ui/'));
    gulp.src('./src/sprites/sprite_temp/*.scss')
    .pipe(replace('\'spritesheet', '\'/images/ui/spritesheet'))
    .pipe(gulp.dest('./src/scss/modules/'));
});






gulp.task('update_svg', function() {
    var output = "<?php \n\n";
    return gulp.src('./src/svgs/*.svg')
    .pipe(flatmap(function(stream, file){
        var name = path.basename(file.path, '.svg');
        output += "$svgicon_" + name + "='" + file.contents.toString('utf8') + "'; \n\n";
        fs.writeFile('./www/includes/svgvars.php', output + "?>");
        return gulp.src(output) 
    }))    

});



gulp.task('iconfont', function() {
    //console.log(path.join(__dirname, '/src/scss/'));
    gulp.src(['./src/svgs/*.svg'], {base: './'})
      .pipe(imagemin())
      .pipe(iconfontCSS({
        fontName: fontName,
        targetPath: '../../src/scss/partials/_icons.scss',
        fontPath: '/fonts/'
      }))
      .pipe(iconfont({
        fontName: fontName,
        // Remove woff2 if you get an ext error on compile
        formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
        normalize: true,
        fontHeight: 1001
      }))
      .pipe(gulp.dest('./www/fonts/'))
  });
  


















gulp.task('spritesheet', ['sprite', 'move_sprites'], function() {
    console.log("----------------- > Sprite Sheet Created!");
});


gulp.task('js', ['javascripting'], function() {
    console.log("----------------- > javascripting");
});


gulp.task('updateCB', ['updateCacheBuster'], function() {
    console.log("----------------- > Updated Cache Buster!!");
});




/* 

Default Watch Task
------------------
runs the sass and javascript commands on change in the SRC folder

*/
gulp.task('default', ['styles', 'javascripting'] ,function() {
	browserSync.init({
	    proxy: 'http://localhost:8088'
	});
	gulp.watch('./src/js/**/*.js',['js', 'updateCacheBuster']);
    gulp.watch('./src/scss/**/*.scss',['styles', 'updateCacheBuster']);
    gulp.watch("./www/*.php").on('change', browserSync.reload);
    gulp.watch("./www/*.html").on('change', browserSync.reload);
    gulp.watch("./www/**/*.php").on('change', browserSync.reload);
    gulp.watch("./www/**/*.html").on('change', browserSync.reload);
    gulp.watch("./www/js/**/*.js").on('change', browserSync.reload);
});


