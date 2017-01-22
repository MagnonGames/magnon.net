const gulp = require("gulp"),
	minifyHtml = require("gulp-htmlmin"),
	gutil = require("gulp-util"),
	imagemin = require("gulp-imagemin"),
	merge = require("merge-stream");

let baseSrc = "src/node/",
	baseOut = "out/production/node/";

if (gutil.env.dev) baseOut = "out/development/node/";

gulp.task("node", ["html"], function() {
	return merge(
		gulp.src([baseSrc + "server.js", baseSrc + "start_node.sh", "package.json"])
			.pipe(gulp.dest(baseOut + "src/")),
		gulp.src(baseSrc + "Dockerfile")
			.pipe(gulp.dest(baseOut))
	);
});

gulp.task("html", function() {
	const stream = merge(
		gulp.src(["./src/web/svg/**/*.svg"], { base: "./src/web/" })
			.pipe(gutil.env.dev ? gutil.noop() : imagemin([
				imagemin.svgo({ plugins: [{ mergePaths: false }] })
			])),
		gulp.src("./src/web/html/**/*")
			.pipe(minifyHtml({
				// This is basically just making sure it isn't trying to
				// minify any nunjucks code since gulp-htmlmin doesn't
				// support doing that.
				ignoreCustomFragments: [(/{%[^%]*?%}(\s)?/g),
				(/{{[^{]*?}}(\s)?/g), (/<%[\s\S]*?%>/), (/<\?[\s\S]*?\?>/)]
			}))
	);
	return stream.pipe(gulp.dest(baseOut + "src/views/"));
});
