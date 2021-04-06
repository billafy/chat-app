import React, {useState, useEffect, useReducer} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Main from './components/Main';
import Homepage from './components/Homepage';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';

import {reducer} from './reducer';
import {urls} from './urls';
import redBlack from './images/red-black.jpg';
import bluePink from './images/blue-pink.jpg';
import yellowWhite from './images/yellow-white.jpg';

import './css/global.css';

const states = {
    loggedIn: false,
    token: 0,
    account: {},
    width: window.innerWidth,
    height: window.screen.availHeight - (window.outerHeight - window.innerHeight),
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
        const localTheme = localStorage.getItem('theme');
        if(localTheme)
            setTheme(localTheme);
        const sessionToken = localStorage.getItem('sessionToken');
        const sessionUsername = localStorage.getItem('username');
        if(sessionToken && sessionUsername)
            login(sessionUsername, sessionToken); 
    }, [])

    useEffect(() => {
        document.body.style.background = gradients[theme];
        localStorage.setItem('theme',theme);
    }, [theme]);
    
    useEffect(() => {
        window.addEventListener('resize',() => {
            dispatch({type:'SCREEN_SIZE',payload:{width:window.innerWidth}});
        })

        return () => {
            window.removeEventListener('resize', () => {
                dispatch({type:'SCREEN_SIZE',payload:{width:window.innerWidth}});
            })
        };
    })

    const login = async (username, token) => {
        const url = urls.accountDetailed + username + '/';
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Token '+token
            }
        });        
        const account = await response.json();
        if(account.detail === "Invalid token." || !account) {
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('username');
            return;
        }
        localStorage.setItem('sessionToken', token);
        localStorage.setItem('username', account.username);
        if(account)
            dispatch({type:'LOGIN',payload:{account, token}});
    }

    const logout = () => {
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('username');
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
                                    <Route exact path='/'>
                                        <Homepage/>
                                    </Route>
                                    <Route exact path={['/dashboard','/login','/createAccount','*']}>
                                        <Main/>                                    
                                    </Route>
                                </Switch>
                            </Router>
                        :
                            <Router>
                                <Switch>
                                    <Route exact path='/login'>
                                        <Login/>                                    
                                    </Route>
                                    <Route exact path='/createAccount'>
                                        <CreateAccount/>                                    
                                    </Route>
                                    <Route exact path={['/dashboard','/','*']}>
                                        <Homepage/>                                    
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
