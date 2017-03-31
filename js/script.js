/* global $  */

$(function () {
    pageInit();

    $(window).resize(function() {
        resizeHandler();
    });
});

var buttonHandler = false;
var css = {};
var footer = $('.footer');
var header = $('.header');
var headerIsDown = false;
var headerOnClick;
var isScrolling = false;
var lastScrollTop = $(window).scrollTop();
var section = $('.section');
var windowHeight = $(window).height();
var firstSectionBottom = section.first().position().top + windowHeight;
var didScroll = false;

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
        interstitialSection: '.footer, .hungry, .wanted, .hunting',
        scrollSpeed: 1100,
        updateHash: true,
        touchScroll: true,
        overflowScroll: true
    });
    setTouchAction('auto');
}

function jobDescriptionToggler() {
    $('.job__button').click(function() {
        isScrolling = true;
        headerIsDown = false;

        $('.wanted__text').find('.job-' + this.id).toggleClass('job--open');

        var descriptionIsHidden = $('.job-' + this.id).hasClass('job--open');

        if (descriptionIsHidden) {
            var px = openDescription(this.id);
            $('html, body').animate({scrollTop: px}
                , 1100);
            $.scrollify.disable();
        } else {
            $.scrollify.enable();
            $.scrollify.move('#wanted');
        }
        $.scrollify.update();
        $.scrollify.disable();
        setTimeout(afterScroll, 1250);
    });
}

function openDescription(id) {
    var scrollTop;
    var position = $('.job-' + id).offset().top;
    if ($(window).width() <= 576) {
        scrollTop = position * 0.93;
    } else if ($(window).width() < 1500) {
        scrollTop = position * 0.8;
    } else {
        scrollTop = $(window).scrollTop();
    }

    return scrollTop;
}

function setStickyHeader() {
    setInterval(function() {
        var onFirstSection = firstSectionBottom * 0.8;
        if (!isScrolling) {
            if ($(window).scrollTop() < onFirstSection || headerIsDown) {
                css = { top: 0 };
            } else {
                css = { top: '-130px' };
            }
        }
        header.css(css);
    }, 400);
}

function onWindowScroll() {
    $(window).scroll(function() {
        if (header.hasClass('header--mobile-open')) {
            return;
        }

        if (!didScroll && !isScrolling) {
            didScroll = true;
        }
    });

    setInterval(function() {
        if (didScroll) {
            didScroll = false;
            if (!isScrolling) {
                scrollHandler();
            }
        }
    }, 400);
}

function scrollHandler() {
    var current = $(this).scrollTop();
    var lastSectionTop = section.last().position().top;
    headerIsDown = current <= lastScrollTop;
    var hungry = $('.hungry').position().top;
    var wanted = $('.wanted').position().top;

    if (headerOnClick) {
        headerIsDown = buttonHandler ? headerIsDown : !headerIsDown;
    } else if (current >= hungry && current < wanted) {
        handleScrollingWithoutScrollify(current);
    } else if (current + windowHeight > lastSectionTop + windowHeight) {
        $.scrollify.disable();
        afterScroll();
    } else if (current < lastScrollTop) {
        handleScrollingWithoutScrollify(current);
    } else if (current > lastScrollTop) {
        handleScrollingDown(current);
    } else {
        afterScroll();
        $.scrollify.disable();
    }
}

function handleScrollingWithoutScrollify(current) {
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
    afterScroll();
}

function handleScrollingDown(current) {
    if (!isScrolling) {
        isScrolling = true;
        var overFlow = $.scrollify.current().height() - windowHeight;
        if (current > $.scrollify.current().position().top + overFlow) {
            scrollToNext();
            setTimeout(afterScroll, 1200);
        } else {
            isScrolling = false;
        }
    }
}

function scrollToNext() {
    $.scrollify.enable();
    $.scrollify.update();
    $.scrollify.next();
    $.scrollify.disable();
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
    $('button').on('click', function () {
        buttonHandler = true;
        headerOnClick = true;
        $.scrollify.enable();
        $.scrollify.move($(this).attr('data-href'));
        $.scrollify.disable();
        setTimeout(function() {
            lastScrollTop = $(window).scrollTop();
            headerOnClick = false;
            buttonHandler = false;
        }, 1600);
    });
}

function scrollNavInit() {
    $('a[href*=\\#]').on('click', function () {
        headerOnClick = true;
        $.scrollify.enable();
        $.scrollify.move($(this).attr('href'));
        $.scrollify.disable();
        setTimeout(function() {
            lastScrollTop = $(window).scrollTop();
            headerIsDown = false;
            headerOnClick = false;
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
        header.css({height: '100vh', top: 0});
        header.on('touchmove', function(e) {
            e.preventDefault();
        });
    } else {
        header.off('touchmove');
        header.removeClass(navOpenClass);
        navList.hide();
        closeIcon.hide();
        openIcon.show();
        header.css({height: 'auto', top: 0});
    }
}
