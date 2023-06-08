import blobRight  from '../assets/blob_right.png'
import blobLeft  from '../assets/blob_left.png'
import Question from '../components/Question'

import BeatLoader from 'react-spinners/BeatLoader';
import Confetti from 'react-confetti'
import { decode } from 'html-entities';

import { useState, useEffect } from 'react'

export default function QuestionScreen({ formData, resetGame }) {
    const [questions, setQuestions] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [isFinished, setFinished] = useState(false)
    const [hasWon, setWon] = useState(false)

    // Have the confetti cover the whole screen
    const body = document.body
    const html = document.documentElement
    const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)

    // Fetch questions for selected category/difficulty and set state while showing loading screen
    useEffect(() => {
        async function fetchQuestions() {
            setLoading(true)

            const response = await fetch(`https://opentdb.com/api.php?amount=5&category=${formData.category}&difficulty=${formData.difficulty}&type=multiple`)
            const data = await response.json()
            // decode HTML characters
            const parsedData = data.results.map(question => {
                question.correct_answer = decode(question.correct_answer)
                question.question = decode(question.question)
                question.incorrect_answers = question.incorrect_answers.map(answer => decode(answer))
                return question
            })
            setQuestions(parsedData.map(question => {
                // randomly decide where the correct answer should be inserted into array of incorrect answers
                const indexCorrectAnswer = Math.floor(Math.random()*(question.incorrect_answers.length + 1))
                // put the correct answer into that spot
                question.incorrect_answers.splice(indexCorrectAnswer, 0, question.correct_answer)
                // return a new object that also holds a field for the quiz being over,
                // the user selected answer, whether it's wrong, and an array holding all answers
                return {
                    ...question,
                    isQuizOver: false,
                    selected_answer: "",
                    wrongly_selected_answer: "",
                    randomized_answers: question.incorrect_answers
                }
            }))

            setLoading(false)
        }
        fetchQuestions()
    }, [])

    // check if player scored a perfect game by checking that no answers were wrongly selected and all questions were answered
    useEffect(() => { 
        // wrongly_selected is "" if the user selection is correct and a truthy "string" if the user selects falsely
        if(isFinished && questions.every(question => !question.wrongly_selected_answer) && questions.every(question => question.selected_answer)) {
            setWon(true)                               
        }  
    }, [isFinished])

    // Mark selected answers
    function handleClick(question, answer) {
        if(!isFinished) {
            setQuestions(prevState => {
                return prevState.map(prevQuestion => {
                    return prevQuestion.question !== question.question ? prevQuestion : {
                        ...prevQuestion,
                        selected_answer: answer
                    }
                })
            })        
        }            
    }

    // Check answers (show confetti for perfect game) or restart game
    function checkAnswers() {
        if(!isFinished) { 
            setQuestions(prevState => {
                return prevState.map(prevQuestion => {
                    return {
                        ...prevQuestion,
                        isQuizOver: true,                    
                        wrongly_selected_answer: prevQuestion.selected_answer !== prevQuestion.correct_answer ? prevQuestion.selected_answer : ""
                    }
                })
            })          

            setFinished(true)   
        } else {        
            resetGame()
        }
    }    

    const questionElements = questions.map(question => {
        return(
            <Question key={question.question} question={question} isFinished={isFinished} onClick={handleClick} />
        )
    })

    return (
        <div className="questionScreen">
            {hasWon && <Confetti height={height}/>}
            <img className="blob right" src={blobRight}/>
            <img className="blob left" src={blobLeft}/>
            {isLoading ? <BeatLoader color="#4D5B9E" /> : 
                <>               
                    <p className="quiz--title">Quizzical</p>
                    {questionElements}
                    <button className="questions--button" onClick={checkAnswers}>{isFinished ? "Restart" : "Check answers"}</button>
                </>
            }
        </div>
    )
}