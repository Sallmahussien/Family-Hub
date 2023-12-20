const galleryCover = document.querySelector('.gallery-cover');

const backBtns = document.getElementsByClassName('fa-arrow-left');

const galleryBox = document.getElementById('main-gallery');
const modal = document.getElementById('imgModal');
const modalImage = document.getElementById('modalImage');

let currentImageIndex = 0;

const containerCounts = {};
const containerImages = {};

createAllPhotos();
createUsersPhotos();

async function getImages(url) {
  try {
    const response = await fetch(url);
    const responseData = await response.json();

    if (response.status === 200) {
      const imgs = getImgsFromResponse(responseData);
      return imgs;
    }
  } catch (error) {
    console.error(error);
  }
}

async function getAllUsers(url) {
  try {
    const response = await fetch(url);
    const responseData = await response.json();

    if (response.status === 200) {
      return responseData;
    }
  } catch (error) {
    console.error(error);
  }
}

// logic functions
function getImgsFromResponse(responseData) {
  const imgs = [];
  responseData.forEach(feed => {
    imgs.push(feed.photo);
  });

  return imgs;
}

async function createAllPhotos() {
  const imgs = await getImages(`/api/v1/circles/${circleId}/photos`);

  createUserLink({
    name: 'All Photos',
    img: imgs.length ? imgs[0] : undefined,
    imgsNum: imgs.length,
    id: 'all'
  });

  createGalleryContainer({
    name: 'All Photos',
    imgs: imgs,
    id: 'all',
  });
}

function createUserLink(linkConfig) {
  const photo = linkConfig.img;
  const imgUrl = linkConfig.img ? `/images/${linkConfig.img.photo}` : '/imgs/user.jpg';
  const userLink = document.createElement('div');

  userLink.classList.add('user-link');
  userLink.setAttribute('data-user-id', `id-${linkConfig.id}`);
  userLink.setAttribute('onclick', 'showGallery(this)');

  userLink.innerHTML = `
    <div class="link-cover" style="background-image: url(${imgUrl});"></div>
    <div class="text">
      <h3>${linkConfig.name}</h3>
      <span>${linkConfig.imgsNum} Photos</span>
    </div>
  `;

  galleryCover.appendChild(userLink);
}

function createGalleryContainer(galleryConfig) {
  const imgsLength = galleryConfig.imgs.length;
  const galleryContainer = document.createElement('div');

  galleryContainer.classList.add('gallery', 'd-none');
  galleryContainer.setAttribute('id', `id-${galleryConfig.id}`);

  galleryContainer.innerHTML = `
    <div class="gallery-header d-flex align-items-center gap-1 ">
      <i class="fa-solid fa-arrow-left" onclick="handleBackBtn(this)"></i>
      <div class="gallery-title">
        <h2>${galleryConfig.name}</h2>
        <span>${imgsLength} Photos</span>
      </div>
    </div>
  `;

  if (imgsLength === 0) {
    const emptyContainer = document.createElement('div');
    emptyContainer.classList.add('empty-container', 'w-100', 'd-flex', 'justify-content-center', 'align-items-center', 'flex-column', 'gap-3');
    emptyContainer.innerHTML = `
      <i class="fa-solid fa-photo-film"></i>
      <h3>No Photos</h3>
      <p>Upload a new image that can appear here.</p>
    `;
    galleryContainer.appendChild(emptyContainer);
  } else {
    const imgsContainer = document.createElement('div');
    const imgs = galleryConfig.imgs;

    imgsContainer.classList.add('imgs-container');
    imgsContainer.setAttribute('id', `containerId-${galleryConfig.id}`);

    imgs.forEach((img, idx) => {
      const imgElement = document.createElement('img');
      imgElement.src = `/images/${img.photo}`;
      imgElement.classList.add('img-thumb');
      imgElement.setAttribute('onclick', `openModal(${idx}, 'containerId-${galleryConfig.id}')`);
      imgsContainer.appendChild(imgElement);
    });

    galleryContainer.appendChild(imgsContainer);
  }

  galleryBox.appendChild(galleryContainer);
}

async function createUsersPhotos() {
  const users = await getAllUsers(`/api/v1/circles/${circleId}/users`);

  for (userObj of users) {
    const imgs = await getImages(`/api/v1/circles/${circleId}/users/${userObj.id}/photos`);

    createUserLink({
      name: `${userObj.firstName}'s`,
      img: imgs.length ? imgs[0] : undefined,
      imgsNum: imgs.length,
      id: userObj.id,
    });

    createGalleryContainer({
      name: `${userObj.firstName}'s`,
      imgs: imgs,
      id: userObj.id,
    });
  }
}

// onclick methods
function showGallery(target) {
  const userId = target.getAttribute('data-user-id');

  document.querySelectorAll(".user-link").forEach(user => {
    user.classList.add('d-none');
  });

  document.getElementById(userId).classList.remove('d-none');
}

function handleBackBtn(target) {
  const galleryContainer = target.parentNode.parentNode;
  galleryContainer.classList.add('d-none');

  document.querySelectorAll(".user-link").forEach((user) => {
    user.classList.remove('d-none');
  });
}

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
