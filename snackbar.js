function openSnackbar() {
  var snackbar = document.getElementById("snackbar");
  snackbar.classList.add('show');
  timeoutId = setTimeout(function() {
    closeSnackbar();
  }, 2000)
}
function closeSnackbar() {
  snackbar.classList.remove('show');
}