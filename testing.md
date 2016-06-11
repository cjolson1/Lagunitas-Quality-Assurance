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
CasperJS is a scraping and testing framework for the front-end of any web application. It is simple and lightweight, and uses a headless browser to navigate quickly. It comes budled with very useful APIs that allow the user to take screenshots, assert conditions about almost anything, and mimic user behavior. In this document we will take you throught writing a CasperJS test suite for the Lagunitas Ordering Portal. The one downside to the Casper module is that if one test fails, the entire test suite aborts.

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

In this example, we will login to the Ordering Portal as an admin, navigate to the admin page to login as a user managed by the admin, perform a variety of tasks as that user, and logout. Throughout this proceess we will be testing if we can navigate away from these pages to see orders and forecasts that are not associated with our user and consequently cannot see.

To begin any test, we begin with the following command:

```javascript
// casper.test.begin(testTitle, numberOfTests, callback)
casper.test.begin('Testing the Lagunitas Ordering Portal', 32, function(test){
  // It is important that we start at a designated URL and set the size of the screenshots we are going to be taking.
  casper.start('http://192.168.0.236/').viewport(1600,1000);
  // This line allows casper to emulate the browsers below:
  casper.userAgent('Mozilla/5.0 (Windows NT 6.0) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/13.0.782.41 Safari/535.1');
});
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
});
```

This test is beginning by viewing this page:

<p align="center">
  <img src="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/Screen%20Shot%202016-06-10%20at%203.09.25%20PM.png">
</p>

We encapsulate our tests with `casper.then` as a CasperJS convention. The first line with `test.comment` allows you to annotate the output of your testcases. The next series of lines utilize several CasperJS APIs to determine the existence of several HTML elements, like the username field, password field, and submit button. We also check that the webpage title matches what we expect it to be. The design of your `test.assert[whatever]` commands should be around the expected behavior of your website. There is a optional parameter to customize the title of a specific test by passing in a string, which can be used to clarify the intent of a test. Inherent to the behavior of Casper with `test.assert[whatever]` is that it will select only the first instance that it finds of what is specified, provided that there are multiple instances of what's being searched for.

The next command `this.fill` really demonstrates the power of Casper. The first parameter is the form that we want to fill, which we can select how we would with CSS. The next parameter is a dictionary with the name of input tags that are going to be filled with their corresponding values. The `true` at the end tells Casper that we want to submit this form. We then comment that we are attempting to login. We use `this` instead of `test` because the casper test module is `this` in this case, which we want to utilize to navigate through the webapp.

The output from running this code would look something like the following:

```
Test file: test.js                                                              
# Testing Lagunitas Ordering Portal
PASS Testing Lagunitas Ordering Portal (32 tests)
# Beginning tests...
PASS Page title is: "Lagunitas Apps"
PASS Find username field.
PASS Find password field.
PASS Find login button.
# Attempting to login...
```

The majority of this tutorial will follow the same structure as this, so I will continue to elaborate on what the code is doing, but not focus so much on the APIs and methods, unless they are new. The following tests will be of the same structure as the first tests we wrote, wrapped in the `casper.test.begin` function.

After submitting this login request, we need to check if we logged in successfully. 

<p align="center">
<b>We need to consider the speed of CasperJS, and write code that pauses accordingly.</b>
</p>

We can accomplish this by telling casper to wait with the `casper.wait` commands. There are a variety of wait-specific commands like `casper.waitForPopup`, `casper.waitForAlert`, etc. but they timeout by default at 5000 ms so we can make due with a simple `casper.wait(5000, function(){})`. We need to give the browser some time to render the account page, so we do:

```javascript
casper.wait(2000, function(){
    // We determine if we navigated to the expected page.
    test.assertUrlMatch('http://192.168.0.236/orderportal/dashboard', 'Logging in.');
    test.comment('Taking photo of account dashboard...');
    // casper.capture takes a photo of what the browser is looking at.
    casper.capture('test_img/login.png');
    // We determine if we can go to the admin portal and do it if we can.
    test.assertExists('a[href="/orderportal/admin"]', 'Find Admin Portal button.');
    this.click('a[href="/orderportal/admin"]');
});
```

We wait 2000 milliseconds before executing the next round of tests to let the page load and begin by asserting that the URL has changed with `test.assertUrlMatch`. We eventually call the first of many `casper.capture` calls. This method allows us to take a screenshot of what the browser is seeing and save it to any filepath we desire. In this case I created a directory called `test_img` for these screenshots to reside.

