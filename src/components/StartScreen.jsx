import blobRight  from '../assets/blob_right.png'
import blobLeft  from '../assets/blob_left.png'

import Form from '../components/Form'

export default function StartScreen({ formData, onChange, onSubmit }) {

    return (
        <div className="startScreen">
            <img className="blob right" src={blobRight}/>
            <img className="blob left" src={blobLeft}/>
            <p className="start--title">Quizzical</p>
            <Form formData={formData} onChange={onChange} onSubmit={onSubmit} />
        </div>
    )
}