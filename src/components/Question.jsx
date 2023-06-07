export default function Question({ question, isFinished, onClick }) {

    const answerElements = question.randomized_answers.map(answer => {
        return (
            <div className={
                `question--answer
                ${question.selected_answer === answer ? "question--selectedAnswer" : ""}
                ${(question.isQuizOver && question.correct_answer == answer) ? "question--correctAnswer" : ""}
                ${question.wrongly_selected_answer === answer ? "question--wrongAnswer" : ""}
                ${isFinished ? "" : "question--hoverable"}`
            } 
            key={answer}
            onClick={e => onClick(question, answer)}
            >
                {answer}
            </div>
        )
    })

    return (
        <div className="question">
            <p className="question--text">{question.question}</p>
            <div className="question--answers">
                {answerElements}
            </div>
        </div>
    )
}