Here is that image:

<p align="center">
<img src="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/login.png">
</p>

We then search for the Admin anchor and click on it.

As you can see, the CasperJS language is very simple, yet powerful. This will only become more apparent as we continue.

```javascript
casper.wait(2000, function(){
    //Again, we check if we navigated to the right page.
    test.assertUrlMatch('http://192.168.0.236/orderportal/admin', 'Admin page navigation.');
    test.comment('Taking photo of admin dashboard...');
    casper.capture('test_img/admin-dash.png');
    //clickLabel clicks on the given HTML element with innerHTML of the first parameter
    //We click on a label to get to more information.
    var match = this.clickLabel(" Customers (Distributors)", "a");
    //If the element is click, it will be truthy.
    test.assertTruthy(match, 'Customers (Distributors) button clicked.');
});
```

We wait again for the Admin Dashboard to load and check if indeed we are at the right URL path. We take a photo of the page, click on a button on the page, and check that we indeed clicked that button with `test.assertTruthy`. `this.clickLabel` allows us to search for an HTML element, in this case `a`, with the innerHTML of `" Customers (Distributors)"`. This is a very useful instruction when HTML elements and their properties are indistinguishable.

At this point in the process we have navigated here:

<p align="center">
<img src="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/customer_interface.png">
</p>

We then continue to try to login as a user by clicking the gear next to `LOVELAND`:

```javascript
casper.wait(2000, function(){
    casper.capture('test_img/customer_interface.png');
    test.comment('Taking photo of Customers (Distributors) interface...');
    //We find and click on the edit user button so we can log in as them.
    test.assertExists('a.editCustomers span.glyphicon.glyphicon-cog', 'Find Edit User Button.');
    this.click('a.editCustomers span.glyphicon.glyphicon-cog')
});
```

We first test that the gear exists as a complicated expression of a span within an anchor element which CasperJS can understand. 
<p align="center">
<b>In writing this test, I found that PhantomJS could not execute this command, but SlimerJS could, leading to my intuition that SlimerJS is more reliable.</b>
</p>

We then click on it, yielding the following screenshot:

<p align="center">
<img src="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/editing_user.png">
</p>

We now need to click the Login As User Button which can be accomplished by the following:

```javascript
casper.wait(2000, function(){
    test.comment('Taking photo of Editing User HTML...');
    casper.capture('test_img/editing_user.png');
    test.assertExists('div.login-as-user.pull-right.btn.btn-link', 'Find Login As User Button.');
    //We progress with logging in as someone.
    this.click('div.login-as-user.pull-right.btn.btn-link');
});
```

We simply declare that this button must exist and click on it, yielding:

<p align="center">
<img src="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/login_as_user.png">
</p>

All we need to do is click the button called Login as LOVELAND and we are set!

```javascript
casper.wait(2000, function(){
    test.comment('Taking photo of Login As User prompt...');
    casper.capture('test_img/login_as_user.png');
    //We login as someone
    test.assertExists('button.confirm', "Find Login as XXXXX Button.");
    this.click('button.confirm');
});
```

And just like that, we are logged in:

<p align="center">
<img src="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/new_acc.png">
</p>

As you can see the number of lines of code are minimal. A well-practiced test-writer will spend most of their time writing `casper.wait` or `casper.then` than the actual tests with how easy CasperJS's interface is.

Now that we are logged in as another user, we can begin testing permissions and the forecasts and orders of that user, in this case LOVELAND.

As I mentioned before, we are going to repeatedly test the ability of a user to access unauthorized forecasts and orders that are not associated with LOVELAND. In order to promote reusability of code, we can write one function to accomplish this:

```javascript
//This function will be called throughout; it will test the ability to see orders/forecasts that are not allowed.
function test_nav() {
    test.comment('Testing unauthorized navigation.');
    casper.thenOpen('http://192.168.0.236/orderportal/order/42', function(response){
        //Tests the server response to a POST request to the page.
        test.assertEqual(response.status, 403, "Cannot view Order not associated with user.");
        casper.capture('test_img/403.png')
    });
    casper.wait(1200, function(){
        //Allows us to go back a page in history.
        casper.back();
    });
    casper.thenOpen('http://192.168.0.236/orderportal/forecast/42', function(response){
        test.assertEqual(response.status, 403, "Cannot view Forecast not associated with user.")
    });
    casper.wait(1200, function(){
        casper.back();
        test.comment('Navigating back to page of origin.')
    });
}
```

