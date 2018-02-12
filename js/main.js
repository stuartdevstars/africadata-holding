var no_more_scroll;
no_more_scroll=false;
function enableScrollAgain(){
  no_more_scroll=false;
}
$(function () {
    var $w = $(window), $b = $('body'), $promo_slides = $('#promo_slides'); //, navScroll;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        FastClick.attach(document.body);
        $b.addClass('mobile');
        adjust_promo_slides();
        $w.on('orientationchange', function() {
            adjust_promo_slides()
        });
        var iscroll_options = {};
        if (/Android/i.test(navigator.userAgent)) {
            iscroll_options['click'] = true;
        }
        // navScroll = new IScroll('#menu_navigation_holder',iscroll_options);
    }
    if ($promo_slides.length) {
        $w.scrollTop(0);
        $b.addClass('show_promo');
        // $("#skip_slides").css('display', 'block');
        // $promo_slides.find('.dots a').eq(0).addClass('active');

        $promo_slides.addClass('first');

        $promo_slides.find('.slides .slide').eq(0).addClass('active').find('.block_1-55').show();

        promo_slide = new PromoSlide('#promo_slides');
        $(document).on('DOMMouseScroll mousewheel wheel MozMousePixelScroll onwheel', function(event) {
            // promo_slide.slide(-(event.originalEvent.deltaY));
            var scroll_slide = -(event.originalEvent.deltaY);
            //console.log(scroll_slide);
            if (scroll_slide > 0) if ($w.scrollTop() == 0) no_more_scroll=false;
            if(!no_more_scroll){
              no_more_scroll=true;
              var scroll_slide = -(event.originalEvent.deltaY);
  
              if (scroll_slide > 0) {
                  if ($w.scrollTop() == 0)
                      promo_slide.prev();
              } else {
  
                  promo_slide.next();
              }
              window.setTimeout('enableScrollAgain()',1500);
            }
        }).on('keydown', function(e) {
            if (e.keyCode == 38) {
                if ($w.scrollTop() == 0)
                    promo_slide.prev();
            } else if (e.keyCode == 40) {
                promo_slide.next();
            }
            if ($b.hasClass('show_promo') && (e.keyCode == 38 || e.keyCode == 40)) {
                disable_event(e);
            }
        });
    }

    function adjust_promo_slides() {
        $b.removeClass('portrait landscape');
        if (window.innerHeight > window.innerWidth) {
            $b.addClass('portrait');
        } else {
            $b.addClass('landscape');
        }
    }
    function disable_event(e) {
        e = e || window.event;
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;
    }
});
function open_accordion() {
    var $accordion = $('.accordion_title');
    var $content = $('.accordion_content');
    var $content_inner = $('.accordion_content_inner')
    $accordion.on('click', function() {
        var $this = $(this);
        var $HA = $(this).siblings($content).children($content_inner).outerHeight(true);
        if ($(this).hasClass('open')) {
            $(this).removeClass("open");
            $(this).siblings($content).animate({
                height: 0
            }, 200, function() {
                $(this).removeAttr('style');
            });
        } else {
            $accordion.removeClass("open");
            $accordion.siblings($content).animate({
                height: 0
            }, 200, function() {
                $(this).removeAttr('style');
            });
            $(this).addClass("open");
            $(this).siblings($content).animate({
                height: $HA
            }, 200, function() {
                $(this).css('height', 'auto');
            });
        }
    });
    return;
}
function openPopup($popup, $timer) {
    var body = $('body');
    if (!$popup.length) {
        return;
    }
    body.addClass('overflow');
    $popup.fadeIn(200, function() {
        $(this).addClass('active');
        if ($popup.find("iframe").length){
            var $frame = $popup;
            var iSrc = $($frame).find('iframe').data('src');
            $($frame).find('iframe').attr('src', iSrc);
        }
    });
}

