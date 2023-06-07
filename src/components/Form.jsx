import { useEffect, useState } from 'react'

export default function Form({ formData, onChange, onSubmit }) {
    const [categories, setCategories] = useState([])
    const [isLoading, setLoading] = useState(false)
    
    // Fetch list of available topics
    useEffect(() => {
        async function fetchTopics() {
            setLoading(true)
            const response = await fetch("https://opentdb.com/api_category.php")
            const data = await response.json()       
            setCategories(data.trivia_categories.map(category => {
                return (
                    <option value={category.id} key={category.id}>{shortenName(category.name)}</option>
                )
            }))                      
            setLoading(false)
        }
        fetchTopics()
    }, [])
    
    // Manually fire the onChange event after the category list was populated to update the form state in App.jsx
    useEffect(() => {
        let event = new MouseEvent('change', {
            'view': window, 
            'bubbles': true, 
            'cancelable': false
        })
        document.getElementById('category').dispatchEvent(event)  
    }, [categories])

    // Omit pointless parts of the names of the fetched categories
    function shortenName(name) {
        if(name.includes("Entertainment: ")) {
            if(name.includes("Entertainment: Japanese ")) {
                return name.slice("Entertainment: Japanese ".length)
            }
            return name.slice("Entertainment: ".length)
        } else if(name.includes("Science: ")) {
            return name.slice("Science: ".length)
        }

        return name
    }

    return (
        <form onSubmit={onSubmit}> 
        
            <select 
                className="form--category"
                id="category" 
                value={formData.category}
                onChange={onChange}
                name="category"
                required
            >
            {isLoading ? <option value="loading">Loading categories...</option> : categories}
            </select>

            <div className="form--difficulty">
                <input 
                    type="radio"
                    id="easy"
                    name="difficulty"
                    value="easy"
                    checked={formData.difficulty === "easy"}
                    onChange={onChange}
                />
                <label htmlFor="easy">Easy</label>
                
                <input 
                    type="radio"
                    id="medium"
                    name="difficulty"
                    value="medium"
                    checked={formData.difficulty === "medium"}
                    onChange={onChange}
                />
                <label htmlFor="medium">Medium</label>

                <input 
                    type="radio"
                    id="hard"
                    name="difficulty"
                    value="hard"
                    checked={formData.difficulty === "hard"}
                    onChange={onChange}
                />
                <label htmlFor="hard">Hard</label>
            </div>

            <button className="start--button" disabled={isLoading}>Let's go!</button>
        </form>
    )
}