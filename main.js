Validator({
    form: "#sign-up",
    errorSelector: ".warning",
    formGroupSelector: ".input-container",
    label: ".label",
    rules: [
        Validator.isRequired("#first-name", "This field is Required"),
        Validator.isRequired("#last-name",),
        Validator.isRequired("#email"),
        Validator.isRequired("#phone"),
        Validator.isRequired("#password"),
        Validator.isRequired("#confirm-password"),

        Validator.isPhoneNumber("#phone"),
        Validator.isEmail("#email", "Please provide a valid Email"),
        Validator.minLength("#password", 8),
        Validator.maxLength("#password", 32),
        Validator.isConfirmed("#confirm-password", () => {
            return document.getElementById("password").value;
        })
    ],
    onSubmit: function (data) {
        // Call API
        console.log(data);
    }
});