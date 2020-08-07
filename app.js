// Hide sections
$("#movie").hide();

setTimeout(function () {
  $(document).ready(function () {
    // Show section
    $("#movie").fadeIn();

    // hide preloader
    $(".loader").fadeOut();
  });
}, 1000);
