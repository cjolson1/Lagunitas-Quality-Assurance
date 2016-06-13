#Testing with CasperJS and Locust
###### Christopher Olson | Maria Casciani &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; June 10, 2016 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Last Revision: June 13, 2016 9:33
<br/>

## Table of Contents
* [CasperJS](#casperjs)
  - [Installing Casper](#installing-casper)
  - [Using Casper](#using-casper)
* [Locust](#locust)
  - [Installing Locust](#installing-locust)
  - [Using Locust](#using-locust)

## CasperJS
CasperJS is a webscraping and testing framework for the front-end of any web application. It is simple and lightweight, and uses a headless browser to test quickly. It comes bundled with very useful APIs that allow the user to take screenshots, assert conditions about almost anything, and overall mimic user behavior. In this document we will take you through writing a CasperJS test suite for the Lagunitas Ordering Portal. Casper is a great tool overall, but the one downside to the Casper module is that if one test fails, the entire test suite aborts. There is a solution to this, but as you will see, it is not a very graceful one.

The documentation for Casper is extensive and can be found <a href="http://docs.casperjs.org/en/latest/modules/">here</a>. It runs by default on the PhantomJS engine, but we will be using SlimerJS to execute tests because it is less buggy in my experience.

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

In this example, we will:
- Login to the Ordering Portal as an admin.
- Navigate to the admin page to login as a user managed by the admin.
- Perform a variety of tasks as that user.
- Logout.
- Throughout this proceess we will be testing if authentication is working properly by navigating away from these pages to see orders and forecasts that are not associated with our user.

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

Before I elaborate, it is essential that you do NOT instantiate any variable as `casper`. CasperJS test module will figure that out for you. We start by declaring that we will begin the testing, and the first parameter `'Testing the Lagunitas Ordering Portal'` is the title of the tests that are going to follow. The next parameter `32`, is a count of how many tests are going to be executed in this suite. An error will be thrown if you do not update this. The JavaScript function takes a parameter `test` that will be helpful for assertions later.

The first line in any `casper.test.begin` function should be that call to `casper.start`. It gives Casper a URL to start at, and with the `viewport` extension, we can set the size of the screenshots we will be taking.

After writing all your tests, it is vital that you inclue these lines at the end:

```javascript
// This last function is critical. Without it, the tests won't run.
    casper.run(function(){
        // This line is just for aesthetics.
        this.echo('\n');
        // End testing.
        test.done();
    })
```

This allows the tests to complete. Now that we have walked through an entire test suite, I will give you the code in its entirety <a href="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/test.js">here</a>.

#### Logging in

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
        try{
            test.assertTitle('Lagunitas Apps');
        }catch(e){test.processAssertionResult(e.result)}
        try{
            test.assertExists('input[name="username"]', "Find username field.");
        }catch(e){test.processAssertionResult(e.result)}
        try{
            test.assertExists('input#id_password', 'Find password field.');
        }catch(e){test.processAssertionResult(e.result)}
        try{
            test.assertExists('a#login_id', 'Find login button.');
        }catch(e){test.processAssertionResult(e.result)}
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

We encapsulate our tests with `casper.then` as a CasperJS convention which separates our testing into steps. The first line with `test.comment` allows you to annotate the output of your testcases. You may notice the try/catch loops surrounding each test. This is an unfortunate cosequence of Casper aborting whenever a test fails.

<p align="center">
<b>In order to avoid this, you must wrap each test in a try/catch loop. It's a travesty, but will improve the quality of your test suite.</b>
</p>

The next series of lines utilize several CasperJS APIs to determine the existence of several HTML elements, like the username field, password field, and submit button. We also check that the webpage title matches what we expect it to be. The design of your `test.assertWhatever` commands should be around the expected behavior of your website. There is a optional parameter to customize the title of a specific test by passing in a string, which can be used to clarify the intent of a test like in the `test.assertExits` calls. Inherent to the behavior of Casper with `test.assertWhatever` is that it will select only the first instance that it finds of what is specified.

The next command `this.fill` really demonstrates the power of Casper. The first parameter is the form that we want to fill, which we can select with CSS identifiers. The next parameter is a dictionary with the name property of input tags that are going to be filled with their corresponding values. The `true` at the end tells Casper that we want to submit this form. We then comment that we are attempting to login. We use `this` instead of `test` because the casper test module is `this` in this case, which we want to utilize to navigate through the webapp.

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
<b>We need to consider the speed of CasperJS, and write code that pauses accordingly because Casper will continue to test even when pages aren't loaded.</b>
</p>

We can accomplish this by telling casper to wait with the `casper.wait` commands. There are a variety of wait-specific commands like `casper.waitForPopup`, `casper.waitForAlert`, etc. but they timeout by default at 5000 ms so we can make due with a simple `casper.wait(5000, function(){})`.

#### Logging in as an Admin

We need to give the browser some time to render the account page, so we do:

```javascript
casper.wait(2000, function(){
    //We determine if we navigated to the expected page.
    try{
        test.assertUrlMatch('http://192.168.0.236/orderportal/dashboard', 'Logging in.');
    }catch(e){test.processAssertionResult(e.result)}
    test.comment('Taking photo of account dashboard...');
    //casper.capture takes a photo of what the browser is looking at.
    casper.capture('test_img/login.png');
    //We determine if we can go to the admin portal and do it if we can.
    try{
        test.assertExists('a[href="/orderportal/admin"]', 'Find Admin Portal button.');
    }catch(e){test.processAssertionResult(e.result)}
    this.click('a[href="/orderportal/admin"]');
});
```

We wait 2000 milliseconds before executing the next round of tests to let the page load and begin by asserting that the URL has changed with `test.assertUrlMatch`. We eventually call the first of many `casper.capture` calls. This method allows us to take a screenshot of what the browser is seeing and save it to any filepath we desire. In this case I created a directory called `test_img` for these screenshots to reside.

Here is that image:

<p align="center">
<img src="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/login.png">
</p>

We then search for the Admin button and click on it.

#### Logging in as a Distributor

```javascript
casper.wait(2000, function(){
    // Again, we check if we navigated to the right page.
    try{
        test.assertUrlMatch('http://192.168.0.236/orderportal/admin', 'Admin page navigation.');
    }catch(e){test.processAssertionResult(e.result)}
    test.comment('Taking photo of admin dashboard...');
    casper.capture('test_img/admin-dash.png');
    /* clicklabel clicks on the given HTML element with innerHTML of the first parameter
    * We click on a label to get to more information. */
    var match = this.clickLabel(" Customers (Distributors)", "a");
    //If the element is click, it will be truthy.
    try{
        test.assertTruthy(match, 'Customers (Distributors) button clicked.');
    }catch(e){test.processAssertionResult(e.result)}
});
```

We wait again for the Admin Dashboard to load and check if indeed we are at the right URL path. We take a photo of the page, click on a button, and check that we indeed clicked the button with `test.assertTruthy`. Furthermore, `this.clickLabel` allows us to search for an HTML element, in this case an anchor with the innerHTML of `" Customers (Distributors)"`. This is a very useful instruction when HTML elements and their properties are indistinguishable.

At this point in the process we have navigated here:

<p align="center">
<img src="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/customer_interface.png">
</p>

We then continue to try to login as a user by clicking the setting symbol next to `LOVELAND`:

```javascript
casper.wait(2000, function(){
    casper.capture('test_img/customer_interface.png');
    test.comment('Taking photo of Customers (Distributors) interface...');
    //We find and click on the edit user button so we can log in as them.
    try{
        test.assertExists('a.editCustomers span.glyphicon.glyphicon-cog', 'Find Edit User Button.');
    }catch(e){test.processAssertionResult(e.result)}
    this.click('a.editCustomers span.glyphicon.glyphicon-cog');
});
```

We first test that the gear element exists as a CSS identifier that CasperJS can understand. 
<p align="center">
<b>In writing this test, I found that PhantomJS could not execute this command, but SlimerJS could, leading to my intuition that SlimerJS is more reliable.</b>
</p>

We then click on it, yielding the following:

<p align="center">
<img src="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/editing_user.png">
</p>

We now need to click the Login As User Button which can be accomplished by the following:

```javascript
casper.wait(2000, function(){
    test.comment('Taking photo of Editing User HTML...');
    casper.capture('test_img/editing_user.png');
    try{
        test.assertExists('div.login-as-user.pull-right.btn.btn-link', 'Find Login As User Button.');
    }catch(e){test.processAssertionResult(e.result)}
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
    try{
        test.assertExists('button.confirm', "Find Login as XXXXX Button.");
    }catch(e){test.processAssertionResult(e.result)}
    this.click('button.confirm');
});
```

And just like that, we are logged in:

<p align="center">
<img src="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/new_acc.png">
</p>

Now that we are logged in as another user, we can begin testing permissions and the forecasts and orders of that user, in this case LOVELAND.

As I mentioned before, we are going to repeatedly test the ability of a user to access unauthorized forecasts and orders that are not associated with LOVELAND. In order to promote reusability of code, we can write one function to accomplish this:

```javascript
// This function will be called throughout; it will test the ability to see orders/forecasts that are not allowed.
function test_nav() {
    test.comment('Testing unauthorized navigation.');
    casper.thenOpen('http://192.168.0.236/orderportal/order/42', function(response){
        // Tests the server response to a POST request to the page.
        try{
            test.assertEqual(response.status, 403, "Cannot view Order not associated with user.");
        }catch(e){test.processAssertionResult(e.result)}
        casper.capture('test_img/403.png')
    });
    casper.wait(1200, function(){
        // Allows us to go back a page in history.
        casper.back();
    });
    casper.thenOpen('http://192.168.0.236/orderportal/forecast/42', function(response){
        try{
            test.assertEqual(response.status, 403, "Cannot view Forecast not associated with user.");
        }catch(e){test.processAssertionResult(e.result)}
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

It will eventually return us to whatever page we were initially on. 

#### Testing Distributor Forecasts

Continuing from the LOVELAND dashboard we accessed, we test the associated forecasts (in this case the first one that says 'View Details'). Remember that Casper chooses the first instance of an element being looked for.

```javascript
casper.wait(2000, function(){
    // We now are going to interact with forecasts. We view details on one of them.
    try{
        test.assertExists('a[class="btn btn-primary btn-xs btn-view-forecast"]', 'Find View Details for Forecast Button.');
    }catch(e){test.processAssertionResult(e.result)}
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
    //We take a photo of the forecast and test if we can access unauthorized orders and forecasts.
    test.comment('Taking photo of Forecast...');
    casper.capture('test_img/forecast.png');
    test_nav();
});

casper.wait(2000, function(){
    //We begin adding a comment to the forecast.
    test.comment('Clicking Forecast Comments Button...');
    this.click('a[id="btn-comments"]');
});

casper.wait(2000, function(){
    test.comment('Entering Comment...');
    //We enter the comment and confirm it.
    //When a form isn't present, you can fill input values with sendKeys. the reset param first empties the element.
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
    try{
        test.assertUrlMatch("http://192.168.0.236/orderportal/dashboard", 'Confirm Navigation from Forecast to Dashboard');
    }catch(e){test.processAssertionResult(e.result)}
    try{
        test.assertExists('table#tbl-recent-forecasts', 'Find Table with Forecast data.');
    }catch(e){test.processAssertionResult(e.result)}
    //We evaluate if we have indeed put the comment on the forecast.
    var comment = this.evaluate(function(){
        return $("table#tbl-recent-forecasts td:contains('testing')").size() === 1
    });
    try{
        test.assertTruthy(comment, "Comment displayed on Dashboard");
    }catch(e){test.processAssertionResult(e.result)}
    //We go back to the forecast page to comment some more.
    try{
        test.assertExists('a[class="btn btn-primary btn-xs btn-view-forecast"]', 'Find View Details for Forecast Button.');
    }catch(e){test.processAssertionResult(e.result)}
    this.click('a[class="btn btn-primary btn-xs btn-view-forecast"]');
    test.comment('Navigating to Forecast Page.')
});
```

Apart from the same old CasperJS commands to navigate through the webapp, we can see that there is a call to `this.evaluate`. In a nutshell it evaluates an expression in the current page DOM context, or the current HTML page. 
<p align="center">
This function is the most powerful thing CasperJS has to offer.
</p>

To not miscontrue its meaning, I will quote the documentation: "The concept behind this method is probably the most difficult to understand when discovering CasperJS. As a reminder, think of the evaluate() method as a gate between the CasperJS environment and the one of the page you have opened; everytime you pass a closure to evaluate(), you’re entering the page and execute code as if you were using the browser console." It's pretty cool. That's what's behind letting us use the jQuery instruction, so scanning through HTML elements becomes much easier.

Now we go back to the forecast page, try to enter an empty comment, and go back to the dashboard to see if the forecast comment is now empty:

```javascript
casper.wait(2000, function(){
    // On that same forecast, we try to erase the comment by submitting a blank field.
    this.click('a[id="btn-comments"]');
    this.fillSelectors('fieldset', {
        'input[type="text"]': ''
    }, true);
    test.comment('Re-entering comment to be blank.');
    // We navigate back to the dashboard to see if we can see the comment.
    this.click('button.confirm');
    this.click('a[href="/orderportal/dashboard"]');
    test.comment('Navigating back to dashboard.')
});

casper.wait(2000, function(){
    try{
        test.assertUrlMatch("http://192.168.0.236/orderportal/dashboard", "Confirm Navigation from Forecast to Dashboard.");
    }catch(e){test.processAssertionResult(e.result)}
    try{
        test.assertExists('table#tbl-recent-forecasts', "Find Table with Forecast data.");
    }catch(e){test.processAssertionResult(e.result)}
    /*this.evaluate is a special functionality to casperjs. It executes the code as if it's on the page itself,
     * so we can use things like jQuery to make selecting elements easier.*/
    //We determine if the testing comment can be found.
    var commentt = this.evaluate(function(){
        return $("table#tbl-recent-forecasts td:contains('testing')").size() === 0;
    });
    test.comment('Taking photo of second comment input...');
    casper.capture('test_img/empty_comment_forecast.png');
    try{
        test.assertTruthy(commentt, "New empty comment is reflected in table.");
    }catch(e){test.processAssertionResult(e.result)}
    //We now progress to orders and begin messing with those.
    try{
        test.assertExists('a[class="btn btn-primary btn-xs btn-view-order"]', "Find View Details Button for Orders.");
    }catch(e){test.processAssertionResult(e.result)}
    this.click('a[class="btn btn-primary btn-xs btn-view-order"]');
    test.comment('Navigating to Order page.');
});
```

This follows similar logic from initially entering the comment above. In fact, at the time of writing this, it was not possible to write empty comments! This means the the instruction `test.assertTruthy(commentt, "New empty comment is reflected in table.")` will fail. Finding bugs like this is easy with Casper; this is the first testcase I've written with it.

#### Testing Distributor Orders

Next, we need to play with the order forms. We are already at the order page with the code above, and to give you a sense of where we are at, here's a photo:

<p align="center">
<img src="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/order_data.png">
</p>

We will interact with it in the following way:

```javascript
casper.wait(5000, function(){
    /* Of particular interest are the specialty beers because they are limited by allocation. We enter the max value 
    * allowed into their fields and save it. */
    test.comment('Entering Limit for Units Ordered...');
    this.sendKeys('input[data-key-name="B1-EQUINOX-12/22"]', '9999', {reset: true});
    this.sendKeys('input[data-key-name="B2-LUCKY13-4/6/12"]', '9999', {reset: true});
    this.sendKeys('input[data-key-name="B3-LUCKY-155"]', '9999', {reset: true});
    this.sendKeys('input[data-key-name="B3-SUMPIN-155"]', '9999', {reset: true});
    test.comment('Taking photo of inputted data...');
    casper.capture('test_img/order_data.png');
    try{
        test.assertExists('a#btn-save-order', "Find Save Button");
    }catch(e){test.processAssertionResult(e.result)}
    this.click('a#btn-save-order');
});
casper.wait(2000, function(){
    try{
        test.assertExists('button.confirm', "Find Adjustment Prompt OK Button.");
    }catch(e){test.processAssertionResult(e.result)}
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
    try{
        test.assertTruthy(correct, "All fields are less than limit.");
    }catch(e){test.processAssertionResult(e.result)}
    // We test the system for unauthorized navigation.
    test_nav();
});
```

We first fill the seasonal beers inputs with the max possible value, and save the order to see how the values are changed. We then check that these orders' values do not go over the specified limit, which they do. Another bug! This means that `test.assertTruthy(correct, "All fields are less than limit.")` will fail.

This is what I mean by how the orders' values are changed:

<p align="center">
<img src="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/adj_prompt.png">
</p>

#### Logging Out

Now we are done with this user account, and we want to test authentication from an external party, one that is not logged in. We can accomplish all of that with this code:

```javascript
casper.then(function(){
    // Then, we logout.
    try{
        test.assertExists('a[href="/logout"]', "Find logout button.");
    }catch(e){test.processAssertionResult(e.result)}
    casper.capture('test_img/logout.png');
    this.click('a[href="/logout"]');
    test.comment('Testing unauthorized navigation.');
    /* Afterward, we try to access orders and forecasts that are unauthorized. We also try to go to the dashboard.
    * We verify the correct response is taken by checking URL. */
    casper.thenOpen('http://192.168.0.236/orderportal/order/42', function(response){
        try{
            test.assertUrlMatch('http://192.168.0.236/accounts/login/?next=/orderportal/order/42', "Cannot view Order not associated with user.");
        }catch(e){test.processAssertionResult(e.result)}
    });
    casper.wait(1200, function(){
        casper.back();
    });
    casper.thenOpen('http://192.168.0.236/orderportal/forecast/42', function(response){
        try{
            test.assertUrlMatch('http://192.168.0.236/accounts/login/?next=/orderportal/forecast/42', "Cannot view Forecast not associated with user.");
        }catch(e){test.processAssertionResult(e.result)}        
    });
    casper.wait(1200, function(){
        casper.back();
        test.comment('Navigating back to page of origin.')
    });
});
```

Instead of an `assertEquals` with status codes, we simply did an `assertUrlMatch`. This demonstrates how we can accomplish the same thing multiple ways with CasperJS. We were able to logout with a simple `.click` command and execute the rest of our testing.

After writing all your tests, it is vital that you inclue these lines at the end:

```javascript
// This last function is critical. Without it, the tests won't run.
    casper.run(function(){
        // This line is just for aesthetics.
        this.echo('\n');
        // End testing.
        test.done();
    })
```

This allows the tests to complete. Now that we have walked through an entire test suite, I will give you the code in its entirety <a href="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/test.js">here</a>.

## Locust

Locust is a open-source performance testing tool that "spawns" thousands of "locusts" (users) to test your program's http requests efficiently. So it's important to note that the HTML page rendering time is NOT evaluated. Locust's event-based architecture relies on micro-threads. This allows a single machine to asynchronously simulate many more users in comparison to technologies such as Jmeter which create much more load on your machine. Locust is python-based pairs well with Lagunitas' Django experience. 

### Installing Locust
```
pip install locustio
```
That simple.


For OS X specifically (if you have Homebrew): 
```
brew install libevent
```

To install software to do distributed processing:
```
pip install pyzmq
```

### Using Locust

<b>Locust tests http request performance under load</b>

The <a href="http://docs.locust.io/en/latest/quickstart.html">Locust official documentation</a> has a good basic example, so I won’t repeat it here. The basic idea is you write a python file to test your code and then run it from the commandline: 

To run Locust with the above locust file, if it was named locustfile.py, we could run (in the same directory as locustfile.py):

```
locust --host=http://example.com
```

or if the locust file is located elsewhere we could run:

```
locust -f ../locust_files/my_locust_file.py --host=http://example.com
```

Once it is running you will go to the local host address it specifies. A nice UI will pop up where you will input the number of users you want to simulate and the “hatch rate” (how fast you want the users to be created to hit your total user goal).

<p align="center">
  <img src="">
</p>

Once you want the test to stop press STOP. Stats will be displayed in the UI, and also will be printed to the command line. 

#### Writing a Locustfile

At a minimum, you simply need to define two classes:
  - A subclass of <a href=”http://docs.locust.io/en/latest/writing-a-locustfile.html#making-http-requests”>HttpLocust</a> (runs the test).
  - A subclass of TaskSet (defines what will be tested).

```python
from locust import HttpLocust, TaskSet, task

class WebsiteTasks(TaskSet):
    def on_start(self):
        self.client.post("/login", {
            "username": "test_user",
            "password": ""
        })
    
    @task
    def index(self):
        self.client.get("/")
        
    @task
    def about(self):
        self.client.get("/about/")


# HttpLocust inherits from Locust
class WebsiteUser(HttpLocust):
    task_set = WebsiteTasks
    min_wait = 5000
    max_wait = 15000
```
  
Each “locust” will be an instance of the class `WebsiteUser`. Each `WebsiteUser` will perform the tasks assigned to `task_set`. The class `WebsiteTasks` defines the different tasks. `Min_wait` and `max_wait` are the minimum and maximum wait times between each task (this variation is used to simulate users more realistically). 

`TaskSet` subclass can include a method called `on_start`, often for login purposes. The `on_start` function is called when a simulated user starts executing that `TaskSet` class.

`HttpLocust` inherits from Locust, and it allows the user to preserve cookies between requests so that it can be used to log in to websites and keep a session between http requests:

POST example:

```python
response = self.client.post("/login", {"username":"testuser", "password":"secret"})
```

GET exmaple:

```python
response = self.client.get("/about")
print "Response status code:", response.status_code
print "Response content:", response.content
```

#### Specifying Task Ratios

Some tasks will tend to be more heavily used than others in your application. To define these ratios by setting a <a href=”http://docs.locust.io/en/latest/writing-a-locustfile.html#the-weight-attribute”>weight</a>. The simplest way to do this is with the tasks decorator:

```python
class MyTaskSet(TaskSet):
    min_wait = 5000
    max_wait = 15000

    @task(3)
    def task1(self):
        pass

    @task(6)
    def task2(self):
        pass
```

So in the example above `task2` will run twice as often as `task1`.


#### Nesting Tasks

Most web pages have pages are hierarchical so <a href=”http://docs.locust.io/en/latest/writing-a-locustfile.html#tasksets-can-be-nested”>nesting</a> your task sets helps replicate the way users behave within your site. An example of this would be how in a site like reddit, a user would:

1. Open a forum page 
  - Read a thread
    * Reply to that thread
  - Read a new thread
  - Go to next page
  - 
To do this in Locust you nest these `TaskSet` classes:

```python
class UserBehavior(TaskSet):

   # logs in user
   def on_start(self):
       """ on_start is called when a Locust start before any task is scheduled """
       # logs in as admin
       self.client.post("/login", {"username": "maria.casciani",
                                   "password": "maria.casciani123"})

   # inner nest testing dashboard behavior
   @task(1)
   class DashboardBehavior(TaskSet):
       @task(3)
       def admin(self):
           self.client.get('/admin')

       @task
       def schedule(self):
           self.client.get("/schedule")

       @task
       def export(self):
           self.client.get("/om_export")

   # tests the "view details" forecast requests
@task(5)
def order_adjust(self):
self.client.get("/order/1354")


class WebsiteUser(HttpLocust):
   task_set = UserBehavior # outer nest
   min_wait=800
   max_wait=12000
```

In the example above, the task nesting structure looks like this:
  - `DashboardBehavior` (note this is a class because there are tasks nested within it)
    * `admin`
    * `schedule`
    * `export`
  - `order_adjust`

Admin, schedule, and export methods are all the methods of the `DashboardBehavior` class. Each of these can also have their own ratios in relation to each other.

#### Simulating Page Views

Locust doesn’t request a URL unless you tell it to. You can either do this explicitly for each, or utilize <a href=”https://www.crummy.com/software/BeautifulSoup/”>Beautiful Soup</a>.
An example to open all the URLs a user typically loads when accessing a page (for images, style sheets, and scripts):

```python
resource_urls = set()
    soup = BeautifulSoup(response.text)
    for res in soup.find_all(src=True):
        url = res['src']
        resource_urls.add(url)
```

This is critical to having more realistic load on your application.

You can install BeautifulSoup by entering the following on the command line:

```
pip install beautifulsoup4
```

