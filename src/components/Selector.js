import React, {
  useState, useRef, useEffect, forwardRef, useImperativeHandle,
} from 'react';
import PropTypes, { string } from 'prop-types';
import style from './Selector.module.scss';

const data = [
  { id: 'h1', title: 'Heading 1' },
  { id: 'h2', title: 'Heading 2' },
  { id: 'h3', title: 'Heading 3' },
  { id: 'h4', title: 'Heading 4' },
  { id: 'h5', title: 'Heading 5' },
  { id: 'h6', title: 'Heading 6' },
  { id: 'i', title: 'Italic' },
  { id: 'b', title: 'Bold' },
  { id: 'u', title: 'Underline' },
  { id: 'p', title: 'Paragraph' },
];

const rowHeight = 55;
const maxHeight = 300;

const Selector = forwardRef((props, ref) => {
  const { selectionChanged, position, text } = props;
  const [visibleData, setVisibleData] = useState(data);

  // index of highlighted element
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const ul = useRef(null);

  const container = useRef(null);

  useEffect(() => {
    // receive text from Editor component as a prop and do filtering operation
    setVisibleData(
      data.filter((item) => item.title.toLowerCase().includes(text.toLowerCase())
        || item.id.toLowerCase().includes(text.toLowerCase())),
    );
  }, [text]);

  // to execute commands triggered in Editor component
  useImperativeHandle(ref, () => ({

    handleKeyDown(e) {
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        if (suggestionIndex <= visibleData.length - 2) {
          setSuggestionIndex(suggestionIndex + 1);
          const top = ul.current.scrollTop;
          if (
            (suggestionIndex + 2) * rowHeight
          > top + maxHeight + 2
          ) {
            ul.current.scrollTop = (suggestionIndex + 2) * rowHeight
            - (maxHeight + 2);
          }
        }
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        if (suggestionIndex >= 1) {
          const top = ul.current.scrollTop;
          if ((suggestionIndex - 1) * rowHeight < top) {
            ul.current.scrollTop = (suggestionIndex - 1) * rowHeight;
          }
          setSuggestionIndex(suggestionIndex - 1);
        }
      } else if (e.code === 'Enter') {
        e.preventDefault();
        selectionChanged(visibleData[suggestionIndex].id);
      }
    },
  }));

  return (
    <div
      className={style.container}
      ref={container}
      style={{ top: position.top, left: position.left }}
    >
      <b>Add Blocks</b>
      <span>Keep typing to filter, or escape to exit</span>
      {text && (
      <span>
        filtering keyword
        {' '}
        <b>{text}</b>
      </span>
      )}
      <ul className={style.ul} ref={ul}>
        {visibleData.map((item, i) => (
          <li
            key={item.id}
            className={`${style.li} ${
              i === suggestionIndex ? style.suggestion : ''
            }`}
            // onMouseOver={() => setSuggestionIndex(i)}
            // onFocus={() => setSuggestionIndex(i)}
            style={{
              maxWidth: '300px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
            }}
            title={item.title}
          >
            <button type="button" onClick={() => selectionChanged(item.id)}>
              <b>{item.id.toUpperCase()}</b>
              <div dangerouslySetInnerHTML={{ __html: `<${item.id}> ${item.title} </${item.id}>` }} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});

Selector.propTypes = {
  selectionChanged: PropTypes.func.isRequired,
  position: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
  }).isRequired,
  text: string,
};

Selector.defaultProps = {
  text: '',
};

Selector.displayName = 'Selector';
export default Selector;
