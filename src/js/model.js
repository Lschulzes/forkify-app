import { async } from 'regenerator-runtime';
import { API_URL, KEY, RES_PER_PAGE } from './config';
import { AJAX } from './helper';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
    sorted: false,
  },
  bookmarks: [],
  cart: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image_url,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    // As the recipe is loaded, the bookmarks (id) are checked, if bookmarked
    // then set to true, and the icon is going to be filled
    state.recipe.bookmarked = state.bookmarks.some(
      bookmark => bookmark.id === id
    )
      ? true
      : false;
    state.recipe.cartItem = state.cart.some(item => item.id === id)
      ? true
      : false;
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const { data } = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        image: rec.image_url,
        publisher: rec.publisher,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
    state.search.numOfPages = Math.ceil(
      state.search.results.length / RES_PER_PAGE
    );
  } catch (err) {
    console.log(`${err} llllllll`);
  }
};

export const sortResults = function () {
  state.search.results.sort((a, b) => {
    let na = a.title.toLowerCase(),
      nb = b.title.toLowerCase();
    if (!state.search.sorted) return na < nb ? -1 : 1;
    return na > nb ? -1 : 1;
  });
  state.search.sorted = state.search.sorted ? false : true;
  state.search.page = 1;
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = state.search.resultsPerPage * (page - 1);
  const end = state.search.resultsPerPage * page;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
  );

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);
  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  // mark current recipe as NOT bookmarked anymore
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

(function () {
  const storageBookmark = localStorage.getItem('bookmarks');
  if (storageBookmark) state.bookmarks = JSON.parse(storageBookmark);
  const storageCart = localStorage.getItem('cart');
  if (storageCart) state.cart = JSON.parse(storageCart);
})();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong Ingredient format! Please use the correct format :)'
          );
        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const persistCart = function () {
  localStorage.setItem('cart', JSON.stringify(state.cart));
};

export const addCartItem = function (recipe) {
  // Add cart item
  state.cart.push(recipe);
  // Mark current recipe as add to cart
  if (recipe.id === state.recipe.id) state.recipe.cartItem = true;
  persistCart();
};

export const deleteCartItem = function (id) {
  // delete cart item
  const index = state.cart.findIndex(el => el.id === id);
  state.cart.splice(index, 1);
  // mark current recipe as NOT added to cart anymore
  if (id === state.recipe.id) state.recipe.cartItem = false;
  persistCart();
};
