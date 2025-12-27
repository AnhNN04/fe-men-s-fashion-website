/**
 * Banner Slider Component
 * Auto-play banner slides with dot navigation
 */

export class BannerSlider {
  constructor(sliderId = 'heroSlider') {
    this.sliderElement = document.getElementById(sliderId);
    this.slides = this.sliderElement?.querySelectorAll('.slide') || [];
    this.dots = document.querySelectorAll('.slider-dot');
    this.currentSlide = 0;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 5000; // 5 seconds
    
    if (this.slides.length > 0) {
      this.init();
    }
  }

  /**
   * Initialize slider
   */
  init() {
    console.log('[BannerSlider] Initialized with', this.slides.length, 'slides');
    
    // Setup dot click handlers
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Setup pause on hover
    if (this.sliderElement) {
      this.sliderElement.addEventListener('mouseenter', () => this.pause());
      this.sliderElement.addEventListener('mouseleave', () => this.play());
    }

    // Start auto-play
    this.play();
  }

  /**
   * Go to specific slide
   * @param {number} index - Slide index
   */
  goToSlide(index) {
    // Wrap around if index is out of bounds
    if (index >= this.slides.length) {
      this.currentSlide = 0;
    } else if (index < 0) {
      this.currentSlide = this.slides.length - 1;
    } else {
      this.currentSlide = index;
    }

    this.updateSlider();
  }

  /**
   * Go to next slide
   */
  nextSlide() {
    this.goToSlide(this.currentSlide + 1);
  }

  /**
   * Update slider - show active slide and dot
   */
  updateSlider() {
    // Update slides
    this.slides.forEach((slide, index) => {
      if (index === this.currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update dots
    this.dots.forEach((dot, index) => {
      if (index === this.currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    console.log('[BannerSlider] Switched to slide', this.currentSlide);
  }

  /**
   * Start auto-play
   */
  play() {
    if (this.autoPlayInterval) return;
    
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDelay);

    console.log('[BannerSlider] Auto-play started');
  }

  /**
   * Pause auto-play
   */
  pause() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
      console.log('[BannerSlider] Paused');
    }
  }

  /**
   * Destroy slider
   */
  destroy() {
    this.pause();
    this.dots.forEach(dot => {
      dot.removeEventListener('click', null);
    });
    if (this.sliderElement) {
      this.sliderElement.removeEventListener('mouseenter', null);
      this.sliderElement.removeEventListener('mouseleave', null);
    }
  }
}

/**
 * Setup banner slider when home view renders
 */
export function setupBannerSlider() {
  return new BannerSlider('heroSlider');
}
