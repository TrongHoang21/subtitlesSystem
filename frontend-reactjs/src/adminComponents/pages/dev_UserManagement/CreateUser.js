import axios from "axios";
import {useState } from "react";
import "./CreateUser.css";

import {NODEJS_SERVER} from '../../../env'

export default function CreateUser() {

  const [Message, setMessage] = useState('Create New User');

  const [Email, setEmail] = useState("");
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [PricingPlanId, setPricingPlanId] = useState(1);
  
  const handleChangeEmail = (e) => {
    setEmail(e.target.value)
  }

  const handleChangeUsername = (e) => {
    setUsername(e.target.value)
  }

  const handleChangePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value)
  }
  
  const handlePricingPlanChange = (e) => {
      setPricingPlanId(e.target.value)
  }

  const handleSubmitButton = (e) => {

    if(!Email){
      setMessage('please set an Email')
      return
    }
    if(!Email.includes('@')){
      setMessage('your Email is not valid')
      return
    }
    if(!Username){
      setMessage('please set an Username')
      return
    }
    if(!Password){
      setMessage('please set a Password')
      return
    }
    if(Password !== ConfirmPassword){
      setMessage('confirm password does not match')
      return
    }

    let userSubmit = {
      email: Email,
      username: Username,
      password: Password,
      confirmPassword: ConfirmPassword,
      pricingPlanId: PricingPlanId
    }

    console.log('submit info: ', userSubmit);
    

    setMessage('please wait for server to response')
    axios({
      method: 'post',
      url: NODEJS_SERVER + '/admin/createUser',
      data: userSubmit,
    })
    .then(response => {
      if(response.data.success){ // Axios responses have a `data` property that contains the HTTP response body.
        console.log(response.data.message);
        setMessage(response.data.message)

        
      } else {
        console.log(response.data.message);
        setMessage(response.data.message)
      }
    }).catch((error) => {
        console.log('axios có ERROR: ', error);
    });
  }



  return (
    <div className="newUser">
      <h1 className="newUserTitle">{Message}</h1>
      <div className="newUserForm">
        <div className="newUserItem">
          <label>Email</label>
          <input
            onChange={handleChangeEmail}
            id="email"
            placeholder="Enter your email address here"
            type="email"
            name="email"
            className="Input__StyledInput-sc-mdxq3k-2 cibaxs"
            value={Email}
          />
        </div>

        <div className="newUserItem">
          <label>Username</label>
          <input
              onChange={handleChangeUsername}
              id="username"
              placeholder="Enter your name here"
              type="text"
              name="username"
              className="Input__StyledInput-sc-mdxq3k-2 cibaxs"
              value={Username}
            />
        </div>

        <div className="newUserItem">
          <label>Password</label>
          <input
            onChange={handleChangePassword}
            id="password"
            placeholder="Enter your password here"
            type="password"
            name="password"
            className="Input__StyledInput-sc-mdxq3k-2 cibaxs"
            value={Password}
          />
        </div>

        <div className="newUserItem">
          <label>ConfirmPassword</label>
          <input
            onChange={handleChangeConfirmPassword}
            id="confirmPassword"
            placeholder="Reconfirm your password here"
            type="password"
            name="confirmPassword"
            className="Input__StyledInput-sc-mdxq3k-2 cibaxs"
            value={ConfirmPassword}
          />
        </div>

        <div className="newUserItem">
          <label>Pricing Plan</label>
          <select className="newUserSelect" name="active" value={PricingPlanId} onChange={handlePricingPlanChange}>
            <option value={1}>FREE</option>
            <option value={2}>BASIC</option>
            <option value={3}>PRO</option>
          </select>
        </div>

        <button className="newUserButton" onClick={handleSubmitButton}>Create now !</button>
      </div>


    </div>
  );
}