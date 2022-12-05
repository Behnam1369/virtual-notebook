import { useState, useRef, useEffect } from 'react';
import Selector from './Selector';
import Pages from './Pages';

export default function Editor() {
  const [position, setPosition] = useState({ top: 50, left: 50 });
  const [value, setValue] = useState('');
  const [text, setText] = useState('');
  const [showSelector, setShowSelector] = useState(false);
  const input = useRef(null);
  const selector = useRef(null);
  const handleFocus = (e) => {
    const rect = e.target.getBoundingClientRect();
    setPosition({ top: rect.y + rect.height + window.scrollY, left: rect.x });
  };

  useEffect(() => {
    // handle window resize
    window.addEventListener('resize', () => {
      const rect = input.current.getBoundingClientRect();
      setPosition({ top: rect.y + rect.height + window.scrollY, left: rect.x });
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

  return (
    <div className="App">
      <Pages />
      <div style={{ height: '400px' }} />
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
      <div style={{ height: '400px' }} />
    </div>
  );
}
