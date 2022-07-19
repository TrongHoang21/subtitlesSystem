import React, { useState, useEffect } from "react";
import { Container, Nav, Button, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/User-PricePlanPage.css'
import { Link, useNavigate } from "react-router-dom";

// import pricingFree from '../../media/pricingFree.jpg'
// import pricingBasic from '../../media/pricingBasic.svg'
// import pricingPro from '../../media/pricingPro.webp'
// import pricingEnterprise from '../../media/pricingEnterprise.png'

import "../../styles/User-PurchaseModal.css";
import { Dialog } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import axios from "axios";
import { NODEJS_SERVER } from "../../../env";

import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, setUserInfo } from "../../../reduxComponents/userAndProjectSlice";

const policies = [
  { id: 0, name: 'EMPTY', priceVND: 0, imgSrc: '', featureList: ["Video Export Length : 0mins", "Upload File Size : 0MB", "Storage : 0MB", "Auto Subtitles: 0mins", "SRT Subtitles Downloads: NO"] },
];


function PricePlanPage() {
  const [chosenPolicy, setchosenPolicy] = useState(0);
  const [open, setOpen] = useState(false);
  const [PolicyId, setPolicyId] = useState('');
  const [EmailAddress, setEmailAddress] = useState('');
  const [ConfirmEmail, setConfirmEmail] = useState('');
  // const [CardNumber, setCardNumber] = useState('');
  const [Message, setMessage] = useState('');
  const [PolicyList, setPolicyList] = useState(policies);
  const [isSubscribed, setIsSubscribed] = useState(true);

  const currentUser = useSelector(selectCurrentUser)
  const pageRouter = useNavigate();
  const dispatch = useDispatch();


  //CSR session (localStorage)
  useEffect(() => {

    let userId = localStorage.getItem('userId')

    if (userId) {


      //get login infor
      axios({
        url: NODEJS_SERVER + '/login/' + userId,
        method: 'get',
      })
        .then(response => {
          if (response.data.success) {
            console.log('get login', response.data.userInfo);

            //set to current user
            dispatch(setUserInfo({
              userInfo: response.data.userInfo
            }))

          } else{
            pageRouter('/dev_login')
          }
        })

    }
  }, []);



  //Check if not user -> login page, no purchase
  useEffect(() => {
    // console.log('pricingPage: ', currentUser);

    if(currentUser.userInfo && (currentUser.userInfo.role !== "user")){
      pageRouter('/dev_login')
    }

  }, [currentUser]);

  //UseEffect to avoid memory leak when async task but unmounted
  useEffect(() => {
    setIsSubscribed(true);
    return () => setIsSubscribed(false);
  }, []);


  //Get Policy List
  useEffect(() => {
    axios({
      url: NODEJS_SERVER + '/getPolicyList',
      method: 'get',
    })
      .then(response => {
        if (response.data.success && isSubscribed) {

          const listWithFeatureList = createFeatureList(response.data.policyList)

          console.log('Get Policy List after add: ', listWithFeatureList);

          setPolicyList(listWithFeatureList)
        }

      })

  }, []);

  const createFeatureList = (policyList) => {
    // To create an array of string like this for easily iterate and show: featureList: ["Video Export Length : 2mins", "Upload File Size : 25MB", "Storage: 250MB", "Auto Subtitles: 2mins", "SRT Subtitles Downloads: NO"]

    for (let i = 0; i < policyList.length; i++) {
      let arr = [];
      arr.push("Video Export Length : " + policyList[i].rule_maxVideoExportLengthMinutes + "mins");
      arr.push("Upload File Size : " + policyList[i].rule_maxUploadFileSizeMB + "MB");
      arr.push("Storage : " + policyList[i].rule_maxStorageMB + "MB");
      arr.push("Auto Subtitles : " + policyList[i].rule_maxAutoSubMinutes + "mins");
      arr.push(`SRT Subtitles Downloads : ${policyList[i].rule_isSubDownloadable ? "YES" : "NO"}`);
      policyList[i].featureList = arr;
    }

    //Sort by id
    policyList.sort(function compareFn(a, b) {
      if (a.id > b.id)
        return 1; //b before a
      return -1; //a before b
    })

    return policyList;

  }


  const handleClick = (value) => {
    setOpen(true);
    setchosenPolicy(value)

    console.log('click: PolicyList[value].id', PolicyList[value].id);

    setPolicyId(PolicyList[value].id)
  }

  const handleClose = () => {
    setOpen(false);
    policy = "";
    setMessage('')
  };

  const handleChangeEmail = (e) => {
    setEmailAddress(e.target.value)
  };

  const handleChangeConfirmEmail = (e) => {
    setConfirmEmail(e.target.value)
  };

  // const handleChangeCardNumber = (e) => {
  //   setCardNumber(e.target.value)
  // };

  const handlePurchase = (e) => {
    setMessage('Processing...')
    document.querySelector('.message-purchase').setAttribute("style", 'color: black;font-family: -apple-system,BlinkMacSystemFont,system-ui,sans-serif; font-weight: 500;')


    //kiểm tra email và confirm khớp nhau, nếu k báo lỗi ngay
    if (!EmailAddress || !ConfirmEmail) {
      setMessage('Phải điền tất cả thông tin')
      document.querySelector('.message-purchase').setAttribute("style", 'color: red;font-family: -apple-system,BlinkMacSystemFont,system-ui,sans-serif; font-weight: 500;')
      return;
    }

    if (EmailAddress !== ConfirmEmail) {
      setMessage('Email không trùng khớp!')
      document.querySelector('.message-purchase').setAttribute("style", 'color: red;font-family: -apple-system,BlinkMacSystemFont,system-ui,sans-serif; font-weight: 500;')
      return;
    }

    //kiểm tra thẻ hợp lệ -> chỉ được là số, 9 kí tự, ví dụ vậy (đáng ra cần kiểm tra password từ 3rd-party nữa)
    // for(let i = 0; i < CardNumber.length; i++){
    //   if(isNaN(CardNumber[i]) || CardNumber.length !== 9){
    //     setMessage('Thẻ phải có 9 chữ số')
    //     document.querySelector('.message-purchase').setAttribute("style", 'color: red;font-family: -apple-system,BlinkMacSystemFont,system-ui,sans-serif; font-weight: 500;')
    //     return;
    //   }
    // }

    //gửi request, để message là waiting...
    axios({
      method: 'post',
      url: NODEJS_SERVER + '/purchasePlan',
      data: {
        email: EmailAddress,
        // cardNumber: CardNumber,
        policyId: PolicyId
      },
    })
      .then(response => {
        if (response.data.success) {
          // setMessage(response.data.message + '\nKiểm tra tại tại khoản của bạn')
          // document.querySelector('.message-purchase').setAttribute("style", 'color: green;font-family: -apple-system,BlinkMacSystemFont,system-ui,sans-serif; font-weight: 500;')

          console.log('thành công rồi nè bà con ơi: ', response.data);
          window.location.href = response.data.payUrl
        }
        else {
          setMessage(response.data.message)
          document.querySelector('.message-purchase').setAttribute("style", 'color: red;font-family: -apple-system,BlinkMacSystemFont,system-ui,sans-serif; font-weight: 500;')



        }
      })
    console.log('gửi thông tin thanh toán cho server: ', policyName, EmailAddress);


    //trả về kết quả, hiển thị message
    setEmailAddress('')
    setConfirmEmail('')
    // setCardNumber('')
    // setPolicyId('')
    // setchosenPolicy('') -> dont do this, will throw an error

  };



  let policy = PolicyList[chosenPolicy]
  const featureList = policy.featureList
  const policyName = policy.policyName
  const policyDescription = policy.description
  const policyImgSrc = policy.imgSrc
  const policyPrice = policy.priceVND







  return (
    <div id="root">

      {/* <PurchaseModal> */}
      <div>
        <StyledEngineProvider injectFirst>
          {/* Your component tree. Now you can override MUI's styles. */}
          <Dialog sx={{ backdropFilter: "blur" }} open={open} className="mui-dialog-content">

            <div className="dialog-content">


              <div className="left-section">
                <div className="Sidebarstyled__SidebarContainer-sc-5smszl-0 fnHMhr">


                  <div className="Sidebarstyled__BackButtonWrapper-sc-5smszl-12 gGQXpc">
                    {
                      Message !== 'Processing...' &&
                      <button className="BackButtonstyled__Button-sc-ts4p84-0 bksrsV" onClick={handleClose}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http:'//www.w3.org/2000/svg" className="sc-bdvvtL eoWdFC">
                          <path d="M20 12H4m0 0l7 7m-7-7l7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </button>
                    }
                  </div>

                  <div className="Sidebarstyled__Header-sc-5smszl-4 eANrFq">

                    <img src={policyImgSrc} alt="" className="Sidebarstyled__LargeIcon-sc-5smszl-5 eiFRmy" />
                    <div>
                      <div className="Sidebarstyled__Title-sc-5smszl-7 izutSQ">{policyName}</div>
                      <div className="Sidebarstyled__Description-sc-5smszl-8 bPcUyh">{policyDescription}</div>
                    </div>
                  </div>
                  <div className="Sidebarstyled__Body-sc-5smszl-6 hNnOvR">
                    <div className="Sidebarstyled__ListWrapper-sc-5smszl-9 dksTbW">
                      <div className="FeatureListstyled__List-sc-1kqyj41-0 kpHOpi">

                        {featureList && featureList.map((item, index) => (

                          <div key={index} className="ListItemstyled__Row-sc-ksw2ez-1 hRYEAT">
                            <div className="ListItemstyled__Circle-sc-ksw2ez-0 bcEHFA">
                              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http:'//www.w3.org/2000/svg" color="#B377FF">
                                <path d="M12.3337 5.3335L6.00033 11.3335L2.66699 8.00016" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                              </svg>
                            </div>
                            {item}
                          </div>

                        ))}


                      </div>
                      <p className='message-purchase'>{Message}</p>
                    </div>
                  </div>



                </div>
              </div>

              <div className="right-section">
                <div className="SinglePlanViewstyled__Main-sc-11umq2k-1 dTNezA">
                  <h1 className="SinglePlanViewstyled__Title-sc-11umq2k-2 bnQIMO">Upgrade My Workspace to {policyName}</h1>



                  <div className="PaymentPlanTabstyled__Container-sc-v1pdnw-0 kdPoft">



                    <div className="PaymentPlanTabstyled__Body-sc-v1pdnw-5 jwcfWU">
                      <div className="PaymentPlanTabstyled__InputGrid-sc-v1pdnw-7 dWBMgM">

                        <div className="sc-khQegj jqDpB PaymentPlanTabstyled__StyledInput-sc-v1pdnw-6 bEndeF">
                          <input
                            id="email"
                            placeholder="Enter your email address here"
                            data-testid="@payment-plan/email"
                            className="sc-jgrJph jkfuxu"
                            value={EmailAddress}
                            onChange={handleChangeEmail}
                          />
                          <label className="sc-hUpaCq doaakO">Email Address</label>
                        </div>

                        <div className="sc-khQegj jqDpB PaymentPlanTabstyled__StyledInput-sc-v1pdnw-6 bEndeF">
                          <input
                            id="email"
                            placeholder="Confirm your email address here"
                            data-testid="@payment-plan/email"
                            className="sc-jgrJph jkfuxu"
                            value={ConfirmEmail}
                            onChange={handleChangeConfirmEmail}
                          />
                          <label className="sc-hUpaCq doaakO">Confirm Email Address</label>
                        </div>

                        <div>
                          <label className="sc-hUpaCq doaakO">Payment Methods</label>

                          <img height='30px' width='30px' alt="momo icon" src={'https://play-lh.googleusercontent.com/dQbjuW6Jrwzavx7UCwvGzA_sleZe3-Km1KISpMLGVf1Be5N6hN6-tdKxE5RDQvOiGRg'} />

                        </div>

                      </div>



                    </div>

                    {/* Nếu đang proccessing thì phải disable các nút này */}

                    <div className="PaymentPlanTabstyled__Footer-sc-v1pdnw-4 iMOstU">

                      {
                        Message === 'Processing...' ?
                          <div>
                            {/* Left empty */}

                          </div>


                          :
                          <div className="FormButtonsstyled__Group-sc-16d3kqm-0 kYeYSc">
                            <button onClick={handlePurchase} className="sc-jrQzAO sc-kDTinF fBjQgG dTBbnP FormButtonsstyled__SubmitButton-sc-16d3kqm-1 koPoel">
                              Subscribe Now<div className="FormButtonsstyled__Price-sc-16d3kqm-2 fPUhjD">{policyPrice / 1000}.000đ (VND)</div>
                            </button>
                            <button className="sc-jrQzAO sc-kDTinF fBjQgG jBbHSx" onClick={handleClose}>Cancel</button>
                          </div>

                      }



                    </div>
                  </div>
                </div>
              </div>

            </div>

          </Dialog>
        </StyledEngineProvider>
      </div>




      <main className="app defaultScrollbar" data-testid="@main/container">

        <Navbar bg="light" expand="lg">

          <h1 className="logo1" style={{
            fontWeight: 'bold', fontSize: '30px',
            color: 'rgb(25, 32, 51)', cursor: 'pointer',
            fontFamily: 'Euclidcirculara webfont, Arial, sans-serif',
            marginLeft: '20px'
          }}>ORANGESUB</h1>

          <Container fluid>
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px', fontsize: '16px', fontweight: '400' }}
                navbarScroll
              >


              </Nav>



              {
                currentUser.userInfo && currentUser.userInfo.id ?

                  <div className="InviteBar__InviteBarContainer-sc-xgawj2-0 jpjfiA">
                    <Link to='/dev_WorkspacePage'>
                      <Button className='navbar__button buttonSignUp' variant="outline-success">Workspace</Button>
                    </Link>


                    <div className="InviteBar__AvatarContainer-sc-xgawj2-2 fDnhXJ">

                      <img
                        src={currentUser.userInfo && (currentUser.userInfo.avaPath ? currentUser.userInfo.avaPath : "https://lh3.googleusercontent.com/a/AATXAJym5F0Tn72u4RtYs1MTO7CeD0MVfWoijlSr8Jzi=s96-c")}
                        alt=""
                        size="40"
                        className="Avatar__Icon-sc-1yzjx87-0 jXemal"
                      ></img>
                    </div>
                  </div>
                  :
                  <div>
                    <Link to='dev_login'>
                      <Button className='navbar__button buttonLogin' variant="outline-success">Login</Button>
                    </Link>

                    <Link to='dev_register'>
                      <Button className='navbar__button buttonSignUp' variant="outline-success">Sign Up</Button>
                    </Link>

                  </div>
              }

            </Navbar.Collapse>
          </Container>
        </Navbar>

        { //Because inside this using index up to [3], this is just a way to handle UI when fetching
          PolicyList.length >= 3 ?

            <div className="Pricingstyled__PricingScreenContainer-1">


              <h1 className="Pricingstyled__Heading-sc-ao3m0b-0 ezYKYQ">PRICING PLANS</h1>
              <h2 className="Pricingstyled__Subheading-sc-ao3m0b-1 dmOWyn">All plans include all video editing features, auto subtitles, unlimited projects, and unlimited rendering</h2>
              <div>
                <div className="PricingTablestyled__IntervalToggleContainer-1">
                  <div className="IntervalToggle__ToggleContainer-sc-1">
                    <div className="IntervalToggle__ToggleItemContainer-sc-1">
                      <span className="IntervalToggle__ItemTitle-sc-1">Choose your plan</span>
                    </div>

                  </div>
                </div>
                <p className="PricingTablestyled__PricesBasedIn-sc-guu3xh-7 kLpbun">* prices based on VND</p>

                <div className="PricingTablestyled__PricingTableContainer-sc-guu3xh-24 euxUyk">
                  <div className="PricingTablestyled__OuterGrid-sc-guu3xh-3 elyAIh">
                    <div className="PricingTablestyled__PlansContainer-1">
                      <div className="PricingTablestyled__PlanContainer-sc-guu3xh-4 czqDCt">
                        <div className="PricingTablestyled__PlanTitleContainer-sc-guu3xh-6 fvXIpj">
                          <img src={PolicyList[0].imgSrc} alt="free" className="PricingTablestyled__PlanIcon-sc-guu3xh-8 dMTmVH" />
                          <h3 className="PricingTablestyled__PlanTitle-sc-guu3xh-9 gfHoSX">{PolicyList[0].policyName}</h3>
                        </div>
                        <p className="PricingTablestyled__PlanDescription-sc-guu3xh-10 hjioNu">{PolicyList[0].description}</p>
                        <div className="PricingTablestyled__PriceContainer-sc-guu3xh-11 jvkMrD">
                          <p className="PricingTablestyled__PriceCurrency-sc-guu3xh-12 gERWBk">đ</p>
                          <p className="PricingTablestyled__Price-sc-guu3xh-13 cKjCUC">{PolicyList[0].priceVND}</p>
                        </div>

                        <Link to='/dev_login'>
                          <button className="button_free" data-testid="@pricing-table/button-1">
                            <span className="PricingTablestyled__CTAText-sc-guu3xh-0 gVLvJp">Try For Free</span>
                          </button>
                        </Link>



                      </div>
                    </div>


                    <div className="PricingTablestyled__PlansContainer-2">
                      <div className="PricingTablestyled__PlanContainer-sc-guu3xh-4 czqDCt">
                        <div className="PricingTablestyled__PlanTitleContainer-sc-guu3xh-6 fvXIpj">
                          <img src={PolicyList[1].imgSrc} alt="" className="PricingTablestyled__PlanIcon-sc-guu3xh-8 dMTmVH" />
                          <h3 className="PricingTablestyled__PlanTitle-sc-guu3xh-9 gfHoSX">{PolicyList[1].policyName}</h3>
                        </div>
                        <p className="PricingTablestyled__PlanDescription-sc-guu3xh-10 hjioNu">{PolicyList[1].description}</p>
                        <div className="PricingTablestyled__PriceContainer-sc-guu3xh-11 jvkMrD">
                          <p className="PricingTablestyled__PriceCurrency-sc-guu3xh-12 gERWBk">đ</p>
                          <p className="PricingTablestyled__Price-sc-guu3xh-13 cKjCUC">{PolicyList[1].priceVND / 1000}.000</p>
                          <div className="PricingTablestyled__PriceDetailsBox-sc-guu3xh-14 eMVSiQ">
                            <div className="PricingTablestyled__PriceDiscountContainer-sc-guu3xh-15 ejQkYM">
                              <p className="PricingTablestyled__PriceDiscount-sc-guu3xh-16 fboSOf" style={{ textDecoration: 'line-through' }}>{(PolicyList[1].priceVND + 6000) / 1000}.000</p>
                            </div>
                            <p className="PricingTablestyled__PriceMonthlyLabel-sc-guu3xh-17 bIgtkg">/mo.</p>
                          </div>

                        </div>
                        <button className="button_gobasic" onClick={(e) => handleClick(1)}>
                          <span className="PricingTablestyled__CTAText-sc-guu3xh-0 gVLvJp">Go Basic</span>
                        </button>
                      </div>
                    </div>
                    <div className="PricingTablestyled__PlansContainer-3">
                      <div className="PricingTablestyled__PlanContainer-sc-guu3xh-4 czqDCt">
                        <div className="PricingTablestyled__PlanTitleContainer-sc-guu3xh-6 fvXIpj">
                          <img src={PolicyList[2].imgSrc} alt="" className="PricingTablestyled__PlanIcon-sc-guu3xh-8 dMTmVH" />
                          <h3 className="PricingTablestyled__PlanTitle-sc-guu3xh-9 gfHoSX">{PolicyList[2].policyName}</h3>
                        </div>
                        <p className="PricingTablestyled__PlanDescription-sc-guu3xh-10 hjioNu">{PolicyList[2].description}</p>
                        <div className="PricingTablestyled__PriceContainer-sc-guu3xh-11 jvkMrD">
                          <p className="PricingTablestyled__PriceCurrency-sc-guu3xh-12 gERWBk">đ</p>
                          <p className="PricingTablestyled__Price-sc-guu3xh-13 cKjCUC">{PolicyList[2].priceVND / 1000}.000</p>
                          <div className="PricingTablestyled__PriceDetailsBox-sc-guu3xh-14 eMVSiQ">
                            <div className="PricingTablestyled__PriceDiscountContainer-sc-guu3xh-15 ejQkYM">
                              <p className="PricingTablestyled__PriceDiscount-sc-guu3xh-16 fboSOf" style={{ textDecoration: 'line-through' }}>{(PolicyList[1].priceVND + 6000) / 1000}.000</p>
                            </div>
                            <p className="PricingTablestyled__PriceMonthlyLabel-sc-guu3xh-17 bIgtkg">/mo.</p>
                          </div>

                        </div>
                        <button className="button_gopro" onClick={(e) => handleClick(2)}>
                          <span className="PricingTablestyled__CTAText-sc-guu3xh-0 gVLvJp">Go Professional</span>
                        </button>
                      </div>
                    </div>
                    <div className="PricingTablestyled__PlansContainer-sc-guu3xh-5 bLMsCX">
                      <div className="PricingTablestyled__PlanContainer-sc-guu3xh-4 czqDCt">
                        <div className="PricingTablestyled__PlanTitleContainer-sc-guu3xh-6 fOOLIr">
                          <img
                            src={PolicyList[3].imgSrc}
                            alt=""
                            className="PricingTablestyled__PlanIcon-sc-guu3xh-8 iJFPew"
                          />
                          <h3 className="PricingTablestyled__PlanTitle-sc-guu3xh-9 gfHoSX">{PolicyList[3].policyName}</h3>
                        </div>
                        <p className="PricingTablestyled__PlanDescription-sc-guu3xh-10 hjioNu">{PolicyList[3].description}</p>
                        <p className="PricingTablestyled__PriceSummary-sc-guu3xh-18 Teguw">{`${PolicyList[3].priceVND === 0 ? 'Please contact our sales team for price estimates' : PolicyList[3].priceVND}`}</p>
                        <button className="button_contactus" data-testid="@pricing-table/button-4">
                          <span className="PricingTablestyled__CTAText">Contact us</span>
                        </button>
                      </div>
                    </div>


                    <div style={{ gridArea: '3 / 2 / 4 / -2' }}>
                      <h3 className="PricingTablestyled__FeatureCategoryTitle-sc-guu3xh-19 lbirfO">Pricing Plan Details</h3>
                    </div>
                    <div style={{ height: '1px', background: 'rgb(223, 224, 229)', gridArea: '4 / 2 / 5 / 5', marginRight: '20px', marginTop: '10px' }}></div>
                    <div style={{ height: '1px', background: 'rgb(223, 224, 229)', gridArea: '4 / 5 / 5 / 6', marginRight: '20px', marginTop: '10px' }}></div>
                    <div style={{ height: '1px', background: 'rgb(223, 224, 229)', gridArea: '4 / 6 / 5 / 7', marginLeft: '20px', marginRight: '20px', marginTop: '10px' }}></div>


                    <div className="PricingTablestyled__FeaturesGrid-sc-guu3xh-2-jcEGuA">
                      <div className="PricingTablestyled__FeatureRow-sc-guu3xh-1 jfOeCd">
                        <p className="PricingTablestyled__FeatureLabel-sc-guu3xh-20 cNnCSy">Max Video Export Length</p>
                        <div style={{ fontSize: '16px', marginLeft: '0.5rem', textAlign: 'center' }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http: '//www.w3.org/2000/svg">
                            <circle cx="8" cy="8" r="7.5" stroke="#AEB1BD"></circle>

                            <path d="M8 7.5V10.5" stroke="#5D647B" strokeLinecap="round" strokeLinejoin="round"></path>

                            <path d="M8 5V5.1" stroke="#5D647B" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </div>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 3 / 4' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">{PolicyList[0].rule_maxVideoExportLengthMinutes} mins</p>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 4 / 5' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">{PolicyList[1].rule_maxVideoExportLengthMinutes} mins</p>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 5 / 6' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">{PolicyList[2].rule_maxVideoExportLengthMinutes} mins</p>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 6 / 7' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">{PolicyList[3].rule_maxVideoExportLengthMinutes} mins</p>
                      </div>
                    </div>

                    <div className="PricingTablestyled__FeaturesGrid-sc-guu3xh-2-cBjpmK">
                      <div className="PricingTablestyled__FeatureRow-sc-guu3xh-1 jfOeCd">
                        <p className="PricingTablestyled__FeatureLabel-sc-guu3xh-20 cNnCSy">Max Upload File Size</p>
                        <div style={{ fontSize: ' 16px', marginLeft: ' 0.5rem', textAlign: ' center' }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http: '//www.w3.org/2000/svg">
                            <circle cx="8" cy="8" r="7.5" stroke="#AEB1BD"></circle>

                            <path d="M8 7.5V10.5" stroke="#5D647B" strokeLinecap="round" strokeLinejoin="round"></path>

                            <path d="M8 5V5.1" stroke="#5D647B" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </div>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 3 / 4' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">{PolicyList[0].rule_maxUploadFileSizeMB} MB</p>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 4 / 5' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">{PolicyList[1].rule_maxUploadFileSizeMB} MB</p>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 5 / 6' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">{PolicyList[2].rule_maxUploadFileSizeMB} MB</p>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 6 / 7' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">{PolicyList[3].rule_maxUploadFileSizeMB} MB</p>
                      </div>
                    </div>



                    <div className="PricingTablestyled__FeaturesGrid-sc-guu3xh-2-hzyjUc">
                      <div className="PricingTablestyled__FeatureRow-sc-guu3xh-1 jfOeCd">
                        <p className="PricingTablestyled__FeatureLabel-sc-guu3xh-20 cNnCSy">Projects</p>
                        <div style={{ fontSize: ' 16px', marginLeft: ' 0.5rem', textAlign: ' center' }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http: '//www.w3.org/2000/svg">
                            <circle cx="8" cy="8" r="7.5" stroke="#AEB1BD"></circle>

                            <path d="M8 7.5V10.5" stroke="#5D647B" strokeLinecap="round" strokeLinejoin="round"></path>

                            <path d="M8 5V5.1" stroke="#5D647B" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </div>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 3 / 4' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">Unlimited</p>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 4 / 5' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">Unlimited</p>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 5 / 6' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">Unlimited</p>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 6 / 7' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">Unlimited</p>
                      </div>
                    </div>

                    <div className="PricingTablestyled__FeaturesGrid-sc-guu3xh-2-kIfdHV">
                      <div className="PricingTablestyled__FeatureRow-sc-guu3xh-1 jfOeCd">
                        <p className="PricingTablestyled__FeatureLabel-sc-guu3xh-20 cNnCSy">Cloud Storage</p>
                        <div style={{ fontSize: ' 16px', marginLeft: ' 0.5rem', textAlign: ' center' }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http: '//www.w3.org/2000/svg">
                            <circle cx="8" cy="8" r="7.5" stroke="#AEB1BD"></circle>

                            <path d="M8 7.5V10.5" stroke="#5D647B" strokeLinecap="round" strokeLinejoin="round"></path>

                            <path d="M8 5V5.1" stroke="#5D647B" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </div>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 3 / 4' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">{PolicyList[0].rule_maxStorageMB} MB</p>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 4 / 5' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">{PolicyList[1].rule_maxStorageMB} MB</p>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 5 / 6' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">{PolicyList[2].rule_maxStorageMB} MB</p>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 6 / 7' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">{PolicyList[3].rule_maxStorageMB} MB</p>
                      </div>
                    </div>

                    <div className="PricingTablestyled__FeaturesGrid-sc-guu3xh-2-gLnRXM">
                      <div className="PricingTablestyled__FeatureRow-sc-guu3xh-1 jfOeCd">
                        <p className="PricingTablestyled__FeatureLabel-sc-guu3xh-20 cNnCSy">Auto-generate Subtitles</p>
                        <div style={{ fontSize: ' 16px', marginLeft: ' 0.5rem', textAlign: ' center' }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http: '//www.w3.org/2000/svg">
                            <circle cx="8" cy="8" r="7.5" stroke="#AEB1BD"></circle>

                            <path d="M8 7.5V10.5" stroke="#5D647B" strokeLinecap="round" strokeLinejoin="round"></path>

                            <path d="M8 5V5.1" stroke="#5D647B" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </div>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 3 / 4' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">{PolicyList[0].rule_maxAutoSubMinutes} mins</p>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 4 / 5' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">{PolicyList[1].rule_maxAutoSubMinutes} mins</p>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 5 / 6' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">{PolicyList[2].rule_maxAutoSubMinutes} mins</p>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 6 / 7' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">Unlimited</p>
                      </div>
                    </div>

                    <div className="PricingTablestyled__FeaturesGrid-sc-guu3xh-2-lbVYlS">
                      <div className="PricingTablestyled__FeatureRow-sc-guu3xh-1 jfOeCd">
                        <p className="PricingTablestyled__FeatureLabel-sc-guu3xh-20 cNnCSy">Export Quality</p>
                        <div style={{ fontSize: ' 16px', marginLeft: ' 0.5rem', textAlign: ' center' }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http: '//www.w3.org/2000/svg">
                            <circle cx="8" cy="8" r="7.5" stroke="#AEB1BD"></circle>

                            <path d="M8 7.5V10.5" stroke="#5D647B" strokeLinecap="round" strokeLinejoin="round"></path>

                            <path d="M8 5V5.1" stroke="#5D647B" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </div>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 3 / 4' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">720p</p>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 4 / 5' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">720p</p>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 5 / 6' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">720p</p>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 6 / 7' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">720p</p>
                      </div>
                    </div>

                    <div className="PricingTablestyled__FeaturesGrid-sc-guu3xh-2-fSYeRo">
                      <div className="PricingTablestyled__FeatureRow-sc-guu3xh-1 jfOeCd">
                        <p className="PricingTablestyled__FeatureLabel-sc-guu3xh-20 cNnCSy">Subtitles Downloadable</p>
                        <div style={{ fontSize: ' 16px', marginLeft: ' 0.5rem', textAlign: ' center' }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http: '//www.w3.org/2000/svg">
                            <circle cx="8" cy="8" r="7.5" stroke="#AEB1BD"></circle>

                            <path d="M8 7.5V10.5" stroke="#5D647B" strokeLinecap="round" strokeLinejoin="round"></path>

                            <path d="M8 5V5.1" stroke="#5D647B" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </div>
                      </div>

                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 3 / 4' }}>
                        {
                          PolicyList[0].rule_isSubDownloadable ?

                            <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">
                              <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http: '//www.w3.org/2000/svg">
                                <path d="M1 5.81481L6.13333 11L16 1" stroke="#5D647B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                              </svg>
                            </p>

                            :

                            <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">
                              <svg width="11" height="2" viewBox="0 0 11 2" fill="none" xmlns="http: '//www.w3.org/2000/svg">
                                <path d="M1 1H10" stroke="#AEB1BD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                              </svg>
                            </p>


                        }

                      </div>

                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 4 / 5' }}>
                        {
                          PolicyList[1].rule_isSubDownloadable ?

                            <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">
                              <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http: '//www.w3.org/2000/svg">
                                <path d="M1 5.81481L6.13333 11L16 1" stroke="#5D647B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                              </svg>
                            </p>

                            :

                            <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">
                              <svg width="11" height="2" viewBox="0 0 11 2" fill="none" xmlns="http: '//www.w3.org/2000/svg">
                                <path d="M1 1H10" stroke="#AEB1BD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                              </svg>
                            </p>


                        }
                      </div>

                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 5 / 6' }}>
                        {
                          PolicyList[2].rule_isSubDownloadable ?

                            <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">
                              <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http: '//www.w3.org/2000/svg">
                                <path d="M1 5.81481L6.13333 11L16 1" stroke="#5D647B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                              </svg>
                            </p>

                            :

                            <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">
                              <svg width="11" height="2" viewBox="0 0 11 2" fill="none" xmlns="http: '//www.w3.org/2000/svg">
                                <path d="M1 1H10" stroke="#AEB1BD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                              </svg>
                            </p>


                        }
                      </div>

                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 6 / 7' }}>
                        {
                          PolicyList[3].rule_isSubDownloadable ?

                            <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">
                              <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http: '//www.w3.org/2000/svg">
                                <path d="M1 5.81481L6.13333 11L16 1" stroke="#5D647B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                              </svg>
                            </p>

                            :

                            <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">
                              <svg width="11" height="2" viewBox="0 0 11 2" fill="none" xmlns="http: '//www.w3.org/2000/svg">
                                <path d="M1 1H10" stroke="#AEB1BD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                              </svg>
                            </p>


                        }
                      </div>
                    </div>

                    <div className="PricingTablestyled__FeaturesGrid-sc-guu3xh-2-kquOAe">
                      <div className="PricingTablestyled__FeatureRow-sc-guu3xh-1 jfOeCd">
                        <p className="PricingTablestyled__FeatureLabel-sc-guu3xh-20 cNnCSy">Support</p>
                        <div style={{ fontSize: ' 16px', marginLeft: ' 0.5rem', textAlign: ' center' }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http: '//www.w3.org/2000/svg">
                            <circle cx="8" cy="8" r="7.5" stroke="#AEB1BD"></circle>

                            <path d="M8 7.5V10.5" stroke="#5D647B" strokeLinecap="round" strokeLinejoin="round"></path>

                            <path d="M8 5V5.1" stroke="#5D647B" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </div>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 3 / 4' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">None</p>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 4 / 5' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">Chat</p>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 5 / 6' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">Chat</p>
                      </div>
                      <div style={{ display: ' flex', alignItems: ' center', gridColumn: ' 6 / 7' }}>
                        <p className="PricingTablestyled__FeatureText-sc-guu3xh-21 keDvcT">Chat', email', training</p>
                      </div>
                    </div>



                  </div>
                </div>

              </div>


            </div>

            :
            <div className="Pricingstyled__PricingScreenContainer-1">
              <h1 className="Pricingstyled__Heading-sc-ao3m0b-0 ezYKYQ">Getting the latest price...</h1>
            </div>
        }


      </main>


    </div>

  );
}

export default PricePlanPage;
