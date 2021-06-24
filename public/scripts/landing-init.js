// If the page is smaller than the viewport, fix the footer to the bottom.
if ($('body').height() < $(window).height()) {
    $('footer').addClass('fixed-bottom');
}