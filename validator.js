function Validator(options) {
    const formElement = document.querySelector(options.form);

    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    let selectorRules = {};

    function validate(inputElement, rule) {
        const errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        const labelElement = getParent(inputElement, options.formGroupSelector).querySelector(options.label);

        let errorMessage;
        const rules = selectorRules[rule.selector];

        for (let i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add("active");
            inputElement.classList.add("invalid");
            inputElement.classList.remove("valid");

            if (inputElement.value.trim().length > 0) labelElement.classList.add("active");
            else labelElement.classList.remove("active");
        } else {
            errorElement.classList.remove("active");
            inputElement.classList.remove("invalid");
            inputElement.classList.add("valid");
            labelElement.classList.add("active");
        }
        return !errorMessage;
    }

    if (formElement) {
        options.rules.forEach((rule) => {
            const inputElement = formElement.querySelector(rule.selector);

            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }
            // selectorRules[rule.selector] = [selectorRules[rule.selector],rule.test];

            if (inputElement) {
                inputElement.addEventListener("blur", () => {
                    validate(inputElement, rule);
                });

                inputElement.addEventListener("input", () => {
                    const errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);

                    errorElement.classList.remove("active");
                    inputElement.classList.remove("invalid");


                    if (inputElement.id === "password") {
                        const confirmPasswordElement = formElement.querySelector("#confirm-password");
                        const errorElement = getParent(confirmPasswordElement, options.formGroupSelector).querySelector(options.errorSelector);
                        errorElement.classList.remove("active");
                        confirmPasswordElement.classList.remove("invalid");
                    }
                });
            }

        });

        formElement.addEventListener("submit", (e) => {
            e.preventDefault();
            let isFormValid = true;

            options.rules.forEach((rule) => {
                const inputElement = formElement.querySelector(rule.selector);
                const isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            })

            if (isFormValid) {
                if (typeof options.onSubmit === "function") {
                    const enableInput = formElement.querySelectorAll("[name]:not(disabled");

                    const formValue = [...enableInput].reduce((values, input) => {
                        values[input.name] = input.value
                        return values;
                    }, {});

                    options.onSubmit(formValue)
                } else {
                    formElement.submit();
                }
            }
        });

    }
}

Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message || "This field is Required";
        }
    };
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || "Please provide a valid Email";
        }
    };
}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Password requires minimum ${min} characters`;
        }
    };
}

Validator.maxLength = function (selector, max, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length <= max ? undefined : message || `Password requires maximum ${max} characters`;
        }
    };
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || "Password did not match";
        }
    };
}

Validator.isPhoneNumber = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            const regex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
            return regex.test(value) ? undefined : message || "Please enter valid number";
        }
    };
}