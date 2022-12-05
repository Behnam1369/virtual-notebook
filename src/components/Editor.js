import { useState, useRef, useEffect } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiUnlock, FiChevronDown, FiArrowDownLeft, FiCheckCircle, FiCloud,
} from 'react-icons/fi';
import { BsClock } from 'react-icons/bs';
import { GiRabbitHead } from 'react-icons/gi';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import Selector from './Selector';
import Pages from './Pages';
import style from './Editor.module.scss';

export default function Editor() {
  const [position, setPosition] = useState({ top: 50, left: 50 });
  const [value, setValue] = useState('');
  const [text, setText] = useState('');
  const [showSelector, setShowSelector] = useState(false);
  const [showPages, setShowPages] = useState(false);
  const input = useRef(null);
  const selector = useRef(null);
  const handleFocus = (e) => {
    const rect = e.target.getBoundingClientRect();
    setPosition({ top: rect.y + rect.height + window.scrollY, left: rect.x });
  };

  const id = (
    useParams().id !== undefined
      ? parseInt(useParams().id, 10)
      : useSelector((state) => state.pages[0]).id);
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
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      selector.current.handleKeyDown(e);
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
    console.log(val);
    setShowSelector(false);
  };

  const togglePages = () => {
    setShowPages(!showPages);
  };

  return (
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
          <input
            type="text"
            onFocus={(e) => { handleFocus(e); }}
            value={value}
            onChange={(e) => handleChange(e)}
            onKeyUp={(e) => handleKeyDown(e)}
            ref={input}
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
  );
}
