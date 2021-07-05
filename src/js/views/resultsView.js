import View from './View';
import previewView from './previewView';
// import icons from '../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again ;)';
  _message = '';

  render(data, render = true) {
    if (!data || (Array.isArray(data) && !data.length))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    markup.forEach((el, i) =>
      setTimeout(
        () => this._parentElement.insertAdjacentHTML('beforeend', el),
        100 * i
      )
    );
  }

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false));
  }
}

export default new ResultsView();
