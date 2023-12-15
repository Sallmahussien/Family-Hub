document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".gallery").forEach(function (gallery) {
      gallery.classList.add('d-none');
    });
  
    document.querySelectorAll(".user-link").forEach(function (userLink) {
      userLink.addEventListener("click", function () {
        const userId = this.getAttribute("data-user-id");
  
        document.querySelectorAll(".user-link").forEach((user) => {
          user.classList.add('d-none');
        });
  
  
        document.getElementById("user" + userId + "-photos").classList.remove('d-none');
      });
    });
  
  
    const backBtns = document.getElementsByClassName('fa-arrow-left');
  
    Array.from(backBtns).forEach((backBtn) => {
  
      backBtn.addEventListener('click', function () {
        const galleryContainer = backBtn.parentNode.parentNode;
        galleryContainer.classList.add('d-none');
  
        document.querySelectorAll(".user-link").forEach((user) => {
          user.classList.remove('d-none');
        });
  
      });
    });
  
  });
  
  
  const modal = document.getElementById('imgModal');
  const modalImage = document.getElementById('modalImage');
  let currentImageIndex = 0;
  
  const containerCounts = {};
  
  const containerImages = {};
  
  function openModal(index, containerId) {
    modal.style.display = 'flex';
    currentImageIndex = index;
    updateModalImage(containerId);
    document.body.style.overflow = 'hidden'; 
  
    modalImage.setAttribute('data-container-id', containerId);
  
    containerCounts[containerId] = containerCounts[containerId] || getImagesFromContainer(containerId).length;
  }
  
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
  
  function updateModalImage(containerId) {
    const images = containerImages[containerId] || getImagesFromContainer(containerId);
    const currentImage = images[currentImageIndex];
    modalImage.src = currentImage.src;
    modalImage.alt = currentImage.alt;
  }
  
  function prevImage() {
    const containerId = getCurrentContainerId();
    currentImageIndex = (currentImageIndex - 1 + containerCounts[containerId]) % containerCounts[containerId];
    updateModalImage(containerId);
  }
  
  function nextImage() {
    const containerId = getCurrentContainerId();
    currentImageIndex = (currentImageIndex + 1) % containerCounts[containerId];
    updateModalImage(containerId);
  }
  
  function getCurrentContainerId() {
    return modalImage.getAttribute('data-container-id');
  }
  
  function getImagesFromContainer(containerId) {
    const container = document.getElementById(containerId);
    const images = container.querySelectorAll('.img-thumb');
    const imageArray = Array.from(images).map(img => ({ src: img.src, alt: img.alt }));
    containerImages[containerId] = imageArray;
    return imageArray;
  }
  