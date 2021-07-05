import View from './View';

class SortView extends View {
  _parentElement = document.querySelector('.sort');

  addHandlerSort(handler) {
    this._parentElement.addEventListener('click', () => {
      document.querySelector('.arrow').classList.toggle('arrow-animation');
      document.querySelector('.arrow').classList.toggle('arrow-deanimation');
      handler();
    });
  }
}

export default new SortView();
