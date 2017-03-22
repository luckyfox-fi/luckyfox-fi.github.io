$(function () {
    pageInit();

    $(window).resize(function() {
        resizeHandler();
    });
});

var controller = new ScrollMagic.Controller();
var footer = $('.footer');
var header = $('.header');
var section = $('.section');

function pageInit() {
    mobileNavInit();
    scrollNavInit();
    stickyHeaderInit();
    jobDescriptionToggler();
    bindSectionScrollers();
    moveHuntingHeader();
    scrollifySection();
}

function resizeHandler() {
    mobileNavInit();
    scrollNavInit();
    header.width($(window).width());
    moveHuntingHeader();
}

function scrollifySection() {
    if ($(window).width() > 320) {
        $.scrollify({
            interstitialSection : ".footer, .hungry",
            section : ".section",
            touchScroll: true,
            updateHash : false
        });
    } else {
        setTouchAction('auto');
    }
}

function jobDescriptionToggler() {
    $(".job__button").click(function() {
        $(".wanted__text").find(".job-" + this.id).toggleClass("job--open");
        if ($(window).height() < 1200) {
            $.scrollify.update();
        }
    });
}

function stickyHeaderInit() {
    var stickyHeader = new ScrollMagic.Scene({duration: 0})
        .setPin(".header", {
            pushFollowers: false,
            spacerClass: "header__pin"
        })
        .addTo(controller);

    stickyHeader.on('end', function (event) {
        if (event.scrollDirection === 'FORWARD') {
            TweenMax.to(header, 0.2, {opacity: 0});
        }
        else {
            TweenMax.to(header, 0.4, {opacity: 1});
        }
    });

    setStickyHeaderTween = function(top, opacity) {
        TweenMax.to(header, 0.2, { css: { top: top, opacity: opacity } } );
    }

    var scrollTimeout;
    var lastScrollTop = 0;
    var windowHeight = $(window).height();

    $(window).scroll(function () {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
            scrollTimeout = null;
        }
        scrollTimeout = setTimeout(scrollHandler, 150);
    });

    scrollHandler = function() {
        var scrollTop = $(this).scrollTop();
        if ($(window).width() >= 375) {
            handleScrollifyScrolling(lastScrollTop, scrollTop);
        } else {
            handleNormalScrolling(lastScrollTop, scrollTop);
        }
        lastScrollTop = scrollTop;
    }

    handleNormalScrolling = function(lastScrollTop, scrollTop) {
        stickyHeaderOnScroll(scrollTop, lastScrollTop);
    }

    handleScrollifyScrolling = function(lastScrollTop, scrollTop) {
        if (scrollTop === 0 || scrollTop >= lastScrollTop) {
                if ($.scrollify.isDisabled()) { $.scrollify.enable(); }
                setTouchAction('none');
        } else {
            $.scrollify.disable();
            setTouchAction('auto');
        }
        stickyHeaderOnScroll(scrollTop, windowHeight);
    }

    stickyHeaderOnScroll = function(scrollTop, point) {
        if ($.scrollify.isDisabled() || (scrollTop < point)) {
            setStickyHeaderTween(0, 1);
        } else {
            setStickyHeaderTween('-130px', 0);
        }
    }
}

function setTouchAction(action) {
    footer.css('touch-action', action);
    section.css('touch-action', action);
}

function moveHuntingHeader() {
    h1 = $('.hunting__text h1');
    var img = $('.hunting__image img');
    var h1Height = img.height() / 3 * 2;
    if ($(window).width() < 992) {
        h1.css('top', -h1Height);
    } else {
        h1.css('top', 0);
    }
}

function bindSectionScrollers() {
    $('.scroll__button').on('click', function() {
        if ($(window).width() > 320 && !($.scrollify.isDisabled())) {
            $.scrollify.next();
        } else {
            var id = $(this).data('href');
            controller.scrollTo(id);
        }
    });
}

function scrollToId(id) {
    controller.scrollTo(id);

    // if supported by the browser we can even update the URL.
    if (window.history && window.history.pushState) {
        history.pushState("", document.title, id);
    }
}

function scrollNavInit() {
     // change behaviour of controller to animate scroll instead of jump
     controller.scrollTo(function (newpos) {
         TweenMax.to(window, 0.5, {scrollTo: {y: newpos}});
     });

     //  bind scroll to anchor links
     $('a[href*=\\#]').on('click', function (e) {
         var id = $(this).attr("href");
         id = id.startsWith("/") ? id.substr(1) : id;
         if ($(id).length > 0) {
             e.preventDefault();
             scrollToId(id);
         }
     });
}

/**
 * Mobile navigation
 */
function mobileNavInit() {
    var mobileClass = 'header--mobile';
    if (window.matchMedia('(max-width: 767px)').matches) {
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
        header.css( 'height', '100vh' );
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
        header.css( 'height', 'auto' );
    }
}
