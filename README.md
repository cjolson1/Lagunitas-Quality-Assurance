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
When beginning any project, it is critical to review code standards and metrics, as well as establish the requirements for the new software. Reviewing these standards and metrics is important to maintain high-quality and consistency in the codebase. 
#### Quality Overview
Each of the following should be reviewed and understood by all developers on the team.
- Error handling: Errors should be handled gracefully & explicity. Custom errors can be created to more effectively address issues in the code.
- Avoid repeated code: Trivial. 
- Comment clearly & concisely: Trivial. 
- File length: Excessive file lengths are a good indicator that the file should be split into smaller, more focused files. As the file size increases, discoverability decreases. 
- Review your own code first: Examine the changes made, and look for discrepancies or issues you might want to address before others address you about it. 

#### Requirements and Design Development
Develop clear, and mutually agreeable goals for the end product. These should be well communicated and delegated. Developers should commit to deadlines for each stage. 
<br>
## Test Planning and Designing
Test driven development fosters clear goals and allows for those key requirements to be checked at each step in the development process. 
#### Test Cases
These depend on the product, but they should address the desired requirements and functionality. 
#### Test Automation
Designing tests to be automated will allow for more tests and a better use of developer's time. In the case of Lagunitas, Jenkins and Selenium would be used to test code as it is committed; however, it is important to do more exhaustive, time-consuming testing when the project is not being worked on (e.g. when the office is empty). During this phase of the software development cycle, we recommend that tests be automated in a structured, two-tier process.
##### Tier 1
Also known as "microtesting" or sanity checks, test after every commit on general (ie required cases)
##### Tier 2
Also known as "macrotesting" or regression testing, exhaustive testing at night when project isn't being worked on. 
#### Bugs
When faced with a system with multiple bugs, it is important to address those that effect the most people/users first. Integrating a tool like Google Analytics or a custom software tool to evaluate the most pertinent bugs is recommended. 
#### Metrics
When creating any application, metrics will allow for clear goals and progress to be acchieved efficiently. A 100% success rate is not always advised, as sufficient rates will allow for quality while not overly burdening progress. Below are some useful metric examples:
- Pass rate: While need not be 100% in all scenarios, test case pass rates should be 100% for continuous integration testing.
- Code coverage: This metric does not necessarily reflect the quality of the test cases written, code coverage is always a good indicator of how much of the project has actually been tested.
- Defect metrics: Used in conjunction with goals, establishing thresholds for how many bugs are allowed in a development over a certain time period can be beneficial for production.

&#9;While these metrics are helpful, they are certainly not complete; metrics may be project-specific and establishing these before a project starts can help accelerate the software development process while maintaining quality.

## Development and Repeated Testing
#### Unit Tests
#### Integration Tests
#### Performance Tests
#### Code Reviews
#### Session Based Testing
#### Security
<br>
## Final Steps
#### System Tests
#### Regression Cycle
#### Acceptance Testing
#### Simulation
