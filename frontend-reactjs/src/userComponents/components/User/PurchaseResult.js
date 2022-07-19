import React, { useEffect, useState } from "react";
import {Container, Nav,Button,Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/User-PricingResult.css'
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { NODEJS_SERVER } from "../../../env";




function PurchaseResult() {

  const search = useLocation().search;
  const resultCode = new URLSearchParams(search).get('resultCode');
  const message = new URLSearchParams(search).get('message');
  const extraData = new URLSearchParams(search).get('extraData');

  const [isSubscribed, setIsSubscribed] = useState(true);
  const [Status, setStatus] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");


  //UseEffect to avoid memory leak when async task but unmounted
  useEffect(() => {
    setIsSubscribed(true);
    return () => setIsSubscribed(false);
  }, []);


  //Notify to server backend to save to database if success
  useEffect(() => {
    //Thanh toán thành công
    if(resultCode === '0'){ 

      setStatus("Đang lưu giao dịch vào hệ thống. Chờ chút nhé...")

    axios({
      method: 'post',
      url: NODEJS_SERVER + '/notifyAfterPurchase',
      data: {
        extraData : extraData
      },
    })
    .then(response => {
      if(response.data.success && isSubscribed){
        setStatus("")
      
      }
      else{
        setStatus("")
        setErrorMessage(response.data.message)
      }
    })

  }
}, []);




  return (
    <div id="root">



      <main className="app defaultScrollbar" data-testid="@main/container">

      <Navbar bg="light" expand="lg">

      <h1 className="logo1" style={{fontWeight: 'bold', fontSize: '30px',
                    color: 'rgb(25, 32, 51)', cursor: 'pointer',
                    fontFamily: 'Euclidcirculara webfont, Arial, sans-serif',
                    marginLeft: '20px'
                    }}>ORANGESUB</h1>

        <Container fluid>
        <Navbar.Collapse id="navbarScroll">
        <Nav
        className="me-auto my-2 my-lg-0"
        style={{ maxHeight: '100px', fontsize: '16px',fontweight: '400'}}
        navbarScroll
        >


        </Nav>


        </Navbar.Collapse>
        </Container>
        </Navbar>


        <div className="Pricingstyled__PricingScreenContainer-1">

          {
            resultCode === '0' ? <div>
              <h1 className="Pricingstyled__Heading-1" style={{color:'#0a7818'}}>{message}</h1>
              <h2 className="Pricingstyled__Subheading-1">Bạn đã thanh toán thành công gói dịch vụ. Còn một bước nữa!</h2>
              
            </div>

            :

            <div >
              <h1 className="Pricingstyled__Heading-1" style={{color:'#a31433'}}>{message}</h1>
              <h2 className="Pricingstyled__Subheading-1">Có lỗi xảy ra trong quá trình thanh toán. Bạn vui lòng thực hiện thanh toán vào lúc khác nhé!</h2>
              

            </div>
          }
        

          {
            Status ? 
            <div>
              <h3 className="Pricingstyled__Heading-3" style={{color:'#0a7818'}}>{Status}</h3>
            </div>
            :
            <div>

              <div className="PricingTablestyled__IntervalToggleContainer-1">
                  <Link to='/dev_WorkspacePage'>
                    <Button className='navbar__button buttonSignUp' variant="outline-success">Workspace</Button>
                  </Link>
                </div>


              {
                ErrorMessage ?
                  <h3 className="Pricingstyled__Heading-3" style={{color:'#db522c'}}>{ErrorMessage}</h3>
                :
                  <h3 className="Pricingstyled__Heading-3" style={{color:'#0a7818'}}>Nhấn để trở về workspace của bạn và hoàn tất giao dịch!</h3>

              }



            </div>

            

           }


            
         
            </div>
    
          
      </main>

      
    </div>
    
  );
}

export default PurchaseResult;
