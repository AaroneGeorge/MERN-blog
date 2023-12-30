import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
 
export default function LoginPage(){

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [redirect,setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);

    async function login(ev) {       /* same functionalities as register(ev) see RegisterPage.js */
        ev.preventDefault();
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            body: JSON.stringify({username,password}),
            headers: {'Content-Type':'application/json'},
            credentials: 'include',     /* cookie will be considered as credential and will be included in the next requests.. */
        });

        if (response.ok){           /* if the login is successfull... the app must redirect it to '/' */
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);
            });
        } else {
            alert('wrong credentials');
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return(
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
            <input type="text" 
                   placeholder="username" 
                   value={username} 
                   onChange = {ev => setUsername(ev.target.value)}/>
            <input type="password" 
                   placeholder="password" 
                   value={password} 
                   onChange = {ev => setPassword(ev.target.value)}/>
            <button>login</button>
        </form>
    );
}