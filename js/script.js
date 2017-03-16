$(function () {
    pageInit();

    $(window).resize(function() {
        resizeHandler();
    });
});

var controller = new ScrollMagic.Controller();
var header = $('.header');

function pageInit() {
    moveHuntingHeader();
    scrollingEffect();
    mobileNavInit();
    scrollNavInit();
    stickyHeaderInit();
    jobDescriptionToggler();
    bindSectionScrollers();
    floatingButton();

}

function resizeHandler() {
    mobileNavInit();
    scrollNavInit();
    header.width($(window).width());
    moveHuntingHeader();
}

function scrollingEffect() {
    $('#fullpage').fullpage({
        scrollOverflow: true,
        normalScrollElements: '.job'
    });
}

function jobDescriptionToggler() {
    $(".job__button").click(function() {
        $(".wanted__text").find(".job-" + this.id).toggleClass("job--open");
        $.fn.fullpage.reBuild();
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
        if (event.scrollDirection === 'FORWARD') {
            TweenMax.to(header, 0.2, {opacity: 0});
        }
        else {
            TweenMax.to(header, 0.4, {opacity: 1});
        }
    });
/*
    var lastScrollTop = 0;
    $(window).scroll( function() {
        var scrollTop = $(this).scrollTop();
        css =  scrollTop > lastScrollTop ? {'opacity': 0, 'top': 0, 'position': 'static', 'transition': 'all 0.5s linear'} : {'opacity': 1, 'position': 'fixed', 'transition': 'all 0.5s linear'};
        header.css(css);
        lastScrollTop = scrollTop;
    });
    */
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
        $.fn.fullpage.moveSectionDown();
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
    var lastScrollTop = 0;
    $(window).scroll(function() {
        var scrollTop = $(this).scrollTop();
        var scrollBottom = scrollTop + $(window).height();
        var isScrollingDown = true;
        var $wantedSection = $('.wanted');
        var $huntingSection = $('.hunting');
        var wantedBottom = $wantedSection.position().top + $wantedSection.outerHeight(true);
        var huntingBottom =  $huntingSection.position().top + $huntingSection.outerHeight(true);

        isScrollingDown = scrollTop > lastScrollTop ? true : false;
        lastScrollTop = scrollTop;
        buttonVisibility('.wanted', wantedBottom, isScrollingDown, scrollBottom);
        buttonVisibility('.hunting', huntingBottom, isScrollingDown, scrollBottom);
   });
}

function buttonVisibility(className, sectionBottom, isScrollingDown, scrollBottom) {
  /* var element = $(className + ' .scroll__button');
    if ((scrollBottom >= (sectionBottom * 0.98)) && (scrollBottom <= sectionBottom * 1.15)) {
        if (element.is( ':hidden' ) && isScrollingDown ) { element.slideDown(250); }
    } else { element.slideUp(250); }*/
}

/**
 * Scroll based navigation on bigger screen sizes
 */
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
