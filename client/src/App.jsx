import { Route } from "wouter"
import './App.css'
import Dashboard from './components/Dashboard/Dashboard'
import Login from './components/Login/Login'
import Signup from './components/Signup/Signup'

function App() {
  return (
    <div className="App">
      <Route path='/' component={Login} />
      <Route path='/signup' component={Signup} />
      <Route path='/dashboard' component={Dashboard} />
    </div>
  )
}

export default App
