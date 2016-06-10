#Testing with CasperJS and Locust
###### Christopher Olson | Maria Casciani &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; June 10, 2016 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Last Revision: June 10, 2016 13:33
<br/>

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

In order to teach you how to use CasperJS, we will just dive in and take you through an example. But first, it is important to make a distinction between the default casper module and the tester module. We will be using the tester module for testing with Casper, and the commands for running it will be slightly different.

To run a testfile with CasperJS, simply enter the following:

```
casperjs test TEST_FILE_NAME.js --engine=slimerjs
```

This will let CasperJS know that you want to use the test module and SlimerJS as the engine.

To begin any test, we begin with the following command:

```javascript
// casper.test.begin(testTitle, numberOfTests, callback)
casper.test.begin('Testing the Lagunitas Ordering Portal', 32, function(test){
  // It is important that we start at a designated URL and set the size of the screenshots we are going to be taking.
  casper.start('http://192.168.0.236/').viewport(1600,1000);
  // This line allows casper to emulate the browsers below:
  casper.userAgent('Mozilla/5.0 (Windows NT 6.0) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/13.0.782.41 Safari/535.1');

})
```

Before I elaborate, it is essential that you do NOT instantiate any variable as `casper`. CasperJS test module will figure that out for you. We start by declaring that we will begin the testing, and the first parameter `'Testing the Lagunitas Ordering Portal'` is the title of the tests that are going to follow. The next parameter `32`, is a count of how many tests are going to be executed in this suite. The JavaScript function takes a parameter `test` that will be helpful for assertions later.

The first line in any `casper.test.begin` function should be that call to `casper.start`. It gives Casper a URL to start at, and with the `viewport` extension, we can set the size of the screenshots we will be taking.

Our next step is to begin our first test:

```javascript
// casper.test.begin(testTitle, numberOfTests, callback)
casper.test.begin('Testing the Lagunitas Ordering Portal', 32, function(test){
  // It is important that we start at a designated URL and set the size of the screenshots we are going to be taking.
  casper.start('http://192.168.0.236/').viewport(1600,1000);
  // This line allows casper to emulate the browsers below:
  casper.userAgent('Mozilla/5.0 (Windows NT 6.0) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/13.0.782.41 Safari/535.1');
  casper.then(function(){
        /* First, we test some basic functionality, like the webpage's title, and fields.*/
        test.comment('Beginning tests...');
        test.assertTitle('Lagunitas Apps');
        test.assertExists('input[name="username"]', "Find username field.");
        test.assertExists('input#id_password', 'Find password field.');
        test.assertExists('a#login_id', 'Find login button.');
        this.fill('form#form-login', {
            'username': 'cj.olson',
            'password': 'cj.olson123'
        }, true);
        test.comment('Attempting to login...')
    });
})
```

## Locust

### Installing Locust
### Using Locust
