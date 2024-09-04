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
document.addEventListener('DOMContentLoaded', function () {
  // Get all dropdown-toggle elements
  var dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  // Loop through each dropdown-toggle element
  dropdownToggles.forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
          // Check if the clicked element is an anchor tag inside the dropdown
          if (!e.target.closest('.dropdown-menu a')) {
              e.preventDefault(); // Prevent default only when clicking the toggle, not the links

              // Close any open dropdowns that aren't the one being clicked
              dropdownToggles.forEach(function (item) {
                  if (item !== toggle) {
                      item.classList.remove('show');
                  }
              });

              // Toggle the 'show' class on the clicked item
              toggle.classList.toggle('show');
          }
      });
  });

  // Close the dropdown if clicked outside of it
  document.addEventListener('click', function (e) {
      if (!e.target.closest('.dropdown-toggle')) {
          dropdownToggles.forEach(function (item) {
              item.classList.remove('show');
          });
      }
  });
});
