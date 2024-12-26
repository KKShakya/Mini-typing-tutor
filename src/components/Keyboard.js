import React from 'react';
import './Keyboard.css';

const Keyboard = ({ currentChar, onKeyPress }) => {
  const keyboardLayout = {
    row1: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    row2: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    row3: ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
    row4: ['space']
  };

  const isKeyHighlighted = (key) => {
    const targetChar = currentChar?.toLowerCase() || '';
    return key === (targetChar === ' ' ? 'space' : targetChar);
  };

  return (
    <div className="keyboard-container">
      <div className="keyboard">
        <div className="keyboard-row">
          {keyboardLayout.row1.map((key) => (
            <div 
              key={key} 
              className={`key ${isKeyHighlighted(key) ? 'highlighted' : ''}`}
              onClick={() => onKeyPress(key)}
            >
              {key}
            </div>
          ))}
        </div>
        <div className="keyboard-row">
          <div className="spacer-half"></div>
          {keyboardLayout.row2.map((key) => (
            <div 
              key={key} 
              className={`key ${isKeyHighlighted(key) ? 'highlighted' : ''}`}
              onClick={() => onKeyPress(key)}
            >
              {key}
            </div>
          ))}
          <div className="spacer-half"></div>
        </div>
        <div className="keyboard-row">
          <div className="spacer"></div>
          {keyboardLayout.row3.map((key) => (
            <div 
              key={key} 
              className={`key ${isKeyHighlighted(key) ? 'highlighted' : ''}`}
              onClick={() => onKeyPress(key)}
            >
              {key}
            </div>
          ))}
          <div className="spacer"></div>
        </div>
        <div className="keyboard-row">
          {keyboardLayout.row4.map((key) => (
            <div 
              key={key} 
              className={`key space-key ${isKeyHighlighted(key) ? 'highlighted' : ''}`}
              onClick={() => onKeyPress(' ')}
            >
              {key}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
