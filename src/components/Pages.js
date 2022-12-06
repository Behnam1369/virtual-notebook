import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BsChevronLeft } from 'react-icons/bs';
import { AiOutlineEdit, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { FaRegTrashAlt } from 'react-icons/fa';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import PropType from 'prop-types';
import {
  addPage, deletePage, editPage, updatePage, cancelEditPage,
} from '../redux/reducer';
import style from './Pages.module.scss';

export default function Pages(props) {
  const { togglePages } = props;
  const pages = useSelector((state) => state.pages);
  const [text, setText] = useState('');
  const [editingText, setEditingText] = useState('');
  const [error, setError] = useState('');

  // to implement blinking animation
  const setErrorWithAnimation = (errorText) => {
    setError(null);
    setTimeout(() => {
      setError(errorText);
    }, 100);
  };

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text) {
      setErrorWithAnimation('Please enter page title');
    } else {
      setText('');
      setError('');
      dispatch(addPage({ title: text }));
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (text) {
      setError('');
    }
  };

  const firstId = useSelector((state) => state.pages[0]).id;

  // in case of visiting home page use the first page id
  const urlId = (
    useParams().id !== undefined
      ? parseInt(useParams().id, 10)
      : firstId);

  const navigate = useNavigate();

  const handleDelete = (id) => {
    if (pages.length === 1) {
      setErrorWithAnimation('Page list cannot be empty');
    } else {
      dispatch(deletePage({ id }));

      // if user deleted the current page, navigate to the first page
      if (id === urlId) {
        navigate(`/pages/${firstId}`);
      }
    }
  };

  const handleEdit = (id, title) => {
    dispatch(editPage({ id }));
    setEditingText(title);
  };

  const handleCancelEdit = (id) => {
    dispatch(cancelEditPage({ id }));
  };

  const handleUpdate = (e, id) => {
    e.preventDefault();
    if (!editingText) {
      setErrorWithAnimation('Please enter page title');
    } else {
      dispatch(updatePage({ id, title: editingText }));
    }
  };

  return (
    <div className={style.pages}>
      <div className={style.header}>
        <h2>Pages</h2>
        <button type="button" onClick={togglePages}>
          <BsChevronLeft />
        </button>
      </div>
      <ul data-testid="pageList">
        {pages.map((page) => (
          <li key={page.id}>
            {page.editing && (
            <form onSubmit={(e) => handleUpdate(e, page.id)}>
              <input type="text" data-testid="editingPageInput" value={editingText} onChange={(e) => setEditingText(e.target.value)} />
              <div>
                <button type="submit">
                  <AiOutlineCheck title="Save" />
                </button>
                <button type="button" onClick={() => handleCancelEdit(page.id)}>
                  <AiOutlineClose title="Cancel" />
                </button>
              </div>
            </form>
            )}
            {!page.editing
            && (
            <>
              <NavLink to={`/pages/${page.id}`}>{ page.title }</NavLink>
              <div>
                <button type="button" onClick={() => handleEdit(page.id, page.title)}>
                  <AiOutlineEdit title="Edit" />
                </button>
                <button type="button" onClick={() => handleDelete(page.id)}>
                  <FaRegTrashAlt title="Delete" />
                </button>
              </div>
            </>
            )}
          </li>
        ))}
      </ul>
      <form className={style.footer} onSubmit={(e) => handleSubmit(e)}>
        <input type="text" data-testid="newPageInput" value={text} onChange={(e) => handleTextChange(e)} placeholder="Type new pag's title" maxLength={25} />
        <button type="submit">
          Add Page
        </button>
        {error && <p data-testid="message">{error}</p>}
      </form>
    </div>
  );
}

Pages.propTypes = {
  togglePages: PropType.func.isRequired,
};
