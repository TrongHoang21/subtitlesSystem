import React, {useState, useEffect, useRef, useCallback} from "react";
import '../../styles/Login-LoginPage.css'
import {useDispatch, useSelector} from 'react-redux'
import {selectCurrentUser, setUserInfo} from '../../../reduxComponents/userAndProjectSlice'
import axios from "axios";
import { NODEJS_SERVER } from "../../../env";
import { Link, useNavigate } from "react-router-dom"; 


function LoginPage() {
  const pageRouter = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const submitButton = useRef();
  const form = useRef();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Message, setMessage] = useState("");

  
  
  
  
  const handleChangeEmail = (e) => {
    setEmail(e.target.value)
  }

  const handleChangePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmitButton = useCallback((e) => {
    e.preventDefault()
    
    let currentProject = "";
    if(currentUser.currentProject !== undefined && currentUser.currentProject.videoUrl !== ""){
      currentProject = JSON.stringify(currentUser.currentProject)
    }

    let dataSubmit = {
      email: Email,
      password: Password,
      currentProject: currentProject
    }

    axios({
      method: 'post',
      url: NODEJS_SERVER + '/login',
      data: dataSubmit,
    })
    .then(response => {
      if(response.data.success){ // Axios responses have a `data` property that contains the HTTP response body.
        console.log('login success: ', response.data); 

        dispatch(setUserInfo({
          userInfo: response.data.userInfo
        }))

        //set localStorage
        localStorage.setItem('userId', response.data.userInfo.id)

        //redirect
        console.log('role: ', response.data.userInfo.role);
        
        if(response.data.userInfo.role === 'user'){
          pageRouter('/dev_WorkspacePage')
        }
        else{
          pageRouter('/dev_AdminMainPage')
        }

        
      } else {
        setMessage(response.data.message)
      }
    }).catch(err => setMessage('Connection Error!'))
    
  

  }, [dispatch, pageRouter, currentUser,Email, Password])

  
  useEffect(() => {
    // console.log(currentUser);

    let submitButtonRef = null //there is a warning
    
    if(currentUser.currentProject !== undefined && submitButton.current){ //have data or not, let server check
      submitButtonRef = submitButton.current
      submitButtonRef.addEventListener('click', handleSubmitButton);
    }
  
    return () => {
      if(submitButtonRef){
        submitButtonRef.removeEventListener('click', handleSubmitButton);
      }
      
    };
  }, [currentUser, handleSubmitButton]);


    //CSR session (localStorage)
    useEffect(() => {
      let userId = localStorage.getItem('userId')
      
      if(userId){
        
  
        //get login infor
        axios({
          url: NODEJS_SERVER + '/login/' + userId,
          method: 'get',
        })
        .then(response => {
          if(response.data.success){
            console.log('get login', response.data.userInfo);
            
            //set to current user
            dispatch(setUserInfo({
              userInfo: response.data.userInfo
            }))
          }
          else{
            pageRouter('/dev_login')
          }
        })
  
      } 
    }, []);

  //redirect if logined already
  useEffect(() => {
    console.log('loginPage useEffect redirect check');
    
    if(currentUser.userInfo && currentUser.userInfo.role === "user"){
      pageRouter('/dev_WorkspacePage')
    }
    else if(currentUser.userInfo && currentUser.userInfo.role === ""){
      //no login
    }
    else if(currentUser.userInfo && currentUser.userInfo.role !== "user"){
      pageRouter('/dev_AdminMainPage')
    }
  
  }, [currentUser]);



  return (

<div>
    <div id="root">
      <main className="app" data-testid="@main/container">
        <div className="LogInPage__Container-sc-1lupdgi-0 cNexuf">
          <div className="LogInPage__LeftWrapper-sc-1lupdgi-3 heZZjo">
            <div className="LogInPage__FormWrapper-sc-1lupdgi-1 fBwYea">
              <div data-testid="@account/login-form" className="LoginOrSignupForm__RootWrapper-sc-x0p9og-0 gihzRa">
                <div className="styled__Header">
                  <h1 className="logo1" style={{fontWeight: 'bold', fontSize: '30px',
                  color: 'rgb(25, 32, 51)', cursor: 'pointer',
                  fontFamily: 'Euclidcirculara webfont, Arial, sans-serif'
                  }}>ORANGESUB</h1>
                  {/* <svg viewBox="0 0 167 31" fill="none" xmlns="http://www.w3.org/2000/svg" className="styled__Logo-1">
                    <path d="M19.5939 29.3733H11.7147L0 0.658971H8.92148L15.6751 17.8018L22.3871 0.658971H31.3086L19.5939 29.3733Z" fill="currentColor"></path>
                    <path d="M55.6065 29.3733H33.3862V0.658971H55.4398V7.60183H41.3905V11.8447H54.3142V18.1447H41.3905V22.4304H55.6065V29.3733Z" fill="currentColor"></path>
                    <path d="M81.3366 29.3733H59.1162V0.658971H81.1698V7.60183H67.1205V11.8447H80.0442V18.1447H67.1205V22.4304H81.3366V29.3733Z" fill="currentColor"></path>
                    <path d="M96.6443 0.658971C101.202 0.658971 104.885 1.97326 107.692 4.60183C110.471 7.25897 111.861 10.7304 111.861 15.0161C111.861 19.3018 110.471 22.759 107.692 25.3875C104.885 28.0447 101.202 29.3733 96.6443 29.3733H84.8463V0.658971H96.6443ZM96.0607 22.4304C98.3675 22.4304 100.23 21.7447 101.647 20.3733C103.064 19.0018 103.773 17.2161 103.773 15.0161C103.773 12.8161 103.064 11.0304 101.647 9.65897C100.23 8.28754 98.3675 7.60183 96.0607 7.60183H92.8506V22.4304H96.0607Z" fill="currentColor"></path>
                    <path d="M118.39 20.759C119.64 20.759 120.683 21.2018 121.516 22.0875C122.322 22.9733 122.725 24.0161 122.725 25.2161C122.725 26.4733 122.322 27.5161 121.516 28.3447C120.683 29.1733 119.64 29.5875 118.39 29.5875C117.139 29.5875 116.111 29.1733 115.305 28.3447C114.471 27.5161 114.054 26.4733 114.054 25.2161C114.054 24.0161 114.471 22.9733 115.305 22.0875C116.111 21.2018 117.139 20.759 118.39 20.759Z" fill="currentColor"></path>
                    <path d="M125.68 29.3733V0.658971H133.685V29.3733H125.68Z" fill="currentColor"></path>
                    <path d="M151.95 0.0161133C156.175 0.0161133 159.746 1.45897 162.664 4.34468C165.555 7.25897 167 10.8161 167 15.0161C167 19.2161 165.555 22.759 162.664 25.6447C159.746 28.559 156.175 30.0161 151.95 30.0161C147.726 30.0161 144.168 28.559 141.278 25.6447C138.36 22.759 136.9 19.2161 136.9 15.0161C136.9 10.8161 138.36 7.25897 141.278 4.34468C144.168 1.45897 147.726 0.0161133 151.95 0.0161133ZM151.95 22.6018C153.951 22.6018 155.619 21.8733 156.953 20.4161C158.259 18.9875 158.912 17.1875 158.912 15.0161C158.912 12.8733 158.259 11.0733 156.953 9.61611C155.619 8.15897 153.951 7.4304 151.95 7.4304C149.949 7.4304 148.295 8.15897 146.989 9.61611C145.655 11.0733 144.988 12.8733 144.988 15.0161C144.988 17.1875 145.655 18.9875 146.989 20.4161C148.295 21.8733 149.949 22.6018 151.95 22.6018Z" fill="currentColor"></path>
                  </svg> */}

                  <h1 className="styled__Title-1">Welcome back to ORANGE</h1>
                  <h2 className="styled__Subtitle-1">Log in to your account and start creating</h2>
                </div>
                <form ref={form} onSubmit={handleSubmitButton} className="LoginOrSignupForm__StyledForm-sc-x0p9og-1 eiWYJH">
                  <button type="button" className="OAuthGoogle__GoogleButton">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48" className="svg-OAuthGoogle__GoogleButton">
                      <defs>
                        <path
                          id="a"
                          d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                        ></path>
                      </defs>
                      <clipPath id="b">
                        <use xlinkHref="#a" overflow="visible"></use>
                      </clipPath>
                      <path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z"></path>
                      <path clipPath="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z"></path>
                      <path clipPath="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z"></path>
                      <path clipPath="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z"></path>
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                  <div className="LoginOrSignupForm__Divider-sc-x0p9og-3 gPJDsB">OR</div>
                  <div className="Input__RootWrapper-sc-mdxq3k-0 kdZnns LoginOrSignupForm__StyledInput-sc-x0p9og-5 irApWU">
                    <input onChange={handleChangeEmail} id="email" placeholder="Enter your email address here" type="email" name="email" className="Input__StyledInput-sc-mdxq3k-2 cibaxs" value={Email}/>
                    <label className="Input__Label-sc-mdxq3k-1 bdYPll">
                      Email Address
                    </label>
                  </div>
                  <div className="Input__RootWrapper-sc-mdxq3k-0 kdZnns LoginOrSignupForm__StyledInput-sc-x0p9og-5 irApWU">
                    <input onChange={handleChangePassword} id="password" placeholder="Enter your password here" type="password" name="password" className="Input__StyledInput-sc-mdxq3k-2 cibaxs" value={Password} />
                    <label className="Input__Label-sc-mdxq3k-1 bdYPll">
                      Password
                    </label>
                  </div>
                  <button
                    className="LoginButton"
                    ref={submitButton}
                  >
                    Login now !
                  </button>
                  <p className="LoginOrSignupForm__MagicLinkHint-sc-x0p9og-4 boSaNK">{Message}</p>
                </form>
                <div className="FormStyled__Footer-sc-67n526-6 dCuQEf">
                  Don't have an account? 
                <br/>
                      <Link className="styled__BlueLink-sc-1uh77v9-4 hRKVQr" to="/dev_register">
                        Create an account for free
                        </Link>
                      </div>
              </div>

            </div>
          </div>
          <div className="LogInPage__Outdoor-sc-1lupdgi-2 jeOygR"></div>
        </div>
      </main>
    </div>



</div>
  
  );
}

export default LoginPage;
