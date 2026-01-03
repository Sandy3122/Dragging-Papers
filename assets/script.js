let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;
  animationFrame = null;
  paperElement = null;

  init(paper) {
    this.paperElement = paper;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Use passive listeners for better performance
    const passiveOptions = { passive: false };
    
    if (isTouchDevice) {
      // Touch events
      paper.addEventListener('touchstart', (e) => this.handleTouchStart(e), passiveOptions);
      paper.addEventListener('touchmove', (e) => this.handleTouchMove(e), passiveOptions);
      paper.addEventListener('touchend', () => this.handleTouchEnd(), passiveOptions);
      paper.addEventListener('touchcancel', () => this.handleTouchEnd(), passiveOptions);
    } else {
      // Mouse events
      paper.addEventListener('mousedown', (e) => this.handleMouseDown(e));
      paper.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      paper.addEventListener('mouseup', () => this.handleMouseUp());
      paper.addEventListener('mouseleave', () => this.handleMouseUp());
    }

    // Prevent context menu on long press
    paper.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  handleTouchStart(e) {
    if (this.holdingPaper) return;
    e.preventDefault();
    
    this.holdingPaper = true;
    this.paperElement.style.zIndex = highestZ;
    highestZ += 1;
    this.paperElement.classList.add('dragging');

    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.prevTouchX = this.touchStartX;
    this.prevTouchY = this.touchStartY;
  }

  handleTouchMove(e) {
    if (!this.holdingPaper) return;
    e.preventDefault();

    const touch = e.touches[0];
    this.touchMoveX = touch.clientX;
    this.touchMoveY = touch.clientY;

    this.velX = this.touchMoveX - this.prevTouchX;
    this.velY = this.touchMoveY - this.prevTouchY;

    this.currentPaperX += this.velX;
    this.currentPaperY += this.velY;

    this.prevTouchX = this.touchMoveX;
    this.prevTouchY = this.touchMoveY;

    this.updateTransform();
  }

  handleTouchEnd() {
    this.holdingPaper = false;
    this.rotating = false;
    this.paperElement.classList.remove('dragging');
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  handleMouseDown(e) {
    if (this.holdingPaper) return;
    e.preventDefault();
    
    this.holdingPaper = true;
    this.paperElement.style.zIndex = highestZ;
    highestZ += 1;
    this.paperElement.classList.add('dragging');

    this.touchStartX = e.clientX;
    this.touchStartY = e.clientY;
    this.prevTouchX = this.touchStartX;
    this.prevTouchY = this.touchStartY;
  }

  handleMouseMove(e) {
    if (!this.holdingPaper) return;

    this.touchMoveX = e.clientX;
    this.touchMoveY = e.clientY;

    this.velX = this.touchMoveX - this.prevTouchX;
    this.velY = this.touchMoveY - this.prevTouchY;

    this.currentPaperX += this.velX;
    this.currentPaperY += this.velY;

    this.prevTouchX = this.touchMoveX;
    this.prevTouchY = this.touchMoveY;

    this.updateTransform();
  }

  handleMouseUp() {
    this.holdingPaper = false;
    this.paperElement.classList.remove('dragging');
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  updateTransform() {
    // Use requestAnimationFrame for smooth updates
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.animationFrame = requestAnimationFrame(() => {
      this.paperElement.style.transform = 
        `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      this.animationFrame = null;
    });
  }
}

// Initialize all papers when DOM is ready
function initPapers() {
  const papers = Array.from(document.querySelectorAll('.paper'));
  
  papers.forEach((paper) => {
    const p = new Paper();
    p.init(paper);
  });
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPapers);
} else {
  initPapers();
}
