/* global $ TweenMax ScrollMagic */

$(function () {
    pageInit();

    $(window).resize(function() {
        resizeHandler();
    });
});

var controller = new ScrollMagic.Controller();
var css = {};
var footer = $('.footer');
var header = $('.header');
var isScrolling = false;
var lastScrollTop = $(window).scrollTop();
var section = $('.section');
var windowHeight = $(window).height();

function pageInit() {
    mobileNavInit();
    scrollNavInit();
    stickyHeaderInit();
    jobDescriptionToggler();
    bindSectionScrollers();
    moveHuntingHeader();
    scrollifySection();
    $.scrollify.disable();
    onWindowScroll();
}

function resizeHandler() {
    mobileNavInit();
    scrollNavInit();
    header.width($(window).width());
    moveHuntingHeader();
}

function scrollifySection() {
    $.scrollify({
        section: '.section',
        sectionName: 'section-name',
        interstitialSection: '.footer, .wanted, .hunting',
        scrollSpeed: 1100,
        updateHash: true,
        touchScroll: true,
        overflowScroll: true
    });
    setTouchAction('auto');
}

function jobDescriptionToggler() {
    $('.job__button').click(function() {
        $('.wanted__text').find('.job-' + this.id).toggleClass('job--open');
        $.scrollify.enable();
        $.scrollify.update();
        $.scrollify.disable();
    });
}

function stickyHeaderInit() {
    var stickyHeader = new ScrollMagic.Scene({duration: 240})
    .setPin('.header', {
        pushFollowers: false,
        spacerClass: 'header__pin'
    })
    .addTo(controller);

    stickyHeader.on('end', function (e) {
        if (e.scrollDirection === 'FORWARD') {
            TweenMax.to(header, 0.4, {opacity: 0, top: '-130px'});
        } else {
            TweenMax.to(header, 0.4, {opacity: 1, top: 0});
        }
    });
}

function setStickyHeaderTween(isVisible) {
    if (!isScrolling) {
        if ($(window).scrollTop() >= section.first().position().top) {
            if (isVisible) {
                css = { opacity: 1, position: 'fixed', top: 0 };
            } else {
                css = { opacity: 1, top: '-130px', position: 'fixed' }
            }
            header.css(css);
        }
    }
}

function onWindowScroll() {
    var didScroll = false;

    $(window).scroll(function() {
        didScroll = true;
    });

    setInterval(function() {
        if (didScroll) {
            didScroll = false;
            scrollHandler();
        }
    }, 300);
}

function scrollHandler() {
    var current = $(this).scrollTop();
    var lastSectionTop = section.last().position().top;
    if (current + windowHeight > lastSectionTop + windowHeight) {
        $.scrollify.disable();
        normalScrolling(current);
    } else if (current < lastScrollTop) {
        setStickyHeaderTween(true);
        handleScrollingUp(current);
    } else if (current > lastScrollTop) {
        setTimeout(function() {
            setStickyHeaderTween(false);
        }, 505);
        handleScrollingDown(current);
    } else {
        $.scrollify.disable();
    }
    lastScrollTop = current;
}

function normalScrolling(current) {
    if (current > lastScrollTop) {
        css = { top: '-130px', position: 'fixed' };
    } else {
        css = { top: 0, position: 'fixed' };
    }
    header.css(css);
    afterScroll();
}

function handleScrollingUp(current) {
    var sections = [];
    section.each(function() {
        var sectionInfo = {
            position: $(this).position().top,
            hash: $(this).attr('data-section-name')
        };
        sections.push(sectionInfo);
    });

    for (var index in sections) {
        if (current <= sections[index].position) {
            window.location.hash = sections[index].hash;
            break;
        }
    }
    $.scrollify.update();
    $.scrollify.disable();
}

function handleScrollingDown(current) {
    if (!isScrolling) {
        var overFlow = $.scrollify.current().height() - windowHeight;
        if (current > $.scrollify.current().position().top + overFlow) {
            isScrolling = true;
            scrollToNext();
        }
    }
}

function scrollToNext() {
    $.scrollify.enable();
    $.scrollify.update();
    $.scrollify.next();
    $.scrollify.disable();
    setTimeout(afterScroll, 1250);
}

function afterScroll() {
    lastScrollTop = $(window).scrollTop();
    setTouchAction('auto');
    isScrolling = false;
}

function setTouchAction(action) {
    footer.css('touch-action', action);
    section.css('touch-action', action);
}

function moveHuntingHeader() {
    var h1 = $('.hunting__text h1');
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
        $.scrollify.enable();
        $.scrollify.update();
        $.scrollify.move($(this).attr('data-href'));
        $.scrollify.disable();
    });
}

function scrollNavInit() {
    $('a[href*=\\#]').on('click', function () {
        header.css({visibility: 'hidden', opacity: 0});
        $.scrollify.enable();
        $.scrollify.move($(this).attr('href'));
        $.scrollify.disable();
        setTimeout(function() {
            setStickyHeaderTween(false);
        }, 1400);
        setTimeout(function() {
            header.css({visibility: 'visible', opacity: 1});
        }, 1650);
    });
}

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
    } else {
        header.removeClass(mobileClass);
    }
}

function showMobileNav(openMobileNav) {
    var openIcon = $('.header__mobile-nav-btn--open');
    var closeIcon = $('.header__mobile-nav-btn--close');
    var navList = $('.header__navigation ul');
    var navOpenClass = 'header--mobile-open';
    if (openMobileNav) {
        header.addClass(navOpenClass);
        openIcon.hide();
        navList.show();
        closeIcon.show();
        header.css('height', '100vh');
        header.on('touchmove', function(e) {
            e.preventDefault();
        });
    } else {
        header.off('touchmove');
        header.removeClass(navOpenClass);
        navList.hide();
        closeIcon.hide();
        openIcon.show();
        header.css('height', 'auto');
    }
}
