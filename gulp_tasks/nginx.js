var gulp = require("gulp"),
	gutil = require("gulp-util"),
	merge = require("merge-stream");

var baseSrc = "./src/nginx",
	baseOut = "./out/production/nginx/";

if (gutil.env.dev) baseOut = "out/development/nginx/";

gulp.task("nginx", ["public"], function() {
	return build();
});

function build() {
	var webBase = "./out/" + (gutil.env.dev ? "development" : "production") + "/web/"

	const stream = merge();

	stream.add(gulp.src(webBase + "public/**/*")
		.pipe(gulp.dest(baseOut + "src/")));
	stream.add(gulp.src([webBase + "**/*", "!" + webBase + "public/**/*"])
		.pipe(gulp.dest(baseOut + "src/")));
	stream.add(gulp.src("./src/web/html/error/**/*")
		.pipe(gulp.dest(baseOut + "src/error/")));
	stream.add(gulp.src(baseSrc + "/**/*")
		.pipe(gulp.dest(baseOut)));

	return stream;
}

exports.build = build;
