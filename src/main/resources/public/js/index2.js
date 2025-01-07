
$(document).ready(function () {
    $("#tm10").on("mouseover", "li", function () {
        $(this).find(".gnb_depth10").stop().slideDown();
    }).on("mouseout", "li", function () {
        $(this).find(".gnb_depth10").stop().slideUp();
    });
});







    //모바일 메뉴

    $('.dep1-link10').on('click', function (e) {
        e.preventDefault();
        $(this).next('div').slideToggle(100);
        $(this).toggleClass('active');
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
        $('.lnb-list1010>ul>li>a').click(function () {
            $('.lnb-list1010 ul li a').removeClass()
            $(this).addClass('orange')
        })
    })





    $(document).ready(function () {
        $(".lnb-list1010 > ul > li > a").click(function () {
            if ($(this).parent("li").hasClass("on")) {
                $(".lnb-list1010 > ul > li > ul").slideUp(500);
                $(".lnb-list1010 > ul > li").removeClass("on");
            } else {
                $(".lnb-list1010 > ul > li > ul").slideUp();
                $(".lnb-list1010 > ul > li").removeClass("on");
                if ($(this).next("ul").length > 0) {
                    $(this).attr("href", "#n");
                    $(this).parent("li").addClass("on");
                    $(this).next("ul").slideDown(500);

                }
            }
        });



        /*모바일 전체메뉴*/
        $(".gnb-btn10").click(function () {
            $("body").css({
                "overflow": "hidden"
            });
            $(".gnb-bg10").show();
            $(".lnb10").fadeIn("300");
            $(".lnb10").animate({
                right: "0"
            }, 300);
        });
        $(".gnb-close-btn10 > a").click(function (e) {
            $("body").css({
                "overflow": "auto"
            });
            $(".gnb-bg10").hide();
            $(".lnb10").animate({
                right: "-506px"
            }, 300);

        });










        $(function () {
            $(".gnb10").mouseover(function () {
                $(".sub10").stop().slideDown();
            });
            $(".gnb10").mouseout(function () {
                $(".sub10").stop().slideUp();
            });
            $(".gnb10").mouseover(function () {
                $(".sub_bg10").stop().slideDown();
            });

            $(".gnb10").mouseout(function () {
                $(".sub_bg10").stop().slideUp();
            });

           

        });
 
        $(function () {
            $('.main_list10').click(function () {
                if ($(this).hasClass('on')) {
                    slideUp();
                } else {
                    slideUp();
                    $(this).addClass('on').children('.t_sub').slideDown();
                };

                function slideUp() {
                    $('.main_list10').removeClass('on').children('.t_sub').slideUp();
                };
            });

            $('.main_t10').on('scroll touchmove mousewheel', function (event) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            });
        });









    });




