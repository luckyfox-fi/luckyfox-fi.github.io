// init controller
var controller = new ScrollMagic.Controller();

$(function () {
    if ($(window).width() >= 767) {
        // change behaviour of controller to animate scroll instead of jump
        controller.scrollTo(function (newpos) {
            TweenMax.to(window, 0.5, {scrollTo: {y: newpos}});
        });

        //  bind scroll to anchor links
        $('a[href*=\\#]').click(function (e) {
            var id = $(this).attr("href");
            id = id.startsWith("/") ? id.substr(1) : id;
            if ($(id).length > 0) {
                e.preventDefault();

                // trigger scroll
                controller.scrollTo(id);

                // if supported by the browser we can even update the URL.
                if (window.history && window.history.pushState) {
                    history.pushState("", document.title, id);
                }
            }
        });
    }

    var stickyHeader = new ScrollMagic.Scene({duration: 240})
        .setPin(".header", {
            pushFollowers: true,
            spacerClass: "header__pin"
        })
        .addTo(controller);

    stickyHeader.on('end', function (event) {
        var header = $('.header');
        if (event.scrollDirection === 'FORWARD') {
            TweenMax.to(header, 0.2, {opacity: 0});
        }
        else {
            TweenMax.to(header, 0.4, {opacity: 1});
        }
    });
});

