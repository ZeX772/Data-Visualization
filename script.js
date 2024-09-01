'use strict';


const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");

const toggleNavbar = function () { navbar.classList.toggle("active"); }

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () { navbar.classList.remove("active"); }

addEventOnElem(navLinks, "click", closeNavbar);

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

function playVideo() {
  const video = document.getElementById('fitness-video');
  const playButton = document.querySelector('.play-btn');

  playButton.style.display = 'none';
  video.style.display = 'block';
  video.play();
}

$(document).ready(function() {
  // Initialize Slick Carousel
  $('.slick-carousel').slick({
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    arrows: false
  });

  // Handle form submission
  $('#contactForm').submit(function(event) {
    event.preventDefault(); // Prevent default form submission
    // Simulate submission success (for demo purposes)
    $('#successModal').modal('show'); // Show success modal
    // Clear form fields
    $('#contactForm')[0].reset();
  });

});

$(document).ready(function() {
  // Initialize Slick Carousel
  $('.slick-carousel').slick({
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    arrows: false
  });
});

$(document).ready(function() {
  // Toastr options
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut",
    "toastClass": "toast-custom"
  };

  // Handle form submission
  $('#contactForm').submit(function(event) {
    event.preventDefault(); // Prevent default form submission
    // Trigger Toastr notification
    toastr.success('Message sent');
    // Clear form fields
    $('#contactForm')[0].reset();
  });
});
function toggleAccordion(element) {
  const content = element.nextElementSibling;
  content.classList.toggle('show');
}