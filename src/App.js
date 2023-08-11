import React from 'react';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import Menu from './components/Menu';
import Register from './components/Register';
import Message from './components/Message';
import User from './components/User';
import Thread from './components/Thread';
import './App.css';

export const dataContext = React.createContext()
export const userDataContext = React.createContext()

function App() {
  const [userData, setUserData] = useState(null)
 
  return (
    <userDataContext.Provider value={userData}>
      <dataContext.Provider value={setUserData}>
        <div className="App">                    
          <Routes>
            <Route path='/home' element={<Menu userData={userData}/>} />
            <Route path="/auth" element={<Auth t0="Inicia sesión en Twitter" />} />
            <Route path='/follows' element={<Menu/>} />
            <Route path='/register' element={<Register/>}/>            
            <Route path='/messages' element={<Message hasMessages={false}/>}/>
            <Route path='/user/:email' element={<User/>}/>
            <Route path='home/status/:id'element={<Thread/>}/>
          </Routes>
        </div>
      </dataContext.Provider>
    </userDataContext.Provider>
  );
}

export default App;
