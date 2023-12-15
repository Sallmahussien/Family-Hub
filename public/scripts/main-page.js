
document.addEventListener('DOMContentLoaded', function() {
    const sectionsContainer = document.getElementById('sections-container');
    let translateY = 0;
    let moveDirectionY = 1;
    
    function animateSectionsY() {
      translateY += 1 * moveDirectionY;
    
      if (translateY >= 50 || translateY <= -50) {
        moveDirectionY *= -1; 
      }
    
      sectionsContainer.style.transform = `translateY(${translateY}px)`;
    }
    
    setInterval(animateSectionsY, 20);
  
    const sectionTwo = document.getElementById('sectiontwo');
    let translateXTwo = 0;
    let moveDirectionXTwo = 1;
    
    function animateSectionTwoX() {
      translateXTwo += 1 * moveDirectionXTwo;
    
      if (translateXTwo >= 50 || translateXTwo <= -50) {
        moveDirectionXTwo *= -1;
      }
    
      sectionTwo.style.transform = `translateX(${translateXTwo}px)`;
    }
    
    setInterval(animateSectionTwoX, 20);
  
    const sectionOne = document.getElementById('sectionOne');
    let translateXOne = 0;
    let moveDirectionXOne = -1;
    
    function animateSectionOneX() {
      translateXOne += 1 * moveDirectionXOne;
    
      if (translateXOne >= 50 || translateXOne <= -50) {
        moveDirectionXOne *= -1;
      }
    
      sectionOne.style.transform = `translateX(${translateXOne}px)`;
    }
    
    setInterval(animateSectionOneX, 20);
  });