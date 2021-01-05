'use strict';

var allSectionsOffsetTop;
var navbarTopPoint;
var navbarBottomPoint;

/**
 * Firebase config
 */
var firebaseConfig = {
    apiKey: "AIzaSyCjPWWe-agx2pM8jE70HUHrrG5PVaTCNZI",
    authDomain: "lx-kish.firebaseapp.com",
    projectId: "lx-kish",
    storageBucket: "lx-kish.appspot.com",
    messagingSenderId: "901503787573",
    appId: "1:901503787573:web:60236d20b3f8621473877c",
    measurementId: "G-5EW4GQ4PZ2"
};
/**
 * Firebase initialization
 */
firebase.initializeApp(firebaseConfig);
firebase.analytics();

/**
* Initialize page interface, load all variables and events handlers
*/
$(document).ready(function () {

    initiateInterfaceValues();
    scrollEvents();
    scrollAnimation();
    resizeEvent();
    colorManagement();
    mobileColorPanelShowHide();
    popupMessageShowHide();
    submitFormHandler();
});

/**
 * Hides alert message
 * @return void
 */
function hideAlert() {
    var el = $('.alert');
    if (el) el.remove();
};

/**
 * Shows alert message
 * @param {String} msg The message for showing
 * @param {String} type Message type: 'success' or 'error'
 * @return void
 */
function showAlert(type, msg) {
    var markup = '<div class="alert alert--' + type + '">' + msg + '</div>';
    $('body').prepend(markup);
    window.setTimeout(hideAlert, 5000);
}

// Creating reference to the firebase collection
// console.log('%c messagesRef ===> ', 'color: yellowgreen;', firebase.database());
var messagesRef = firebase.database().ref('messages');
// console.log('%c messagesRef ===> ', 'color: yellowgreen; font-weight: bold; text-transform: uppercase;', messagesRef);

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
    return Math.round($(e).offset().top);
}

/**
 * Get offsets top (distances between top point of an element 
 * and top of the page) of all <section> elements in pixels
 * @return {Object} The list of all <section> elements 
 * offsets top in pixels
 */
//@TODO - refactor with less lines of code later
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
function initiateInterfaceValues() {

    allSectionsOffsetTop = getAllSectionsOffsetTop();
    navbarTopPoint = getElementHeight('.header') - 20; //50;
    navbarBottomPoint = getElementOffsetTop('.footer') - getElementHeight('.navigation') - 20; //50;

    scrollSpy();
    stickNavbar();
    switchColorSchemaBtn();
}

/**
 * Adds and removes class attributes to an html element
 * @param  {Node} e The element which class is adding
 * @param  {String} addedClass The class attribute is adding to the element
 * @param  {String} removedClass The class attribute is removing from the element
 * @return void
 */
function addRemoveClass(el, addedClass, removedClass) {
    if (addedClass) el.addClass(addedClass);
    if (removedClass) el.removeClass(removedClass);
}

/**
* Hides/shows color panel on touch-screens
* Showing by clicking the button, hiding by clicking outside the color pannel
*/
function mobileColorPanelShowHide() {

    $('.color-schema__btn--mobile').on('touchstart', function (e) {
        addRemoveClass(
            $('.color-schema__panel'),
            'color-schema__panel--show',
            'color-schema__panel--hide');
        e.stopPropagation();
    });

    $('body').on('touchstart', function () {
        addRemoveClass(
            $('.color-schema__panel'),
            'color-schema__panel--hide',
            'color-schema__panel--show');
    });

    // Prevent events from getting pass .color-schema__panel{
    $('.color-schema').on('touchstart', function (e) {
        e.stopPropagation();
    });
}

