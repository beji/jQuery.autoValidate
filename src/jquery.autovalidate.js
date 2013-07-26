/*!
 * jQuery.autoValidate
 * https://github.com/beji/jQuery.autoValidate
 *
 * Requires jQuery
 * http://jquery.com/
 *
 * Copyright 2013 Bjoern Erlwein
 * Released under the MIT license
 *
 */
(function (global) {
    "use strict";
    var autoValidate = function (jQuery) {

        /*
        The FormValidator can be used to validate a form without the error handling included within jQuery.fn.autoValidate. 
        The object formValidator is created and filled with some default validation options by default. You can add your own custom validations by usign the addValidation function.
        See the code below for examples on that. You can also execute a specific validation on an object by calling the custom functions created by addValidation.
        e.g. adding a validation called "fullName" would create a function called validateFullName (notice that the first letter of the name is automatically capitalized).
        If that doesn't suit you you can access the current validations through formValidator.validations object


        Example:
        ------------
        <form id="newsletterraffleform" name="newsletter" action="http://submit.me" 
            method="post" onSubmit="return check();">
            <input id="EMAIL" data-validation="epost" type="text" name="EMAIL" value="">
        </form>
        <script>
            function check() {
                var currentForm = document.newsletter;
                var inlineErrorMessageObj = jQuery("#inlineErrorMessages");
                var errorJson = formValidator.validate(jQuery("#newsletterraffleform"));
                
                if (typeof errorJson.EMAIL !== "undefined") {
                    if (errorJson.EMAIL.error === "epost") {
                        inlineErrorMessageObj.text(
                            localizedStringsForJavaScript["formcheck_validate_email_epost"] 
            
                        ).removeClass("skipElement");
                    }
                    else{
                        inlineErrorMessageObj.text(
                            localizedStringsForJavaScript["formcheck_validate_email"] 
                        ).removeClass("skipElement");
                    }
                    currentForm.EMAIL.focus();
                    currentForm.EMAIL.select();
                    return false;            
                }
                inlineErrorMessageObj.addClass("skipElement");    
                return true;
            }
        </script>
        
        Returns:
        -------------
        The JSON will be built like this:
            {"<Name of the element>":{"type":"<the type of check performed>","error":"<what went wrong>"},{...},...
        Example:
            {"EMAIL":{"type":"input_email","error":"empty"},"agb_cb":{"type":"checkbox","error":"unchecked"}}
        
        
        Types of checks and what can be returned:
        --------------
        data-validation="radio":
            Used for type="radio" inputs, checks if something was selected at all
            returns: 
                type: radio
                error: unchecked
        
        data-validation="string":
            Checks if the input contains any value
            returns:
                type: input_string
                error: empty
                
        data-validation="email":
            Checks if the content is a valid email-address
            returns:
                type: input_email
                error: 
                    empty (if the input is empty)
                    invalid (it the input contains a text that is not a valid email address)
        
        data-validation="epost":
            Same as email, but also returns an error if the email is an epost-address
            returns:
                type: input_email
                error:
                    empty
                    invalid
                    epost
        
        data-validation="checkbox":
            Used for type="checkbox", checks if the checkbox is checked
            returns:
                type: checkbox
                returns: unchecked
                
        data-validation="number":
            Checks if the input contains a numeric value
            returns:
                type: input_number
                error: 
                    empty
                    "not a number"
        */
        var FormValidator = function () {
            this.returnJson = {};
            this.validations = {};
        }, formValidator;

        FormValidator.prototype.addValidation = function(name, validationCode) {
            if (typeof validationCode === "function") {
                this.validations[name] = validationCode;
            }
            name = name.charAt(0).toUpperCase() + name.slice(1);
            this["validate" + name] = validationCode;
        };

        FormValidator.prototype.addInvalidElement = function(name, checktype, errortype) {
            this.returnJson[name] = {"type" : checktype, "error" : errortype};
        };

        FormValidator.prototype.isValidation = function(name) {
            name = name.charAt(0).toUpperCase() + name.slice(1);
            return (typeof this["validate" + name] === "function");
        };

        FormValidator.prototype.validate = function(formObject) {
            var validationLoop, _this;
            this.returnJson = {};
            _this = this;
            validationLoop = function(loopObject) {
                var validationType;

                loopObject.children().each(function(index, element) {
                    element = jQuery(element);

                    if (element.children().length > 0) {
                        validationLoop(element);
                    }

                    validationType = element.attr("data-validation");

                    if (validationType !== undefined && _this.isValidation(validationType)) {
                        validationType = validationType.charAt(0).toUpperCase() + validationType.slice(1);
                        _this["validate" + validationType](element);
                    }
                });
            };

            validationLoop(formObject);

            return this.returnJson;
        };

        formValidator = new FormValidator();

        //item is a jQuery object, e.g. jQuery(".testobject")
        formValidator.addValidation("radio", function(item) {
            var name = item.attr("name");
            if (!(jQuery("input:radio[name='" + name + "']").is(":checked"))) {
                this.addInvalidElement(name, "radio", "unchecked");
                return false;
            }
            return true;
        });

        formValidator.addValidation("string", function(item) {
            if (item.val().trim() === "") {
                this.addInvalidElement(item.attr("name"), "input_string", "empty");
                return false;
            }
            return true;
        });

        formValidator.addValidation("email", function(item) {
            var reg = /^[_a-zA-Z0-9\-]+(\.[_a-zA-Z0-9\-]+)*@[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]+)*(\.([a-zA-Z]){2,4})$/;
            if (item.val().trim() === "" && !item.hasClass("optional")) {
                this.addInvalidElement(item.attr("name"), "input_email", "empty");
                return false;
            }
            if (!reg.exec(item.val()) && item.val().trim() !== "") {
                this.addInvalidElement(item.attr("name"), "input_email", "invalid");
                return false;
            }
            return true;
        });

        formValidator.addValidation("epost", function(item) {
            var epostReg = /@epost\.de$/;
            this.validateEmail(item);
            if (epostReg.exec(item.val().toLowerCase())) {
                this.addInvalidElement(item.attr("name"), "input_email", "epost");
                return false;
            }
            return true;
        });

        formValidator.addValidation("checkbox", function(item) {
            if (!(item.is(':checked'))) {
                this.addInvalidElement(item.attr("name"), "checkbox", "unchecked");
                return false;
            }
            return true;
        });

        formValidator.addValidation("number", function(item) {
            if (item.val().trim() === "" && !item.hasClass("optional")) {
                this.addInvalidElement(item.attr("name"), "input_number", "empty");
                return false;
            }
            if (isNaN(item.val()) && item.val().trim() !== "") {
                this.addInvalidElement(item.attr("name"), "input_number", "not a number");
                return false;
            }
            return true;
        });

        global.formValidator = formValidator;

        /**
         * Kept for compatibility
         *
         * @deprecated  use formValidator.validate(formObject) instead
         */
        global.validateForm = function(formObject){
            return formValidator.validate(formObject);
        }

        /* Validates a form with validateForm() and displays error Messages
         * The inputs require the correct data-validation attributes to be validated, see validateForm()
         * 
         * Example / default:
         * ------------------
         * <form name="recommend" method="post" class="validateForm" action="http://submit.me">
         * Throws settings.generalErrorMessage in an alert(), adds error class to the inputs, calls submit() after validation if defined
         * 
         * Example / no error classes:
         * ------------------
         * <form name="recommend" method="post" class="validateForm noErrorClass" action="http://submit.me">
         * OR jQuery(".formDesigner").formDesigner({addErrorClass : false});
         * 
         * Example / display error in container:
         * ------------------
         * <form name="recommend" method="post" class="validateForm" data-validation="container" action="http://submit.me">
         * 
         * Example / custom callback:
         * ------------------
         * <form name="recommend" method="post" class="validateForm" data-validation-callback="customFunction" action="http://submit.me">
         * OR jQuery(".formDesigner").formDesigner({ callback : function() {...} });
         * 
         * Example / one container per element:
         * ------------------
         * <form name="recommend" method="post" class="validateForm" data-validation="container" action="http://submit.me">
         * <input data-validation="epost" type="text" name="EMAIL" value="">
         * <div class="customErrorContainer" data-for="EMAIL">I am a special error message</div> 
         *  */
        jQuery.fn.autoValidate = function(settings) {
            var autoValidateForm;

            settings = jQuery.extend({
                validationMessageAttribute : "data-validation",
                defaultValidationMessageType : "container",
                validationMessageContainerClass : "validationMessages",
                validationCallbackAttribute : "data-validation-callback",
                defaultCallbackFunction : "submit",
                callback : null,
                addErrorClass : true,
                generalErrorMessage : "Please correct your input"
            }, settings || {});

            autoValidateForm = function() {
                var formObject, errorJson, validationMessageType, messageContainer, errorText, key, input, errorType, callBack, callBackFunction, returnVal;

                formObject = jQuery(this);
                if (formObject.hasClass("noErrorClass")) {
                    settings.addErrorClass = false;
                }
                errorJson = formValidator.validate(formObject);


                validationMessageType = formObject.attr(settings.validationMessageAttribute) || settings.defaultValidationMessageType;
                messageContainer = formObject.find("." + settings.validationMessageContainerClass);

                if (settings.addErrorClass) {
                    jQuery(".validateForm .error, .autoValidate .error").removeClass("error");
                }

                if (validationMessageType === "container") {
                    if (messageContainer.length !== 0) {
                        messageContainer.hide();
                    }
                    formObject.find(".customErrorContainer").hide();
                }

                errorText = settings.generalErrorMessage;

                if (!jQuery.isEmptyObject(errorJson)) {
                    for (key in errorJson) {
                        if (errorJson.hasOwnProperty(key)) {
                            if (settings.addErrorClass) {
                                input = jQuery("[name='" + key + "']");
                                input.addClass("error");
                                jQuery("label[for='" + input.attr("id") + "']").addClass("error");
                            }

                            /* Checks if there is a container with a custom errormessage for the input
                             * Containers for the specific errorType have priority over the more general container for the input */
                            if (validationMessageType === "container") {
                                errorType = errorJson[key].error;
                                if (formObject.find(".customErrorContainer[data-for='" + key + "'][data-errortype='" + errorType + "']").length > 0) {
                                    formObject.find(".customErrorContainer[data-for='" + key + "'][data-errortype='" + errorType + "']").show();
                                } else if (formObject.find(".customErrorContainer[data-for='" + key + "']").not("[data-errortype]").length > 0) {
                                    formObject.find(".customErrorContainer[data-for='" + key + "']").not("[data-errortype]").show();
                                }
                            } else if (validationMessageType === "alert") {
                                errorType = errorJson[key].error;
                                if (formObject.find(".customErrorContainer[data-for='" + key + "'][data-errortype='" + errorType + "']").length > 0) {
                                    errorText = formObject.find(".customErrorContainer[data-for='" + key + "'][data-errortype='" + errorType + "']").text();
                                } else if (formObject.find(".customErrorContainer[data-for='" + key + "']").not("[data-errortype]").length > 0) {
                                    errorText = formObject.find(".customErrorContainer[data-for='" + key + "']").not("[data-errortype]").text();
                                }
                                if (errorText !== settings.generalErrorMessage) {
                                    break;
                                }
                            }
                        }
                    }
                    if (validationMessageType === "alert") {
                        alert(errorText);
                    } else if (validationMessageType === "container") {
                        if (messageContainer.length === 0) {
                            messageContainer.text(settings.generalErrorMessage);
                        }
                        messageContainer.show();
                    }
                    return false;
                }

                callBack = formObject.attr(settings.validationCallbackAttribute) || settings.defaultCallbackFunction;

                /* Is there a valid callback function? */
                callBackFunction = settings.callback || global[callBack];
                if (typeof callBackFunction === "function") {
                    /* By using the return of the callback the form can use the standard submit or prevent it simply by returning true or false */
                    returnVal = callBackFunction();
                    return (returnVal !== null && returnVal !== undefined) ? returnVal : true;
                }
                return true;

            };

            /* Unbind the submit event in case we want to override the settings by recalling the function */
            this.unbind("submit");

            this.bind("submit", autoValidateForm);

            /* Maintain chainability of jQuery by returning the object */
            return this;
        };
    };

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], autoValidate);
    } else {
        autoValidate(global.jQuery);
    }

}(this));