# Coding Standards

## Github

Build off of develop. If you are working on a feature, make the branch name `feature/<feature name>`. If you are working on a bug fix, make the branch name `bugfix/<what you're working on>`.

We use github issues to track tasks, and projects to organize them. If you are working on a new issue that is not being tracked, please create one and file it into the proper project.

## Javascript

We follow ES6, and use jshint to tell us when we're not writing good code. We use async / await, which is not supported by jshint (yet).

## Documentation of API

We use apidoc.js to generate documentation for the API. This documentation is found on our github pages link.

For more info on how to write your own documentation, see their docs: <http://apidocjs.com/>.

To update the docs, run: `npm run generateDoc`. Make sure that the version number for each route is correct!