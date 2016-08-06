(function($) {
    // Menu
    $('#menu-icon').click(function(e) {
        e.preventDefault();
        
        $('#menu').slideToggle(200).toggleClass('opened');
    });

    // ScrollTo
    $('[data-bind="scroll-to"]').click(function(e) {
        e.preventDefault();
        
        var element = $(this).data('to');

        if (element) {
            var bodyPaddingTop = parseInt($('body').css('padding-top'));

            $('html, body').animate({
                scrollTop: $(element).offset().top - bodyPaddingTop
            }, 800);

            $('#menu.opened').removeClass('opened').hide();
        }
    });
})(jQuery);
