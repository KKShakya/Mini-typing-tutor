import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Keyboard from '../components/Keyboard';

import {
  resetStartTime,
  updateCombination,
  updateNext,
  updateRepetition,
  updateSource,
  updateVisualText,
  updateMinutes,
  updateSeconds,
  generateTwoWords,
  generateThreeWords,
  generateFourWords,
  generateFiveWords
} from '../redux/typingReducer';
import { genWordlist, shuffleArray, repeat } from '../components/HomehelperFunctions';

import Click from '../assets/media/click.mp3'
import ding from '../assets/media/ding.wav'
import clack from '../assets/media/clack.mp3'

import './home.css'
import { getNextKeyDef } from '@testing-library/user-event/dist/keyboard/getNextKeyDef';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  //root to build visualText
  const letters =
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  //WPM checks for Words per minute
  // current index checks for the visual text and typed text character matching
  //correctChar Char checks for the length of correct user input
  //totalTyped Char checks for the length of total user input, to calulate WPM typed
  //accuracy determines user Accuracy in 5 min time frame

  const [currentIndex, setCurrentIndex] = useState(0)
  const [WPM, setWPM] = useState(0)
  const [correctChar, setCorrect] = useState(0);
  const [totalTypedChar, setChar] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  // Add state for timer input
  const [timerInput, setTimerInput] = useState(5);

  // redux useCase connections
  const { n, combination, repetition, visualText, next, startTime, minutes, seconds } = useSelector((store) => store)
  const dispatch = useDispatch();
  console.log(n, repetition, next)

  //update length of words
  const handleSource = (e) => {
    console.log(typeof e.target.value)
    dispatch(updateSource(e.target.value));
  }

  // Audio elements ref
  const clickAudioRef = useRef(null);
  const wrongKeyRef = useRef(null);
  const finishAudioRef = useRef(null);

  const handleWPMandAccuracy = () => {
    //Wpm dividing total typed Characters with timerInput 
    //as it is a variable time window
    let wpm = Math.abs(Math.round((totalTypedChar / timerInput)));
    let acc = totalTypedChar === 0 ? 0 : (correctChar / totalTypedChar) * 100;

    setWPM(wpm);
    setAccuracy(acc.toFixed(0));

    if (finishAudioRef.current) {
      finishAudioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  }

  // Function to handle key press
  const handleKeyPress = (pressedKey) => {
    if (currentIndex >= visualText.length) return;
    
    // Only process if it's a valid key (letter or space)
    const validKey = pressedKey === ' ' || /^[a-zA-Z]$/.test(pressedKey);
    if (!validKey) return;

    setChar(prev => prev + 1);
    const currentKey = visualText[currentIndex];

    if (pressedKey.toLowerCase() === currentKey.toLowerCase()) {
      if (clickAudioRef.current) {
        clickAudioRef.current.currentTime = 0;
        clickAudioRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
      setCorrect(correct => correct + 1);
      setCurrentIndex(prev => prev + 1);
      
      // When text is finished, just generate new text without resetting stats
      if (currentIndex === visualText.length - 1) {
        dispatch(updateNext(next));
      }
    } else {
      if (wrongKeyRef.current) {
        wrongKeyRef.current.currentTime = 0;
        wrongKeyRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
    }
  };

  const handleReset = () => {
    dispatch(resetStartTime(timerInput * 60));
    dispatch(updateCombination());
    dispatch(updateRepetition());
    dispatch(updateSource());

    setWPM(0);
    setAccuracy(0);
    setChar(0);
    setCorrect(0);
    setCurrentIndex(0);
  }

  // Function to handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle alphanumeric keys and space
      if (e.key.length === 1 || e.key === 'Space') {
        e.preventDefault();
        handleKeyPress(e.key === 'Space' ? ' ' : e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, visualText]);

  useEffect(() => {
    const result = genWordlist(n, letters)
    const text = shuffleArray(result, combination)
    const final_text = repeat(repetition, text)

    let timer = setTimeout(() => {
      dispatch(updateVisualText(final_text));
    }, 100)

    return () => {
      clearTimeout(timer);
    }
  }, [n, combination, repetition, next])

  //handles the typing area value and event listener
  useEffect(() => {
    if (currentIndex === visualText.length) {
      // Remove focus call since we don't have the textarea anymore
    }
  }, [currentIndex, visualText])

  //handles the curentindex reset once visual text changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [visualText])

  //timer useEffect
  useEffect(() => {
    let timer;

    if (startTime === 0) {
      handleWPMandAccuracy();
      // Reset stats only when timer ends
      setWPM(0);
      setAccuracy(0);
      setChar(0);
      setCorrect(0);
      setCurrentIndex(0);
      dispatch(resetStartTime(0));
      clearInterval(timer);
    }

    // Timer logic for 5 minutes
    timer = setInterval(() => {
      dispatch(updateMinutes(Math.floor(startTime / 60)));
      dispatch(updateSeconds(startTime % 60));
      dispatch(resetStartTime(startTime - 1));

      if (startTime === 0) {
        clearInterval(timer);
        dispatch(resetStartTime(0));
        return;
      }
    }, 1000);

    // Cleanup function to clear the timer 
    return () => clearTimeout(timer);
  }, [startTime])

  window.addEventListener('beforeunload', (e) => { console.log(e) })

  // Function to render visual text with highlighting
  const renderVisualText = () => {
    return visualText.split('').map((char, index) => {
      let className = '';
      if (index < currentIndex) {
        className = 'typed';
      } else if (index === currentIndex) {
        className = 'current';
      }
      // Convert space to nbsp and wrap in span
      return `<span class="${className}">${char === ' ' ? '&nbsp;' : char}</span>`;
    }).join('');
  };

  // Skeleton of the body starts form here
  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <button onClick={toggleTheme} className="theme-toggle">
        {isDarkMode ? '🌞' : '🌙'}
      </button>

      {/* Left stats section */}
      <div className="stats-wrapper">
        <div className="stat-box">
          <div className="stat-label">WPM</div>
          <div className="stat-value">{WPM}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Accuracy</div>
          <div className="stat-value">{accuracy}%</div>
        </div>
      </div>

      {/* Right stats section */}
      <div className="right-stats-wrapper">
        <div className="stat-box">
          <div className="stat-label">Time</div>
          <div className="stat-value">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Errors</div>
          <div className="stat-value">{totalTypedChar - correctChar}</div>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        <div id="container">
          <h1>Typing Tutor</h1>
          <div className="timer-controls">
            <div className="timer-display">
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </div>
            <div className="timer-input-group">
              <input 
                type="number" 
                min="1" 
                max="10"
                value={timerInput}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  setTimerInput(Math.min(Math.max(value, 1), 10));
                }}
                className="timer-input"
              />
              <span className="timer-label">min</span>
            </div>
            <button 
              className="start-button"
              onClick={() => {
                dispatch(resetStartTime(timerInput * 60));
                handleReset();
              }}
            >
              Start
            </button>
            <button 
              className="reset-button"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
          <button id='reset' onClick={handleReset}>Reset</button>

          {/* div to generate the text for typing */}
          <div id="source_container">
            <div>
              <h4>Source</h4>
              <div>
                <input type="radio" name="Source" value={2} onChange={handleSource} checked={n === 2} />
                <p>2 Words</p>
              </div>
              <div>
                <input type="radio" name="Source" value={3} onChange={handleSource} checked={n === 3} />
                <p>3 Words</p>
              </div>
              <div>
                <input type="radio" name="Source" value={4} onChange={handleSource} checked={n === 4} />
                <p>4 Words</p>
              </div>
            </div>
            {/* generator allow combination and repetiotion */}

            <div className='generator'>
              <h4>Generator</h4>
              <div>
                <p>Combination</p>
                <input type="number" maxLength={1} value={combination} onChange={(e) => dispatch(updateCombination(e.target.value))} disabled={combination >= 20} />
              </div>
              <div>
                <p>Repetition</p>
                <input type="number" maxLength={1} value={repetition} onChange={(e) => dispatch(updateRepetition(e.target.value))} />
              </div>
            </div>
          </div>

          {/* container for visual and typing text */}
          <div id="text_container">
            <div
              className="text-editor visual-text"
              dangerouslySetInnerHTML={{ __html: renderVisualText() }}
            ></div>
          </div>
        </div>

        {/* Virtual Keyboard */}
        <Keyboard
          currentChar={visualText[currentIndex]}
          onKeyPress={handleKeyPress}
        />
      </div>

      {/* Audio elements */}
      <audio ref={clickAudioRef} src={Click}></audio>
      <audio ref={wrongKeyRef} src={clack}></audio>
      <audio ref={finishAudioRef} src={ding}></audio>
    </div>
  )
}

export default Home