import { serviceGetPictures } from './api';
import Notiflix from 'notiflix';
import { photoCardHtml } from './markup';

const searchForm = document.getElementById('search-form');
const galleryWrap = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const perPage = 40;
let page = 1;

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  const { searchQuery } = searchForm.elements;
  if (!searchQuery.value.trim()) {
    Notiflix.Notify.failure('Please enter some text.');
    return;
  }

  loadMoreBtn.setAttribute('hidden', '');

  page = 1;
  try {
    const response = await serviceGetPictures(searchQuery.value, page, perPage);
    const { data } = response;
    if (data.hits.length === 0) {
      galleryWrap.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    const dataImgHtml = data.hits.map(el => {
      return photoCardHtml(el);
    });

    galleryWrap.innerHTML = dataImgHtml;

    if (data.totalHits > perPage) {
      loadMoreBtn.removeAttribute('hidden');
    }

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

    // scroll
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    console.error(error);
  }
});

loadMoreBtn.addEventListener('click', async event => {
  try {
    const res = await serviceGetPictures(
      searchForm.elements.searchQuery.value,
      ++page,
      perPage
    );
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
  } catch (error) {
    console.log(error);
  }
});
