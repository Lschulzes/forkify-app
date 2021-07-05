import View from './View';
import icons from 'url:../../img/icons.svg';

class CartListView extends View {
  _parentElement = '';

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return ` 
          <li class="preview">
            <a class="preview__link ${
              id === this._data.id ? 'preview__link--active' : ''
            }"  href="#${this._data.id}">
              <figure class="preview__fig">
                <img src="${this._data.image}" alt="${this._data.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${this._data.title}</h4>
                <p class="preview__publisher">${this._data.publisher}</p>
                <button class="btn--round cart__btn cart__btn__remove" style="width: 35px; height: 35px; margin-right:1rem;">
                  <svg style="width: 25px; height: 25px;">
                    <use href="${icons}#icon-minus-circle"></use>
                  </svg>
                </button>
              </div>
            </a>
          </li>
    `;
  }
}

export default new CartListView();
