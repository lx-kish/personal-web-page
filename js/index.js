'use strict';

var allSectionsOffsetTop;
var navbarTopPoint;
var navbarBottomPoint;

$(document).ready(function () {

    ititiateInterfaceValues();
    scrollEvents();
    scrollAnimation();
    resizeEvent();
    colorManagement();
    // changePrimaryColor();
});

//refactor with less lines of code later
function calculateAllSectionsOffsetTop() {

    var sections = {};
    var sectionsList = $('section');

    Array.prototype.forEach.call(sectionsList, function (e) {
        sections[e.id] = $(e).offset().top;// - $(window).scrollTop();
        // sections[e.id] = $(e).offset().top - $(window).scrollTop();
        // sections[e.id] = e.offsetTop;
    });

    return sections;
}

function getNavbarTopPoint() {
    return $('.header').height() - 20; //50;
    // return $('.header__button').offset().top + 50;
}

function getNavbarBottomPoint() {
    return $('.footer').offset().top - $('.navigation').height() - 20; //50;
    // return $('.footer__button').offset().top - $('.navigation').height() - 50;
}

function ititiateInterfaceValues() {

    allSectionsOffsetTop = calculateAllSectionsOffsetTop();
    navbarTopPoint = getNavbarTopPoint();
    navbarBottomPoint = getNavbarBottomPoint();

    scrollSpy();
    stickNavbar();
    switchColorSchemaBtn();
}

function scrollSpy() {

    var scrollPosition = $(window).scrollTop();
    var i = 0;

    for (i in allSectionsOffsetTop) {
        if (allSectionsOffsetTop[i] <= scrollPosition) {

            $('.navigation__list').children('.navigation__item--active').removeClass('navigation__item--active');
            $('.navigation__link[href*=' + i + ']').parent().addClass('navigation__item--active');
        }
    }
}

function stickNavbar() {

    if ($(window).scrollTop() > navbarTopPoint &&
        $(window).scrollTop() < navbarBottomPoint) {

        $('.navigation')
            .removeClass('navigation--top navigation--bottom')
            .addClass('navigation--fixed');
    }
    else {
        if ($(window).scrollTop() <= navbarTopPoint) {

            $('.navigation')
                .removeClass('navigation--fixed navigation--bottom')
                .addClass('navigation--top');
        }
        else if ($(window).scrollTop() >= navbarBottomPoint) {

            $('.navigation')
                .removeClass('navigation--fixed navigation--top')
                .addClass('navigation--bottom');
        }
    }
}

function switchColorSchemaBtn() {

    // var btnTopPoint = $('.color-schema__btn').offset().top;
    // var btnBottomPoint = $('.color-schema__btn').offset().top + $('.color-schema__btn').height();
    var panelPoint = $('.color-schema__panel').offset().top + $('.color-schema__panel').height() / 2;
    var togglePoint = $('.color-schema__toggle').offset().top + $('.color-schema__toggle').height() / 2;
    var btnPoint = $('.color-schema__btn').offset().top + $('.color-schema__btn').height() / 2;

    //changing panel color
    if (panelPoint > $('.header').height() && panelPoint < $('.footer').offset().top) {
        $('.color-schema__panel')
            .removeClass('color-schema--color-top-bottom')
            .addClass('color-schema--color-main');
    }
    else {
        $('.color-schema__panel')
            .removeClass('color-schema--color-main')
            .addClass('color-schema--color-top-bottom');
    }

    //changing toggle color
    if (togglePoint > $('.header').height() && togglePoint < $('.footer').offset().top) {
        $('.color-schema__toggle')
            .removeClass('color-schema__toggle--color-top-bottom')
            .addClass('color-schema__toggle--color-main');
    }
    else {
        $('.color-schema__toggle')
            .removeClass('color-schema__toggle--color-main')
            .addClass('color-schema__toggle--color-top-bottom');
    }

    //changing button color
    if (btnPoint > $('.header').height() && btnPoint < $('.footer').offset().top) {
        $('.color-schema__btn')
            .removeClass('color-schema--color-top-bottom')
            .addClass('color-schema--color-main');
    }
    else {
        $('.color-schema__btn')
            .removeClass('color-schema--color-main')
            .addClass('color-schema--color-top-bottom');
    }

}

function scrollEvents() {

    $(window).on('scroll', function () {
        scrollSpy();
        stickNavbar();
        switchColorSchemaBtn();

        // console.log(allSectionsOffsetTop);
        // console.log(`scroll position = ${$(window).scrollTop()}`);
        // console.log(`color-schema-btn top position = ${$('.color-schema__btn').offset().top}`);
        // console.log(`color-schema-btn bottom position = ${$('.color-schema__btn').offset().top + $('.color-schema__btn').height()}`);
        // console.log(`header height = ${$('.header').height()}`);
        // console.log(`header offset top = ${$('.header').offset().top}`);
        // console.log(`footer offset top = ${$('.footer').offset().top}`);
        // console.log(`scroll position = ${scrollPosition}, section = ${allSectionsOffsetTop[i]}`);

    });
}

function scrollAnimation() {

    $('.navigation__link, .header__scroll-down, .footer__scroll-up').click(function (e) {

        e.preventDefault();

        $('html, body').animate(
            {
                scrollTop: $($.attr(this, 'href')).offset().top
            }, 400);

        return false;
    });
}

function resizeEvent() {
    $(window).on('resize', function () {
        ititiateInterfaceValues();
    });
}

function toggleClass(cl, mask) {

}

function colorManagement() {

    //primary color changing
    $('.color-schema__input').on('change', function () {

        // $('body').addClass('color-theme-in-transition')
        $('body').attr('primary-color', $(this).val());
        // window.setTimeout(function () {
        //     $('body').removeClass('color-theme-in-transition')
        // }, 1000)
    });

    //light/dark mode
    $('.color-schema__toggle-input').on('change', function () {

        $('body').addClass('color-theme-in-transition');
        $('body').attr('data-theme', $(this).is(':checked') ? "dark" : "light");
        window.setTimeout(function () {
            $('body').removeClass('color-theme-in-transition')
        }, 1000)
    });

    // //primary color changing
    // $('.color-schema__input').on('change', function () {

    //     var classList = $('body').attr('class').split(/\s+/);

    //     $.each(classList, function (index, item) {

    //         if (item.indexOf('color-primary') >= 0) {

    //             $('body').removeClass(item);
    //         }
    //     });

    //     $('body').addClass($(this).val());

    //     // console.log($('.color-schema__input:checked').val());
    // });

    // //day-night toggling
    // $('.color-schema__toggle-input').on('change', function () {

    //     $(this).is(':checked') ?
    //         $('body').addClass('color-schema--night') :
    //         $('body').removeClass('color-schema--night');
    // });


}