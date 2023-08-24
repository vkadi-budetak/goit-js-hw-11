import axios from 'axios';

async function serviceGetPictures(searchString, page = 1, perPage = 40) {
  const SEARCH_IMAGES = 'https://pixabay.com/api/';
  const API_KEY = '38948666-72a52c33b9b70edb25ef78ef1';

  try {
    const params = {
      key: API_KEY,
      q: searchString,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: perPage,
      page: page,
    };
    const paramsURL = new URLSearchParams(params).toString();
    const response = await axios.get(`${SEARCH_IMAGES}?${paramsURL}`);

    return response;
  } catch (error) {
    throw new Error(error.message);
  }
}

export { serviceGetPictures };
