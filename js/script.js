/* global $ TweenMax ScrollMagic */

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
  disableScrollify();
  onHeaderClick();
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
      section : ".section",
      sectionName : "section-name",
      interstitialSection : ".footer",
      scrollSpeed: 1100,
      updateHash: true,
      touchScroll:true,
      overflowScroll: true
    });
  } else {
    $.scrollify({
      section : ".section",
      sectionName : "section-name",
      interstitialSection : ".footer, .wanted, .hunting",
      scrollSpeed: 1100,
      updateHash: true,
      touchScroll:true,
      overflowScroll: true
    });
  }
  setTouchAction('auto');
}

function jobDescriptionToggler() {
  $(".job__button").click(function() {
    $(".wanted__text").find(".job-" + this.id).toggleClass("job--open");
    enableScrollify();
    $.scrollify.update();
    disableScrollify();
  });
}

function onHeaderClick() {
  $(".header__navigation ul li a").click(function() {
    enableScrollify();
    $.scrollify.move($(this).attr("href"));
    disableScrollify();

  });

  $(".header__navigation button").click(function() {
    enableScrollify();
    $.scrollify.move($(this).attr("href"));
    disableScrollify();
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
      TweenMax.to(header, 0.4, {top: '-130px'});
    }
    else {
      TweenMax.to(header, 0.4, {opacity: 1, top: 0});
    }
  });

  var headerIsDown;
  function setStickyHeaderTween(isVisible) {
    if (!isScrolling) {
      if (!isVisible) {
        if (headerIsDown) {
          TweenMax.to(header, 0.4, {css: {position: 'relative', top: '-130px'}});
          headerIsDown = false;
        }
      } else {
        if (!headerIsDown) {
          TweenMax.to(header, 0.4, {css: {position: 'fixed', top: 0}});
          headerIsDown = true;
        }
      }
    }
  }

  var isScrolling = false;
  var lastScrollTop = $(window).scrollTop();
  var windowHeight = $(window).height();

  $(window).scroll(function() {
    var current = $(this).scrollTop();
    if ($(window).width() > 320) {
      scrollifyScrolling(current);
    } else {
      normalScrolling(current);
    }
    lastScrollTop = current;
  });

  function normalScrolling(current) {
    if (current > lastScrollTop) {
      TweenMax.to(header, 0.2, {css: {opacity: 0, position: 'relative', top: '-130px'}});
    } else {
      TweenMax.to(header, 0.4, {css: {opacity: 1, position: 'fixed', top: 0}});
    }
    afterScroll();
  }

   function scrollifyScrolling(current) {
    if (current < lastScrollTop) {
      setStickyHeaderTween(true);
      handleScrollingUp(current);
    } else if (current >= $('.contacts').position().top) {
      setStickyHeaderTween(false);
    } else {
      handleScrollingDown(current);
    }
  }

  function handleScrollingUp(current) {
    var sections = [];
    $( '.section' ).each(function() {
      var section = {
        position: $(this).position().top,
        hash: $(this).attr('data-section-name')
      };
      sections.push(section);
    });

    for (var index in sections) {
      if (current < sections[index].position) {
        window.location.hash = sections[index].hash;
        break;
      }
    }
    $.scrollify.update();
    disableScrollify();
  }

  function handleScrollingDown(current) {
    if (!isScrolling) {
      handleScrollifyTransition(current);
    }
  }

  function handleScrollifyTransition(current) {
      var overFlow = $.scrollify.current().height() - windowHeight;
      if (current > ($.scrollify.current().position().top + overFlow)) {
        isScrolling = true;
        scrollToNext();
    }
  }

  function scrollToNext() {
    enableScrollify();
    $.scrollify.update();
    $.scrollify.next();
    disableScrollify();
    setTimeout(afterScroll, 1250);
  }

  function afterScroll() {
    lastScrollTop = $(window).scrollTop();
    setTouchAction('auto');
    isScrolling = false;
    setStickyHeaderTween(false);
  }
}

function enableScrollify() {
  if ($.scrollify.isDisabled()) {
    $.scrollify.enable();
  }
}

function disableScrollify() {
  if (!($.scrollify.isDisabled())) {
    $.scrollify.disable();
  }
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
      enableScrollify();
      $.scrollify.update();
      $.scrollify.next();
      disableScrollify();
  });
}

function scrollToId(id) {
  controller.scrollTo(id);

  if (window.history && window.history.pushState) {
    history.pushState("", document.title, id);
  }
}

function scrollNavInit() {
  controller.scrollTo(function (newpos) {
    TweenMax.to(window, 0.5, {scrollTo: {y: newpos}});
  });

  $('a[href*=\\#]').on('click', function (e) {
    var id = $(this).attr("href");
    id = id.startsWith("/") ? id.substr(1) : id;
    if ($(id).length > 0) {
      e.preventDefault();
      scrollToId(id);
    }
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
    header.addClass(navOpenClass);
    openIcon.hide();
    navList.show();
    closeIcon.show();
    header.css( 'height', '100vh' );
    header.on('touchmove', function(event) {
      event.preventDefault();
    });
  } else {
    header.off('touchmove');
    header.removeClass(navOpenClass);
    navList.hide();
    closeIcon.hide();
    openIcon.show();
    header.css( 'height', 'auto' );
  }
}
