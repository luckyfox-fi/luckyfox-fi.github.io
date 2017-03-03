$(function () {
    pageInit();

    $(window).resize(function() {
        resizeHandler();
    });
});

var controller = new ScrollMagic.Controller();

function pageInit() {
    mobileNavInit();
    scrollNavInit();
    stickyHeaderInit();
    jobDescriptionToggler();
    bindSectionScrollers();
}

function resizeHandler() {
    mobileNavInit();
    scrollNavInit();
}

function jobDescriptionToggler() {
    $(".job__button").click(function() {
        $(".wanted__text").find(".job-" + this.id).toggleClass("job--open");
    });
}

function stickyHeaderInit() {
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
}

function bindSectionScrollers() {
    $('.scroll__button').click(function() {
        var id = $(this).data('href');
        controller.scrollTo(id);
    });
}

function scrollToId(id) {
    controller.scrollTo(id);

    // if supported by the browser we can even update the URL.
    if (window.history && window.history.pushState) {
        history.pushState("", document.title, id);
    }
}


/**
 * Scroll based navigation on bigger screen sizes
 */
function scrollNavInit() {
    if (!window.matchMedia('(max-width: 768px)').matches) {
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
                scrollToId(id);
            }
        });
    }
}


/**
 * Mobile navigation
 */
function mobileNavInit() {
    var header = $('.header');
    var mobileClass = 'header--mobile';
    if (window.matchMedia('(max-width: 768px)').matches) {
        header.addClass(mobileClass);

        $('.header__mobile-nav-btn--open').click(function() {
            showMobileNav(true);
        });

        $('.header__mobile-nav-btn--close').click(function() {
            showMobileNav(false);
        });

        $('.header__navigation a').click(function() {
           showMobileNav(false);
        });
    }
    else {
        header.removeClass(mobileClass);
    }
}

function showMobileNav(open) {
    var header = $('.header');
    var openIcon = $('.header__mobile-nav-btn--open');
    var closeIcon = $('.header__mobile-nav-btn--close');
    var navList = $('.header__navigation ul');
    var navOpenClass = 'header--mobile-open';
    if (open) {
        console.log("open");
        header.addClass(navOpenClass);
        openIcon.hide();
        navList.show();
        closeIcon.show();

        header.on('touchmove', function(event) {
            event.preventDefault();
        });
    } else {
        console.log("close");
        header.off('touchmove');
        header.removeClass(navOpenClass);
        navList.hide();
        closeIcon.hide();
        openIcon.show();
    }
}