function closePopup($popup, callback) {
    var body = $('body');
    $popup.removeClass('active');
    setTimeout(function() {
        $popup.fadeOut(200, callback);
        body.removeClass('overflow');
        //add logic stop video if close popup
        if ($popup.find("iframe").length){
            var $frame = $popup;
            $($frame).find('iframe').removeAttr("src")
        }
    }, 500);
}

function popup() {
    var body = $('body');
    $(document).on('click', '.open_popup', function(event) {
        event.preventDefault();
        openPopup($($(this).data('popup')));
    });
    $(document).on('click', '.close_popup, .popup_close', function(event) {
        closePopup($(this).parents('.popup'));
        event.preventDefault();
    });
    $(document).on('click', '.backdrop', function() {
        closePopup($(this).parent('.popup'));
    });
}

function full_win() {
    var full_contain = $('.full_window');
    if (!full_contain.length) {
        return;
    }
    full_contain.css('min-height', $(window).outerHeight());
}
// function fixed_main_nav() {
//     var $header = $('.header-container');
//     var $winScroll = $(window).scrollTop();
//     if (150 <= $winScroll) {
//         $header.addClass('bg');
//     } else {
//         $header.removeClass('bg')
//     }
// }
function fixed_main_nav() {
    var $header = $('.header-container');
    var $winScroll = $(window).scrollTop();
    if (!$('body').hasClass('show_promo')) {
        $header.addClass('bg');
    } else {
        $header.removeClass('bg')
    }
}
function open_menu(menu, open) {

    var div_menu = menu;
    var body = $('html, body');
    open.toggleClass('open');
    $('.header-container').addClass('open');
    if (open.hasClass('open')) {
        body.addClass('overflow');
        $(document).find(div_menu).slideDown(350, function() {
            open.addClass('open');
            $('.social_menu').show();
        });
    } else {
        $('.social_menu').hide();
        $(document).find(div_menu).slideUp(350, function() {
            open.removeClass('open');
            body.removeClass('overflow');
            $('.header-container').removeClass('open');
            $(this).removeAttr("style");// options
        });
    }
}
function social_menu(){
    if($(window).height() <= 525){
        $('.header_menu').addClass('relative')
    } else {
        $('.header_menu').removeClass('relative')
    }

}

$(window).resize(function() {
    full_win();
    social_menu();
});
$(window).scroll(function () {
    fixed_main_nav();
});
$(document).ready(function () {
    open_accordion();
    full_win();
    fixed_main_nav();
    popup();
    social_menu();
    $('.icon-scroll').on('click', function () {
        $(this).fadeOut(300)
    });
    var wow = new WOW(
        {
            boxClass:     'wow',      // animated element css class (default is wow)
            animateClass: 'animated', // animation css class (default is animated)
            offset:       0,          // distance to the element when triggering the animation (default is 0)
            mobile:       false,      // trigger animations on mobile devices (default is true)
            live:         true,       // act on asynchronously loaded content (default is true)
            callback:     function(box) {
                // the callback is fired every time an animation is started
                // the argument that is passed in is the DOM node being animated
            },
            scrollContainer: null // optional scroll container selector, otherwise use window
        }
    );
    wow.init();


    if ($(window).width() >= 768 ) {
        $('section[data-type="background"]').each(function () {
            var $bgobj = $(this);
            $(window).scroll(function () {
                var yPos = -($(window).scrollTop() / $bgobj.data('speed'));
                var coords = 'center ' + yPos + 'px';
                $bgobj.css({backgroundPosition: coords});
            });
        });
    }
    $('.menu_open_close').click(function(e) {
        e.preventDefault();
        var menu = $('.header_menu');
        var open = $(this);
        open_menu(menu, open);
    });

    $('.header_menu li a').click(function(e) {
        e.preventDefault();
        var $this = $(this);
        if ($(window).width() <= 767 ) {
            var menu = $('.header_menu');
            var open = $('.menu_open_close');
            open_menu(menu, open);
        }
    });
});
