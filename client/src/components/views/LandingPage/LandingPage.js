import React,{useEffect} from 'react'
import axios from 'axios'
function LandingPage() {

    useEffect(() => {
        axios.get('/api/hello').then(response=>console.log(response.data))
    }, [])
    return (
        <h1>
            Landing
        </h1>
    )
}

export default LandingPage
