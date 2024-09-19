## Functional Programming

Essential elements of functional programming are:

-   [First Class Functions](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function)
-   Higher order Functions
-   Declarative rather than Imperative code
-   Purity
-   Composition

## First Class

A first class function is one which can be treated as a variable

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const firstClass = () => {
    return "first Class function";
};

let answer = firstClass();
```

</div>

Just like a variable a function can be passed as a parameter to a second function. In this case it is the returned value from the first which is passed into the second function

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const cube = (z) => {
    return z * z * z;
};

const statement = (volume) => {
    return "The volume of a cube is", volume;
};

let answer = statement(cube(4));
```

</div>

## Higher order

A Function which recieves a function as and argument (like answer in the code above) or a function which returns a function is called a higher order function.

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const power = (z) => {
    return (x) => {
        return ("The value of " + x + " to the power " + z + " is " + Math.pow(x, z));
    };
};

const volume = power(3);
const area = power(2);

let c = area(4);
```

</div>

Edit the last line of this code to display the volume(4).

## Declarative

Declarative code avoids counters and uses iterators so that the code expresses what is to be done rather than the steps to do an action.  The map method of an array is an example of this.

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
// Declarative
// Find volumes from numbers in a list

const power = (z) => {
    return (x) => {
        return ( Math.pow(x, z));
    };
};

const volume = power(3);
const area = power(2);

const nums = [2,3,4,5];
const numVolume = nums.map(volume);

let a = numVolume;
```

</div>


## Purity

A pure function is one which returns a value which depends only on its arguments.  That means that a pure function should not refer to any global variables or data values outside its definition.

Pure functions are very portable as they have no  external dependancies.

## Composition

A function can be written which uses 2 or more functions as arguments and then utililises both to produce a result.

Note that the order of execution for the function effect runs function g first and passes the result to function f. Evaluating the inner brackets first is the normal way of evaluating and expression.

In the code which follows try editting a to use the compose 1 - 4 functions in turn.

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const effect = (f, g) => {
    return (x) => {
        return f(g(x));
    };
};

const bigEffect = (f, g, h) => {
    return (x) => {
        return f(g(x) + h(x));
    };
};

const add1 = (y) => y + 1;
const times2 = (z) => z * 2;
const negate = (w) => w * -1;

const compose1 = effect(add1, times2);
const compose2 = effect(add1, negate);
const compose3 = effect(negate, times2);
const compose4 = bigEffect(add1, times2, negate);

let a = compose1(2);
```

</div>
