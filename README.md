jQuery.autoValidate
===================
Validates a form and displays error messages

Initialisation
--------------

To get started include the script somewhere in your code. Make shure it is loaded after jQuery sice it's a dependency
```html
<script src="path/to/the/script/jquery.autovalidate.js" type="text/javascript"></script>
```
After that you can call
```js
jQuery("form.autoValidate").autoValidate();
```
to initialize the autoValidation for all forms with the class autoValidate (you can set the name of the class to anything you want obviously). You can pass optional settings with that.
Avaliable settings:
* validationMessageAttribute: *String*. The name of the data-attribute that contains the type of output (We will get to that later on), the default is "data-validation"
* defaultValidationMessageType: *String*. Defines how the error-messages should be displayed if not specified in the forms data-attributes. The default is "container". Accepted values: "alert", "container"
* validationMessageContainerClass: *String*. Defines the class of a general container that will contain the error messages if you choose "container" as the validation type. The default is "validationMessages"
* validationCallbackAttribute: *String*. Defines the data-attribute that defines the name of the default callback function. The default is "data-validation-callback"
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

Preparing the form
------------------

After you initialized the validation for the form (and added the corresponding class to the form element) you need to prepare the input elements to be validated. You simply do that by the corresponding *data-validation* attribute. Keep in mind that certain validation types can throw multiple types of errors (but will only throw one at a time)
Valid values are:
* radio: Only makes sense on radio buttons, checkes if any radio button with that name is checked
* string: Checks if the input is not empty.
* email: 
  * Checks if the input is not empty
  * Checks if the input contains a valid e-mail address
* epost: The same as email, but also throws an error if the email is a epost.de address (you will propably not need this but it is there just in case)
* checkbox: Only makes sense on checkboxes, checks if that checkbox is checked (e.g. for a "i have totally read the TERMS AND CONDITIONS"-checkbox)
* number:
  * Checks if the input is not empty
  * Checks if the input contains a number

All of the empty-checks can be disabled by adding the class "optional" to the input element

Example:
```html
<input data-validation="email" type="text" name="email" value="" />
<input data-validation="string" type="text" name="name" value="" />
<input data-validation="number" type="text" name="age" class="optional" value="" />
```

You can modify certain default settings by adding attributs to the form element:
* You can add noErrorClass to force *settings.addErrorClass=false*
* You can add the data-validation attribute to override *settings.defaultValidationMessageType*
* You can add the data-validation-callback attribute to override *settings.defaultCallbackFunction*

Adding useful error messages
----------------------------

You will propably want to display different error messages for the different kinds of errors and you can do that by adding a container with the class "customErrorContainer" that contains the text. To make the customErrorContainer specific to an input element it requires a "data-for" attribute containing the name of the input element. If you want to display different error messages for each kind of error the validation can throw you can add the "data-errortype" attribute containing the corresponding error type.

Example:
```html
<input data-validation="email" type="text" name="email" value="" />
<div class="customErrorContainer" data-for="email" data-errortype="empty">You need to specify an email address</div> 
<div class="customErrorContainer" data-for="email" data-errortype="invalid">The email address is not valid. Please check your input</div> 
<div class="customErrorContainer" data-for="email">Something is wrong with your email address. Please check your input</div> 
```
You should propably add something like this to your css:
```css
.customErrorContainer{
  display:none;
}
```
The containers will be set to visible by the script automatically if you choose "container" as your validation type. If you choose "alert", their content will be passed to javascript:alert()
These containers can be placed anywhere within the form element but you can choose to group them inside a container with the class set by *validationMessageContainerClass* in the settings.

What happens on submit
----------------------

When you submit the form, e.g. with jQuery().submit(), the form gets validated according to your configuration and data-validation attributes. Input elements without the data-validation attribute will be ignored.
If no error is found the script searches for a callback function that will can be executed. By default it searches for a function called window.submit or whatever you specified in *data-validation-callback* or *settings.defaultCallbackFunction*. If none of these are found it will try to call *settings.callback*. The validation will then return whatever is specified as a return inside the callback function or *true*, if nothing is found. If no callback can be found the validation will simply return *true*.
You can manipulate what happens with the submit by returning the correct value inside your callback:
* return true: If this happens the default form.submit event is called by the browser, with the page change and everything
* return false: The default form.submit event will be bypassed. This requires you to do the submit by yourself, e.g. by doing an ajax call inside the callback.
