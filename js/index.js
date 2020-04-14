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
});

function getElementHeight(e) {
    return $(e).height();
}

function getElementOffsetTop(e) {
    return $(e).offset().top;
}

//refactor with less lines of code later
function getAllSectionsOffsetTop() {

    var sections = {};
    var sectionsList = $('section');

    Array.prototype.forEach.call(sectionsList, function (e) {

        sections[e.id] = getElementOffsetTop(e);
    });

    return sections;
}

function ititiateInterfaceValues() {

    allSectionsOffsetTop = getAllSectionsOffsetTop();
    navbarTopPoint = getElementHeight('.header') - 20; //50;
    navbarBottomPoint = getElementOffsetTop('.footer') - getElementHeight('.navigation') - 20; //50;

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

    var panelPoint = getElementOffsetTop('.color-schema__panel') + getElementHeight('.color-schema__panel') / 2;
    var togglePoint = getElementOffsetTop('.color-schema__toggle') + getElementHeight('.color-schema__toggle') / 2;
    var btnPoint = getElementOffsetTop('.color-schema__btn') + getElementHeight('.color-schema__btn') / 2;

    //changing panel color
    if (panelPoint > getElementHeight('.header') && panelPoint < getElementOffsetTop('.footer')) {
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
    if (togglePoint > getElementHeight('.header') && togglePoint < getElementOffsetTop('.footer')) {
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
    if (btnPoint > getElementHeight('.header') && btnPoint < getElementOffsetTop('.footer')) {
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

    });
}

function scrollAnimation() {

    $('.navigation__link, .header__scroll-down, .footer__scroll-up').click(function (e) {

        e.preventDefault();

        $('html, body').animate(
            {
                scrollTop: getElementOffsetTop($.attr(this, 'href'))
            }, 400);

        return false;
    });
}

function resizeEvent() {
    $(window).on('resize', function () {
        ititiateInterfaceValues();
    });
}

function colorManagement() {

    //primary color changing
    $('.color-schema__input').on('change', function () {


        $('body').attr('primary-color', $(this).val());
    });

    //light/dark mode
    $('.color-schema__toggle-input').on('change', function () {

        $('body').addClass('color-theme-in-transition');
        $('body').attr('data-theme', $(this).is(':checked') ? "dark" : "light");
        window.setTimeout(function () {
            $('body').removeClass('color-theme-in-transition')
        }, 1000)
    });
}