/**
* Hides/shows pop up message for desktop
* Showing by clicking the button, hiding by clicking
* outside the pop up, or '&times' symbol.
*/
function popupMessageShowHide() {

    $('#btn-contacts').on('click', function (e) {
        // console.log('%c btn-contacts ===> ', 'color: orangered;');
        addRemoveClass(
            $('#message'),
            'message--shown',
            '');
        e.stopPropagation();
    });

    $('#message').on('click', function (e) {
        addRemoveClass(
            $('#message'),
            '',
            'message--shown');
        e.stopPropagation();
    });

    $('#contact-form').on('click', function (e) {
        e.stopPropagation();
    });

    // Prevent events from getting pass .color-schema__panel{
    $('.message__close').on('click', function (e) {
        addRemoveClass(
            $('#message'),
            '',
            'message--shown');
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
        if (allSectionsOffsetTop[i] <= scrollPosition) { // + 1) { // adding 1 to cover fractional part 

            addRemoveClass($('.navigation__list').children('.navigation__item--active'), '', 'navigation__item--active');
            addRemoveClass($('.navigation__link[href*=' + i + ']').parent(), 'navigation__item--active', '');
        }
    }
}

/**
* Sticks the navigation bar at the top and bottom points of <main> section
*/
function stickNavbar() {

    if ($(window).scrollTop() > navbarTopPoint &&
        $(window).scrollTop() < navbarBottomPoint) {

        addRemoveClass(
            $('.navigation'),
            'navigation--fixed',
            'navigation--top navigation--bottom');
    }
    else {
        if ($(window).scrollTop() <= navbarTopPoint) {

            addRemoveClass(
                $('.navigation'),
                'navigation--top',
                'navigation--fixed navigation--bottom');
        }
        else if ($(window).scrollTop() >= navbarBottomPoint) {

            addRemoveClass(
                $('.navigation'),
                'navigation--bottom',
                'navigation--fixed navigation--top');
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

        addRemoveClass(
            $('.color-schema__panel'),
            'color-schema--color-main',
            'color-schema--color-top-bottom');
    }
    else {
        addRemoveClass(
            $('.color-schema__panel'),
            'color-schema--color-top-bottom',
            'color-schema--color-main');
    }

    //changing toggle color
    if (togglePoint > getElementHeight('.header') && togglePoint < getElementOffsetTop('.footer')) {
        addRemoveClass(
            $('.color-schema__toggle'),
            'color-schema__toggle--color-main',
            'color-schema__toggle--color-top-bottom');
    }
    else {
        addRemoveClass(
            $('.color-schema__toggle'),
            'color-schema__toggle--color-top-bottom',
            'color-schema__toggle--color-main');
    }

    //changing button color
    if (btnPoint > getElementHeight('.header') && btnPoint < getElementOffsetTop('.footer')) {
        addRemoveClass(
            $('.color-schema__btn'),
            'color-schema--color-main',
            'color-schema--color-top-bottom');
    }
    else {
        addRemoveClass(
            $('.color-schema__btn'),
            'color-schema--color-top-bottom',
            'color-schema--color-main');
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

        initiateInterfaceValues();
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

        addRemoveClass($('body'), 'color-theme-in-transition', '');
        $('body').attr('data-theme', $(this).is(':checked') ? "dark" : "light");
        window.setTimeout(function () {
            addRemoveClass($('body'), '', 'color-theme-in-transition')
        }, 1000)
    });
}

/**
 * Submit form handler - adding event listener to the contactForm form
 */
function submitFormHandler() {
    $('#contactForm').on('submit', function (e) {
        e.preventDefault();

        var values = {};
        $('#name, #email, #subject, #message-text').each(
            function (index) {
                values[this.name] = $(this).val();
                var input = $(this);
            }
        );
        values['date'] = Date.now();

        try {
            saveMessage(values);

            addRemoveClass(
                $('#message'),
                '',
                'message--shown');
            
            document.getElementById('contactForm').reset();
            showAlert('success', 'Message has been sent successfully!');
        }
        catch (e) {
            showAlert('error', 'An error occured while message sending: ' + e);
        }
    });
}

/**
 * Saves message to the firebase
 */
function saveMessage(values) {
    var newMessage = messagesRef.push();
    return newMessage.set(values);
}