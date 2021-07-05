import View from './View';
import cartListView from './cartListView';
import icons from 'url:../../img/icons.svg';

class CartView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No items added to the cart';
  showing = false;

  addHandlerShow(handler) {
    document.querySelector('.nav').addEventListener('click', e => {
      const btn = e.target.closest('.cart__btn__show');
      if (!btn) return;
      handler();
    });
  }

  addHandlerRemove(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.cart__btn__remove');
      if (!btn) return;
      e.preventDefault();
      const recipeId = e.target
        .closest('.preview__link')
        .getAttribute('href')
        .slice(1);
      handler(recipeId);
    });
  }

  _generateBuy() {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = `
    <button class="btn--buy">
      <svg class="search__icon">
        <use href="${icons}#icon-send"></use>
      </svg>
      <span>Receive Recipes</span>
    </button>
    `;
  }

  _generateMarkup() {
    this._generateBuy();
    return this._data.map(el => cartListView.render(el, false));
  }
}

export default new CartView();
