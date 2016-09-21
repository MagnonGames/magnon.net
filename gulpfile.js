const gulp = require("gulp"),
	requireDir = require("require-dir"),
	eslint = require("gulp-eslint");

const tasks = requireDir("./gulp_tasks", { recurse: true });

gulp.task("watch", ["default"], function() {
	tasks.web.buildJS(true);
	gulp.watch("src/web/scss/*.scss", ["css", "nginx"]);
	gulp.watch(["src/web/svg/**/*.svg", "src/web/html/**/*"], ["html", "node"]);
	gulp.watch("src/web/images/**/*", ["images", "nginx"]);
	gulp.watch("src/web/public/**/*", ["public", "nginx"]);
	gulp.watch("src/nginx/**/*", ["nginx"]);
	gulp.watch("src/node/**/*", ["node"]);
});

gulp.task("lint", () => {
	return gulp.src(["**/*.js", "!node_modules/**", "!out/**"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task("default", ["web", "node", "nginx"]);
