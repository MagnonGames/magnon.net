# The Magnon Website
This is all the source code that goes into making the Magnon website. It contains not only all the source code for the website itself, but also some of the tools we use to publish it and maintain it.

## Debugging
**Disclaimer**: if you're planning on doing **anything** with the code here, it's **highly recommended** that you read through this **entire** section to actually understand what's going on.

To debug the website, you have to (PR welcome to fix this) be running Linux and have docker, docker-compose and a recent version of node installed. While it would be nice to provide instructions on how to get all the dependencies for every distribution, that would most likely end up being too much for a little readme and therefore, we have decided only to provide full instructions for Ubuntu.

### Getting dependencies
Here's how you would install the docker part:
```
$ wget -qO- https://get.docker.com/ | sh
$ sudo apt-get -y install python-pip
$ sudo pip install docker-compose
```
Since docker provides an easy script to use for installing docker, we use that. Docker-compose is installed through `pip` and therefore we install that before we install docker-compose (skip line 2 if you already have `pip` installed). Why did we use all of these scripts for installing docker and docker-compose when they exist in the main Ubuntu repositories? Simple answer: because the main repository has outdated versions. This is the same for node.

Speaking of node, time to install it! Some good instructions on how to go about that can be found on [this page](https://nodejs.org/en/download/package-manager/) on the nodejs official website. Be sure to pick version 5 since one of our build dependencies [svg2png]() doesn't support version 4 very well.

With that, there are a few things that needs configuring with node. First of all, you need to install all the gulp build dependencies. Before you execute these commands, make sure you're in the root folder of this repository on your computer. (This applies for the rest of the guide unless otherwise stated)
```
$ npm install
```
Simple. Now you should have all the build dependencies locally installed. We still have something to do before we can actually run a proper build though. If we were to run the `gulp` command right now, we would get an error because gulp isn't globally installed. (If you want to learn more about gulp, have a look [here](http://gulpjs.com/)) To fix that, it *should* be as simple as just executing
```
$ npm install -g gulp
```
However, you will most likely run in to an error after running that command. If you did not, be happy and move on. If you did, you could try with just adding `sudo` in front since it is a most likely a permission problem, but that is quite a dirty "solution" and therefore I would instead advise you to have a look [here](https://docs.npmjs.com/getting-started/fixing-npm-permissions) to solve your problem.

When you have all the permissions fixed run the command again and you should hopefully see that it works now.

### Running everything
Now, with all the dependencies installed, let's set up a development build on your own computer. Here's the code you would need to do that:
```
$ gulp --dev
$ sudo docker-compose up
```
After running all of that, you should be able to visit [localhost:8080](http://localhost:8080) and see that you have a working build of the website up and running. There are some problems here still that we need to fix, but let's go over what actually happened for now. First we ran gulp with the `--dev` parameter to run a build of the website without all of the extra optimizations that go in to a production build. Then we set up the website itself with docker-compose since we have everything needed to do that created by gulp.

## License
All code is licensed under the [MIT](http://choosealicense.com/licenses/mit/) license while all content (text, images, etc) is licensed under the [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).
