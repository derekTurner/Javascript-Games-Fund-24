## HTML5 introduction

HTML5 is a markup language used to structure a document.

The `<!DOCTYPE html>` confirms that the file is an HTML5 document.

The `<head>` generally contains information for the browser to use, such as the `<title>`.

The `<body>` contains text to be structured and rendered onto the browser screen.

Both `<head>` and `<body>` are contained within an `<html>` element.

A number of structuring elements such as header level `<h1>` and paragraph `<p>` enclose the text to control how it is layed out.

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Page Title</title>
    </head>
    <body>
        <h1>First Level Heading</h1>
        <p>Opening paragraph.</p>
    </body>
</html>
```


<iframe 
    height="200" 
    width="100%" 
    scrolling="no" 
    title="Hello.html" 
    src="Block_1/section_1/Hello.html" 
    frameborder="no" 
    loading="lazy" 
    allowtransparency="true" 
    allowfullscreen="true">
</iframe>

### Images and links

The anchor tag `<a>` is used to create hyperlinks to other locations.

The `<img>` tag includes an image in the page.

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Page Title</title>
    </head>
    <body>
        <h1>First Level Heading</h1>
        <!-- COMMENTS GO HERE -->

        <p><a href="https://beta.dreamstudio.ai/"> Visit Dream Studio </a></p>

        <img src="images/space.png" alt="Space Image" style="width:200px; height:200px;">

        
        <p>Create your own image</p>
    </body>
</html>
```


<iframe 
    height="400" 
    width="100%" 
    scrolling="no" 
    title="Hello.html" 
    src="Block_1/section_1/dream.html" 
    frameborder="no" 
    loading="lazy" 
    allowtransparency="true" 
    allowfullscreen="true">
</iframe>


### Lists

```html
<!DOCTYPE html>
<html>
    <head>
        <title>List Display</title>
    </head>
    <body>
        <h1>Lists</h1>

        <ul style="list-style-type:square">
            <li> Coffee </li>
            <li> Tea </li>
            <li> Milk </li>
        </ul>
        
        <ol type="1">
            <li> Coffee </li>
            <li> Tea </li>
            <li> Milk </li>
        </ol>
        
    </body>
</html>
```

<iframe 
    height="250" 
    width="100%" 
    scrolling="no" 
    title="Hello.html" 
    src="Block_1/section_1/lists.html" 
    frameborder="no" 
    loading="lazy" 
    allowtransparency="true" 
    allowfullscreen="true">
</iframe>

### links

Within the `<head>` tag, external files can bel linked. Javascript files are identified by `<script>` tags and CSS files by `<link>` tags.

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Page Title</title>
        <meta charset="UTF-8">
        <title>Home Page</title>
        <script type="text/javascript" src="JS/MyJavaScript.js"></script>
        <link rel="stylesheet" type="text/css" href="CSS/MyCSS.css">
    </head>
    <body>
        <h1>Change Location</h1>
        <button onclick="myFunction();"> Visit W3Schools </button>

    </body>
</html>
```
The onclick attribute has a value which is a single line of javascript which has been loaded to the browser from the linked javascript file.  This function opens a new window with a remote site.

```javascript
function myFunction() {
    window.open("https://www.w3schools.com");
}
```

The css file referenced is the simplest code.  The point here is how to link to the css rather than the css syntax.

```css
body {background-color: coral;}
```

In the browser this appears as:

<iframe 
    height="250" 
    width="100%" 
    scrolling="no" 
    title="Hello.html" 
    src="Block_1/section_1/links.html" 
    frameborder="no" 
    loading="lazy" 
    allowtransparency="true" 
    allowfullscreen="true">
</iframe>