import { useState, useRef } from 'react';
import Selector from './Selector';

export default function Editor() {
  const [position, setPosition] = useState({ top: 50, left: 50 });
  const [value, setValue] = useState('');
  const [text, setText] = useState('');
  const [showSelector, setShowSelector] = useState(false);
  const selector = useRef(null);
  const handleFocus = (e) => {
    const rect = e.target.getBoundingClientRect();
    setPosition({ top: rect.y + rect.height, left: rect.x });
  };

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
      <input
        type="text"
        onFocus={(e) => { handleFocus(e); }}
        value={value}
        onChange={(e) => handleChange(e)}
        onKeyUp={(e) => handleKeyDown(e)}
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
  );
}
