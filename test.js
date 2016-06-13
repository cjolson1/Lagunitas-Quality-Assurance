/* This test requires account information with admin rights that is managing
 * at least one distributor with at least one forecast and at least one order,
 * with the most recent order having a status of 'Needs approval'.
 *
 * In this test, we will log in as an admin, log in as a distributor, comment repeatedly on a forecast, modify an
 * order, and logout. Throughout these tests we will be checking if we can navigate from a page to other pages that
 * are unauthorized. We will also be doing basic tests for HTML elements and variables.*/

//We begin the test with the casper.test.begin function. You must specify the number of tests that are going to be run.
// casper.test.begin(testTitle, numberOfTests, callback)
casper.test.begin('Testing Lagunitas Ordering Portal', 34, function(test){
    //It is important that we start at a designated URL and set the size of the screenshots we are going to be taking.
    casper.start('http://192.168.0.236/').viewport(1600,1000);
    //This line allows casper to emulate the browsers below:
    casper.userAgent('Mozilla/5.0 (Windows NT 6.0) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/13.0.782.41 Safari/535.1');

    //This function will be called throughout; it will test the ability to see orders/forecasts that are not allowed.
    function test_nav() {
        //test.comment allows you to make remarks during the test for clarification
        test.comment('Testing unauthorized navigation.');
        //A lot of Casper's functionality comes from casper.then. It is used to separate steps in the testing process.
        casper.thenOpen('http://192.168.0.236/orderportal/order/42', function(response){
            //Tests the server response to a POST request to the page.
            try{
                test.assertEqual(response.status, 403, "Cannot view Order not associated with user.");
            }catch(e){test.processAssertionResult(e.result)}
            casper.capture('test_img/403.png')
        });
        //Casper.wait allows us to wait a specific number of milliseconds for pages to load etc.
        casper.wait(1200, function(){
            //Allows us to go back a page in history.
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

    casper.then(function(){
        /*In general, with test.assertXXX the first field is what is being asserted and the second input is
         * what the tester will spit out as the title of the test.
         * First, we test some basic functionality, like the webpage's title, and fields.*/
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
        /*this.fill is used to fill forms. the username and password parameters in the dictionary correspond
         * to the name of the input fields. We use this to login. The true parameter tells casper to submit the form.*/
        this.fill('form#form-login', {
            'username': 'xxxxxxx',
            'password': 'xxxxxxx'
        }, true);
        test.comment('Attempting to login...')
    });

    //casper.wait is used to allow pages to load; without it we will encounter errors because casper will just go.
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

    casper.wait(2000, function(){
        //Again, we check if we navigated to the right page.
        try{
            test.assertUrlMatch('http://192.168.0.236/orderportal/admin', 'Admin page navigation.');
        }catch(e){test.processAssertionResult(e.result)}
        test.comment('Taking photo of admin dashboard...');
        casper.capture('test_img/admin-dash.png');
        //clicklabel clicks on the given HTML element with innerHTML of the first parameter
        //We click on a label to get to more information.
        var match = this.clickLabel(" Customers (Distributors)", "a");
        //If the element is click, it will be truthy.
        try{
            test.assertTruthy(match, 'Customers (Distributors) button clicked.');
        }catch(e){test.processAssertionResult(e.result)}
    });

    casper.wait(2000, function(){
        casper.capture('test_img/customer_interface.png');
        test.comment('Taking photo of Customers (Distributors) interface...');
        //We find and click on the edit user button so we can log in as them.
        try{
            test.assertExists('a.editCustomers span.glyphicon.glyphicon-cog', 'Find Edit User Button.');
        }catch(e){test.processAssertionResult(e.result)}
        this.click('a.editCustomers span.glyphicon.glyphicon-cog')
    });

    casper.wait(2000, function(){
        test.comment('Taking photo of Editing User HTML...');
        casper.capture('test_img/editing_user.png');
        try{
            test.assertExists('div.login-as-user.pull-right.btn.btn-link', 'Find Login As User Button.');
        }catch(e){test.processAssertionResult(e.result)}
        //We progress with logging in as someone.
        this.click('div.login-as-user.pull-right.btn.btn-link');
    });

    casper.wait(2000, function(){
        test.comment('Taking photo of Login As User prompt...');
        casper.capture('test_img/login_as_user.png');
        //We login as someone
        try{
            test.assertExists('button.confirm', "Find Login as XXXXX Button.");
        }catch(e){test.processAssertionResult(e.result)}
        this.click('button.confirm');
    });

    casper.wait(2000, function(){
        //We take a photo of the new account that we logged into.
        test.comment('Taking photo of new account...');
        casper.capture('test_img/new_acc.png');
        test_nav();
    });

    casper.wait(2000, function(){
        //We now are going to interact with forecasts. We view details on one of them.
        try{
            test.assertExists('a[class="btn btn-primary btn-xs btn-view-forecast"]', 'Find View Details for Forecast Button.');
        }catch(e){test.processAssertionResult(e.result)}
        this.click('a[class="btn btn-primary btn-xs btn-view-forecast"]');
    });

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

    casper.wait(2000, function(){
        //We go back to the dashboard and look if the comment we just made shows up.
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
        test.comment('Navigating to Order page.')
    });

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

    casper.then(function(){
        //Then, we logout.
        try{
            test.assertExists('a[href="/logout"]', "Find logout button.");
        }catch(e){test.processAssertionResult(e.result)}
        casper.capture('test_img/logout.png');
        this.click('a[href="/logout"]');
        test.comment('Testing unauthorized navigation.');
        //Afterward, we try to access orders and forecasts that are unauthorized. We also try to go to the dashboard.
        //We verify the correct response is taken by checking URL.
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

    //This last function is critical. Without it, the tests won't run.
    casper.run(function(){
        //This line is just for aesthetics.
        this.echo('\n');
        //End testing.
        test.done();
    })
});
