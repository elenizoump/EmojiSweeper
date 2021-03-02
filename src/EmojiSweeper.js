import { useState, useEffect, useRef } from 'react'

import './emojisweeper.css'

const AvailableEmojis = ['😂', '😍', '🤣', '😊', '😭', '😘', '😅', '😁', '😢']

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

const placeholderEmojiGrid = [
  { emoji: '❓', index: 0 },
  { emoji: '❓', index: 1 },
  { emoji: '❓', index: 2 },
  { emoji: '❓', index: 3 },
  { emoji: '❓', index: 4 },
  { emoji: '❓', index: 5 },
  { emoji: '❓', index: 6 },
  { emoji: '❓', index: 7 },
  { emoji: '❓', index: 8 },
]

function EmojiSweeper() {
  const selectedMineEmoji = useRef()
  const gameStats = useRef()
  const [gameState, setGameState] = useState('new')
  const [gridEmojis, setGridEmojis] = useState([...placeholderEmojiGrid])

  const getResultsText = () => {
    if (gameState === 'won') {
      return `YOU WON!`
    } else if (gameState === 'lost') {
      return `YOU LOST! ${
        gameStats.current.safeSquareClickCount > 0
          ? `You cheated death ${gameStats.current.safeSquareClickCount} times`
          : `On your first try, how sad...`
      }`
    }

    return ''
  }

  const gameStateText = gameState === 'new' ? 'START' : 'RESET'

  const changeGameState = () => {
    if (gameState === 'new') {
      setGameState('in-progress')
    } else {
      setGameState('new')
    }
  }

  const onSquareClick = (emojiCharacter) => {
    if (gameState === 'in-progress') {
      const emojiIsMine = selectedMineEmoji.current === emojiCharacter
      setGridEmojis((currentGridEmojis) =>
        currentGridEmojis.map((emojiObj) => {
          if (emojiObj.emoji === emojiCharacter) {
            return {
              ...emojiObj,
              picked: emojiIsMine ? 'mine' : 'safe',
            }
          } else {
            return emojiObj
          }
        })
      )
      if (emojiIsMine) {
      }
    }
  }

  useEffect(() => {
    if (gameState === 'new') {
      gameStats.current = {
        mineSquareClickCount: 0,
        safeSquareClickCount: 0,
      }
      selectedMineEmoji.current = ''
      setGridEmojis([...placeholderEmojiGrid])
    } else if (gameState === 'in-progress') {
      const shuffledEmojis = shuffle([
        ...AvailableEmojis,
      ]).map((emojiCharacter) => ({ emoji: emojiCharacter, picked: 'none' }))
      selectedMineEmoji.current =
        shuffledEmojis[
          randomIntFromInterval(0, shuffledEmojis.length - 1)
        ].emoji
      setGridEmojis(shuffledEmojis)
    }
  }, [gameState])

  useEffect(() => {
    if (gameState === 'in-progress') {
      gameStats.current = gridEmojis.reduce(
        (accumulator, emojiObj) => {
          return {
            ...accumulator,
            mineSquareClickCount:
              emojiObj.picked === 'mine'
                ? accumulator.mineSquareClickCount + 1
                : accumulator.mineSquareClickCount,
            safeSquareClickCount:
              emojiObj.picked === 'safe'
                ? accumulator.safeSquareClickCount + 1
                : accumulator.safeSquareClickCount,
          }
        },
        {
          mineSquareClickCount: 0,
          safeSquareClickCount: 0,
        }
      )

      if (gameStats.current.mineSquareClickCount === 1) {
        setGameState('lost')
      } else if (gameStats.current.safeSquareClickCount === 8) {
        setGameState('won')
      }
    }
  }, [gridEmojis, gameState])

  return (
    <>
      {getResultsText() ? (
        <div className="results-wrapper">{getResultsText()}</div>
      ) : null}
      <div className="emoji-grid-wrapper">
        <div className="emoji-grid">
          {gridEmojis.map((emojiObj) => (
            <button
              onClick={() => {
                onSquareClick(emojiObj.emoji)
              }}
              className={`emoji-button${
                gameState === 'new' ? ' placeholder' : ''
              }${emojiObj.picked === 'safe' ? ' safe-pick' : ''}${
                emojiObj.picked === 'mine' ? ' mine-pick' : ''
              }`}
              key={`${emojiObj.index ?? emojiObj.emoji}`}
            >
              {emojiObj.emoji}
            </button>
          ))}
        </div>
      </div>
      <div className="game-state-button-wrapper">
        <button onClick={changeGameState}>{gameStateText}</button>
      </div>
    </>
  )
}

export default EmojiSweeper
