function PromoSlide(holder) {
    var _this = this, $dark_menu = $('.slide.dark_menu'), $w = $(window), $b = $('body'), $promo_slides = $(holder), $slides_holder = $promo_slides.find('.slides'), $slides = $slides_holder.find('.slide'), $nav = $promo_slides.find('.slides_navigation'), $dots = $nav.find('.dots a'), $nav_prev = $nav.find('.prev'), $nav_next = $nav.find('.next'), diff = 0, animated_slides = false, $current, pos, size, startY = 0, one_touch = false, tags_skip = ['A'];
    set_variables();
    function run(val) {
        if (!animated_slides && $w.scrollTop() == 0) {
            set_variables();
            diff += val;
            if (Math.abs(diff) % 3 == 0 && diff != 0) {
                if (diff > 0 && pos != 0) {
                    show_slide($current.index() - 1);
                } else if (diff < 0 && $b.hasClass('show_promo')) {
                    show_slide($current.index() + 1);
                }
                diff = 0;
            }
        }
    }
    function callback() {
        $dots.removeClass('active').eq(pos).addClass('active');
        if (pos == 0) {
            $promo_slides.addClass('first');
        } else {
            if ($promo_slides.hasClass('first'))
                $promo_slides.removeClass('first');
                $('.icon-scroll').fadeOut(300) ;

        }
        animated_slides = false;
    }
    function dark_menu(){
        if ($dark_menu.hasClass('over') || $dark_menu.hasClass('under')){
            $b.addClass('dark_menu')
        } else {
            $b.removeClass('dark_menu')
        }
    }

    function show_slide(i) {
        if (!animated_slides && i != pos) {
            set_variables();
            var $_slide = $slides.eq(i);
            if (i > pos && pos >= 0) {
                animated_slides = true;
                if (i == size) {
                    $("#skip_slides").css('display', 'none');

                    $promo_slides.slideUp(800, function() {
                        $b.removeClass('show_promo');
                        fixed_main_nav();
                        $slides.removeClass('active').hide();

                        pos = -1;
                        callback();
                        dark_menu();
                        animate_wow_fix();
                        $('.map_img').show();
                    });
                } else {


                    $_slide.addClass('under').show();
                    // setTimeout(function () {
                    //     dark_menu();
                    // }, 400);
                    dark_menu();

                    fixed_main_nav();

                    $current.slideUp(800, function() {
                        $(this).removeClass('active');
                        $_slide.removeClass('under').addClass('active');
                        pos = $_slide.index();

                        callback();
                    });
                }
            } else if (i < pos) {
                $b.addClass('show_promo');
                if (pos > 0) {

                    animated_slides = true;
                    fixed_main_nav();

                    $_slide.addClass('over');

                    dark_menu();

                    $_slide.hide().slideDown(800, function() {

                        $current.removeClass('active');
                        $_slide.removeClass('over').addClass('active');
                        pos = $_slide.index();

                        callback();
                    });
                } else if (pos == -1) {
                    animated_slides = true;
                    $slides.last().show().addClass('active');

                    fixed_main_nav();

                    $promo_slides.slideDown(800, function() {

                        $("#skip_slides").css('display', 'block');
                        pos = size - 1;
                        callback();
                        dark_menu();

                    });
                }
            }
        }
    }
    function animate_wow_fix () {
        var n_ws = $w.scrollTop();
        if (n_ws <= 0)
        {
            $w.scrollTop(n_ws+1)
        }
    }
    function set_variables() {
        $current = $slides_holder.find('.slide.active');
        pos = $current.index('.slide');
        size = $promo_slides.find('.slide').length;
    }
    function go_to_slide (num, link) {
        var i = --num;


        if (pos <= -1) {
            $b.addClass('show_promo');
            fixed_main_nav();
            $slides.eq(i).show().addClass('over').addClass('active');
            dark_menu();
            $promo_slides.slideDown(800, function() {
                $b.addClass('show_promo');

                $slides.eq(i).removeClass('over').addClass('active');
                if (!link.hasClass('active')) {
                    show_slide(i);
                }
                callback();
            });
        } else {
            if (!link.hasClass('active')) {
                show_slide(i);
            }
        }
    }
    $('a[href^="#"].go_to_section').on('click', function(event) {
        var target = $($(this).attr('href'));
        $promo_slides.slideUp(800, function() {
            $b.removeClass('show_promo');
            fixed_main_nav();
            $slides.removeClass('active').hide();


            pos = -1;
            callback();
            dark_menu();
            if ($w.width <= 767){
                var top_px = 70;
            } else {
                var top_px = 50;
            }
            if (target.length) {
                $('body').removeClass('show_promo');
                event.preventDefault();

                $('html, body').animate({
                    scrollTop: target.offset().top - top_px
                }, 1000, 'swing', function () {
                    animate_wow_fix();
                });
                $('.map_img').show();
            }
        });
    });

    $('.go_to_slide').on('click',function (e) {
        e.preventDefault();
        var num = Number($(this).data('gotoslide'));
        var $link = $(this);
        go_to_slide(num, $link)
    });

    $dots.on('click touchstart', function(e) {
        e.preventDefault();
        var $this = $(this)
            , i = $this.index();
        if (!$this.hasClass('active')) {
            show_slide(i);
        }
    });
    $nav_prev.on('click touchstart', function(e) {
        e.preventDefault();
        show_slide(pos - 1);
    });
    $nav_next.on('click touchstart', function(e) {
        e.preventDefault();
        show_slide(pos + 1);
    });
    _this.slide = function(val) {
        run(val);
    }
    ;
    _this.prev = function() {
        show_slide(pos - 1);
    }
    ;
    _this.next = function() {
        show_slide(pos + 1);
    }
    ;
    function not_click(e) {
        return (indexOf.call(tags_skip, e.target.tagName) == -1 || !$(e.target).closest('a').length);
    }
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.addEventListener('touchstart', function(e) {
            var touchobj = e.changedTouches[0];
            startY = parseInt(touchobj.clientY);
            if ($b.hasClass('show_promo') && e.touches.length == 1) {
                if ($(e.target).closest(holder).length || $(e.target).closest('header').length) {
                    if (not_click(e)) {
                        e.preventDefault();
                        one_touch = true;
                    }
                }
            }
        }, false);
        document.addEventListener('touchmove', function(e) {
            var touchobj = e.changedTouches[0];
            var dist = parseInt(touchobj.clientY) - startY;
            if ($b.hasClass('show_promo') && e.touches.length == 1) {
                if ($(e.target).closest(holder).length || $(e.target).closest('header').length) {
                    if (not_click(e)) {
                        e.preventDefault();
                        if (Math.abs(dist) > 30 && one_touch) {
                            one_touch = false;
                            if (dist > 0) {
                                promo_slide.prev();
                            } else {
                                promo_slide.next();
                            }
                        }
                    }
                }
            }
            if (window.scrollY <= 0 && !$b.hasClass('show_promo') && dist > 20) {
                _this.prev();
            }
        }, false);
        document.addEventListener('touchend', function(e) {
            var touchobj = e.changedTouches[0];
            startY = parseInt(touchobj.clientY);
            if ($b.hasClass('show_promo') && e.touches.length == 1) {
                if ($(e.target).closest(holder).length || $(e.target).closest('header').length) {
                    if (not_click(e)) {
                        e.preventDefault();
                        one_touch = false;
                    }
                }
            }
        }, false);
    }
    var indexOf = function(needle) {
        if (typeof Array.prototype.indexOf === 'function') {
            indexOf = Array.prototype.indexOf;
        } else {
            indexOf = function(needle) {
                var i = -1
                    , index = -1;
                for (i = 0; i < this.length; i++) {
                    if (this[i] === needle) {
                        index = i;
                        break;
                    }
                }
                return index;
            }
            ;
        }
        return indexOf.call(this, needle);
    };
}