This function redirects us to another url, particulary that of a forecast and order id we don't have access to, and asserts that we must get a 403 - Forbidden error. It then goes back in our browser's history and allows us to continue what we were doing. As we progress in this tutorial, a call to `test_nav()` will result in the displaying of a 403 error like so:

<p align="center">
<img src="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/403.png">
</p>

It will eventually return us to whatever page we are on. 

Anyway, continuing from the LOVELAND dashboard we accessed, we are going to access the associated forecasts (in this case the first one that says 'View Details').

```javascript
casper.wait(2000, function(){
    // We now are going to interact with forecasts. We view details on one of them.
    test.assertExists('a[class="btn btn-primary btn-xs btn-view-forecast"]', 'Find View Details for Forecast Button.');
    this.click('a[class="btn btn-primary btn-xs btn-view-forecast"]');
    });
```

This brings us to a page like this:

<p align="center">
<img src="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/forecast.png">
</p>

We will then access the comment prompt and add a comment to this forecast with the following JavaScript:

```javascript
casper.wait(2000, function(){
    // We take a photo of the forecast and test if we can access unauthorized orders and forecasts.
    test.comment('Taking photo of Forecast...');
    casper.capture('test_img/forecast.png');
    test_nav();
});
    
casper.wait(2000, function(){
    // We begin adding a comment to the forecast.
    test.comment('Clicking Forecast Comments Button...');
    this.click('a[id="btn-comments"]');
});
casper.wait(2000, function(){
    test.comment('Entering Comment...');
    // We enter the comment and confirm it.
    // When a form isn't present, you can fill input values with sendKeys. the reset param first empties the element.
    this.sendKeys('input[type="text"]', 'testing', {reset: true});
    casper.capture('test_img/enter_comment.png');
    this.click('button.confirm');
    test_nav();
});
```

Notice that we call `test_nav()` multiple times, even from the comment prompt page, just to check for any unexpected vulnerabilities. The third parameter of the `this.sendKeys` command tells the input field to be emptied before inputting the text `'testing'`.

At the time of `casper.capture('test_img/enter_comment.png')`, Casper is seeing:

<p align="center">
<img src="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/enter_comment.png">
</p>

After confirming this comment we navigate back to the dashboard to check that this comment is displayed, and then navigate back to the forecast page to input another comment:

```javascript
casper.wait(2000, function(){
    // We go back to the dashboard and look if the comment we just made shows up.
    this.click('a[href="/orderportal/dashboard"]');
    test.comment('Navigating back to Dashboard...')
});
casper.wait(2000, function(){
    test.comment('Taking photo of Dashboard after commenting on forecast...');
    casper.capture('test_img/dash_after_comment.png');
    test.assertUrlMatch("http://192.168.0.236/orderportal/dashboard", 'Confirm Navigation from Forecast to Dashboard');
    test.assertExists('table#tbl-recent-forecasts', 'Find Table with Forecast data.');
    // We evaluate if we have indeed put the comment on the forecast.
    var comment = this.evaluate(function(){
        return $("table#tbl-recent-forecasts td:contains('testing')").size() === 1
    });
    test.assertTruthy(comment, "Comment displayed on Dashboard");
    // We go back to the forecast page to comment some more.
    test.assertExists('a[class="btn btn-primary btn-xs btn-view-forecast"]', "Find View Details for Forecast Button.");
    this.click('a[class="btn btn-primary btn-xs btn-view-forecast"]');
    test.comment('Navigating to Forecast Page.')
});
```

Apart from the same old CasperJS commands to navigate through the webapp, we can see that there is a call to `this.evaluate`. In a nutshell it evaluates an expression in the current page DOM context. This function is the most powerful thing CasperJS has to offer. To not miscontrue its meaning, I will quote the documentation: "The concept behind this method is probably the most difficult to understand when discovering CasperJS. As a reminder, think of the evaluate() method as a gate between the CasperJS environment and the one of the page you have opened; everytime you pass a closure to evaluate(), you’re entering the page and execute code as if you were using the browser console." It's pretty cool. That's what's behind letting us use the jQuery instruction, which is an even easier way to scan through HTML elements.

