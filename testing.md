#Testing with CasperJS and Locust
###### Christopher Olson | Maria Casciani &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; June 10, 2016 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Last Revision: June 10, 2016 13:33

## Table of Contents
* [CasperJS](#casperjs)
  - [Installing Casper](#installing-casper)
  - [Using Casper](#using-casper)
* [Locust](#locust)
  - [Installing Locust](#installing-locust)
  - [Using Locust](#using-locust)


## CasperJS
CasperJS is a scraping and testing framework for the front-end of any web application. It is simple and lightweight, and uses a headless browser to navigate quickly. It comes budled with very useful APIs that allow the user to take screenshots, assert conditions about almost anything, and mimic user behavior. In this document we will take you throught writing a CasperJS test suite for the Lagunitas Ordering Portal.

The documentation for Casper is extensive and can be found <a href="http://docs.casperjs.org/en/latest/modules/">here</a>. It runs by default on the PhantomJS engine, but we will be using SlimerJS to execute our tests because it is less buggy in my experience.

### Installing Casper

To install CasperJS, one must first install <a href="http://phantomjs.org/">PhantomJS</a> and <a href="https://slimerjs.org/">SlimerJS</a>.

To get SlimerJS, simply use <a href="https://www.npmjs.com/">npm</a>:

```
npm install slimerjs
```

Likewise with PhantomJS:

```
npm install phantomjs
```

And with CasperJS:

```
npm install -g casperjs
```

With that, you should be ready to go!


### Using Casper


## Locust

### Installing Locust
### Using Locust
