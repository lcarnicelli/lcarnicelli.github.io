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
			$('html, body').animate({
		        scrollTop: $(element).offset().top
		    }, 800);

		    $('#menu.opened').removeClass('opened').hide();
		}
	});
})(jQuery);
