import { configureStore } from '@reduxjs/toolkit';

const ADD_PAGE = 'ADD_PAGE';

const defaultState = {
  pages: [
    {
      id: 1,
      title: 'Home',
      elements: [
        { style: 'h1', text: 'Front-end developer test project' },
        { style: 'p', text: 'Your goal is to make a page that looks exactly like this one, and has the ability to create H1 text simply by typing / then 1, then typing text, and hitting enter.' },
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
    default:
      return state;
  }
}

export function addPage(el) {
  return { ...el, type: ADD_PAGE };
}

export const store = configureStore({ reducer });
