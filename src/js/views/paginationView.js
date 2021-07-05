import View from './View';
import icons from 'url:../../img/icons.svg';
import { RES_PER_PAGE } from '../config';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / RES_PER_PAGE);
    const prevPage = this._generateMarkupPagePrev();
    const nextPage = this._generateMarkupPageNext();
    let allPages = Array.from({ length: numPages }, (_, i) => i + 1).map(
      (_, i) => this._generateMarkupBetween(i + 1)
    );
    let displayPag = allPages
      .filter((_, i) => i + 1 <= curPage + 2 && i + 1 >= curPage - 2)
      .join('');
    displayPag = '<div class="bet-center">' + displayPag + '</div>';
    // Page 1 and there are other pages
    if (curPage === 1 && numPages > 1)
      return '<div class="fill-d"></div>' + displayPag + nextPage;
    // Page 1 and there are NO other pages
    if (curPage === 1 && numPages === 1) return ``;
    // Last page
    if (curPage === numPages)
      return prevPage + displayPag + '<div class="fill-d"></div>';
    // Other page
    if (curPage < numPages) {
      return prevPage + displayPag + nextPage;
    }
  }

  _generateMarkupPagePrev() {
    return `
    <button data-goto="${
      this._data.page - 1
    }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
    <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Previous</span>
    </button>
    `;
  }

  _generateMarkupPageNext() {
    return `
    <button data-goto="${
      this._data.page + 1
    }" class="btn--inline pagination__btn--next">
      <span>Next</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `;
  }

  _generateMarkupBetween(page) {
    return `
    <button data-goto="${page}" class="btn--inline pagination__btn--between ${
      this._data.page === page ? 'current' : ''
    }">
      <span>${page}</span>
    </button>
    `;
  }
}

export default new PaginationView();
