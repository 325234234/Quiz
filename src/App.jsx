import StartScreen from './components/StartScreen'
import QuestionScreen from './components/QuestionScreen'

import { useState } from 'react'

export default function App() {
  const [startScreen, setStartScreen] = useState(true)
  const [questionScreen, setQuestionScreen] = useState(false)
  const [formData, setFormData] = useState( { category: "", difficulty: "medium" } )

  // Update form state based on user input
  function handleChange(event) {
    const { name, value } = event.target
    setFormData(prevFormData => {
      return {
          ...prevFormData,
          [name]: value
      }
    })
  }

  // Hide start screen/show quiz screen after user presses "Let's go" button
  function handleSubmit(event) {
    event.preventDefault()
    setStartScreen(false)
    setQuestionScreen(true)
  }
  
  function resetGame() {
    setQuestionScreen(false)
    setStartScreen(true)
  }
  
  return (
    <>
      {startScreen && <StartScreen formData={formData} onChange={handleChange} onSubmit={handleSubmit} />}
      {questionScreen && <QuestionScreen formData={formData} resetGame={resetGame}/>}
    </>
  )
}