import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetStartTime,
  updateCombination,
  updateNext,
  updateRepetition,
  updateSource,
  updateVisualText,
  updateMinutes,
  updateSeconds,
} from '../redux/typingReducer';
import { genWordlist, shuffleArray, repeat } from '../components/HomehelperFunctions';

import Click from '../assets/media/click.mp3';
import ding from '../assets/media/ding.wav';
import clack from '../assets/media/clack.mp3';

import './home.css';
 //root to build visualText
 const letters =
 ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];


const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [WPM, setWPM] = useState(0);
  const [correctChar, setCorrectChar] = useState(0);
  const [totalTypedChar, setTotalTypedChar] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [difficulty, setDifficulty] = useState('easy'); // New state for difficulty
  const [leaderboard, setLeaderboard] = useState([]); // Leaderboard state

  const { n, combination, repetition, visualText, next, startTime, minutes, seconds } = useSelector((store) => store);
  const dispatch = useDispatch();

  const clickAudioRef = useRef(null);
  const wrongKeyAudioRef = useRef(null);
  const finishAudioRef = useRef(null);

  const handleWPMandAccuracy = useCallback(() => {
    const wpm = Math.round(totalTypedChar / 5);
    const acc = totalTypedChar === 0 ? 0 : ((correctChar / totalTypedChar) * 100).toFixed(0);

    setWPM(wpm);
    setAccuracy(acc);

    // Update leaderboard
    setLeaderboard((prev) => {
      const newEntry = { WPM: wpm, Accuracy: acc };
      const updatedLeaderboard = [...prev, newEntry].sort((a, b) => b.WPM - a.WPM).slice(0, 5);
      localStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));
      return updatedLeaderboard;
    });

    if (finishAudioRef.current) {
      finishAudioRef.current.play();
    }
  }, [totalTypedChar, correctChar]);

  const handleKeyDown = useCallback(
    (e) => {
      setTotalTypedChar((prev) => prev + 1);

      const { key } = e;
      const currentKey = visualText[currentIndex];
      const textArea = document.querySelector('#typing-area');

      if (key === currentKey) {
        clickAudioRef.current?.play();
        setCorrectChar((prev) => prev + 1);
        setCurrentIndex((prev) => prev + 1);

        if (currentIndex + 1 === visualText.length) {
          dispatch(updateNext(next));
        }

        textArea.classList.remove('wrong-key');
      } else {
        textArea.classList.add('wrong-key');
        wrongKeyAudioRef.current?.play();
      }
    },
    [currentIndex, visualText, next, dispatch]
  );

  const handleReset = useCallback(() => {
    dispatch(resetStartTime(300));
    dispatch(updateCombination());
    dispatch(updateRepetition());
    dispatch(updateSource());

    setWPM(0);
    setAccuracy(0);
    setTotalTypedChar(0);
    setCorrectChar(0);
    setCurrentIndex(0);

    const textArea = document.querySelector('#typing-area');
    textArea.value = '';
    textArea.classList.remove('wrong-key');
    textArea.focus();
  }, [dispatch]);

  useEffect(() => {
    const result = genWordlist(n, letters, difficulty);
    const text = shuffleArray(result, combination);
    const finalText = repeat(repetition, text);

    dispatch(updateVisualText(finalText));

    const handleLoad = () => document.querySelector('#typing-area').focus();
    window.addEventListener('load', handleLoad);

    return () => window.removeEventListener('load', handleLoad);
  }, [n, combination, repetition, next, difficulty, dispatch]);

  useEffect(() => {
    const textArea = document.querySelector('#typing-area');
    if (currentIndex === visualText.length) {
      textArea.value = '';
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, visualText, handleKeyDown]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [visualText]);

  useEffect(() => {
    if (startTime === 0) {
      handleWPMandAccuracy();
      clearInterval(timer);
      return;
    }

    const timer = setInterval(() => {
      dispatch(updateMinutes(Math.floor(startTime / 60)));
      dispatch(updateSeconds(startTime % 60));
      dispatch(resetStartTime(startTime - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, handleWPMandAccuracy, dispatch]);

  useEffect(() => {
    const storedLeaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    setLeaderboard(storedLeaderboard);
  }, []);

  return (
    <div className="home-container">
      <h1>Typing Tutor</h1>

      <div id="control-panel">
        <button id="reset-button" onClick={handleReset}>Reset</button>

        <div id="source-controls">
          <h4>Source</h4>
          {[2, 3, 4].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name="source"
                value={value}
                onChange={(e) => dispatch(updateSource(e.target.value))}
                checked={n === value}
              />
              {value} Words
            </label>
          ))}
        </div>

        <div id="generator-controls">
          <h4>Generator</h4>
          <label>
            Combination
            <input
              type="number"
              value={combination}
              onChange={(e) => dispatch(updateCombination(e.target.value))}
              max={20}
            />
          </label>
          <label>
            Repetition
            <input
              type="number"
              value={repetition}
              onChange={(e) => dispatch(updateRepetition(e.target.value))}
            />
          </label>
        </div>

        <div id="difficulty-controls">
          <h4>Difficulty</h4>
          <select onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${(currentIndex / visualText.length) * 100}%` }}
        ></div>
      </div>

      <div id="typing-area-container">
        <div className="typing-text">
          {visualText.split('').map((char, idx) => (
            <span
              key={idx}
              className={
                idx < currentIndex ? (char === visualText[idx] ? 'correct' : 'incorrect') : ''
              }
            >
              {char}
            </span>
          ))}
        </div>
        <textarea id="typing-area" className="typing-text" />
      </div>

      <div className="stats-container">
        <div>Accuracy: {accuracy}%</div>
        <div>WPM: {WPM}</div>
        <div>Errors: {totalTypedChar - correctChar}</div>
        <div>Timer: {`00:${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</div>
      </div>

      <div className="leaderboard">
        <h4>Leaderboard</h4>
        <ul>
          {leaderboard.map((entry, idx) => (
            <li key={idx}>
              WPM: {entry.WPM}, Accuracy: {entry.Accuracy}%
            </li>
          ))}
        </ul>
      </div>

      <audio ref={clickAudioRef}><source src={Click} type="audio/mpeg" /></audio>
      <audio ref={wrongKeyAudioRef}><source src={clack} type="audio/mpeg" /></audio>
      <audio ref={finishAudioRef}><source src={ding} type="audio/wav" /></audio>
    </div>
  );
};

export default Home;
