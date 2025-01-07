$(document).ready(function () {
    $("#tm").on("mouseover", "li", function () {
        $(this).find(".gnb_depth2").stop().slideDown();
    }).on("mouseout", "li", function () {
        $(this).find(".gnb_depth2").stop().slideUp();
    });
});

$(function () {
    $('.lnb-list>ul>li').click(function () {
        $('.lnb-list ul li').removeClass()
        $(this).addClass('orange')
    });
});

//모바일 메뉴
$(document).on('click', '.dep1-before', function(e) {
    e.preventDefault();
    
    var $link = $(this).closest('.dep1-link');
    var $div = $link.next('div.dep2');
    
    $div.slideToggle(100);
    $link.toggleClass('active');
});

$(document).on('click', '.dep1-link', function(e) {
    e.preventDefault();

    if ($(e.target).hasClass('dep1-before')) {
        return;
    }

    const scrnId = $(this).data('sc');
    const menuId = $(this).data('mn');
    const upMenuId = $(this).data('umn');
    if (scrnId) {
        const menuInfo = {
            menuId: menuId,
            upMenuId: upMenuId
        };
        localStorage.setItem('menuGroup', JSON.stringify(menuInfo));
        customObj.goPage(scrnId);
    }
});
    
$('.dep2-in > a').on('click', function (e) {
    e.preventDefault();
    $(this).next('ul').slideToggle(100);
    $(this).toggleClass('active');
});

$('.dep3-in > a').on('click', function (e) {
    e.preventDefault();
    $(this).next('ul').slideToggle(100);
    $(this).toggleClass('active');
});

$(function () {
    $('.lnb-list>ul>li>a').click(function () {
        $('.lnb-list ul li a').removeClass()
        $(this).addClass('orange')
    });
});

$(document).ready(function () {
    $(".lnb-list > ul > li > a").click(function () {
        if ($(this).parent("li").hasClass("on")) {
            $(".lnb-list > ul > li > ul").slideUp(500);
            $(".lnb-list > ul > li").removeClass("on");
        } else {
            $(".lnb-list > ul > li > ul").slideUp();
            $(".lnb-list > ul > li").removeClass("on");
            if ($(this).next("ul").length > 0) {
                $(this).attr("href", "#n");
                $(this).parent("li").addClass("on");
                $(this).next("ul").slideDown(500);
            }
        }
    });

    /*모바일 전체메뉴*/
    $(".gnb-btn").click(function () {
        $("body").css({
            "overflow": "hidden"
        });
        $(".gnb-bg").show();
        $(".lnb2").fadeIn("300");
        $(".lnb2").animate({
            right: "0"
        }, 300);
    });
    $(".gnb-close-btn > a").click(function (e) {
        $("body").css({
            "overflow": "auto"
        });
        $(".gnb-bg").hide();
        $(".lnb2").animate({
            right: "-506px"
        }, 300);
    });

    $(window).on('resize', function() {
        if ($(window).width() >= 1330) {
            $('.gnb-bg').css('display', 'none');
        }
    });

    $(function () {
        $(".gnb").mouseover(function () {
            $(".sub").stop().slideDown();
        });
        $(".gnb").mouseout(function () {
            $(".sub").stop().slideUp();
        });
        $(".gnb").mouseover(function () {
            $(".sub_bg").stop().slideDown();
        });

        $(".gnb").mouseout(function () {
            $(".sub_bg").stop().slideUp();
        });

        /*top*/
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $(".top").addClass("on");
            } else {
                $(".top").removeClass("on");
            }
        });

        $(".top a").click(function (e) {
            $(window).scrollTop(0);
            e.preventDefault();
        });
    });

    $(function () {
        $('.menu_btn').click(function (ev) {
            ev.preventDefault();
            $(this).toggleClass("active");
            $(".main_t").fadeToggle(500);
        });
    });

    $(function () {
        $('.main_list').click(function () {
            if ($(this).hasClass('on')) {
                slideUp();
            } else {
                slideUp();
                $(this).addClass('on').children('.t_sub').slideDown();
            };

            function slideUp() {
                $('.main_list').removeClass('on').children('.t_sub').slideUp();
            };
        });

        $('.main_t').on('scroll touchmove mousewheel', function (event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        });
    });

    /* $(document).ready(function () {
        var mySlider = $('.g_slide').bxSlider({
            auto: true,
            pause: 4000,
            autoHover: true,
        });
    });

    $(document).ready(function () {
        var mySlider = $('.footer_slide').bxSlider({
            auto: true,
            speed: 5000,
            pause: 0,
            moveSlides: 3,
            slideWidth: 300,
            minSlides: 1,
            maxSlides: 6,
            slideMargin: 0,
            pager: false,
            controls: false,
            easing: 'linear',
        });
    }); */
});

$(function () {
    $('.menu_btn').click(function (ev) {
        ev.preventDefault();
        $(this).toggleClass("active");
        $(".main_t").fadeToggle(500);
    });
});

$(function () {
    $('.main_list').click(function () {
        if ($(this).hasClass('on')) {
            slideUp();
        } else {
            slideUp();
            $(this).addClass('on').children('.t_sub').slideDown();
        };

        function slideUp() {
            $('.main_list').removeClass('on').children('.t_sub').slideUp();
        };
    });

    $('.main_t').on('scroll touchmove mousewheel', function (event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    });
});