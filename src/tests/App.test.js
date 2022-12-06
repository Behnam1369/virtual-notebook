import userEvent from '@testing-library/user-event';
import TestRenderer from 'react-test-renderer';
import {
  render,
  screen,
  fireEvent,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import { store } from '../redux/reducer';
import App from '../App';

describe('Snapshot test:', () => {
  it('Rendered App component should match the snapshot', () => {
    const testRenderer = TestRenderer.create(
      <Provider store={store}>
        <App />
      </Provider>,
    ).toJSON();
    expect(testRenderer).toMatchSnapshot();
  });
});

describe('Integration tests for Pages:', () => {
  it('By default a home page should be available', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    fireEvent.click(screen.getByTestId('hamburgurButton'));
    expect(screen.getByTestId('pageList')).toHaveTextContent('Home');
  });

  it('Adding a page by dispatching an action', () => {
    store.dispatch({ type: 'ADD_PAGE', title: 'New Page' });
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId('hamburgurButton'));
    expect(screen.getByTestId('pageList')).toHaveTextContent('New Page');
  });

  it('Adding a page by submitting values on the form', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId('hamburgurButton'));
    const input = screen.getByTestId('newPageInput');
    fireEvent.change(input, { target: { value: 'Third Page' } });
    fireEvent.click(screen.getByText('Add Page'));
    expect(screen.getByTestId('pageList')).toHaveTextContent('Third Page');
  });

  it('Shouldn\'t be able to add a page without a title', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId('hamburgurButton'));
    const input = screen.getByTestId('newPageInput');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByText('Add Page'));
    expect(screen.getByTestId('pageList').children).toHaveLength(3);
  });

  it('By clicking on the Edit button an input should be available for editing', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId('hamburgurButton'));
    const pageList = screen.getByTestId('pageList');
    const editButton = pageList.getElementsByTagName('button')[0];
    fireEvent.click(editButton);
    const input = screen.getByTestId('editingPageInput');
    expect(input).toBeInTheDocument();
  });

  it('By clicking on the Edit button an input should be available for editing', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId('hamburgurButton'));
    const pageList = screen.getByTestId('pageList');
    const input = screen.getByTestId('editingPageInput');
    fireEvent.change(input, { target: { value: 'New Home Page' } });
    const submitButton = pageList.getElementsByTagName('button')[0];
    fireEvent.click(submitButton);
    expect(pageList).toHaveTextContent('New Home Page');
  });

  it('By clicking on the delete button, it should remove a page', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId('hamburgurButton'));
    const pageList = screen.getByTestId('pageList');
    const deleteButton = pageList.getElementsByTagName('button')[5];
    fireEvent.click(deleteButton);
    expect(pageList.children).toHaveLength(2);
  });
});

describe('Integration tests for Elements:', () => {
  it('By default an input should be available', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    const input = screen.getByTestId('newElementInput');
    expect(input).toBeInTheDocument();
  });

  it('Input should have a "p" class', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    const input = screen.getByTestId('newElementInput');
    expect(input).toHaveClass('p');
  });

  it('By pressing "/" a selector should appear', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    const input = screen.getByTestId('newElementInput');
    fireEvent.keyDown(input, { key: '/' });
    const selector = screen.getByTestId('selector');
    expect(selector).toBeInTheDocument();
  });

  it('Selector should contain an H1 option', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    const input = screen.getByTestId('newElementInput');
    fireEvent.keyDown(input, { key: '/' });
    const selector = screen.getByTestId('selector');
    expect(selector).toHaveTextContent('H1');
  });

  it('By filtering "H1" Other options shouldn\' be available', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    const input = screen.getByTestId('newElementInput');
    fireEvent.keyDown(input, { key: '/' });
    fireEvent.change(input, { target: { value: '/h1' } });
    const selector = screen.getByTestId('selector');
    expect(selector).toHaveTextContent('H1');
    expect(selector).not.toHaveTextContent('H2');
  });

  it('By Hitting enter an h1 markdown should be applied', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    const input = screen.getByTestId('newElementInput');
    fireEvent.keyDown(input, { key: '/' });
    fireEvent.change(input, { target: { value: '/h1' } });
    userEvent.type(input, '{enter}');
    expect(input).toHaveClass('h1');
  });

  it('By Hitting one more time a P element with h1 class should be added', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    const input = screen.getByTestId('newElementInput');
    fireEvent.keyDown(input, { key: '/' });
    fireEvent.change(input, { target: { value: '/h1' } });
    userEvent.type(input, '{enter}');
    userEvent.type(input, '{enter}');
    const element = screen.getByTestId('editor').querySelector('p.h1');
    expect(element).toBeInTheDocument();
  });
});
