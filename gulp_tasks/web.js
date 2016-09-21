var gulp = require("gulp"),
	concat = require("gulp-concat"),
	uglify = require("gulp-uglify"),
	sass = require("gulp-sass"),
	prefixer = require("gulp-autoprefixer"),
	minify = require("gulp-cssnano"),
	rename = require("gulp-rename"),
	svg2png = require("gulp-svg2png"),
	imagemin = require("gulp-imagemin"),
	gutil = require("gulp-util"),
	rev = require("gulp-rev"),
	revReplace = require("gulp-rev-replace"),
	merge = require("merge-stream"),

	browserify = require("browserify"),
	watchify = require("watchify"),
	babelify = require("babelify"),
	source = require("vinyl-source-stream"),
	buffer = require("vinyl-buffer"),
	sourcemaps = require("gulp-sourcemaps"),

	nginx = require("./nginx.js");

var baseSrc = "src/web/",
	baseOut = "out/production/web/";

if (gutil.env.dev) baseOut = "out/development/web/";

const manifestConf = {
	merge: true
};

gulp.task("css", function() {
	var srcPath = baseSrc + "scss/",
		browsers = [
			"> 1%",
			"Opera > 35"
		];

	return gulp.src(srcPath + "**/*.scss")
		.pipe(sass({
			includedPaths: [srcPath],
			indentedSyntax: false,
			errLogToConsole: true
		}))
		.pipe(prefixer({ browsers: browsers }))
		.pipe(gutil.env.dev ? gutil.noop() : minify())
		.pipe(gutil.env.dev ? gutil.noop() : rev())
		.pipe(gulp.dest(baseOut + "css/"))
		.pipe(rev.manifest(manifestConf))
		.pipe(gulp.dest(baseOut));
});

gulp.task("js", function() {
	return buildJS(false);
});

function buildJS(watch) {
	var srcPath = baseSrc + "js/";

	return merge(
		createBundle(
			[srcPath + "main.js"],
			"logic.js", watch
		),
		createBundle(
			[srcPath + "main.js", srcPath + "index.js"],
			"index.js", watch
		)
	);
}

exports.buildJS = buildJS;

function createBundle(entries, bundleName, watch) {
	var browserifyInstance = browserify({
			entries: entries,
			debug: gutil.env.dev,
			cache: {},
		    packageCache: {},
		    fullPaths: watch
		}).transform("babelify", {
			presets: ["es2015"]
		});

	var b = watch ? watchify(browserifyInstance) : browserifyInstance;

 	var build = function() {
		return b.bundle()
			.pipe(source(bundleName))
			.pipe(buffer())
			.pipe(gutil.env.dev ? sourcemaps.init({ loadMaps: true }) : gutil.noop())
			.pipe(gutil.env.dev ? sourcemaps.write(".") : gutil.noop())
			.pipe(gutil.env.dev ? gutil.noop() : uglify())
			.pipe(gutil.env.dev ? gutil.noop() : rev())
			.pipe(gulp.dest(baseOut + "js/"))
			.pipe(rev.manifest(manifestConf))
			.pipe(gulp.dest(baseOut));
	}

	if (watch) {
		b.on("update", function() {
			gutil.log("Rebundling...");
			build();
		});
		b.on("log", function(e) {
			gutil.log("Bundling Successful: " + gutil.colors.gray(e));
			nginx.build();
		});
	}

	return build();
}

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
	const stream = merge();
	stream.add(generateFavicon(baseSrc + "svg/favicon.svg", 1, baseOut + "public/", "favicon.png"));
	stream.add(generateFavicon(baseSrc + "svg/favicon.svg", 1));
	stream.add(generateFavicon(baseSrc + "svg/favicon.svg", 12));
	return stream;
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

gulp.task("web", ["favicon", "css", "js", "images", "public"], () => {
	return gulp.src(["out/production/**/*.html"])
		.pipe(revReplace({ manifest: gulp.src(baseOut + "rev-manifest.json") }))
		.pipe(gulp.dest("out/production/"));
});