Now we go back to the forecast page, try to enter an empty comment, and go back to the dashboard to see if the forecast comment is now empty:

```javascript
casper.wait(2000, function(){
    //On that same forecast, we try to erase the comment but submitting a blank field.
    this.click('a[id="btn-comments"]');
    this.fillSelectors('fieldset', {
        'input[type="text"]': ''
    }, true);
    test.comment('Re-entering comment to be blank.');
    //We navigate back to the dashboard to see if we can see the comment.
    this.click('button.confirm');
    this.click('a[href="/orderportal/dashboard"]');
    test.comment('Navigating back to dashboard.')
});
casper.wait(2000, function(){
    test.assertUrlMatch("http://192.168.0.236/orderportal/dashboard", "Confirm Navigation from Forecast to Dashboard.");
    test.assertExists('table#tbl-recent-forecasts', "Find Table with Forecast data.");
    //We determine if the testing comment can be found.
    var commentt = this.evaluate(function(){
        return $("table#tbl-recent-forecasts td:contains('testing')").size() === 0;
    });
    test.comment('Taking photo of second comment input...');
    casper.capture('test_img/empty_comment_forecast.png');
    test.assertTruthy(commentt, "New empty comment is reflected in table.");
    //We now progress to orders and begin messing with those.
    test.assertExists('a[class="btn btn-primary btn-xs btn-view-order"]', "Find View Details Button for Orders.");
    this.click('a[class="btn btn-primary btn-xs btn-view-order"]');
    test.comment('Navigating to Order page.')
});
```

This follows similar logic from initially entering the comment above. In fact, at the time of writing this, it was not possible to write empty comments! This means the the instruction `test.assertTruthy(commentt, "New empty comment is reflected in table.")` will fail. Finding bugs like this is easy with Casper, heck, this is the first testcase I've written with it.

Next, we need to play with the order forms. We are already at the oder page with to code above, and to give you a sense of where we are at, here's a photo:

<p align="center">
<img src="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/order_data.png">
</p>

We will interact with it in the follwoing way:

```javascript
casper.wait(5000, function(){
    //Of particular interest are the specialty beers because they are limited by allocation. We enter the max value 
    //allowed into their fields and save it.
    test.comment('Entering Limit for Units Ordered...');
    this.sendKeys('input[data-key-name="B1-EQUINOX-12/22"]', '9999', {reset: true});
    this.sendKeys('input[data-key-name="B2-LUCKY13-4/6/12"]', '9999', {reset: true});
    this.sendKeys('input[data-key-name="B3-LUCKY-155"]', '9999', {reset: true});
    this.sendKeys('input[data-key-name="B3-SUMPIN-155"]', '9999', {reset: true});
    test.comment('Taking photo of inputted data...');
    casper.capture('test_img/order_data.png');
    test.assertExists('a#btn-save-order', "Find Save Button");
    this.click('a#btn-save-order');
});
casper.wait(2000, function(){
    test.assertExists('button.confirm', "Find Adjustment Prompt OK Button.");
    casper.capture('test_img/adj_prompt.png');
    this.click('button.confirm');
    test.comment('Make sure all adjustments are consistent with 9999 limit implemented.');
    //We then test to see that these values are still under the threshold after the modifications by the system.
    var correct = this.evaluate(function(){
        var ret = true;
        $('table#tbl-order-data-ss td div.input-group input.form-control').each( function(index, element){
            if ($(this).val() > 9999){
                ret = false;
            }
        });
        return ret;
    });
    test.assertTruthy(correct, "All fields are less than limit.");
    // We test the system for unauthorized navigation.
    test_nav();
});
```

We first fill the seasonal beers inputs with the max possible value, and save the order to see how the values are changed. We then check that these orders' values do not go over the specified limit, which they do. Another bug! This means that `test.assertTruthy(correct, "All fields are less than limit.")` will fail.

This is what I mean by how the orders' values are changed:

<p align="center">
<img src="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/adj_prompt.png">
</p>

Note that when these tests fail, the entire test suite stops. In order to continue on with tests, I just commented out those lines.

Now we are done with this user account, and we want to test authentication from an external party, one that is not logged in. We can accomplish all of that with this code:

