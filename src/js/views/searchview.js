import icons from 'url:../../img/icons.svg';

class SearchView {
  _parentElement = document.querySelector('.search');
  _data;

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }

  _clear() {
    this._displayList.innerHTML = '';
  }
}

export default new SearchView();
