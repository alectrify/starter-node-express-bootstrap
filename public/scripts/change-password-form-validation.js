const changePasswordForm = $('#changePasswordForm');
const changePasswordFormDOM = changePasswordForm.get()[0];
const newPassword1 = $('#newPassword1');
const newPassword2 = $('#newPassword2');

newPassword2.change(function () {
    if (newPassword1.val() !== newPassword2.val()) {
        newPassword1.addClass('is-invalid');
        newPassword2.addClass('is-invalid');
    } else {
        newPassword1.removeClass('is-invalid');
        newPassword2.removeClass('is-invalid');
    }
});

changePasswordForm.change(function () {
    changePasswordForm.removeClass('was-validated');
});

changePasswordForm.submit(function (event) {
    if (!changePasswordFormDOM.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    }

    if (newPassword1.val() !== newPassword2.val()) {
        event.preventDefault();
        event.stopPropagation();
    } else {
        changePasswordForm.addClass('was-validated');
    }
});