'use strict';

//#region My query selectors

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollto = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const menuButtons = document.querySelectorAll('.nav__item a')
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer =  document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const menu = document.querySelector('.nav__links');
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');

//#endregion

//#region Modal window // 

const openModal = function(e) {
  // e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);
  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//#endregion

//#region Smooth scroll //

  menu.addEventListener('click', function(e) {
    e.preventDefault();

    if(e.target.classList.contains('nav__link')){
      const id = e.target.getAttribute('href');
      console.log(id);
      document.querySelector(id).scrollIntoView({behavior: 'smooth'})
    }

})

//#endregion

//#region tabbed component // 

tabsContainer.addEventListener('click', function(e){
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  if(!clicked) return;
  tabs.forEach(t => t.classList.remove('operations__tab--active'));

  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');

  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
})

//#endregion

//#region menu faded animation // 

const handleHover = function(e){
  if(e.target.classList.contains('nav__link')){
    
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el =>{
      if(el !== link) el.style.opacity = 0.5;
    });
    logo.style.opacity = 0.5;
  }
};

const offHover = function (e){
  if(e.target.classList.contains('nav__link')){

    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el =>{
      if(el !== link) el.style.opacity = 1;
    });
    logo.style.opacity = 1; 
  }
};

nav.addEventListener('mouseout', offHover);

nav.addEventListener('mouseover', handleHover);

//#endregion

//#region sticky navigation : Intersection observer //

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries){
  const [entry] = entries;

  if(!entry.isIntersecting) nav.classList.add('sticky'); 
  else nav.classList.remove('sticky');
}


const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//#endregion

//#region scroll effect, that reveals each section //

const revealSection = function(entries, observer){
  const [entry] = entries;
  console.log('revealSection', entry);

  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver ( revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//#endregion

//#region lazy loading the images // 

const loadImg = function(entries, observer){
  const [entry] = entries;
  console.log(entry);

  if(!entry.isIntersecting) return;
  
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
  
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold:0,
  rootMargin: '200px',
  // I did this so the image might load a little bit earlier compared against when it will cross the display//
});

imgTargets.forEach(img => imgObserver.observe(img));

//#endregion

//#region Sliders - carousel

const slider = function() { // manager the slider navigation
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0; // Keeps track of the current slide (initially set to 0).
  const maxSlide = slides.length; // Stores the total number of slides.

  // Functions // Creates and adds navigation dots to the dotContainer.
  // Iterates over each slide, creating a button
  const createDots = function() {

    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });

  };

  // activeDot - To update the active navigation dot based on the currently visible slide.
  const activateDot = function(slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active')); // o	Iterates over each dot and removes the class dots__dot--active from all of them.

    document // o	Selects the dot that corresponds to the current slide and adds the class dots__dot--active to this specific dot
      .querySelector(`.dots__dot[data-slide="${slide}"]`) 
      .classList.add('dots__dot--active');

  };
  
  // To update the position of each slide to show the desired slide in the slider.
  const goToSlide = function(slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`) // o	The translateX value shifts each slide horizontally based on its index relative to the target slide.
    );
  };

  // Next slide
  //To move to the next slide in the slider and update the navigation dots accordingly.
  //
  const nextSlide = function() {

    if (curSlide === maxSlide - 1) { // If curSlide is at the last slide (maxSlide - 1), reset curSlide to 0 (loop back to the first slide).
      curSlide = 0;
    } else {
      curSlide++; // If not at the last slide, increment curSlide by 1 to move to the next slide.
    }

    goToSlide(curSlide); // Calls goToSlide(curSlide) to move the slides so that the newly updated curSlide is displayed.
    activateDot(curSlide);
  }; // activateDot(curSlide) to highlight the dot corresponding to the new curSlide.


  const prevSlide = function() { // To move to the previous slide in the slider and update the navigation dots accordingly.

    if (curSlide === 0) {
      curSlide = maxSlide - 1; //  If curSlide is at the first slide (index 0), set curSlide to the last slide (maxSlide - 1) to loop back.
    } else {
      curSlide--; // f not at the first slide, decrement curSlide by 1 to move to the previous slide.
    }
    goToSlide(curSlide); // to adjust the slides so that the updated curSlide is displayed.
    activateDot(curSlide); // activateDot(curSlide) to highlight the dot corresponding to the new curSlide.

  };

  const init = function() { // Highlights the navigation dot that corresponds to the currently displayed slide.
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  init();
  
  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) { // set this function to move the slides with the keybord arrows
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) { // This code listens for clicks on the navigation dots, determines which dot was clicked, and updates the slider and dots accordingly.
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

//#endregion