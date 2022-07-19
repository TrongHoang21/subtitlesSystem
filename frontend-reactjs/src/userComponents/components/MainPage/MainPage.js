import React, { useEffect } from 'react'
import { Container, Nav,Button,Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/MainPage.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { NODEJS_SERVER } from '../../../env';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../../reduxComponents/userAndProjectSlice';

function MainPage() {
  const dispatch = useDispatch();
  const pageRouter = useNavigate();

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

          //redirect to workspace
          pageRouter('/dev_workspacePage')
        } else{
          pageRouter('/dev_login')
        }
      })

    } 
  }, []);



  return (
    <div className='MainPage'>
      <Navbar bg="light" expand="lg">

        <div className='navbar__logo' style={{marginTop: '10px'}}>
        {/* <Image src='https://assets-global.website-files.com/616e938268c8f02f94b2b53c/616e938268c8f06a8db2b5a9_veed-alt.svg' width="124" alt="" className="veed-logo"></Image> */}
 
          <h1 className="logo1" style={{fontWeight: 'bold', fontSize: '30px',
            color: 'rgb(25, 32, 51)', cursor: 'pointer',
            fontFamily: 'Euclidcirculara webfont, Arial, sans-serif'
            }}>ORANGESUB</h1>
  
        </div>

        <Container fluid>
        <Navbar.Collapse id="navbarScroll">

        {/* this nav kept to align button pallete to the right */}
        <Nav
        className="me-auto my-2 my-lg-0"
        style={{ maxHeight: '100px', fontsize: '16px',fontweight: '400'}}
        navbarScroll
        >



        </Nav>

        <Link to='dev_pricing'>
          <Button style={{backgroundColor:'transparent', color:'black', marginRight: '10px', border:'none'}}>Pricing</Button>
        </Link>

        <Link to='dev_login'>
          <Button className='navbar__button buttonLogin' variant="outline-success">Login</Button>
        </Link>

        <Link to='dev_register'>
          <Button className='navbar__button buttonSignUp' variant="outline-success">Sign Up</Button>
        </Link>

        </Navbar.Collapse>
        </Container>
        </Navbar>

    <div className='sectionTop'>
        <div className='container_section'>
            <h1 className='heading-1'>Video editing</h1>
            <span className="text-span-3">made simple</span>
        </div>
        
        <h1 className='heading-2'>Create videos with a single click. Add subtitles, transcribe audio and more</h1>
        <h1 className='heading-3'>Try it now, no account required</h1>

      <div className="bigbutton">
        {/* <a href="" className="link-bigbutton"> */}
           <Link style={{textDecoration: 'none'}} to="/EditPage">
            <div className="text-in-bigbutton">Upload Your Video</div>
            </Link> 
          {/* </a> */}
      </div>
        

        <h1 className='heading-5'>Try Sample {'>'}</h1>

        
    </div>
    <img src="https://veed-assets.b-cdn.net/images/Webflow/legacy/6026a6dc410f5bb1159bee51_homd-hero-update.png" className="main-hero-img" alt=""></img>
    </div>
  )
}

export default MainPage
