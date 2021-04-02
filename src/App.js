import React, {useState, useEffect, useReducer} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Main from './components/Main';
import Homepage from './components/Homepage';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import Error from './components/Error';

import {reducer} from './reducer';
import {urls} from './urls';
import redBlack from './images/red-black.jpg';
import bluePink from './images/blue-pink.jpg';
import yellowWhite from './images/yellow-white.jpg';

import './css/global.css';

/* SAMPLE ACCOUNT AND TOKEN FOR TESTING PURPOSES
    account: {
        accountCreated: "2021-03-14T17:47:49.836766Z",
        dateOfBirth: "2021-03-14",
        email: "sample@gmail.com",
        gender: "M",
        isOnline: false,
        username: "sample", 
    },
    token: '6b4235e54600f9db216835bb372f465bfe031ec6'
*/

const states = {
    loggedIn: false,
    token: 0,
    account: {},
    width: window.innerWidth,
    height: window.innerHeight,
};

const backgrounds = {
    'red-black' : redBlack,
    'blue-pink' : bluePink,
    'yellow-white' : yellowWhite,
}

const gradients = {
    'red-black' : 'linear-gradient(to right, #d31027, #ea384d)',
    'blue-pink' : 'linear-gradient(to right, #457fca, #5691c8)',
    'yellow-white' : 'linear-gradient(to right, #ffb75e, #ed8f03)',
}

export const AppContext = React.createContext();

const App = () => {
    const [state, dispatch] = useReducer(reducer, states);
    const [theme, setTheme] = useState('red-black');

    useEffect(() => {
        const localTheme = localStorage.getItem('theme')
        if(localTheme)
            setTheme(localTheme);
    }, [])

    useEffect(() => {
        document.body.style.background = gradients[theme];
        localStorage.setItem('theme',theme);
    }, [theme]);

    useEffect(() => {
        window.addEventListener('resize',() => {
            dispatch({type:'SCREEN_SIZE',payload:{height:window.innerHeight, width:window.innerWidth}});
        });
        return () => {
            window.removeEventListener('resize', () => {
                dispatch({type:'SCREEN_SIZE',payload:{height:window.innerHeight, width:window.innerWidth}});
            });
        };
    });

    const login = async (username, token) => {
        const url = urls.accountDetailed + username + '/';
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Token '+token
            }
        });        
        const account = await response.json();
        dispatch({type:'LOGIN',payload:{account, token}});
    }

    const logout = () => {
        dispatch({type:'LOGOUT'});
    }

    const newToken = (token) => {
        dispatch({type:'NEW_TOKEN',payload:{token}});
    }

    return (
        <AppContext.Provider value={
                {
                    state,
                    login,
                    logout,
                    newToken,
                }}>
            <div className={theme}>
                <div className='app-container' style={{minHeight:state.height-100, maxHeight:'auto',background:`url(${backgrounds[theme]})`}}>
                    {
                        state.loggedIn
                        ?
                            <Router>
                                <Switch>
                                    <Route path={['/dashboard','/login','/createAccount']}>
                                        <Main/>                                    
                                    </Route>
                                    <Route path='*'>
                                        <Error/>                                    
                                    </Route>
                                </Switch>
                            </Router>
                        :
                            <Router>
                                <Switch>
                                    <Route path='/login'>
                                        <Login/>                                    
                                    </Route>
                                    <Route path='/createAccount'>
                                        <CreateAccount/>                                    
                                    </Route>
                                    <Route path={['/dashboard']}>
                                        <Homepage/>                                    
                                    </Route>
                                    <Route path='*'>
                                        <Error/>                                    
                                    </Route>
                                </Switch>
                            </Router>
                    }
                </div>
                <div className='theme-changer'>
                    <p>Theme</p>  
                    <select value={theme} onChange={(event)=>setTheme(event.target.value)}>
                        <option value='red-black'>Sin City Red</option>
                        <option value='blue-pink'>Rose Water</option>
                        <option value='yellow-white'>Horizon</option>                    
                    </select>              
                </div>
            </div>
        </AppContext.Provider>
    );
}

export default App;
