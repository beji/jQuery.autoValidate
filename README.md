jQuery.autoValidate
===================
Validates a form with validateForm() and displays error Messages

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
* validationMessageAttribute: String. The name of the data-attribute that contains the type of output (We will get to that later on), the default is "data-validation"
* defaultValidationMessageType: String. Defines how the error-messages should be displayed if not specified in the forms data-attributes. The default is "alert"
* validationMessageContainerClass: String.

```js
jQuery("form.autoValidate").autoValidate();
```