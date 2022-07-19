import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/Uploader-PopupError.css'

function PopupError({isHidden = false, message='', handlePopupClose}) {
    const [Close, setClose] = useState(isHidden);
    const [Message, setMessage] = useState(message);
    
    const pageRouter = useNavigate()

    useEffect(() => {
        setClose(isHidden)  //if bỏ ở ngoài sẽ bị re render vô hạn
        setMessage(message)
    }, [isHidden, message]);
    


    
    
    const handleClick = () => {
        setClose(true);
        setMessage('');
        handlePopupClose();
    }

    const handleUpgradeClick = () => {
        pageRouter('/dev_pricing')
    }

  return (
    <div className="Overlay-sc-2pwypl-0 fzGOgQ modalOverlay" hidden = {Close}>
      <div className="Flex-sc-ws1hvn-0">
        <div className="Card__StyledRebassCard-sc-1gcrrp6-1">
          <div className="FileTooBigModalStyled__IconContainer-sc-h0eqkf-3 fJaFAa">
            <svg width="47" height="47" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FF5454">
              <path
                d="M19.82 2H4.18C2.97602 2 2 2.97602 2 4.18V19.82C2 21.024 2.97602 22 4.18 22H19.82C21.024 22 22 21.024 22 19.82V4.18C22 2.97602 21.024 2 19.82 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path d="M7 2V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M17 2V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M2 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M2 7H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M2 17H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M17 17H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M17 7H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>
          <span className="FileTooBigModalStyled__HeadlineStyled-sc-h0eqkf-0 kVaSmn">Stop there, hands on the air!</span>
          <span className="FileTooBigModalStyled__MessageStyled-sc-h0eqkf-1 hqYUmQ">
            {/* You are trying to upload a video with a large file size. To export a video with a file size larger than 250MB, you need to upgrade your workspace. */}
            {Message}
          </span>
          <button className="sc-gGCDDS bYNRNv FileTooBigModalStyled__UpgradeButtonStyled-sc-h0eqkf-5 jivczr" onClick={handleUpgradeClick}>
            <span className="sc-clIzBv cuXbrX">Upgrade now</span>
            <div className="sc-hiwPVj eZFkKO sc-lcepkR evBvrA">
              <svg width="15" height="15" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="sc-bdvvtL PYKWr sc-ehCJOs hWUYuu">
                <path
                  d="M4.941 5.4h2.588c.363 0 .59.336.406.602l-4 5.8c-.242.351-.876.205-.876-.203v-5H.471c-.363 0-.59-.335-.406-.601l4-5.8c.242-.351.876-.205.876.203v5z"
                  fill="url(#zapPrimaryIcon_svg__a)"
                ></path>
                <path
                  d="M7.529 5.4H4.94v1h2.588c.043 0 .084.005.122.013l.284-.41c.184-.267-.043-.603-.406-.603zM.349 6.587l3.716-5.389c.242-.351.876-.205.876.203v-1c0-.408-.634-.554-.876-.203l-4 5.8c-.162.235-.005.524.284.589z"
                  fill="#fff"
                ></path>
                <defs>
                  <linearGradient id="zapPrimaryIcon_svg__a" x1="3.416" y1="10.957" x2="3.595" y2="0.532" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFF6E9"></stop>
                    <stop offset="1" stopColor="#FFEDD3"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </button>
          <div className="FileTooBigModalStyled__BottomLineStyled-sc-h0eqkf-4 hwEyqD" onClick={handleClick}>I will do it later</div>
        </div>
      </div>
    </div>
  );
}

export default PopupError;
