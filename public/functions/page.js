const buttons = document.querySelectorAll('.navegation button');
const sections = document.querySelectorAll('#content div');
const curriculum = document.getElementById('curriculum');
const overlay = document.getElementById('overlay');
const contacts = document.getElementById('contactsMenu');


    const overlayy = document.getElementById('overlayy');
    const overlayImg = document.getElementById('overlay-img');
    const images = document.querySelectorAll('.gallery img');

    images.forEach(img => {
      img.addEventListener('click', () => {
        overlayImg.src = img.src;
        overlayy.classList.add('active');
      });
    });

    overlayy.addEventListener('click', () => {
      overlayy.classList.remove('active');
    });

const pageConfig = {
  'home': {
    title: 'Home - Design & Web Development',
  },
  'works': {
    title: 'Projects - Design Portfolio',
  }
};

function updatePageTitle(sectionId) {
  const config = pageConfig[sectionId] || { title: 'Yuren Daniel' };
  document.title = config.title;
}

function showSection(id, push = true) {
  sections.forEach(sec => {
    sec.classList.remove('visible');
    sec.classList.add('hidden');
  });

  const target = document.getElementById(id);
  target.classList.remove('hidden');
  target.classList.add('visible');
  updatePageTitle(id);
  if (push) {
    history.pushState({ page: id }, '', `#${id}`);
  }
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    showSection(btn.dataset.page);
  });
});

window.addEventListener('DOMContentLoaded', () => {
  const hash = location.hash.replace('#', '') || 'home';
  showSection(hash, false);
  updatePageTitle(hash);
});

window.addEventListener('popstate', e => {
  const page = (e.state && e.state.page) || 'home';
  showSection(page, false);
  updatePageTitle(page);
});

function seeCV() {
  curriculum.style.display = 'block';
  overlay.style.display = 'block';
}

function closeCV() {
  curriculum.style.display = 'none';
  overlay.style.display = 'none';
}

function socialMedia() {
  contacts.style.display = 'block';
  contacts.classList.remove('out');
}

function socialMediaOut() {
  contacts.classList.add('out');
  setTimeout(() => {
    contacts.style.display = 'none';
  }, 200);
}

function downloadImage(imageUrl, filename) {
  fetch(imageUrl)
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    
}

