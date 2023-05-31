import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import {
  resetStartTime,
  updateCombination,
  updateNext,
  updateRepetition,
  updateSource,
  updateVisualText,
  updateMinutes,
  updateSeconds
} from '../redux/typingReducer';
import { genWordlist, shuffleArray, repeat } from '../components/HomehelperFunctions';

import Click from '../assets/media/click.mp3'
import ding from '../assets/media/ding.wav'
import clack from '../assets/media/clack.mp3'

import './home.css'




const Home = () => {
 
  
  //root to build visualText
  const letters = ['a', 's', 'd', 'f', 'j', 'k', 'l'];
  
  
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


  // redux useCase connections
  const { n, combination, repetition, visualText, next, startTime, minutes, seconds } = useSelector((store) => store)
  const dispatch = useDispatch();


  //update length of words
  const handleSource = (e) => {
    dispatch(updateSource(e.target.value))
  }



  const handleWPMandAccuracy = () => {

    let finishSound = document.querySelector('#finish-audio');
    //Wpm dividing total typed Characters with 5 
    //as it is 5 minute window and also we have 300 seonds
    let wpm = Math.abs(Math.round(totalTypedChar / 5));

    let acc = totalTypedChar == 0 ? 0 : (correctChar / totalTypedChar) * 100;

    //wpm , accuracy  and Index set to desired values
    setWPM(wpm);
    setAccuracy(acc.toFixed(0));
    setChar(0)
    setCorrect(0)

    if (totalTypedChar !== 0) {

      finishSound.play();
    }
  }



  //function to capture the keys pressed on keyborad through window event listener
  const handleKeyDown = (e) => {


    let clickAudio = document.querySelector('#click-audio');
    let wrongKey = document.querySelector('#clack-audio');

    const { key } = e;
    const currentKey = visualText[currentIndex];

    let textArea = document.querySelector('#tex')
    setChar((prev) => prev + 1);

    if (key === currentKey) {

      clickAudio.play();
      setCorrect(correct => correct + 1)
      setCurrentIndex((prevIndex) => prevIndex + 1);

      if (currentIndex + 1 === visualText.length) {
        dispatch(updateNext(next));

      }
      textArea.classList.remove('wrong-key');
    }
    else {

      textArea.classList.add('wrong-key')

      wrongKey.play();
    }
  };



  //this useEffect handles only words generation

  useEffect(() => {


    const result = genWordlist(n, letters)
    const text = shuffleArray(result, combination)
    const final_text = repeat(repetition, text)

    setTimeout(() => {
      dispatch(updateVisualText(final_text));

    }, 100)

    window.addEventListener('load', () => {
      document.querySelector('#tex').focus();
    })

    return () => {
      window.addEventListener('load', () => {
        document.querySelector('#tex').focus();
      })
    }
  }, [n, combination, repetition, next])



  //handles the typing area value and event listener
  useEffect(() => {
    if (currentIndex === visualText.length) {
      document.querySelector('#tex').value = '';

    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, visualText])




  //handles the curentindex reset once visual text changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [visualText])



  //timer useEffect
  useEffect(() => {
    let timer

    if (startTime === 0) {
      handleWPMandAccuracy();
    }

    // Timer logic for 5 minutes
    timer = setInterval(() => {

      dispatch(updateMinutes(Math.floor(startTime / 60)));
      dispatch(updateSeconds(startTime % 60));
      dispatch(resetStartTime(startTime - 1))

    }, 1000);

    // Cleanup function to clear the timer 
    return () => clearTimeout(timer);

  }, [startTime])




  // Skeleton of the body starts form here
  return (
    <div>
      {/* coantiner for all */}


        <h1>Typing Tutor</h1>
      {/* conatiner of source and typing */}
      <div id="container">


        <div>
          <p id="timer">00:0{minutes}:{seconds == 0 ? '0' : ''}{seconds}</p>
          <button id='reset' onClick={()=>dispatch(resetStartTime(300))}>Reset</button>
        </div>


        {/* div to genrate the text for typing, */}
        <div id="source_container">
          <div >
            <h4>Source</h4>
            <div>
              <input type="radio" name="Source" value={2} onChange={handleSource} selected />
              <p>2 Words</p>
            </div>
            <div>
              <input type="radio" name="Source" value={3} onChange={handleSource} />
              <p>3 Words</p>
            </div>
            <div>
              <input type="radio" name="Source" value={4} onChange={handleSource} />
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


        {/* conatiner for visual and typing text */}
        <div id="text_container">
          <textarea name="visual_text" className="text-editor" disabled value={visualText}></textarea>
          <textarea name="typing_text" className='text-editor' id="tex"></textarea>

        </div>

        <div className='accuracy-wpm'>
          <div >Accuracy {" : "} {accuracy}%</div>
          <div>WPM {" : "} {WPM}</div>
        </div>

      </div>

      {/* audios for different occasion
        click => for every key typed
        clack => every wrong key
        ding for every session  5 minutes
      */}
      <audio id="click-audio">
        <source src={Click} type="audio/mpeg" />
      </audio>
      <audio id="clack-audio">
        <source src={clack} type="audio/mpeg" />
      </audio>
      <audio id="finish-audio">
        <source src={ding} type="audio/wav" />
      </audio>
    </div>
  )
}

export default Home