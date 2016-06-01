# Lagunitas Quality Assurance
###### Christopher Olson | Maria Casciani
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
  * [Integration Tests](#integration-tests)
  * [Code Reviews](#code-reviews)
    - [Architecture and Design](#architecture-and-design)
    - [Style](#style)
    - [Testing](#testing)
  * [Security](#security)
4. [Final Steps](#final-steps)
  * [System Tests](#system-tests)
  * [Regression Cycle](#regression-cycle)
  * [Acceptance Tests](#acceptance-tests)
  * [Performance Tests](#performance-tests)
  * [Simulation](#simulation)
    - * [Session Based Testing](#session-based-testing)

## Getting Started
When beginning any project, it is critical to review code standards and metrics, as well as establish the requirements for the new software. Reviewing these standards and metrics is important to maintain high-quality and consistency in the codebase. This is the basic plan for the Quality Assurance process:

<p align="center">
 <img src="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/Screen%20Shot%202016-05-31%20at%204.36.12%20PM.png">
</p>

#### Quality Overview
Each of the following should be reviewed and understood by all developers on the team.
- **Error handling:** Errors should be handled gracefully & explicity. Custom errors can be created to more effectively address issues in the code.
- **Avoid repeated code**
- **Comment clearly & concisely**
- **File length:** Excessive file lengths are a good indicator that the file should be split into smaller, more focused files. As the file size increases, discoverability decreases. 
- **Review your own code first:** Examine the changes made, and look for discrepancies or issues you might want to address before others address you about it.

While these guidelines are good to follow for any project, it is important to establish quality control measure that are *specific* to the project as a whole.

#### Requirements and Design Development
Develop clear, and mutually agreeable goals for the end product. These should be well communicated and delegated. Developers should commit to deadlines for each stage. In addition, standards should be established for security of the software and Key Performance Indicators (KPIs) should be set for the project. Release Criteria should be set and acknowledged for the project, allowing developers to know when the software is completed.

#### Skepticism Toward Test Driven Development
While using test driven development (TDD) for a project can increase project quality, there is a tradeoff between the benfit of less bugs and better quality versus the time it takes to finish the project. This time expense is a valid concern; however, for Lagunitas, a company in the process of scaling, TDD can be advantageous for developing quality applications with minimized time fixing bugs. Test Driven Development also can be thought of as "Test Driven Design", allowing the structure of the tests to allow your development to proceed with smaller less complex units of code more clearly coming together. 

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
- What should it do?
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
When faced with a system with multiple bugs, it is important to address those that effect the most people/users first. Integrating a tool like Google Analytics or a custom software tool to evaluate the most pertinent bugs is recommended.

#### Metrics
When creating any application, metrics will allow for clear goals and progress to be acchieved efficiently. A 100% success rate is not always advised, as sufficient rates will allow for quality while not overly burdening progress. Below are some useful metric examples:
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

#### Integration Tests
Integration testing begins testing muliple units of code together. It is the logical extension of unit testing. Integration testing allows for an intermediary step before system testing so that problems can be more quickly localized and addressed. This form of testing identifies problems that occur when units are combined. Most of the time when an errors occurs, it is due to the interfacing between the units.

Of particular interest for Lagunitas is the interaction of the software being written and the third-party libraries and external resources such as file systems, databases, and network services.  This is due to the fact that the behavior of such dependencies may not be fully known or controlled by the consuming development team, or may change in unexpected ways when new versions are introduced. In context of external webservices that may be used in conjunction with a project, this means that integration testing can prove vital to the success of the project.

You and your team can do intergration testing in a variety of ways, but it is important to automate them and run them in the 95/5 unit/integration test ratio on Jenkins or Selenium. It is important that you and your team come to a consensus on what the strategy will be in order to improve workflow and the organization/quality of your work. The following are three common approaches to integration testing:

- **Top-down approach:** This approach requires testing the highest-level modules first. This allows high-level logic and data flow to be tested early on and minimizes the need for drivers; however, the need for stubs complicates test management and low-level applications are tested late in the development cycle. Furthermore, this form of testing does not promote early release of a project with limited functionality because it requires everything be thoroughly tested before finishing.
- **Bottom-up approach:** The logical counterpart to the top-down approach. The need for stubs is minimized, but there is a need for drivers which complicates the test management. High-level logic and data flow are tested late. Like the top-down approach, the bottom-up approach also provides poor support for early release of limited functionality.
- **Umbrella approach:** This approach is more advanced and free-spirited. It requires testing along functional data and control-flow paths. First, the inputs for functions are integrated in the bottom-up pattern discussed above. The outputs for each function are then integrated in the top-down manner. The primary advantage of this approach is the degree of support for early release of limited functionality. It also helps minimize the need for stubs and drivers. The potential weaknesses of this approach are significant, however, in that it can be less systematic than the other two approaches, leading to the need for more regression testing.

We suggested Lagunitas use either the top-down or bottom-up methods first to adapt to the idea of test-driven development. As comfort with the process grows, we advise a transition to the Umbrella approach for projects that would like to have Alpha and Beta stages before deployment.

#### Code Reviews

Briefly, a code review is a discussion between two or more developers about changes to the code to address an issue. Its importance is critical; it promotes collaboration, identifies bugs, and keeps code more maintainable. This practice's practicality is fairly obvious. We suggest that code reviews be done when a component of a project is finished. Code reviews should be done with two or more developers, including the person that wrote the code being reviewed.

Here are some useful practices to employ during code reviews:
- **Review fewer than 200-400 lines of code at a time:** The Cisco code review study (see the sidebar) showed that for optimal effectiveness, developers should review fewer than 200-400 lines of code (LOC) at a time. Beyond that, the ability to find defects diminishes. At this rate, with the review spread over no more than 60–90 minutes, you should get a 70–90% yield. In other words, if 10 defects existed, you'd find 7 to 9 of them.
- **Aim for an inspection rate of fewer than 300-500 lines of code (LOC) per hour:** Take your time with code review. Faster is not better. IBM research shows that you'll achieve optimal results at an inspection rate of less than 300–500 LOC per hour.
- **Take enough time for a proper, slow review, but not more than 60–90 minutes:** IBM research shows that 60-90 minutes are the upper bound for effective code reviewing. On the flip side, you should always spend at least five minutes reviewing code, even if it's one line.
- **Be sure that authors annotate source code before the review begins**
- **Create a personal checklist: Each person typically makes the same 15–20 mistakes:** If you notice what your typical errors are, you can develop your own personal checklist (Personal Software Process, the Software Engineering Institute, and the Capability Maturity Model Integrated recommend this practice, too). Reviewers will do the work of determining your common mistakes. All you have to do is keep a short checklist of the common flaws in your work, particularly the things that you most often forget to do.
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

<br>
## Final Steps

#### System Tests

#### Regression Cycle

#### Acceptance Tests

#### Performance Tests
Once the program is stable, these tests will focus on the efficiency of the code. 

#### Simulation

##### Session Based Testing
