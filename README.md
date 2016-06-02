# Lagunitas Quality Assurance
###### Christopher Olson | Maria Casciani &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; June 2, 2016 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Last Revision: June 2, 2016 10:55
<br>
## Table of Contents
1. [Getting Started](#getting-started)
  * [Quality Overview](#quality-overview)
  * [Requirements and Design Development](#requirements-and-design-development)
  * [Skepticism Toward Test Driven Development](#skepticism-toward-test-driven-development)
    - [Pros](#pros)
    - [Cons](#cons)
2. [Test Planning and Designing](#test-planning-and-designing)
  * [Test Cases](#test-cases)
  * [Test Automation](#test-automation)
    - [Tier 1](#tier-1)
    - [Tier 2](#tier-2)
  * [Bugs](#bugs)
  * [Metrics](#metrics)
3. [Development and Repeated Testing](#development-and-repeated-testing)
  * [Unit Tests](#unit-tests)
  * [Mocking](#mocking)
  * [Integration Tests](#integration-tests)
  * [Code Reviews](#code-reviews)
    - [Architecture and Design](#architecture-and-design)
    - [Style](#style)
    - [Testing](#testing)
  * [Security](#security)
    - [Fuzz Testing](#fuzz-testing)
4. [Final Steps](#final-steps)
  * [System Tests](#system-tests)
  * [Regression Cycle](#regression-cycle)
  * [Performance Tests](#performance-tests)
  * [Acceptance Tests](#acceptance-tests)
  * [Session Based Testing](#session-based-testing)
5. [Testing Frameworks](#testing-frameworks)
  * [Django](#django)
  * [JavaScript](#javascript)
  * [Selenium](#selenium)
  * [Jenkins](#jenkins)
6. [An Example](#an-example)

## Getting Started
When beginning any project, it is critical to review code standards and metrics, as well as establish the requirements for the new software. Reviewing these standards and metrics is important to maintain high-quality and consistency in the codebase. This is the basic plan for the Quality Assurance process:

<p align="center">
 <img src="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/Screen%20Shot%202016-05-31%20at%204.36.12%20PM.png">
</p>

#### Quality Overview
Each of the following should be reviewed and understood by all developers on the team:

- **Error handling:** Errors should be handled gracefully & explicity. Custom errors can be created to more effectively address issues in the code.
- **Avoid repeated code**
- **Comment code clearly & concisely:** Good idea to remove any commented out lines.
- **File length:** Excessive file lengths are a good indicator that the file should be split into smaller, more focused files. As the file size increases, discoverability decreases. 
- **Review your own code first:** Examine the changes made, and look for discrepancies or issues you might want to address before others address you about it.
- **Method names:** Naming things is one of the hard problems in computer science. If a method is named `get_message_queue_name` and it is actually doing something completely different like sanitizing HTML from the input, then that’s an inaccurate method name. And probably a misleading function.
- **Variable names:** `foo` or `bar` are probably not useful names for data structures. `e` is similarly not useful when compared to `exception`. Be as verbose as you need (depending on the language). Expressive variable names make it easier to understand code when you have to revisit it later.
- **Docstrings:** For complex methods or those with longer lists of arguments, is there a docstring explaining what each of the arguments does, if it’s not obvious?
- **Readability:** Is the code easy to understand? Is it necessary to pause frequently during the review to decipher it?

While these guidelines are good to follow for any project, it is important to establish quality control measure that are *specific* to the project as a whole.

#### Requirements and Design Development
Develop clear, and mutually agreeable goals for the end product. These should be well communicated and delegated. Developers should commit to deadlines for each stage. In addition, standards should be established for security of the software and Key Performance Indicators (KPIs) should be set for the project. Release Criteria should be set and acknowledged for the project, allowing developers to know when the software is completed.

#### Skepticism Toward Test Driven Development
While using test driven development (TDD) for a project can increase project quality, there is a tradeoff between the benfit of less bugs and better quality versus the time it takes to finish the project. This time expense is a valid concern; however, for Lagunitas, a company in the process of scaling, TDD can be advantageous for developing quality applications with minimized time fixing bugs. Test Driven Development also can be thought of as "Test Driven Design", allowing the structure of the tests to allow your development to proceed with smaller less complex units of code more clearly coming together. 

Some groups that do Agile development, like Lagunitas, do not use TDD; however, it seems to be a critical part of Agile development, according to the Agile <a href="http://programmers.stackexchange.com/questions/21870/can-you-be-agile-without-doing-tdd-test-driven-development">community</a>.

<p align="center">
<b>According to "Exploding Software-Engineering Myths" by Microsoft Research, which used Microsoft to test the efficiency of TDD, test-driven development reduces defects in software by 60-90% while increasing time investment by 15-35%.</b>
</p>

According to the author of the paper, "Over a development cycle of 12 months, 35 percent is another four months, which is huge; however, the tradeoff is that you reduce post-release maintenance costs significantly, since code quality is so much better. Again, these are decisions that managers have to make—where should they take the hit? But now, they actually have quantified data for making those decisions.”

TDD is helpful to learn, understand, and internalise key principles of modular design and delivers quality results. On the flipside, TDD forces a shift toward a more concentrated effort at the inception of the programs development, forcing a slow start that eventually picks up speed.

<p align="center">
<b>Furthermore, the software Lagunitas currently employs for testing (Selenium, Jenkins, Django) are made to be used with TDD.</b>
</p>

With that being said, we strongly recommend TDD be used by Lagunitas except for extreme cases in which a project must be completed on a given day or the project is too small or trivial to even consider testing extensively.

Throughout our research we have collected a series of pros and cons to TDD that may be useful when considering a borderline project to use TDD with.

##### Pros

- Makes code easier to maintain and refactor.
- Makes collaboration easier and more efficient, team members can edit each others code with confidence because the tests will inform them if the changes are making the code behave in unexpected ways.
- Good unit testing forces good architecture.  In order to make your code unit-testable, it must be properly modularized, by writing the unit testing first various architectural problems tend to surface earlier.
- Over the long term it's faster. Refactoring code written two years in the past is hard. If that code is backed up by a good suite of unit tests, the process is made so much easier.
- The Django web framework directly supports TDD for development. They have unit tests for the web data model, control layers, and HTML presentation and behavior. 

##### Cons

- Like any programming, there is a big difference between doing it and doing it well.  Writing good unit tests is an art form. (We will get to that in this document.)
- Initially unit testing is slower.
- Unit testing is something the whole team has to buy into. Team Leaders have to enforce policies and actually get in and check the tests.
- Complex cases are much harder to design test cases for. 


## Test Planning and Designing
Test driven development fosters clear goals and allows for those key requirements to be checked at each step in the development process. 

#### Test Cases
These depend on the product, but they should address the desired requirements and functionality. Test cases form the backbone of any software platform and should be create painstakingly. It is important to not write trivial tests for your project; they contribute to code rot and generally make you and your team test-resistant, which is not a good thing you the quality of your software. 

A good test should be able to answer the following questions clearly:

- What are you testing?
- What is the functionality?
- What is the actual output?
- What is the expected output?
- How can the test be reproduced?

#### Test Automation
Designing tests to be automated will allow for more tests and a better use of developer's time. In the case of Lagunitas, Jenkins and Selenium would be used to test code as it is committed; however, it is important to do more exhaustive, time-consuming testing when the project is not being worked on (e.g. when the office is empty). During this phase of the software development cycle, we recommend that tests be automated in a structured, two-tier process.

##### Tier 1
Also known as "microtesting" or sanity checks, this stage requires testing after each commit (i.e. required cases). This testing should be rudimentary and quick in order to ensure productivity.

##### Tier 2
Also known as "macrotesting" or regression testing, exhaustive testing at night when project isn't being worked on. These tests should take a lot of time and should work to test every aspect of the system extensively.

#### Bugs
When faced with a system with multiple bugs, it is important to address those that effect the most people/users first. Integrating a tool like <a href="https://www.google.com/analytics/#?modal_active=none">Google Analytics</a> or a custom software tool to evaluate the most pertinent bugs is recommended.

#### Metrics
Metrics are critical to understand the level and quality of the software’s progress. A 100% success rate is not always advised, as sufficient rates will allow for quality while not overly burdening progress. 

- **User sentiment**
- **Requirement Turnover:** Requirements delivered/requirements desired at the outset
- **Defect removal efficiency:** No. of Defects found during QA testing / (No. of Defects found during QA testing +No. of Defects found by End user)) * 100
- **Defect density:** defects in a module/ total defects
- **Pass rate:** While need not be 100% in all scenarios, test case pass rates should be 100% for continuous integration testing.
- **Code coverage:** This metric does not necessarily reflect the quality of the test cases written, code coverage is always a good indicator of how much of the project has actually been tested. 100% code coverage means that when the entire sum of all your tests are run, every line is executed at least once. This metric is an indicator of working code, not good code.
- **Defect metrics:** Used in conjunction with the team's goals, establishing thresholds for how many bugs are allowed in a development over a certain time period can be beneficial for production.

&#9;While these metrics are helpful, they are certainly not complete; metrics may be project-specific and establishing these before a project starts can help accelerate the software development process while maintaining quality.

## Development and Repeated Testing
This step of the Quality Assurance process will be the most time-consuming and important. Testing during development is critical to keeping track of the progress of the project. In general, the testing of a project will follow the following ascending order:

<p align="center">
 <img src="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/Screen%20Shot%202016-05-31%20at%204.37.26%20PM.png">
</p>

During the development process, unit tests are the most critical to ensure quality in the software. We recommend in [Tier 1](#tier-1) testing that tests be 95% unit tests and 5% integration tests.

#### Unit Tests
Unit testing focuses on individual units of source code, making sure it is up to the expected code standards. This type of testing is important to address any issues before progressing. Since it only tests small portions of code, it is fastest to complete. Overall, the goal of unit testing is to take the smallest piece of testable software in your project, isolate it, and determine whether its behavior matches what you expect from it. It is at this level that a large percentage of defects in software can be detected and identified. 

Studies from Microsoft Research, IBM, and Springer tested the efficacy of test-first vs test-after methodologies and consistently found that a test-first process produces better results than adding tests later. It is resoundingly clear:

<p align="center">
 <b>Before you implement, write the test.</b>
</p>

Some general topics to cover when unit testing are the following:

- **Module Interface test:** This test checks if information is properly flowing in and out of the program or module.
- **Local data structures:** Testing if the data that is supposed to be saved is saved is extremely important.
- **Boundary conditions**
- **Error handling paths:** The system's behavior surrounding errors should be controlled and useful [(see more)](#quality-overview)

It is important to document each test extensively in order to promote reusability and keep communication clear. Additionally, a failing test should read like a high-quality bug report. Failed test reports should include what was being tested, what the program should do, the expected output, and the actual output. Having these clear channels can imporve quality dramatically.

A common approach to unit testing involves writing drivers and stubs. The driver simulates a calling unit and a stub simulates a called unit. While creating these tests can be bothersome, unit testing can provide enchanced code coverage, reducing difficulties in finding errors in complex pieces of an application, and [test automation](#test-automation). 

Furthermore, while it may be tempting/cost-effective to "glue" together two units and test them as an integrated unit, an error can occur in a variety of places, creating confusion and uncertainty. With an integrated unit composed of unit 1 and unit 2, an error can occur in either of the units, both of the units, in the interface between the units, and in the test itself. These possibilities really demonstrate the importance of only testing one unit as your baseline to lower the level of uncertainty and raise the qulaity associated with testing your project.

#### Mocking
Mocks simulate the behavior of actual objects to allow testers to isolate a smaller component of the program during unit testing, such as a class. Mocking is more elaborate than stubbing. Stubs perform the minimal amount of object behavior to enable the tested module to run, with state verification. When unit testing, mocks perform behavior verification. 

For example, you want to test your software’s ability to send an email if an order wasn’t received. A stub in this case would count how many emails were sent. A mock would track if the program sent the email with the right contents and to the correct person. We have a detailed example of mocking in Django [here](#testing-django-with-mocking).

When to use mocks?

When your method being unit tested has dependencies. Mock every dependency your unit test touches. When creating a mock, set the exact return values the dependency should return when tested, and exceptions to throw to test the method’s error handling. 

Mock Shortcomings:

Excessive mocking calls in a unit test can lead to unit tests that are too tightly coupled to the internal implementation of the very dependency you’re trying to mock.  This can make your code very difficult to refactor because the unit tests are very specific. 

Usage of mocks usually follows this pattern:

1. Setup of the mock(s) and expectations.
2. Execution of the code to test.
3. Verification that the expectations were met.

#### Integration Tests
Integration testing begins testing muliple units of code together. It is the logical extension of unit testing. Integration testing allows for an intermediary step before system testing so that problems can be more quickly localized and addressed. This form of testing identifies problems that occur when units are combined. Most of the time when an errors occurs, it is due to the interfacing between the units.

As a rule of thumb:

<p align="center">
 <b>
 Unit testing makes sure you are using quality ingredients. Functional testing makes sure your application doesn't taste like crap.
 </b>
</p>

Of particular interest for Lagunitas is the interaction of the software being written and the third-party libraries and external resources such as file systems, databases, and network services.  This is due to the fact that the behavior of such dependencies may not be fully known or controlled by the consuming development team, or may change in unexpected ways when new versions are introduced. In context of external webservices that may be used in conjunction with a project, this means that integration testing can prove vital to the success of the project.

You and your team can do intergration testing in a variety of ways, but it is important to automate them and run them in the 95/5 unit/integration test ratio on Jenkins or Selenium. It is important that you and your team come to a consensus on what the strategy will be in order to improve workflow and the organization/quality of your work. 

The following are three common approaches to integration testing:

- **Top-down approach:** This approach requires testing the highest-level modules first. This allows high-level logic and data flow to be tested early on and minimizes the need for drivers; however, the need for stubs complicates test management and low-level applications are tested late in the development cycle. Furthermore, this form of testing does not promote early release of a project with limited functionality because it requires everything be thoroughly tested before finishing.
- **Bottom-up approach:** The logical counterpart to the top-down approach. The need for stubs is minimized, but there is a need for drivers which complicates the test management. High-level logic and data flow are tested late. Like the top-down approach, the bottom-up approach also provides poor support for early release of limited functionality.
- **Umbrella approach:** This approach is more advanced and free-spirited. It requires testing along functional data and control-flow paths. First, the inputs for functions are integrated in the bottom-up pattern discussed above. The outputs for each function are then integrated in the top-down manner. The primary advantage of this approach is the degree of support for early release of limited functionality. It also helps minimize the need for stubs and drivers. The potential weaknesses of this approach are significant, however, in that it can be less systematic than the other two approaches, leading to the need for more regression testing.

We suggested Lagunitas use either the top-down or bottom-up methods first to adapt to the idea of test-driven development. As comfort with the process grows, we advise a transition to the Umbrella approach for projects that would like to have Alpha and Beta stages before deployment.

#### Code Reviews

Briefly, a code review is a discussion between two or more developers about changes to the code to address an issue. Its importance is critical; it promotes collaboration, identifies bugs, and keeps code more maintainable. This practice's practicality is fairly obvious. We suggest that code reviews be done when a component of a project is finished. Code reviews should be done with two or more developers, including the person that wrote the code being reviewed.

Here are some useful practices to employ during code reviews:

- **Review fewer than 200-400 lines of code at a time:** The Cisco code review study showed that for optimal effectiveness, developers should review fewer than 200-400 lines of code (LOC) at a time. Beyond that, the ability to find defects diminishes. At this rate, with the review spread over no more than 60–90 minutes, you should get a 70–90% yield. In other words, if 10 defects existed, you'd find 7 to 9 of them.
- **Aim for an inspection rate of fewer than 300-500 lines of code (LOC) per hour:** Take your time with code review. Faster is not better. IBM research shows that you'll achieve optimal results at an inspection rate of less than 300–500 LOC per hour.
- **Take enough time for a proper, slow review, but not more than 60–90 minutes:** IBM research shows that 60-90 minutes are the upper bound for effective code reviewing. On the flip side, you should always spend at least five minutes reviewing code, even if it's one line.
- **Be sure that authors annotate source code before the review begins**
- **Create a personal checklist:** Each person typically makes the same 15–20 mistakes. If you notice what your typical errors are, you can develop your own personal checklist (Personal Software Process, the Software Engineering Institute, and the Capability Maturity Model Integrated recommend this practice, too). Reviewers will do the work of determining your common mistakes. All you have to do is keep a short checklist of the common flaws in your work, particularly the things that you most often forget to do.
- **Foster a good code review culture in which finding defects is viewed positively**
- **Metrics should never be used to single out developers, particularly in front of their peers:** This practice can seriously damage morale.

Code reviews should span the components Architecture and Design, Style, and Testing of the code being looked at. In conjunction with the practices mentioned above, here are some guidelines to consider when looking at each of these elements specifically.

##### Architecture and Design
- **Single Responsibility Principle:** The idea that a class should have one-and-only-one responsibility. Harder than one might expect. If you have to use “and” to finish describing what a method is capable of doing, it might be at the wrong level of abstraction. This greatly improves testability.
- **Code duplication:** Go by the “three strikes” rule. If code is copied once, it’s usually okay If it’s copied again, it should be refactored so that the common functionality is split out.
- **Code left in a better state than found:** If changing an area of the code that’s messy, it’s tempting to add in a few lines and leave. We recommend going one step further and leaving the code nicer than it was found.
- **Efficiency:** If there’s an algorithm in the code, is it using an efficient implementation? For example, iterating over a list of keys in a dictionary is an inefficient way to locate a desired value.

##### Style
See [Quality Overview](#quality-overview)

##### Testing
- **Test coverage and quality:** Its great to see tests for new features. Are the tests thoughtful? Do they cover the failure conditions? Are they easy to read? How fragile are they? How big are the tests? Are they slow?
- **Testing at the right level:** When reviewing tests make sure that they are testing the program at the right level. In other words, are we as low a level as we need to be to check the expected functionality? Gary Bernhardt, a prominent TDD software blogger, recommends a ratio of 95% unit tests, 5% integration tests. With Django projects, it’s easy to test at a high level by accident and create a slow test suite so it’s important to be vigilant.
- **Number of Mocks:** Mocking is great. Mocking everything is not great. Use a rule of thumb where if there’s more than 3 mocks in a test, it should be revisited. Either the test is testing too broadly or the function is too large. Maybe it doesn’t need to be tested at a unit test level and would suffice as an integration test. Either way, it’s something to discuss.
- **Meets requirements:** Usually as part of the end of a review, look at the requirements of the story, task, or bug which the work was filed against. If it doesn’t meet one of the criteria, it’s better to bounce it back before problems arise.

#### Security
The dependence on Django, a ubiquitous technology, means that its primary security vulnerabilities are well known and documented. Developers should consider taking steps to, at the very least, ensure that the most critical software (such as connections to the financial software) is strong against basic threats.

 - The simplest first step is to update the current working version of your Django framework in all your environments. And while Django is backwards compatible, it is nonetheless crucial that you identify any components in your web app that might be impacted by patching/updating.
 - Django's built-in CSRF protection is good. Enable it and use it everywhere.  (Cross-Site Forgery Attack: when a hacker tricks a user into loading a malicious url in which they are authenticated into) 
 - Avoid manually forming SQL queries using string concatenation. For instance, do not use raw SQL queries (e.g. `raw()`). Similarly, do not use the `extra()` method/modifier to inject raw SQL. Do not execute custom SQL directly; if you bypass Django's Object Relational Mapping layer, you bypass its protections against SQL command injection. (SQL injection attacks are used to read sensitive data, modify data, or perform administrative actions) 
 
Of course, these are only the basics; however, any platform that is being rolled out should have comprehensive security.

##### Fuzz Testing
Fuzz testing is for detecting problems that can cause the system to crash. Examples of these kinds of issues would be buffer overflow, cross-site scripting, denial of service attacks, or SQL injection. Fuzz testing is typically employed by hackers to bring a system down with minimal effort. Fuzz testing is not effective for discovering threat potential from things such as: spyware, viruses, and Trojans. We do not recommend Lagunitas use this form of testing because it is not really applicable.
<br>

## Final Steps

#### System Tests

#### Regression Cycle

A regression cycle is run in the final phase of product stabilization, and it is that procees that triggers the green light to go to production. Since very little is changing in development at this point in the project, there is an opportunity to validate the entire product. We suggest modelling the entire piece of software as a directed graph with edges pointing from components to the components that are dependent upon it. When any branch is modified, the hierarchy shows what branches below it will be affected and will need additional QA testing.

We suggest using a "traffic light" method for the regression cycle. If every edge recieves a green light (passes all tests), the product is considered ready for delivery. If a branch receives a yellow light (all tests passed but with one or more reported warnings), it is important to talk about whther the piece should be worked on more or deployed and fixed after. Finally, if a branch receives a red light (one or more tests failed), stop and address the issue. We suggest that you automate the regression cycle, so it only takes a few days to run.

#### Performance Tests
Performance tests assess speed, scalability, reliability, and stability. Once the platform is stable, preformance tests can begin.

Lagunitas' software, especially programs that will interact with a growing number of users should definitely be assessed with performance-based testing. Scaling issues are critical to platforms such as the distributor ordering system, or ones which will have to withstand larger amounts of data flow. Load testing and endurance testing seem most useful to the expected usage of Lagunitas software which will likely endure sustained usage, with minimal high loads or spikes.

Performance will be determined by running software through a variety of difficult scenarios.
 
- **Load Testing:** This measures important business critical transactions and expected load on the database, application server, etc. There are many open source options to simulate a many users such as <a href="https://jmeter.apache.org/">JMeter</a> or <a href="http://gatling.io/#/">Gattling</a>. Selenium is capable of performance testing, but isn’t an optimal choice. This is because when doing load tests it is significantly slower than other options like JMeter. Selenium is capable of performance testing, but isn’t an optimal choice. This is because when doing load tests it is significantly slower than other options like JMeter. Selenium WebDriver is also capable of working with <a href="http://junit.org/junit4/">JMeter JUnit 4</a>. To use <a href="http://www.seleniumhq.org/projects/webdriver/">Selenium WebDriver</a>, simply install “WebDriver Set” plugins. The WebDriver sampler is very useful if you want to test AJAX based web applications and simulated user actions. 
    1. **Endurance Testing:** Tests system performance under sustained load.
Can use <a href="http://loadrunnerjmeter.com/">LoadRunner</a> in JMeter, or  Selenium WebDriver. Issues commonly found: 
       * Serious memory leaks that would eventually result in application or Operating System crash.
       * Failure to close connections between the layers of the system could stall some or all modules of the system.
       * Failure to close database connections under some conditions might result in the complete system crash.
       * Gradual degradation of response time of the system as the application becomes less efficient as a result of prolonged test.
    2. **Stress Testing:** Finds the upper capacity of the system. 
- **Spike Testing:** Determines the ability of the system to handle large increases in usage in a small amount of time. Can be done with a variety of performance testing tools, including JMeter.

Load testing and endurance testing seem most useful to the expected usage of Lagunitas software which will likely endure sustained usage, with minimal high loads or spikes. 

#### Acceptance Tests

#### Session Based Testing
Session based testing is when a developer takes 90 ± 45 minutes to try to find errors and break a program. It is very exploratory and spontaneous, as opposed to scripted testing with software. As a result, new errors can be found while also verifying software requirements. Session based testing in conjunction with more traditional, regimented testing is recommended by experts at Microsoft. 

Pros: 
- **Can find previously unknown errors**
- **Low Cost:** no need to create unit tests, instead the developers get instantaneous feedback on software performance.

Cons: 
- **Limited by the domain of knowledge of the tester and cannot be done for long period of time**

Session testing basics: 
- **Goal-based:** Set a focus for the tester. Without a clear testing procedure, the session tester will approach the problem in their own way.
- **Documentation:** The session tester must clearly document what was found and how errors occurred. 
   - **Scenario #1:** I tried launching the Open File dialog using keyboard shortcut, and I found out that the hotkey to Open is “n” instead of the more traditional “o”.  We should keep the hotkey consistent with other applications.  Bug #123 filed.
   - **Scenario #2:** Dragging the Open File dialog window around, and this seems to work fine as expected.  Also drag the window outside of the screen and the window redraws itself back correctly.
   - **Scenario #3:** Tried opening file without extension, and Notepad crashes!  Bug #456 filed.

#### Testing Frameworks

There are many frameworks that can be used to test software built here at Lagunitas. Many of the platforms that are used here are made for TDD and easily support unit testing, easily the most critical step in the testing process. 

With that said, here are how the testing frameworks for Django, JavaScript, and Selenium:

##### Django

The testing framework for Django is split between the front-end and back-end. 

###### Testing Django on the back end

On the back-end, Django's testing platform is an extension of Python's `unittest` module, which makes it easy to interact with. Test cases are objects from the subclass `django.test.TestCase`, which is a subclass of `unittest.TestCase` that runs each test inside a transaction to provide isolation. We highly recommend taking advantage of this testing library.

Here is an example of what an example test case might look like:

```python
from django.test import TestCase
from myapp.models import Animal

class AnimalTestCase(TestCase):
    def setUp(self):
        Animal.objects.create(name="lion", sound="roar")
        Animal.objects.create(name="cat", sound="meow")

    def test_animals_can_speak(self):
        """Animals that can speak are correctly identified"""
        lion = Animal.objects.get(name="lion")
        cat = Animal.objects.get(name="cat")
        self.assertEqual(lion.speak(), 'The lion says "roar"')
        self.assertEqual(cat.speak(), 'The cat says "meow"')
```

When you run your tests, the default behavior of the test utility is to find all the test cases (that is, subclasses of `unittest.TestCase`) in any file whose name begins with **test**, automatically build a test suite out of those test cases, and run that suite. The default **startapp** template creates a **tests.py** file in the new application. This might be fine if you only have a few tests, but as your test suite grows you’ll likely want to restructure it into a tests package so you can split your tests into different submodules such as **test_models.py, test_views.py, test_forms.py,** etc. Feel free to pick whatever organizational scheme you like.

Once you've written tests, run them using the **test** command of your project's **manage.py** utility:

```python
$ ./manage.py test
```

Django's test library also has the ability to do built-in test discovery.You can specify particular tests to run by supplying any number of “test labels” to `./manage.py test`. Each test label can be a full Python dotted path to a package, module, `TestCase` subclass, or test method.

Some examples of this include:

```python
# Run all the tests in the animals.tests module
$ ./manage.py test animals.tests

# Run all the tests found within the 'animals' package
$ ./manage.py test animals

# Run just one test case
$ ./manage.py test animals.tests.AnimalTestCase

# Run just one test method
$ ./manage.py test animals.tests.AnimalTestCase.test_animals_can_speak
```

You can also provide a path to a directory to discover tests below that directory:

```python
$ ./manage.py test animals/
```

There is also a pattern option:

```python
$ ./manage.py test --pattern="tests_*.py"
```

We also suggest using the `--failfast` option which allows for a notice on failures without having to wait for the entire testing sequence to complete.

Further information regarding unittest and its customizations can be found <a href="https://docs.python.org/3/library/unittest.html#module-unittest">here</a>.

###### Testing Django on the front-end

On the front-end, Django has a test client that acts as a dummy Web browser and allows you to test your views and interact with your Django app programmatically.

Some of the things you can do with the test client are:

- Simulate GET and POST requests on a URL and observe the response – everything from low-level HTTP (result headers and status codes) to page content.
- See the chain of redirects (if any) and check the URL and status code at each step.
- Test that a given request is rendered by a given Django template, with a template context that contains certain values.

This framework by no means is meant to replace [Selenium](#selenium). It has a different focus. In short:

- Use Django’s test client to establish that the correct template is being rendered and that the template is passed the correct context data.
- Use in-browser frameworks like Selenium to test *rendered* HTML and the *behavior* of Web pages, namely JavaScript functionality. Django also provides special support for those frameworks.

In the best case scenario, teams would use both the Django test client and Selenium.

To use the test client, instantiate `django.test.Client` within a session of the Python interactive interpreter and retrieve Web pages:

```python
>>> from django.test import Client
>>> c = Client()
>>> response = c.post('/login/', {'username': 'john', 'password': 'smith'})
>>> response.status_code
200
>>> response = c.get('/customer/details/')
>>> response.content
b'<!DOCTYPE html...'
```

Note a few important things about how the client works:

- The test client does not require the Web server to be running. In fact, it will run just fine with no Web server running at all! That’s because it avoids the overhead of HTTP and deals directly with the Django framework. This helps make the unit tests run quickly.
- When retrieving pages, remember to specify the path of the URL, not the whole domain. The client is not capable of retrieving Web pages that are not powered by your Django project. If you need to retrieve other Web pages, use a Python standard library module such as <a href="https://docs.python.org/2/library/urllib2.html">urllib2</a> or <a href="http://docs.python-requests.org/en/master/">requests</a>.
- To resolve URLs, the test client uses whatever URLconf is pointed-to by your <a href="https://docs.djangoproject.com/en/1.9/ref/settings/#std:setting-ROOT_URLCONF">ROOT_URLCONF</a> setting.
- By default, the test client will disable any CSRF checks performed by your site. If you want the test client to perform CSRF checks, you can create an instance of the test client that enforces CSRF checks. To do this, pass in the enforce_csrf_checks argument when you construct your client: 
`csft_client = Client(enfore_csrf_checks=True)`.

The Django Client can perform `GET` and `POST` requests and should be looked at closely before beginning testing. The full documentation can be found <a href="https://docs.djangoproject.com/en/1.9/topics/testing/tools/#django.test.Client">here</a>.

###### Testing Django with Mocking

It is also possible to run mocks using Django. Mocking Django can be useful for the reason detail in the [Mocking section](#mocking). Mocking can be done using the <a href="https://pypi.python.org/pypi/mock/">mock</a> library in conjunction with Django and <a href="https://docs.python.org/2.7/library/unittest.html">unittest</a>. Mocking generally uses unittest's `TestCase` object as opposed to the django `TestCase` object because it saves the database cleanup between tests.

```python
from django.db import models
 
class SampleManager(models.Manager):
    def get_by_user(self, user):
        self.filter(user=user)
 
class Sample(models.Model):
    pass
```

```python
import unittest
import mock
from django_testing import models
 
class SampleTests(unittest.TestCase):
    def test_filters_by_user(self):
        user = mock.Mock()
        manager = mock.Mock(spec=models.SampleManager)
        models.SampleManager.get_by_user(manager, user)
        manager.filter.assert_called_with(user=user)
```

Let's walk though the test line by line. First, create a mock user. `user = mock.Mock()` Second, create a mock manager. `manager = mock.Mock(spec=models.SampleManager)` Next, call the method that you want to have do something. You'll notice something a bit of trickery here by using the actual `SampleManager` class and passing the manager mock object in as the self argument. This allows you to capture what the implementation code does with the manager inside the `get_by_user` method. `models.SampleManager.get_by_user(manager, user)` Finally, assert that your desired result occured. Here, you are asserting that the filter method of the manager mock object was called with the keyword user argument with the value of your user mock. `manager.filter.assert_called_with(user=user)`

Let's take a look at a different way to write that same test.

```python
@mock.patch('django_testing.models.SampleManager.filter', mock.Mock())
    def test_filters_by_user_with_patch(self):
        user = mock.Mock()
        models.Sample.objects.get_by_user(user)
        models.Sample.objects.filter.assert_called_with(user=user)
```

Here, the `mock` library's patch decorator to mock the `filter` method on the `SampleManager` class instead of using the 'mock as self' trickery. Let's look at one more way to write this test.


```python
@mock.patch('django_testing.models.SampleManager.filter')
    def test_filters_by_user_with_patch_and_filter_passed_in(self, filter_method):
        user = mock.Mock()
        models.Sample.objects.get_by_user(user)
        filter_method.assert_called_with(user=user)
```

In this example, the patch decorator is used a little bit differently. By omitting the second argument, the patch decorator will pass the mock into your test method which will then allow you to do assertions directly against it. Now, say you want to check for specific return values, consider this test.

```python
@mock.patch('django_testing.models.SampleManager.get_last')
    @mock.patch('django_testing.models.SampleManager.get_first')
    def test_result_of_one_query_in_args_of_another(self, get_first, get_last):
        result = models.Sample.objects.get_first_and_last()
        self.assertEqual((get_first.return_value, get_last.return_value), result)
```

You want to make sure that the result of `get_first_and_last` returns a tuple of the result of `get_first` and `get_last`. Our implementation code would look like this.

```python
from django.db import models
 
class SampleManager(models.Manager):
    def get_first(self):
        pass
    def get_last(self):
        pass
    def get_first_and_last(self):
        return self.get_first(), self.get_last()
 
class Sample(models.Model):
    objects = SampleManager()
```

That is really all there is to getting started with mocking Django. There are a few more advanced things that can be found <a href="http://chimera.labs.oreilly.com/books/1234000000754/ch16.html#_checking_the_view_actually_logs_the_user_in">here</a>.


##### JavaScript
Since Lagunitas uses a Django back-end, we do not forsee any use of a JavaScript testing framework other than [Selenium](#selenium) because of its ability to perform test automation; however, we have compiled a list of JavaScript unit testing tools that are TDD compliant that we found <a href="http://stackoverflow.com/questions/300855/javascript-unit-test-tools-for-tdd/680713#680713">here</a>.

A relatively simple front-end testing tool is <a href="http://docs.casperjs.org/en/latest/quickstart.html">CapserJS</a>. It runs on <a href="http://phantomjs.org/">PhantomJS</a> and relies on [integration tests](#integration-tests) in order to thoroughly test the front-end of your platform.

Compared to Selenium GUI interface, CasperJS is lightweight and simple and can be run from the command line.

To use Casper, you simply write some JavaScript, save it to a file, then run it from the command line like so: `casperjs my-source.js`. If you will be running unit tests, you must include the `test` command, like so: `casperjs test my-test.js`. All of the examples in this post should be run with the `test` command. 

Casper has a fantastic API full of convenience methods to help you interact with your phantasmic browser. There are two main modules that you can use, the <a href="http://docs.casperjs.org/en/latest/modules/casper.html">casper module</a> and the <a href="http://docs.casperjs.org/en/latest/modules/tester.html">tester module</a>. Methods in the tester module are only available when you run Casper with casperjs test `my-test.js`.

As an example, let's look at what the `casper` module can test on <a href="http://www.reddit.com/">http://www.reddit.com</a>.

```javascript
casper.options.viewportSize = {width: 1024, height: 768};
casper.start("http://www.reddit.com/", function() {
	console.log('Opened page with title \"' + this.getTitle() + '"');
    casper.capture("../images/reddit-home.png");
}).run();
```

The `start()` call opens the page and executes the callback when it's loaded. The `capture()` functionality allows you to take a screenshot and save it in the form of a PNG. Saving screenshots in this manner can be a great part of your functional tests, and can be hugely helpful as a debugging tool when writing your tests, helping you "see" what's going on in the invisible browser.

Now let's take a look at Casper's test API. Let's open up the /r/programming subreddit, click the "New" link and confirm that we're on the right page and have the correct content.

```javascript
casper.options.viewportSize = {width: 1024, height: 768};
var testCount = 2;
casper.test.begin("Testing Reddit", testCount, function redditTest(test) {
    casper.start("http://www.reddit.com/r/programming", function() {
    	test.assertTitleMatch(/programming/, "Title is what we'd expect");
    	//Click "new link"
    	casper.click("a[href*='/programming/new/']");
    	casper.waitForUrl(/\/programming\/new\/$/, function() {
    		test.assertElementCount("p.title", 25, "25 links on first page");
    		casper.capture("../images/reddit-programming-new.png");
    	});
    }).run(function() {
        test.done();
    });
});
```

Here, after we click the "New" link, we wait for the url to change and a new page to load. Then we confirm that there are 25 links on the page, the Reddit default.

Casper's API is chock full of handy helper methods like `click()` and `assertElementCount()`. Let's look at a more complicated method, `fill()`. `fill()` is a convenient way to fill out and (optionally) submit forms on the page. In this example, let's fill out the search box form and search for "javascript" within the /r/programming subreddit.

```javascript
casper.options.viewportSize = {width: 1024, height: 768};
var testCount = 1;
casper.test.begin("Searching Reddit", testCount, function redditSearch(test) {
    casper.start("http://www.reddit.com/r/programming", function() {
    	//Search for "javascript"
        casper.fill("form#search", {
            "q": "javascript",
           "restrict_sr": true
        }, true);
        casper.then(function(){
            test.assertElementCount("p.title", 25, "Found 25 or more results");
            this.capture("../images/Reddit search.png");
        });
    }).run(function() {
        test.done();
    });
});
```

Sometimes, to really test something complicated, you need to jump into the DOM of the browser itself. Casper provides the ability to do just that with the <a href="http://docs.casperjs.org/en/latest/modules/casper.html#evaluate">`evaluate()`</a> method. If you find this a bit confusing, they have a nice <a href="http://docs.casperjs.org/en/latest/_images/evaluate-diagram.png">diagram</a> to help you picture this.

Here's an example where we will jump into the context of the r/programming page, click on upvote, confirm that the login modal appears, then click on the `.close` backdrop and confirm that the modal disappears. The results are then returned to the casper environment.

```javascript
casper.options.viewportSize = {width: 1024, height: 768};
var testCount = 1;
casper.test.begin("Testing upvote login", testCount, function upvoteLogin(test) {
    casper.start("http://www.reddit.com/r/programming", function() {
    	var modalOpensAndCloses = casper.evaluate(function(){
            console.log("Now I'm in the DOM!");
            $("div.thing:first .arrow.up").click()
            var modalVisibleAfterClick = $(".popup").is(":visible");
            $(".cover").click()
            var modalClosedAfterClickOff = $(".popup").is(":visible");
            return (modalVisibleAfterClick && !modalClosedAfterClickOff);
        });
        test.assert(modalOpensAndCloses, "Login Modal is displayed when clicking upvote before signing in");
    }).run(function() {
        test.done();
    });
});
```

An important thing to note when using `casper.evaluate()` is that unlike almost any other interaction that occurs with the browser (`click()`, `fill()`, etc.), evaluate is synchronous. Whereas after calling fill or `sendKeys` you will need to wrap your next interaction in a `casper.then()` callback, evaluate happens instantly. This actually makes it easier to use than some of its asynchronous counterparts, but after a while you get used to asynchronous and have to remind yourself that evaluate is synchronous.

##### Selenium

##### Jenkins

#### An Example
