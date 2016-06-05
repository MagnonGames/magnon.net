var gulp = require("gulp"),
	gutil = require("gulp-util");

var baseSrc = "./src/nginx",
	baseOut = "./out/production/nginx/";

if (gutil.env.dev) baseOut = "out/development/nginx/";

gulp.task("nginx", ["public"], function() {
	return build();
});

function build() {
	var webBase = "./out/" + (gutil.env.dev ? "development" : "production") + "/web/"

	gulp.src(webBase + "public/**/*")
		.pipe(gulp.dest(baseOut + "src/"));
	gulp.src([webBase + "**/*", "!" + webBase + "public/**/*"])
		.pipe(gulp.dest(baseOut + "src/"));
	gulp.src("./src/web/html/error/**/*")
		.pipe(gulp.dest(baseOut + "src/error/"));

	return gulp.src(baseSrc + "/**/*").pipe(gulp.dest(baseOut));
}

exports.build = build;
