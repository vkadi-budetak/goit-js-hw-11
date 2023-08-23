import axios from 'axios';
import Notiflix from 'notiflix';

const searchForm = document.getElementById('search-form');
const galleryWrap = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const perPage = 40;
let page = 1;

async function serviceGetPictures(searchString, page = 1) {
  const SEARCH_IMAGES = 'https://pixabay.com/api/';
  const API_KEY = '38948666-72a52c33b9b70edb25ef78ef1';

  const data = await axios(
    `${SEARCH_IMAGES}?key=${API_KEY}&q=${searchString}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
  );
  return data;
}

function photoCardHtml({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        <span>${likes}<span/>
      </p>
      <p class="info-item">
        <b>Views</b>
        <span>${views}<span/>
      </p>
      <p class="info-item">
        <b>Comments</b>
        <span>${comments}<span/>
      </p>
      <p class="info-item">
        <b>Downloads</b>
        <span>${downloads}<span/>
      </p>
    </div>
  </div>`;
}

// console.log(serviceGetPictures('cats'));

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const { searchQuery } = searchForm.elements;
  if (!searchQuery.value) {
    Notiflix.Notify.failure('Please enter some text.');
    return;
  }

  loadMoreBtn.setAttribute('hidden', '');

  page = 1;
  serviceGetPictures(searchQuery.value)
    .then(response => {
      console.log(response);
      const { data } = response;
      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      const dataImgHtml = data.hits.map(el => {
        return photoCardHtml(el);
      });

      galleryWrap.innerHTML = dataImgHtml;

      loadMoreBtn.removeAttribute('hidden');

      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

      // scroll
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    })
    .catch(error => {
      console.error(error);
    });
});

loadMoreBtn.addEventListener('click', event => {
  serviceGetPictures(searchForm.elements.searchQuery.value, ++page)
    .then(res => {
      const { data } = res;
      const dataImgHtml = data.hits.map(el => {
        return photoCardHtml(el);
      });
      galleryWrap.innerHTML += dataImgHtml;

      if (perPage * page >= data.totalHits) {
        Notiflix.Notify.success(
          "We're sorry, but you've reached the end of search results."
        );
        loadMoreBtn.setAttribute('hidden', '');
      }

      // scroll
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    })
    .catch(err => {
      console.error(err);
    });
});
