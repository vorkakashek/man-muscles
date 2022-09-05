'use strict';
const {
	series,
	parallel,
	src,
	dest,
	watch
} = require('gulp');

var scss = require('gulp-sass')(require('sass'));
var browserSync = require('browser-sync').create();

const minify = require('gulp-minify');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const pug = require('gulp-pug');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');

// functions

function buildPug() {
	return src('./app/pug/*.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(dest('build/'));
};

function htmlTransfer() {
	return src('./app/pug/**/*.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(dest('build/assets/html/'));
};

function libs() {
	return src('./app/static/js/libs/**/*')
		.pipe(dest('build/js/libs/'));
};

// function JSlibs() {

// }

function buildStyles() {
	return src('app/static/scss/**/main.scss')
		.pipe(scss.sync({
			outputStyle: 'expanded'
		}).on('error', scss.logError))
		.pipe(autoprefixer({
			cascade: true,
			overrideBrowserlist: ['last 10 version']
		}))
		.pipe(dest('build/css/'))
		.pipe(browserSync.stream())
};

function buildJs() {
	return src(['app/static/js/libs/**/*.js', 'app/static/js/*.js'])
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(concat('app.js'))
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write('.'))
		.pipe(minify())
		.pipe(dest('build/js/'))
		.pipe(browserSync.stream())
}

function watching() {
	watch('app/static/scss/**/*.scss', buildStyles);
	watch('app/static/js/**/*.js', buildJs);
	watch('app/pug/**/*.pug', buildPug);
	watch('build/*.html').on('change', browserSync.reload);
	watch('app/assets/**/*', imageTransfer).on('change', browserSync.reload);
	watch('app/static/php/**/*.php', phpTransfer).on('change', browserSync.reload);
	watch('app/static/libs/**/*', libs).on('change', browserSync.reload);
}


function serve() {
	browserSync.init({
		server: {
			baseDir: "build/"
		}
	});
};

function clean() {
	return del(['build/**/*'])
}

function transferFavicon() {
	return src([
			// 'app/static/fonts/**/*',
			// 'app/static/*.ico', 
			'app/static/favicon/**/*',
		])
		.pipe(dest('build/'));
}

function transferFonts() {
	return src([
			'app/static/fonts/**/*',
		])
		.pipe(dest('build/fonts/'));
}

// function imageCompress() {
// 	return src('app/assets/**/*')
// 		.pipe(image({
// 			pngquant: true,
// 			optipng: false,
// 			zopflipng: true,
// 			jpegRecompress: false,
// 			mozjpeg: true,
// 			gifsicle: true,
// 			svgo: true,
// 			concurrent: 10,
// 			quiet: true // defaults to false
// 			// optipng: ['-i 1', '-strip all', '-fix', '-o2', '-force'],
// 			// optipng: ['-strip all', '-fix', '-o7', '-force'],
// 			// pngquant: ['--speed=1', '--force', 256],
// 			// zopflipng: ['-y', '--lossy_8bit', '--lossy_transparent'],
// 			// jpegRecompress: ['--strip', '--quality', 'medium', '--min', 20, '--max', 60],
// 			// mozjpeg: ['-optimize', '-progressive'],
// 			// gifsicle: ['--optimize'],
// 			// svgo: ['--enable', 'cleanupIDs', '--disable', 'convertColors', '--enable', 'removeUselessStrokeAndFill']
// 		}))
// 		.pipe(dest('build/assets/'))
// }

function imageTransfer() {
	return src('app/assets/**/*')
		.pipe(dest('build/assets/'))
}

function phpTransfer() {
	return src('app/static/*.php')
		.pipe(dest('build/'))
}




// exports

exports.build = series(
	clean,
	parallel(
		buildPug, buildStyles, buildJs, libs
	),
	// parallel(htmlTransfer, imageCompress, transfer, transferFonts),
	parallel(htmlTransfer, imageTransfer, phpTransfer, transferFavicon, transferFonts),
);

exports.default = series(
	parallel(
		buildPug, buildStyles, buildJs, libs, imageTransfer, transferFavicon, transferFonts
	),
	parallel(serve, watching),
);


exports.buildStyles = buildStyles;
exports.buildPug = buildPug;
exports.htmlTransfer = htmlTransfer;
exports.clean = clean;
// exports.imageCompress = imageCompress;
exports.imageTransfer = imageTransfer;
exports.phpTransfer = phpTransfer;
exports.transferFavicon = transferFavicon;
exports.transferFonts = transferFonts;