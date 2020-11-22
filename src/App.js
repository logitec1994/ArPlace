import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import ItemPage from './components/ItemPage'
import CreateAdvert from './components/CreateAdvert'
import AuthorPage from './components/AuthorPage'
import ProfilePage from './components/Profile'
import MainPage from './components/MainPage'
import Header from './components/Header'
import Footer from './components/Footer'


function App() {
  return (
    <Router>
      <div className="wrapper">
        <Header />
        <div className="main">
          <Route path="/item/:itemUrl" component={ItemPage} />
          <Route path="/author/:authorUrl" component={AuthorPage} />
          <Route path="/profile/:profileUrl" component={ProfilePage} />
          <Route path="/main" component={MainPage} />
          <Route path="/create-advert" component={CreateAdvert} />
        </div>
        <Footer />
      </div> 
    </Router>
  )
}

export default App
