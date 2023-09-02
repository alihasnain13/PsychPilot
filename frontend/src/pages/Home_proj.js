import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import { Link } from 'react-router-dom';
import { GoogleButton } from 'react-google-button';
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ParticleBackground from '../components/particlesBackground'
import { motion } from "framer-motion"

function Home() {

  const [showText, setShowText] = useState(false);
  
  const { googleSignIn, user } = UserAuth();
  const navigate = useNavigate();

  

// Listen for authentication state changes


  useEffect(() => {



    if (user !== null && user !== undefined) {

      setTimeout(() => {

      console.log(user);
      navigate('/account');
    }, 1000);


      

    }




  });

  useEffect(() => {
    setShowText(true);
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const createflex = () => {
    document.querySelector('.bg-modal').style.display = "flex";
  };

  const closeflex = () => {
    document.querySelector('.bg-modal').style.display = "none";
  };

  return (


    <>
      <div style={{ display: 'grid', width: '100vw', height: '100vh' }}>


        <header className="App-header item1">
          <div className='content show' >

            <div className='textMain' >Welcome to <span style={{ color: '#3a2568' }}>Psych</span><span style={{ color: '#C31C7E' }}>Pilot</span></div>
            <div className="buttons">
              <button className="_button buttonsignin" style={{ zIndex: '1' }} id="button" on onClick={createflex}><span className='signup'>Sign In</span></button>
              {/* <button className="_button" style={{ zIndex: '1' }}><Link to='/signin'><span>Sign in</span></Link></button> */}
            </div>
            <div className='Paragrapg'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available. It is also used to temporarily replace text in a process called greeking, which allows designers to consider the form of a webpage or publication, without the meaning of the text influencing the design.</div>
          </div>
        </header>


        <div style={{ zIndex: '-1', opacity: '0.6' }}>

          <ParticleBackground />
        </div>

        <div class="bg-modal" style={{ zIndex: '2' }}>
          <div class="modal-contents">

            <button class="close" onClick={closeflex}>+</button>
            <img style={{ width: '50px' }} src="https://th.bing.com/th/id/OIP.1-GkpyXtCOEcd_Wi9Y7QzAHaGH?pid=ImgDet&rs=1" alt=""></img>
            <h2>Sign In With</h2>

            <div className='contententBox'>
              {/* <GoogleButton className="signinbuttons" onClick={() => alert("Hello")} /> */}
              <FacebookLoginButton className="signinbuttons" onClick={() => alert("Hello")} />
              <GoogleLoginButton className="signinbuttons" onClick={handleGoogleSignIn} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;
