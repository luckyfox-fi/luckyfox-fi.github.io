$(function () {
    pageInit();

    $(window).resize(function() {
        resizeHandler();
    });
});

var controller = new ScrollMagic.Controller();
var header = $('.header');

function pageInit() {
    mobileNavInit();
    scrollNavInit();
    stickyHeaderInit();
    jobDescriptionToggler();
    bindSectionScrollers();
    huntingHeader();
    moveHuntingHeader();
    moveHeader();
}

function resizeHandler() {
    mobileNavInit();
    scrollNavInit();
    header.width($(window).width());
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
        if (event.scrollDirection === 'FORWARD') {
            TweenMax.to(header, 0.2, {opacity: 0});
        }
        else {
            TweenMax.to(header, 0.4, {opacity: 1});
        }
    });

    var lastScrollTop = 0;
    $(window).scroll( function() {
        var scrollTop = $(this).scrollTop();
        css =  scrollTop > lastScrollTop ? {'opacity': 0, 'top': 0, 'position': 'static', 'transition': '0.2s'} : {'opacity': 1, 'position': 'fixed', 'transition': '0.4s'};
        header.css(css);
        lastScrollTop = scrollTop;
    });
}

function huntingHeader() {
    moveHuntingHeader();
    $( window ).resize(function() {
        moveHuntingHeader();
    });
}

function moveHuntingHeader() {
    var img = $('.hunting__image').children('img');
    var h1Height = img.height() / 3 * 2;
    if ($(window).width() < 1025){
        moveHeader(-h1Height);
    } else {
        var t = '-' + $('.hunting__text').width() / 2 + 'px';
        img.css('left', t);
    }
}

function moveHeader(h1Height) {
    $('.hunting__text').children('h1').css('top', h1Height);
}

function bindSectionScrollers() {
    $('.scroll__button').on('click', function() {
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
