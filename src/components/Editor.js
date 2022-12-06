import {
  useState, useRef, useEffect, Fragment,
} from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  FiUnlock, FiChevronDown, FiArrowDownLeft, FiCheckCircle, FiCloud,
} from 'react-icons/fi';
import { BsClock } from 'react-icons/bs';
import { GiRabbitHead } from 'react-icons/gi';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import {
  addElement, editElement, updateElement, deleteElement, cencelEditElement,
} from '../redux/reducer';
import Selector from './Selector';
import Pages from './Pages';
import style from './Editor.module.scss';
import Error404 from './Error404';

export default function Editor() {
  // The position of the selector
  const [position, setPosition] = useState({ top: 0, left: 0 });
  // whole input value
  const [value, setValue] = useState('');
  // only search phrase (text afte '/')
  const [text, setText] = useState('');
  const [editingElementId, setEditingElementId] = useState(null);
  const [showSelector, setShowSelector] = useState(false);
  const [showPages, setShowPages] = useState(false);
  // h1, p, h2, h3, h4, h5, h6, i, b, u, p
  const [tagClass, setTagClass] = useState('p');
  const input = useRef(null);
  const selector = useRef(null);
  const dispatch = useDispatch();

  // recalculate the position of the selector when focusing on the input
  const handleFocus = (e) => {
    const rect = e.target.getBoundingClientRect();
    setPosition({ top: rect.y + rect.height + window.scrollY, left: rect.x });
  };

  const firstId = useSelector((state) => state.pages[0]).id;

  // in case of visiting home page use the first page id
  const id = (
    useParams().id !== undefined
      ? parseInt(useParams().id, 10)
      : firstId);
  const page = useSelector((state) => state.pages.find((p) => p.id === id));

  useEffect(() => {
    dispatch(cencelEditElement());
    setTagClass('p');
    setValue('');
  }, [id]);

  useEffect(() => {
    if (input.current != null) input.current.focus();
  }, [editingElementId]);

  useEffect(() => {
    // handle window resize
    window.addEventListener('resize', () => {
      // set position of selector
      if (input !== null) {
        const rect = input.current.getBoundingClientRect();
        setPosition({ top: rect.y + rect.height + window.scrollY, left: rect.x });
      }

      // set show pages panel
      if (window.innerWidth < 768) {
        setShowPages(false);
      } else {
        setShowPages(true);
      }
    });
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === '/') {
      const rect = e.target.getBoundingClientRect();
      setPosition({ top: rect.y + rect.height + window.scrollY, left: rect.x });
      setShowSelector(true);
    } else if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
      e.preventDefault();
      selector.current.handleKeyDown(e);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (showSelector) {
        selector.current.handleKeyDown(e);
      } else {
        if (editingElementId === null) {
          dispatch(addElement({ pageId: page.id, style: tagClass, text: value }));
        } else if (value === '') {
          dispatch(deleteElement({
            pageId: page.id, ElementId: editingElementId,
          }));
        } else {
          dispatch(updateElement({
            pageId: page.id, ElementId: editingElementId, style: tagClass, text: value,
          }));
        }
        setEditingElementId(null);
        setValue('');
        setTagClass('p');
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowSelector(false);
    }
  };

  const handleChange = (e) => {
    const str = e.target.value;
    setValue(str);
    if (str.includes('/')) {
      const arr = str.split('/');
      setText(arr[arr.length - 1]);
    } else {
      setShowSelector(false);
    }
  };

  const selectionChanged = (val) => {
    setTagClass(val);
    setShowSelector(false);
    setValue(value.split('/').slice(0, -1).join('/'));
  };

  const togglePages = () => {
    setShowPages(!showPages);
  };

  const handleEdit = (pageId, element) => {
    setTagClass(element.style);
    setValue(element.text);
    setEditingElementId(element.id);
    dispatch(editElement({ pageId, ElementId: element.id }));
  };

  return (
    <>
      {!page && <Error404 />}
      {page && (
      <div className={style.container} data-testid="editor">
        {showPages && (
        <Pages
          className={style.pages}
          togglePages={togglePages}
        />
        )}
        <div className={style.main}>
          <div className={style.header}>
            <div>
              {!showPages && (
              <>
                <button data-testid="hamburgurButton" type="button" onClick={() => togglePages()}>
                  <RxHamburgerMenu />
                </button>
              </>
              )}
              <p>
                {`Main / Pages / ${page.title}`}
              </p>
            </div>
            <div>
              <p>
                <span>
                  <FiUnlock />
                  {' '}
                  Editing
                </span>
                |
                <span>
                  Publish Space
                  <FiChevronDown />
                </span>
              </p>
            </div>
          </div>
          <div className={style.body}>
            <div className={style.options}>
              <div>
                <span>P</span>
                |
                <BsClock />
                |
                <GiRabbitHead />
                |
                <FiArrowDownLeft />
                0
              </div>
              <div>
                <FiCheckCircle />
                <FiCloud />
                <BiDotsVerticalRounded />
              </div>
            </div>
            <h1>{page.title}</h1>
            {
              page.elements.map((el) => (
                <Fragment key={el.id}>
                  { el.editing
                    && (
                    <input
                      type="text"
                      className={`${style.input} ${style[tagClass]}`}
                      onFocus={(e) => { handleFocus(e); }}
                      value={value}
                      onChange={(e) => handleChange(e, input)}
                      onKeyDown={(e) => handleKeyDown(e)}
                      ref={input}
                      placeholder="Type / for blocks"
                      data-testid="editingElementInput"
                    />
                    )}
                  { !el.editing
                    && (
                    // eslint-disable-next-line max-len
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
                    <p
                      className={style[el.style]}
                      onClick={() => handleEdit(page.id, el)}
                    >
                      {el.text}
                    </p>
                    ) }
                </Fragment>
              ))
            }
            {
              page.elements.filter((el) => el.editing).length === 0 && (
              <input
                type="text"
                className={`${style.input} ${style[tagClass]}`}
                onFocus={(e) => { handleFocus(e); }}
                value={value}
                onChange={(e) => handleChange(e, input)}
                onKeyDown={(e) => handleKeyDown(e)}
                ref={input}
                placeholder="Type / for blocks"
                data-testid="newElementInput"
              />
              )
            }
            {showSelector && (
            <Selector
              selectionChanged={(val) => selectionChanged(val)}
              position={position}
              ref={selector}
              text={text}
            />
            )}
          </div>
        </div>
      </div>
      )}
    </>
  );
}
