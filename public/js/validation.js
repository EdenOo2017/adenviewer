$(function () {
  $("form[name='registration']").validate({
    rules: {
      user_username: "required",
      user_useremail: {
        required: true,
        mail: true
      },
      user_password: {
        required: true,
        minlength: 5
      }
    },

    messages: {
      name: "Please enter your name",
      password: {
        required: "Please provide a password",
        // minlength: "Your password must be at least 5 characters long"
      }
    },
    submitHandler: function (form) {
      form.submit();
    }
  });
});

$(function () {
  $("form[name='login']").validate({
    rules: {
      user_username: "required",

      user_password: {
        required: true,
        minlength: 5
      }
    },

    messages: {
      name: "Please enter your name",
      password: {
        required: "Please provide a password",
        // minlength: "Your password must be at least 5 characters long"
      }
    },
    submitHandler: function (form) {
      form.submit();
    }
  });
});

var dialogBox = $('#dialog');
dialogBox.on('click', 'a.user-actions', function () {
  dialogBox.toggleClass('flip');
});

jQuery.validator.addMethod('mail', function (value, element) {
  return this.optional(element) || /^[a-z0-9](\.?[a-z0-9]){5,}@tiongseng\.com\.sg$/i.test(value);
}, "Not a valid tiongseng email address");
