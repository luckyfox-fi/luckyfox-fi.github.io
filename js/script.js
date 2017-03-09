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
    moveHuntingHeader();
    floatingButton();
}

function resizeHandler() {
    mobileNavInit();
    scrollNavInit();
    $('.header').width($(window).width());
    moveHuntingHeader();
}

function jobDescriptionToggler() {
    $(".job__button").click(function() {
        $(".wanted__text").find(".job-" + this.id).toggleClass("job--open");
    });
}

function stickyHeaderInit() {
    var stickyHeader = new ScrollMagic.Scene({duration: 240})
        .setPin(".header", {
            pushFollowers: false,
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

function moveHuntingHeader() {
    var img = $('.hunting__image').children('img');
    var h1Height = img.height() / 3 * 2;
    if ($(window).width() < 1500) {
        $('.hunting__text').children('h1').css('top', -h1Height);
        img.css('left', 0);
    } else if ($(window).width() < 1700) {
        $('.hunting__text').children('h1').css('top', 0);
        var w = ( ($('.hunting').width() ) - ($('.hunting__image').width()));
        w = '-' + (w / 2) + 'px';
        img.css('left', w);
    } else {
        img.css('left', 0);
    }
}

function bindSectionScrollers() {
    $('.scroll__button').on('click touch', function() {
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

function floatingButton() {
    $(window).scroll(function() {
        $('.wanted .scroll__button').hide();
        $('.hunting .scroll__button').hide();
        var scrolling = $(window).scrollTop() + $(window).height();
        var $wantedSection = $('.wanted');
        var $huntingSection = $('.hunting');
        var wantedBottom = $wantedSection.position().top + $wantedSection.outerHeight(true);
        var huntingBottom =  $huntingSection.position().top + $huntingSection.outerHeight(true);

        if (scrolling >= (wantedBottom - ($wantedSection.height() / 2))) {
            $('.wanted .scroll__button').show();
            if (scrolling >= wantedBottom ) { $('.wanted .scroll__button').hide(); }
        }
       if (scrolling >= (huntingBottom - ($huntingSection.height() / 4))) {
            $('.hunting .scroll__button').show();
            if (scrolling >= huntingBottom ) { $('.hunting .scroll__button').hide(); }
        }
    });
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
