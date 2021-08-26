import { BrowserRouter as Router } from 'react-router-dom';
import { useRoutes } from './Routes';
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';
import { NavBar } from './components/NavBar';
import { Loader } from './components/Loader';
import 'materialize-css'

function App() {
  const {token, login, logout, userId, ready} = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)

  if(!ready){
    return <Loader/>
  }
  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, isAuthenticated
    }}>
    <Router>
      {isAuthenticated && <NavBar></NavBar>}
    <div className="container">
          {routes}
    </div>
    </Router>
    </AuthContext.Provider>
  );
}

export default App
