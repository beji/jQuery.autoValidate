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
 * Validates a form with validateForm() and displays error Messages
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
 *
 *
 */
(function (global) {
    "use strict";
    var autoValidate = function (jQuery, formValidator) {

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
        define(['jquery', 'formValidator'], autoValidate);
    } else {
        autoValidate(global.jQuery, formValidator);
    }

}(this));