var gulp = require("gulp"),
	concat = require("gulp-concat"),
	uglify = require("gulp-uglify"),
	sass = require("gulp-sass"),
	prefixer = require("gulp-autoprefixer"),
	minify = require("gulp-cssnano"),
	rename = require("gulp-rename"),
	concatCss = require("gulp-concat-css"),
	svg2png = require("gulp-svg2png"),
	imagemin = require("gulp-imagemin"),
	gutil = require("gulp-util");

var baseSrc = "src/web/",
	baseOut = "out/production/web/";

if (gutil.env.dev) baseOut = "out/development/web/";

gulp.task("css", function() {
	var srcPath = baseSrc + "scss/";

	gulp.src([srcPath + "_base.scss", srcPath + "style.scss"])
		.pipe(sass({
			includedPaths: [srcPath],
			indentedSyntax: false,
			errLogToConsole: true
		}))
		.pipe(gutil.env.dev ? gutil.noop() : prefixer("last 2 versions"))
		.pipe(gutil.env.dev ? gutil.noop() : minify())
		.pipe(gulp.dest(baseOut + "css/"));

	return gulp.src([srcPath + "_base.scss", srcPath + "style.scss", srcPath + "index.scss"])
		.pipe(sass({
			includedPaths: [srcPath],
			indentedSyntax: false,
			errLogToConsole: true
		}))
		.pipe(gutil.env.dev ? gutil.noop() : prefixer("last 2 versions"))
		.pipe(concatCss("index.css"))
		.pipe(gutil.env.dev ? gutil.noop() : minify())
		.pipe(gulp.dest(baseOut + "css/"));
});

gulp.task("js", function() {
	var srcPath = baseSrc + "js/";

	gulp.src([srcPath + "cookies.js", srcPath + "logic.js"])
		.pipe(concat("logic.js"))
		.pipe(gutil.env.dev ? gutil.noop() : uglify())
		.pipe(gulp.dest(baseOut + "js/"));
	return gulp.src([srcPath + "cookies.js", srcPath + "index.js", srcPath + "logic.js"])
		.pipe(concat("index.js"))
		.pipe(gutil.env.dev ? gutil.noop() : uglify())
		.pipe(gulp.dest(baseOut + "js/"));
});

function generateFavicon(src, scale, out, name) {
	return gulp.src(src)
		.pipe(gutil.env.dev ? gutil.noop() : imagemin({
			multipass: true
		}))
		.pipe(svg2png(scale))
		.pipe(rename(name ? name : (16 * scale) + ".png"))
		.pipe(gulp.dest(out ? out : baseOut + "images/ui/fav/"));
}

gulp.task("favicon", function() {
	generateFavicon(baseSrc + "svg/favicon.svg", 1, baseOut + "public/", "favicon.png");
	generateFavicon(baseSrc + "svg/favicon.svg", 1);
	return generateFavicon(baseSrc + "svg/favicon.svg", 12);
});

gulp.task("images", function() {
	var srcPath = baseSrc + "images/";

	return gulp.src(srcPath + "**/*")
		.pipe(gutil.env.dev ? gutil.noop() : imagemin())
		.pipe(gulp.dest(baseOut + "images/"));
});

gulp.task("public", ["favicon"], function() {
	return gulp.src(baseSrc + "public/**/*")
		.pipe(gulp.dest(baseOut + "public/"));
});

gulp.task("web", ["favicon", "css", "js", "images", "public"]);
