import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'
import { Provider } from 'react-redux'
import styles from './sass/index'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import createLogger from 'redux-logger'
import ReduxPromise from 'redux-promise'
import reducers from './redux/store/combineReducers'

// pages
import MasterPage from './pages/MasterPage'
import MainPage from './pages/MainPage/MainPage'


const logger = createLogger()
const store = createStore(reducers,
    applyMiddleware(reduxThunk, ReduxPromise, logger)
)

class Root extends React.Component {

    render() {
        return (
            <Provider store={store}>
                <Router history={browserHistory}>
                    <Route path="/" component={MasterPage}>
                    <IndexRoute component={MainPage} />

                    </Route>
                </Router>
            </Provider>
            )
        }
}

ReactDOM.render(<Root />, document.getElementById('app'))