import { useState, useRef, useEffect } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  FiUnlock, FiChevronDown, FiArrowDownLeft, FiCheckCircle, FiCloud,
} from 'react-icons/fi';
import { BsClock } from 'react-icons/bs';
import { GiRabbitHead } from 'react-icons/gi';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { addElement } from '../redux/reducer';
import Selector from './Selector';
import Pages from './Pages';
import style from './Editor.module.scss';
import Error404 from './Error404';

export default function Editor() {
  const [position, setPosition] = useState({ top: 50, left: 50 });
  // whole input value
  const [value, setValue] = useState('');
  // only search phrase (text afte '/')
  const [text, setText] = useState('');
  const [showSelector, setShowSelector] = useState(false);
  const [showPages, setShowPages] = useState(false);
  const [tagClass, setTagClass] = useState('p');
  const input = useRef(null);
  const selector = useRef(null);
  const dispatch = useDispatch();
  const handleFocus = (e) => {
    const rect = e.target.getBoundingClientRect();
    setPosition({ top: rect.y + rect.height + window.scrollY, left: rect.x });
  };

  const firstId = useSelector((state) => state.pages[0]).id;
  const id = (
    useParams().id !== undefined
      ? parseInt(useParams().id, 10)
      : firstId);
  const page = useSelector((state) => state.pages.find((p) => p.id === id));
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
      setShowSelector(true);
    } else if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
      e.preventDefault();
      selector.current.handleKeyDown(e);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (showSelector) {
        selector.current.handleKeyDown(e);
      } else {
        dispatch(addElement({ pageId: page.id, style: tagClass, text: value }));
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

  return (
    <>
      {!page && <Error404 />}
      {page && (
      <div className={style.container}>
        {showPages && <Pages className={style.pages} togglePages={togglePages} />}
        <div className={style.main}>
          <div className={style.header}>
            <div>
              {!showPages && (
              <>
                <button type="button" onClick={() => togglePages()}>
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
            page.elements.map((el) => <p key={el.id} className={style[el.style]}>{el.text}</p>)
          }
            <input
              type="text"
              className={`${style.input} ${style[tagClass]}`}
              onFocus={(e) => { handleFocus(e); }}
              value={value}
              onChange={(e) => handleChange(e)}
              onKeyDown={(e) => handleKeyDown(e)}
              ref={input}
              placeholder="Type / for blocks"
            />
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
