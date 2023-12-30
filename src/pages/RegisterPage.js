import { useState } from "react";

export default function RegisterPage(){

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

    async function register(ev) {
        ev.preventDefault();        /* to prevent the default behaviour of html pages to redirect */
        const response = await fetch('http://localhost:4000/register', {
            method: 'POST',
            body: JSON.stringify({username,password}),      /* converts object to string */
            headers: {'Content-Type':'application/json'},   /* specifies the server that the data which is being sent is in json format */
        })

        if (response.status === 200){       // checks the response status code.. 
            alert('Registration Successful');
        } else {
            alert('Registration Failed');
        }
    }

    return(
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input type="text" 
                   placeholder="username"
                   value={username}   /* the username variable stores the input from frontend */
                   onChange={ev => setUsername(ev.target.value)}/>  {/* the onchange trigger will update the username state variable with the newly inputted value */}

            <input type="password" 
                   placeholder="password"
                   value={password}
                   onChange={ev => setPassword(ev.target.value)}/>
            <button>Register</button>
        </form>
    );
}