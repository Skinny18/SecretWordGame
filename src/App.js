import './App.css';

import { useCallback, useEffect, useState } from 'react';
//Data
import {wordsList} from './data/Word'

import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id:1, name: "start"},
  {id:2, name: "game"},
  {id:3, name: "end"}
]

const guessesQty = 3

function App() {

  const[gameStage, setGameStage] = useState(stages[0].name);
  const[words] = useState(wordsList)

  const[pickedWord, setPickedWord] = useState("")
  const[pickedCategory, setPickedCategory] = useState("")
  const[letters, setLetters] = useState([ ])

  const[guessedLetters, setGuessedLetters] = useState([ ])
  const[wrongLetters, setWrongLetters] = useState([])
  const[guesses, setGuesses] = useState(guessesQty)
  const[score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() =>{
    //random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    

    const word = words[category][Math.floor(Math.random() * words[category].length)]
    

    return{word, category}

  }, [words])
 //start Game
  const startGame = useCallback (() => {
    //clear letters

    clearLetterStates();

    //pick word and pick category
    const {word, category} = pickWordAndCategory()
    

    let wordLetters = word.split("")
    wordLetters = wordLetters.map((l) => l.toLowerCase())

    

    //fill stages
    setPickedCategory(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  }, [pickWordAndCategory])
//process the letter input

const verifyLetter = (letter) =>{
  const normalizeLetter = letter.toLowerCase()

  if(guessedLetters.includes(normalizeLetter) || wrongLetters.includes(normalizeLetter)){
    return;
  }

  if(letters.includes(normalizeLetter)){
    setGuessedLetters((actualGuessedLetters)=>[
      ...actualGuessedLetters,
      normalizeLetter
    ])
  }else{
    setWrongLetters((actualWrongLetters)=>[
      ...actualWrongLetters,
      normalizeLetter
    ])

    setGuesses((actualGuesses)=> actualGuesses -1)

  }
}

const clearLetterStates = () => {
  setGuessedLetters([])
  setWrongLetters([])
}

useEffect(()=>{
  if(guesses <= 0){
    clearLetterStates()
    setGameStage(stages[2].name)
  }
},[guesses])

//check win condition
useEffect(() => {

  const uniqueLetters = [...new Set(letters)]

  //win condition
  if(guessedLetters.length === uniqueLetters.length){
    setScore((actualScore) => actualScore += 100)

    //restart game
    startGame()
  }


}, [guessedLetters, letters, startGame] )

//restart the game

const retry = () => {
  setScore(0)
  setGuesses(guessesQty)

  setGameStage(stages[0].name)
}

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame}/> }
      {gameStage === 'game' && <Game
       verifyLetter={verifyLetter}
        pickedWord={pickedWord}
        pickedCategory={pickedCategory}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
        />}
      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
