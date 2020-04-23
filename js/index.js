'use strict';

var allSectionsOffsetTop;
var navbarTopPoint;
var navbarBottomPoint;

/**
* Initialize page interface, load all variables and events handlers
*/
$(document).ready(function () {

    ititiateInterfaceValues();
    scrollEvents();
    scrollAnimation();
    resizeEvent();
    colorManagement();
    mobileColorPanelShowHide();
});

/**
 * Get height of an element in pixels
 * @param  {Node} e The element which height is getting
 * @return {Number} The height of the element in pixels
 */
function getElementHeight(e) {
    return $(e).height();
}

/**
 * Get width of an element in pixels
 * @param  {Node} e The element which width is getting
 * @return {Number} The width of the element in pixels
 */
function getElementWidth(e) {
    return $(e).width();
}

/**
 * Get offset top (distance between top point of an element 
 * and top of the page) of an element in pixels
 * @param  {Node} e The element which offset top is getting
 * @return {Number} The offset top of the element in pixels
 */
function getElementOffsetTop(e) {
    return $(e).offset().top;
}

/**
 * Get offsets top (distances between top point of an element 
 * and top of the page) of all <section> elements in pixels
 * @return {Object} The list of all <section> elements 
 * offsets top in pixels
 */
//TODO - refactor with less lines of code later
function getAllSectionsOffsetTop() {

    var sections = {};
    var sectionsList = $('section');

    Array.prototype.forEach.call(sectionsList, function (e) {

        sections[e.id] = getElementOffsetTop(e);
    });

    return sections;
}

/**
* Initialize values for fixed elements positioning
*/
function ititiateInterfaceValues() {

    allSectionsOffsetTop = getAllSectionsOffsetTop();
    navbarTopPoint = getElementHeight('.header') - 20; //50;
    navbarBottomPoint = getElementOffsetTop('.footer') - getElementHeight('.navigation') - 20; //50;

    // setElementWidth('body', getElementWidth(window));
    // setElementHeight('header.header', getElementHeight(window));
    scrollSpy();
    stickNavbar();
    switchColorSchemaBtn();
}

/**
* Hides/shows color panel on touch-screens
* Showing by clicking the button, hiding by clicking outside the color pannel
*/
function mobileColorPanelShowHide() {

    $('.color-schema__btn--mobile').on('touchstart', function (e) {
        $('.color-schema__panel')
        .removeClass('color-schema__panel--hide')
        .addClass('color-schema__panel--show');
        e.stopPropagation();
    });

    $('body').on('touchstart', function () {
        $('.color-schema__panel')
        .removeClass('color-schema__panel--show')
        .addClass('color-schema__panel--hide');
    });

    // Prevent events from getting pass .color-schema__panel{
    $('.color-schema').on('touchstart', function (e) {
        e.stopPropagation();
    });
}

/**
* Makes appropriate menu item active while scrolling through page sections
*/
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

/**
* Sticks the navigation bar at the top and bottom points of <main> section
*/
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

/**
* Switches the color of the <color-schema-button>, <color palete>
* and <dark-mode toggler> elements at the top and bottom points 
* of <main> section
*/
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

/**
* Initialize all <on scroll> events
*/
function scrollEvents() {

    $(window).on('scroll', function () {
        scrollSpy();
        stickNavbar();
        switchColorSchemaBtn();

    });
}

/**
* Animates scroll effect on click of header and footer buttons
*/
function scrollAnimation() {

    $('.navigation__link, .header__scroll-down, .footer__scroll-up').on('click', function (e) {

        e.preventDefault();

        $('html, body').animate(
            {
                scrollTop: getElementOffsetTop($.attr(this, 'href'))
            }, 400);

        return false;
    });
}

/**
* Recalculates all initial elements values after resizing 
* (in case of changing portrait/landscape modes or equal)
*/
function resizeEvent() {
    $(window).on('resize', function () {

        // $('header.header').css({ 'height': $(window).height() });
        // $('body').css({ 'width': $(window).width() });
        ititiateInterfaceValues();
    });
}

/**
* Changes primary color by user choice
*/
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