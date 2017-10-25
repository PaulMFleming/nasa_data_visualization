// script to control the modal information window
// that pops up on page load

$(document).ready(function(){
    setTimeout(function(){
    if(!Cookies.get('modalShown')) {
        $("#myModal").modal('show');
      Cookies.set('modalShown', true);
    } else {
        alert('Your modal won\'t show again as it\'s shown before.');
    }

},3000);
});
