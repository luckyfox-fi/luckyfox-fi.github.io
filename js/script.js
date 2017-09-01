/* global $ */

$(function () {
    pageInit();

    $(window).resize(function() {
        resizeHandler();
    });
});

var buttonHandler = false;
var closeIcon = $('.header__mobile-nav-btn--close');
var css = {};
var didScroll = false;
var footer = $('.footer');
var header = $('.header');
var headerIsDown = false;
var headerOnClick;
var isScrolling = false;
var lastScrollTop = $(window).scrollTop();
var navLink = $('.header__navigation a');
var navList = $('.header__navigation ul');
var openIcon = $('.header__mobile-nav-btn--open');
var section = $('.section');
var wanted = $('.wanted');
var windowHeight = $(window).height();
var firstSectionBottom = section.first().position().top + windowHeight;

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
    windowHeight = $(window).height();
    firstSectionBottom = section.first().position().top + windowHeight;
    mobileNavInit();
    scrollNavInit();
    onWindowScroll();
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
        } else {
            $.scrollify.enable();
            $.scrollify.move('#wanted');
        }
        window.location.hash = '#i-need-a-job';
        $.scrollify.update();
        $.scrollify.disable();
        setTimeout(afterScroll, 1850);
    });
}

function openDescription(id) {
    var scrollTop;
    var job = $('.job-' + id);
    var windowWidth = $(window).width();

    if (windowWidth <= 375) {
        scrollTop = (job.height() + job.offset().top) * 0.85;
    } else if (windowWidth < 768) {
        scrollTop = (job.offset().top - job.height()) * 0.8;
    } else if (windowWidth <= 1024 && windowWidth > windowHeight) {
        scrollTop = (job.offset().top - job.height()) * 0.83;
    } else {
        scrollTop = wanted.offset().top;
    }

    return scrollTop;
}

function setStickyHeader() {
    setInterval(function() {
        var onFirstSection = firstSectionBottom * 0.8;
        if (!isScrolling) {
            if ($(window).scrollTop() < onFirstSection || headerIsDown) {
                css = { top: 0, transition: 'top 0.2s'};
            } else {
                css = { top: '-130px', transition: 'top 0.2s 0.8s'};
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
    var hungry = $('.hungry').position().top * 0.98;
    var inHungrySection =
    current >= hungry && current < wanted.position().top;
    var currentlyInLast =
        current + windowHeight > lastSectionTop + windowHeight;

    if (headerOnClick) {
        headerIsDown = buttonHandler ? headerIsDown : !headerIsDown;
    } else if (inHungrySection || currentlyInLast || current < lastScrollTop) {
        headerIsDown = current <= lastScrollTop;
        handleScrollingWithoutScrollify(current);
    } else if (current > lastScrollTop) {
        headerIsDown = current <= lastScrollTop;
        handleScrollingDown(current);
    } else {
        $.scrollify.disable();
        headerIsDown = current <= lastScrollTop;
    }
}

function handleScrollingWithoutScrollify(current) {
    var sections = [];
    section.each(function() {
        $.scrollify.update();
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
    $('.scroll__button').click(function () {
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
    var internalLinks = $("a[href^='#']");
    var navList = [].concat(internalLinks, navLink);
    $(navList).each(function() {
        $(this).click(function () {
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
    });
}

function mobileNavInit() {
    var mobileClass = 'header--mobile';
    if ($(window).width() < 768) {
        header.addClass(mobileClass);
        openIcon.click(function() {
            showMobileNav(true);
        });

        closeIcon.click(function() {
            showMobileNav(false);
        });

        navLink.click(function() {
            showMobileNav(false);
        });
    } else {
        header.removeClass(mobileClass);
        closeIcon.off('click');
        openIcon.off('click');
        navLink.off('click');
        navList.removeAttr('style');
        scrollNavInit();
    }
}

function showMobileNav(openMobileNav) {
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
