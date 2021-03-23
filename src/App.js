import React, {useState, useEffect, useReducer} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Main from './components/Main';
import Homepage from './components/Homepage';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import Error from './components/Error';

import {reducer} from './reducer';
import {urls} from './urls';

import './css/global.css';

const states = {
    loggedIn: false,
    token: 0,
    account: {},
    width: window.innerWidth,
    height: window.innerHeight,
};

export const AppContext = React.createContext();

const App = () => {
    const [state, dispatch] = useReducer(reducer, states);

    useEffect(() => {
    }, []);

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

    const createAccount = () => {
        dispatch({type:'LOGIN'});
    }

    const logout = () => {
        dispatch({type:'LOGOUT'});
    }

    return (
        <AppContext.Provider value={
                {
                    state,
                    login,
                    logout,
                    createAccount,
                }}>
            <div className='app-container' style={{minHeight:state.height-100, maxHeight:'auto'}}>
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
        </AppContext.Provider>
    );
}

export default App;
