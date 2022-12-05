import { configureStore } from '@reduxjs/toolkit';

// Page actions
const ADD_PAGE = 'ADD_PAGE';
const DELETE_PAGE = 'DELETE_PAGE';
const EDIT_PAGE = 'EDIT_PAGE';
const CANCEL_EDIT_PAGE = 'CANCEL_EDIT_PAGE';
const UPDATE_PAGE = 'UPDATE_PAGE';

// Element actions
const ADD_ELEMENT = 'ADD_ELEMENT';

const defaultState = {
  pages: [
    {
      id: 1,
      title: 'Home',
      elements: [
        { id: 1, style: 'h2', text: 'Front-end developer test project' },
        { id: 2, style: 'p', text: 'Your goal is to make a page that looks exactly like this one, and has the ability to create H1 text simply by typing / then 1, then typing text, and hitting enter.' },
      ],
    },
  ],
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case ADD_PAGE:
      return {
        ...state,
        pages: [...state.pages,
          {
            id: state.pages.length === 0 ? 1 : (state.pages[state.pages.length - 1].id) + 1,
            title: action.title,
            elements: [],
          }],
      };
    case DELETE_PAGE:
      return {
        ...state,
        pages: state.pages.filter((page) => page.id !== action.id),
      };
    case EDIT_PAGE:
      return {
        ...state,
        pages: state.pages.map((page) => (page.id === action.id
          ? { ...page, editing: true }
          : { ...page, editing: false })),
      };
    case UPDATE_PAGE:
      return {
        ...state,
        pages: state.pages.map((page) => (page.id === action.id
          ? { ...page, title: action.title, editing: false }
          : page)),
      };
    case CANCEL_EDIT_PAGE:
      return {
        ...state,
        pages: state.pages.map((page) => ({ ...page, editing: false })),
      };
    case ADD_ELEMENT:
      return {
        ...state,
        pages: state.pages.map((page) => (page.id === action.pageId
          ? {
            ...page,
            elements: [...page.elements, {
              id: page.elements.length === 0 ? 1 : (page.elements[page.elements.length - 1].id) + 1,
              style: action.style,
              text: action.text,
            }],
          }
          : page)),
      };
    default:
      return state;
  }
}

export function addPage(el) {
  return { ...el, type: ADD_PAGE };
}

export function deletePage(el) {
  return { ...el, type: DELETE_PAGE };
}

export function editPage(el) {
  return { ...el, type: EDIT_PAGE };
}

export function cancelEditPage(el) {
  return { ...el, type: CANCEL_EDIT_PAGE };
}

export function updatePage(el) {
  return { ...el, type: UPDATE_PAGE };
}

export function addElement(el) {
  return { ...el, type: ADD_ELEMENT };
}

const persistedState = localStorage.getItem('virtual_notebook')
  ? JSON.parse(localStorage.getItem('virtual_notebook'))
  : defaultState;

export const store = configureStore({ reducer, preloadedState: persistedState });
store.subscribe(() => {
  localStorage.setItem('virtual_notebook', JSON.stringify(store.getState()));
});
