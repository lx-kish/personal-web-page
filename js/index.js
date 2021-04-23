'use strict';

// import $ from 'jquery';
// import firebase from 'firebase';
// var $ = require('jquery');
// window.$ = require('jquery');
// console.log($);

var allSectionsOffsetTop;
var navbarTopPosition;
var navbarBottomPosition;

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
// var firebase = require('firebase');
// var app = firebase.initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

/**
* Initialize page interface, load all variables and events handlers
*/
$(function () {
    // $(document).ready(function () {

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
    var e = $('.alert');
    if (e) e.remove();
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
    navbarTopPosition = getElementHeight('.header') - 20; //50;
    navbarBottomPosition = getElementOffsetTop('.footer') - getElementHeight('.navigation') - 100; //50;
    // navbarBottomPosition = getElementOffsetTop('.footer') - getElementHeight('.navigation') - 20; //50;

    scrollSpy();
    stickNavbar();
    switchColorSchemaBtn();
}

/**
 * Adds and removes class attributes to an html element
 * @param  {Object} e The jQuery object of the DOM node which class is adding
 * @param  {String} addedClass The class attribute is adding to the element
 * @param  {String} removedClass The class attribute is removing from the element
 * @return void
 */
function addRemoveClass(e, addedClass, removedClass) {

    // console.log(
    // 	'%c element inside addRemoveClass function ===> ',
    // 	'color: gold; font-weight: bold;',
    //     e,
    // 	e.get(0),
    // 	document.body.contains(e.get(0))
    // );

    if (!document.body.contains(e.get(0))) return;

    if (addedClass) e.addClass(addedClass);
    if (removedClass) e.removeClass(removedClass);
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

    var aboveNavBarTopPosition = $(window).scrollTop() <= navbarTopPosition;
    var belowNavBarTopPosition = $(window).scrollTop() > navbarTopPosition;
    var aboveNavBarBottomPosition = $(window).scrollTop() < navbarBottomPosition;
    var belowNavBarBottomPosition = $(window).scrollTop() >= navbarBottomPosition;

    if (belowNavBarTopPosition &&
        aboveNavBarBottomPosition) {

        addRemoveClass(
            $('.navigation'),
            'navigation--fixed',
            'navigation--top navigation--bottom');
    }

    if (aboveNavBarTopPosition) {

        addRemoveClass(
            $('.navigation'),
            'navigation--top',
            'navigation--fixed navigation--bottom');
    }

    if (belowNavBarBottomPosition) {

        addRemoveClass(
            $('.navigation'),
            'navigation--bottom',
            'navigation--fixed navigation--top');
    }
}

/**
 * Checkes if fixed element currently lies between end of the header and top of the footer
 * @param {nodePosition} - current offsetTop of the element
 * @return {Boolean}
 */
function getFixedElementPosition(nodePosition) {
    return nodePosition > getElementHeight('.header') && nodePosition < getElementOffsetTop('.footer')
}

/**
* Switches the color of the <color-schema-button>, <color palete>
* and <dark-mode toggler> elements at the top and bottom points 
* of <main> section by adding/removing css classes
*/
function switchColorSchemaBtn() {

    var panelPosition = getElementOffsetTop('.color-schema__panel') + getElementHeight('.color-schema__panel') / 2;
    var togglePosition = getElementOffsetTop('.color-schema__toggle') + getElementHeight('.color-schema__toggle') / 2;
    var buttonPosition = getElementOffsetTop('.color-schema__btn') + getElementHeight('.color-schema__btn') / 2;

    // conditional variables to define switching colors points
    var mainPanelColor = getFixedElementPosition(panelPosition);
    var mainToggleColor = getFixedElementPosition(togglePosition);
    var mainButtonColor = getFixedElementPosition(buttonPosition);

    //changing panel color
    if (mainPanelColor) {

        addRemoveClass(
            $('.color-schema__panel'),
            'color-schema--color-main',
            'color-schema--color-top-bottom');
    }
    if (!mainPanelColor) {
        addRemoveClass(
            $('.color-schema__panel'),
            'color-schema--color-top-bottom',
            'color-schema--color-main');
    }

    //changing toggle color
    if (mainToggleColor) {
        addRemoveClass(
            $('.color-schema__toggle'),
            'color-schema__toggle--color-main',
            'color-schema__toggle--color-top-bottom');
    }
    if (!mainToggleColor) {
        addRemoveClass(
            $('.color-schema__toggle'),
            'color-schema__toggle--color-top-bottom',
            'color-schema__toggle--color-main');
    }

    //changing button color
    if (mainButtonColor) {
        addRemoveClass(
            $('.color-schema__btn'),
            'color-schema--color-main',
            'color-schema--color-top-bottom');
    }
    if (!mainButtonColor) {
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