```javascript
casper.then(function(){
    //Then, we logout.
    test.assertExists('a[href="/logout"]', "Find logout button.");
    casper.capture('test_img/logout.png');
    this.click('a[href="/logout"]');
    test.comment('Testing unauthorized navigation.');
    //Afterward, we try to access orders and forecasts that are unauthorized. We also try to go to the dashboard.
    //We verify the correct response is taken by checking URL.
    casper.thenOpen('http://192.168.0.236/orderportal/order/42', function(response){
        test.assertUrlMatch('http://192.168.0.236/accounts/login/?next=/orderportal/order/42', "Cannot view Order not associated with user.");
    });
    casper.wait(1200, function(){
        casper.back();
    });
    casper.thenOpen('http://192.168.0.236/orderportal/forecast/42', function(response){
        test.assertUrlMatch('http://192.168.0.236/accounts/login/?next=/orderportal/forecast/42', "Cannot view Forecast not associated with user.")
    });
    casper.wait(1200, function(){
        casper.back();
        test.comment('Navigating back to page of origin.')
    });
});
```

Instead of a `assertEquals` with status codes, we simply did a `assertUrlMatch`. This demonstrates how we can accomplish the same thing multiple ways with CasperJS. We were able to logout with a simple `.click` command and execute the rest of our testing.

After writing all your tests, it is vital that you inclue these lines at the end:

```javascript
//This last function is critical. Without it, the tests won't run.
    casper.run(function(){
        //This line is just for aesthetics.
        this.echo('\n');
        //End testing.
        test.done();
    })
```

This allows the tests to complete. Now that we have walked through an entire test suite, I will give you the code in its entirety <a href="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/test.js">here</a>.

After being run with `casperjs test test.js --engine=slimerjs`, we get the following output:

```
Test file: test.js                                                              
# Testing Lagunitas Ordering Portal
PASS Testing Lagunitas Ordering Portal (32 tests)
PASS Page title is: "Lagunitas Apps"
PASS Find username field.
PASS Find password field.
PASS Find login button.
# Attempting to login...
PASS Logging in.
# Taking photo of account dashboard...
PASS Find Admin Portal button.
PASS Admin page navigation.
# Taking photo of admin dashboard...
PASS Customers (Distributors) button clicked.
# Taking photo of Customers (Distributors) interface...
PASS Find Edit User Button.
# Taking photo of Editing User HTML...
PASS Find Login As User Button.
# Taking photo of Login As User prompt...
PASS Find Login as XXXXX Button.
# Taking photo of new account...
# Testing unauthorized navigation.
PASS Cannot view Order not associated with user.
PASS Cannot view Forecast not associated with user.
# Navigating back to page of origin.
PASS Find View Details for Forecast Button.
# Taking photo of Forecast...
# Testing unauthorized navigation.
PASS Cannot view Order not associated with user.
PASS Cannot view Forecast not associated with user.
# Navigating back to page of origin.
# Clicking Forecast Comments Button...
# Entering Comment...
# Testing unauthorized navigation.
PASS Cannot view Order not associated with user.
PASS Cannot view Forecast not associated with user.
# Navigating back to page of origin.
# Navigating back to Dashboard...
# Taking photo of Dashboard after commenting on forecast...
PASS Confirm Navigation from Forecast to Dashboard
PASS Find Table with Forecast data.
PASS Comment displayed on Dashboard
PASS Find View Details for Forecast Button.
# Navigating to Forecast Page.
# Re-entering comment to be blank.
# Navigating back to dashboard.
PASS Confirm Navigation from Forecast to Dashboard.
PASS Find Table with Forecast data.
# Taking photo of second comment input...
PASS Find View Details Button for Orders.
# Navigating to Order page.
# Entering Limit for Units Ordered...
# Taking photo of inputted data...
PASS Find Save Button
PASS Find Adjustment Prompt OK Button.
# Make sure all adjustments are consistent with 9999 limit implemented.
# Testing unauthorized navigation.
PASS Cannot view Order not associated with user.
PASS Cannot view Forecast not associated with user.
# Navigating back to page of origin.
PASS Find logout button.
# Testing unauthorized navigation.
PASS Cannot view Order not associated with user.
PASS Cannot view Forecast not associated with user.
# Navigating back to page of origin.

PASS 32 tests executed in 93.112s, 32 passed, 0 failed, 0 dubious, 0 skipped.  
```

## Locust

### Installing Locust
### Using Locust
