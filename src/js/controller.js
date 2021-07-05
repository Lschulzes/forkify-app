import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchview.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchview from './views/searchview.js';
import { MODAL_CLOSE_SEC } from './config.js';
import sortView from './views/sortView.js';
import cartView from './views/cartView.js';
// const { title } = require('process');
// const { async } = require('q');
// if (module.hot) {
//   module.hot.accept();
// }

if (module.hot) {
  module.hot.accept(function () {
    window.location.reload();
  });
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    // 1)loading recipe
    recipeView.renderSpinner();
    await model.loadRecipe(id);
    // 2)rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // console.error(`Something went wrong! ${err}`);
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    await model.loadSearchResults(query);
    // sort results
    model.sortResults();
    // Render results
    resultsView.render(model.getSearchResultsPage());
    // Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  const recipe = model.state.recipe;
  // Adding/Removing bookmark to the data
  !recipe.bookmarked
    ? model.addBookmark(recipe)
    : model.deleteBookmark(recipe.id);
  // Updating bookmark icon
  recipeView.update(recipe);
  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarkLoad = function () {
  bookmarksView.render(model.state.bookmarks);
};

// const clearBookmarks = function () {
//   localStorage.clear('bookmarks');
//   localStorage.clear('cart');
// };
// clearBookmarks();

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    // Render Recipe
    recipeView.render(model.state.recipe);
    // Success Message
    addRecipeView.renderMessage();
    // Close form window
    setTimeout(() => addRecipeView.toggleWindow(), MODAL_CLOSE_SEC * 1000);
    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);
    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const controlSortResults = function () {
  model.sortResults();
  controlPagination(1);
};

const controlCartItems = function () {
  const recipe = model.state.recipe;
  // Adding/Removing cart item to the data
  !recipe.cartItem
    ? model.addCartItem(recipe)
    : model.deleteCartItem(recipe.id);
  // Updating cart icon
  recipeView.update(recipe);
  controlCartView();
};

const controlCartView = function () {
  resultsView.renderSpinner();
  // sort results
  model.sortResults();
  // Render results
  cartView.render(model.state.cart);
};

const controlRemoveCartItems = function (recipeId) {
  model.deleteCartItem(recipeId);
  controlCartView();
  recipeView.update(model.state.recipe);
};

(() => {
  bookmarksView.addHandlerRender(controlBookmarkLoad);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  sortView.addHandlerSort(controlSortResults);
  recipeView.addHandlerAddCart(controlCartItems);
  cartView.addHandlerShow(controlCartView);
  cartView.addHandlerRemove(controlRemoveCartItems);
})();
