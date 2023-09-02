import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Protected from './components/Protected';
import { AuthContextProvider } from './context/AuthContext';
import Home from './pages/Home_proj';
import Signin from './pages/Signin';
import ChatPage from './pages/Chat';
import MainPage from './pages/Home_user';
import Introductory from './pages/Introductory';
import Conversations from './pages/conversations';
function App() {
  return (
    <div>
      <AuthContextProvider>

        <Routes>

          <Route exact path='/' element={<Home />} />
          {/* <Route exact path='/signin' element={<Signin />} />
          <Route exact path='/signin/introductory' element={<Introductory />} /> */}
          
          
          <Route
            path='/account'
            element={
              <Protected>
                <MainPage />
             </Protected> 
            }
          />
          
          <Route
             exact path='/chat/:conversationId'
            element={
              <Protected>
                <ChatPage />
              </Protected>
            }
          />
          <Route
             exact path='/Conversations'
            element={
              <Protected>
                <Conversations />
              </Protected>
            }
          />


        </Routes>

      </AuthContextProvider>
    </div>
  );
}

export default App;

