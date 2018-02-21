var pull        = $('#pull'),
    menu        = $('.main-menu > ul');

$(function() {
    $(pull).on('click', function(e) {
        e.preventDefault();
        menu.slideToggle();
    });
});

$(window).resize(function() {
    var w = $(window).width();
    if(w > 420 && menu.is(':hidden')) {
        menu.removeAttr('style');
    }
});