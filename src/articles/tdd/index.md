---
title: Test Driven Development
description: Explore the ideas of Test Driven Development and how it assists testing and code coverage
date: 2016-07-13
tags: articles
---

## Getting started with Test Driven Development

The *Test Driven Development* pattern instructs that tests are written first. Each test should describe the desired functionality and initially fail. After each test has been written, only the minimum code to pass the test is written.

## Our Environment

We will be writing a JavaScript `Users` class using the [Ext JS framework](https://www.sencha.com/products/extjs) and testing with the [Sencha Test Studio](https://www.sencha.com/products/test). These tests are written in Jasmine and usually stored in a `/test` directory alongside the `/app` directory where the application code will be written.

## Our First Test

Our first test will simply create a class object and assert that it is *defined* (i.e. not null). 

```
describe('Users', function () {
  it('should be defined', function () {
    var users = Ext.create('MyApp.main.Users');
    expect(users).toBeDefined();
  });
});
```

Running the test now will fail, of course, because we haven’t yet defined the `Users` class. We can stub out a class using the Ext.define() method. This is application code so it will be written in the `/app` or `/src` directory.

```
Ext.create('MyApp.main.Users', {});
```

We’ve written one line of code, our test passes and we’re done.

## Adding a Second Test

Now that we have started our `Users` class, we can add some functionality to it. Our second test will assert that the `Users.getUsers()` method returns an empty array before any users have been added.

```
describe('Users', function () {
  /// ...
  describe('getUsers() method', function () {
    it('should return an array', function () {
      expect(users.getUsers()).toEqual([]);
    });
  });
});
```

With the Ext JS library at our disposal, we can add this functionality to our class quite quickly by declaring a users configuration property and defining it as an empty array. Ext JS will automatically provide getters and setters for this property, which `Users.getUsers()` will call.

```
Ext.create('MyApp.main.Users', {
  config: {
    users: []
  }
});
```

Our second test now passes.

## Writing a Third Test

Our third test will add a user to our `users` array property. We describe the desired functionality in a test.

```
describe('addUser() method', function () {
  it('should add user by string', function () {
    var users = Ext.create('MyApp.main.Users');
    users.AddUser('first user');
    expect(users.getUsers()).toEqual(['first user']);
  });
});
```

Again, after running the test it will initially fail. We can now add this functionality to our class, but only enough to pass the test.

We create an *addUser* method taking a parameter and pushing this onto the *users* array property.

```
addUser: function(user) {
  users.push(user);
}
```

Running the test again and our test user is added to the array and the value returned by `users.getUsers()` is now equal to `['first user']` and our test passes.

## Write More Tests

Proceeding in this way, we write a test to describe the behaviour of each *public* function. We are building up a library of tests which prove that our code meets the requirements. These tests are *Unit Tests*, which help focus our development through *TDD* and provide *Regression Testing*. After each code change, all tests are run and we can quickly identify if the changes have any side-effects introducing bugs in other areas of the application.
 
Repeating the object creation in each test is a waste of code, we can use some of Jasmine’s built-in methods to create a fresh copy for each test. We move the `users` declaration outside the tests and create an instance of the class using `beforeEach`, which runs before each test and destroy the object after each test with `afterEach`.

```
describe('Users', function() {
  var users = null;

  beforeEach(function () {
    users = Ext.create('MyApp.main.Users');
  });

  afterEach(function () {
    users.destroy();
    users = null;
  });

  //...
});
```

One other technique to improve these test is to clearly spell out the test’s expected and actual values. By defining an `expected` and `actual` variable, future testers can quickly identify the purpose and required output for each test. For example, we could rewrite our `addUsers` test as:

```
describe('addUser() method', function () {
  it('should add user by string', function () {
    users.AddUser('first user');
    var expected = ['first user'];
    var actual = users.getUsers();
    expect(actual).toEqual(expected);
  });
});
```
 
We can now build up a library of tests for our class.

1. Take a business rule and write a failing test
2. Write only the code required and check that the test passes
3. Repeat
