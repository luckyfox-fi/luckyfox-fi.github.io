/* global $  */

$(function () {
    pageInit();

    $(window).resize(function() {
        resizeHandler();
    });
});

var css = {};
var footer = $('.footer');
var header = $('.header');
var headerIsDown = false;
var headerScrolling;
var isScrolling = false;
var lastScrollTop = $(window).scrollTop();
var section = $('.section');
var windowHeight = $(window).height();
var firstSectionBottom = section.first().position().top + windowHeight * 0.8;

function pageInit() {
    mobileNavInit();
    scrollNavInit();
    jobDescriptionToggler();
    bindSectionScrollers();
    scrollifySection();
    $.scrollify.disable();
    onWindowScroll();
    setStickyHeader();
    moveHuntingHeader();
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

function setStickyHeader() {
    setInterval(function() {
        if (!isScrolling) {
            if ($(window).scrollTop() < firstSectionBottom || headerIsDown) {
                css = { top: 0 };
            } else {
                css = { top: '-130px' };
            }
        } else if (isScrolling && !headerIsDown) {
            css = { top: '-130px' };
        }
        header.css(css);
    }, 400);
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
    }, 400);
}

function scrollHandler() {
    var current = $(this).scrollTop();
    var lastSectionTop = section.last().position().top;
    headerIsDown = current <= lastScrollTop;

    if (headerScrolling) {
        headerIsDown = !headerIsDown;

        return;
    } else if (current + windowHeight > lastSectionTop + windowHeight) {
        $.scrollify.disable();
    } else if (current < lastScrollTop) {
        handleScrollingUp(current);
    } else if (current > lastScrollTop) {
        handleScrollingDown(current);
    } else {
        $.scrollify.disable();
    }
    lastScrollTop = current;
    setTimeout(afterScroll, 1250);
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
            $.scrollify.enable();
            $.scrollify.update();
            $.scrollify.next();
            $.scrollify.disable();
        }
    }
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
        headerScrolling = true;
        $.scrollify.enable();
        $.scrollify.move($(this).attr('href'));
        $.scrollify.disable();
        setTimeout(function() {
            headerIsDown = false;
            headerScrolling = false;
        }, 1600);
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
        header.css({height: '100vh', background: '#040404'});
        header.on('touchmove', function(e) {
            e.preventDefault();
        });
    } else {
        header.off('touchmove');
        header.removeClass(navOpenClass);
        navList.hide();
        closeIcon.hide();
        openIcon.show();
        header.css({height: 'auto', background: 'transparent'});
    }
}
