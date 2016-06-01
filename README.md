# Lagunitas Quality Assurance
###### Christopher Olson | Maria Casciani
<br>
## Table of Contents
1. [Getting Started](#getting-started)
  * [Quality Overview](#quality-overview)
  * [Requirements and Design Development](#requirements-and-design-development)
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
  * [Performance Tests](#performance-tests)
  * [Code Reviews](#code-reviews)
  * [Session Based Testing](#session-based-testing)
  * [Security](#security)
4. [Final Steps](#final-steps)
  * [System Tests](#system-tests)
  * [Regression Cycle](#regression-cycle)
  * [Acceptance Testing](#acceptance-testing)
  * [Simulation](#simulation)

## Getting Started
When beginning any project, it is critical to review code standards and metrics, as well as establish the requirements for the new software. Reviewing these standards and metrics is important to maintain high-quality and consistency in the codebase. This is the basic plan for the Quality Assurance process:

<p align="center">
 <img src="https://github.com/cjolson1/Lagunitas-Quality-Assurance/blob/master/Screen%20Shot%202016-05-31%20at%204.36.12%20PM.png">
</p>

#### Quality Overview
Each of the following should be reviewed and understood by all developers on the team.
- Error handling: Errors should be handled gracefully & explicity. Custom errors can be created to more effectively address issues in the code.
- Avoid repeated code: Trivial. 
- Comment clearly & concisely: Trivial. 
- File length: Excessive file lengths are a good indicator that the file should be split into smaller, more focused files. As the file size increases, discoverability decreases. 
- Review your own code first: Examine the changes made, and look for discrepancies or issues you might want to address before others address you about it.

While these guidelines are good to follow for any project, it is important to establish quality control measure that are *specific* to the project as a whole.

#### Requirements and Design Development
Develop clear, and mutually agreeable goals for the end product. These should be well communicated and delegated. Developers should commit to deadlines for each stage. In addition, standards should be established for security of the software and Key Performance Indicators (KPIs) should be set for the project. Release Criteria should be set and acknowledged for the project, allowing developers to know when the software is completed.

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
- Pass rate: While need not be 100% in all scenarios, test case pass rates should be 100% for continuous integration testing.
- Code coverage: This metric does not necessarily reflect the quality of the test cases written, code coverage is always a good indicator of how much of the project has actually been tested. 100% code coverage means that when the entire sum of all your tests are run, every line is executed at least once. This metric is an indicator of working code, not good code.
- Defect metrics: Used in conjunction with the team's goals, establishing thresholds for how many bugs are allowed in a development over a certain time period can be beneficial for production.

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

- Module Interface test: This test checks if information is properly flowing in and out of the program or module.
- Local data structures: Testing if the data that is supposed to be saved is saved is extremely important.
- Boundary conditions: Trivial.
- Error handling paths: The system's behavior surrounding errors should be controlled and useful [(see more)](#quality-overview)

It is important to document each test extensively in order to promote reusability and keep communication clear. Additionally, a failing test should read like a high-quality bug report. Failed test reports should include what was being tested, what the program should do, the expected output, and the actual output. Having these clear channels can imporve quality dramatically.

A common approach to unit testing involves writing drivers and stubs. The driver simulates a calling unit and a stub simulates a called unit. While creating these tests can be bothersome, unit testing can provide enchanced code coverage, reducing difficulties in finding errors in complex pieces of an application, and [test automation](#test-automation). 

Furthermore, while it may be tempting/cost-effective to "glue" together two units and test them as an integrated unit, an error can occur in a variety of places, creating confusion and uncertainty. With an integrated unit composed of unit 1 and unit 2, an error can occur in either of the units, both of the units, in the interface between the units, and in the test itself. These possibilities really demonstrate the importance of only testing one unit as your baseline to lower the level of uncertainty and raise the qulaity associated with testing your project.

#### Integration Tests
Integration testing begins testing muliple units of code together. It is the logical extension of unit testing. Integration testing allows for an intermediary step before system testing so that problems can be more quickly localized and addressed. This form of testing identifies problems that occur when units are combined. Most of the time when an errors occurs, it is due to the interfacing between the units.

Of particular interest for Lagunitas is the interaction of the software being written and the third-party libraries and external resources such as file systems, databases, and network services.  This is due to the fact that the behavior of such dependencies may not be fully known or controlled by the consuming development team, or may change in unexpected ways when new versions are introduced. In context of external webservices...

You and your team can do intergration testing in a variety of ways, but it is important to automate them and run them in the 95/5 unit/integration test ratio on Jenkins or Selenium. It is important that you and your team come to a consensus on what the strategy will be in order to improve workflow and the organization/quality of your work. The following are three common approaches to integration testing:

- Top-down approach: This approach requires testing the highest-level modules 

#### Performance Tests
Once the program is stable, these tests will focus on the efficiency of the code 

#### Code Reviews


#### Session Based Testing

#### Security

<br>
## Final Steps

#### System Tests

#### Regression Cycle

#### Acceptance Testing

#### Simulation
