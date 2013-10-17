jQuery.autoValidate
===================
jQuery.autoValidate is a library that offers automatic validation (and the displaying of error messagtes too) for form elements through jQuery

Initialisation
--------------

To get started include the script somewhere in your code. Make sure it is loaded after jQuery sice it's a dependency
```html
<script src="path/to/the/script/jquery.autovalidate.js" type="text/javascript"></script>
```
After that you can call
```js
jQuery("form.autoValidate").autoValidate();
```
to initialize the autoValidation for all forms with the class autoValidate (you can set the name of the class to anything you want obviously). You can pass optional settings with that.

Preparing the form
-----------
You need to tell autoValidate what elements are to be validated which way. You can do that by adding a `data-validation` attribute with a fitting value to the element. By default the element will be considered as required, which means that the validation will fail if the element has no value. This can be disabled by setting the class `optional` to the element
If you want to run some script after a successfull autoValidation, you can either define a function called `submit()` or pass the script during the initialization of autoValidate with 
```js
jQuery("form.autoValidate").autoValidate({
  callback : function() {
    // do something
  }  
});
```
The form will be submitted after that. You can prevent this by letting `submit()` return `false`. Note that this requires you to handle the submitting yourself, e.g. through ajax inside the submit function

Adding useful error messages
----------------------------
You can (and should) set the error messages displayed by adding a container with the class `customErrorContainer` and the `data-for` attribute containing the name of the corresponding element. The text inside this container will then be used for the error message. If a validation type offers multiple error types you can specify a message for each type like that:
```html
<input data-validation="email" type="text" name="email" value="" />
<div class="customErrorContainer" data-for="email" data-errortype="empty">You need to specify an email address</div> 
<div class="customErrorContainer" data-for="email" data-errortype="invalid">The email address is not valid. Please check your input</div> 
<div class="customErrorContainer" data-for="email">Something is wrong with your email address. Please check your input</div> 
```
You can group all customErrorContainers inside a container with the class `validationMessages` or place them freely inside the form element. Note that the validationMessages container needs to be inside the form element as well.
You should propably add something like this to your css:
```css
.customErrorContainer{
  display:none;
}
```

Available validation types
----------
All currently available validation types can be accessed in the formValidator object.
Currently available are:
* radio: Only makes sense on radio buttons, checkes if any radio button with that name is checked
* string: Checks if the input is not empty.
* email: 
  * Checks if the input is not empty. Errorcode: "empty"
  * Checks if the input contains a valid e-mail address. Errorcode: "invalid"
* epost: The same as email, but also throws an error if the email is a epost.de address (you will propably not need this but it is there just in case). Errorcode: "epost"
* checkbox: Only makes sense on checkboxes, checks if that checkbox is checked (e.g. for a "i have totally read the TERMS AND CONDITIONS"-checkbox)
* number:
  * Checks if the input is not empty. Errorcode: "empty"
  * Checks if the input contains a number. Errorcode: "not a number"

You can expand this by calling 
```js
formValidator.addValidation(<Name of the validation>, function(item) {
  // item is a jQuery object of the form element that is validated
  
  if(item.failsTheCheck()){
    this.addInvalidElement(item.attr("name"), <what is validated>, <what is the error>);
    return false;
  }
  return true; //Everything went well
  
});
```
You can find examples of this in the source code 

Default behaviour
------------
AutoValidate will override the submit event of the form it is initialized on. When the form is submitted all elements with a `data-validation` attribute will be validated accordingly. If an error is found a class `error` will be applied to the element and its label (if that exists). After that it will show the according customErrorContainers and finish without submitting the form.
If the form passes the validation the script will execute the submit function, if it exists, and then either submit the form or not, depending if the submit function returns true or false.


Configuration through attributes
-------------
You can add certain attributes and classes to the `<form>` element to change the default behaviour.
* Adding the class `noErrorClass` will stop the script from appending `error`-classes to all invalid elements
* Adding the `data-validation` attribute will override the display method of the error messages. This can be set to either `alert`, which will display the error message inside a `alert()` instead of the html. Note that this will only display one error message at a time to prevent spammy behaviour. The default is `container`
* Adding the `data-validation-callback` attribute will override the name of the submit function to be executed after the validation. Note that the name needs to be passed without the (), e.g. `data-validation-callback="myAwesomeSubmitFunction"`. The default is `submit`

Configuration through JavaScript
------------
You can pass a few options during the initialization for further customization.
Available setting options are:
* validationMessageAttribute: *String*. The name of the data-attribute that defines the type of output, the default is "data-validation"
* defaultValidationMessageType: *String*. Defines how the error-messages should be displayed if not specified in the forms data-attribute attribute. The default is "container". Accepted values: "alert", "container"
* validationMessageContainerClass: *String*. Defines the class of a general container that will contain the error messages if you choose "container" as the validation type. The default is "validationMessages"
* validationCallbackAttribute: *String*. Defines the attribute that defines the name of the default callback function. The default is "data-validation-callback"
* defaultCallbackFunction: *String*. Defines the name of the default callback function. The default is "submit"
* callback: *function*. If you want to pass the callback function directly to the initialization, you can do so here. The default is *null*
* addErrorClass: *boolean*. Defines if a class "error" should be added to all input elements (and their label) that generated an error. The default is *true* (You will propably want to style that with css)
* generalErrorMessage: *String*. A default message that is displayed if no other error message can be found. The default is "Please correct your input" (Yeah, you should propably change that...)

Example:
```js
jQuery("form.autoValidate").autoValidate({
  addErrorClass: false,
  defaultCallbackFunction: "customSubmit",
  generalErrorMessage: "O NOEZ I HAS AN ERROR"
});
```
