//development
// const FLASK_SERVER_URI = 'http://localhost:5000'
// const REACTJS_SERVER_URI = 'http://localhost:3000'
// const NODEJS_SERVER_URI = 'http://localhost:8080'


//production
const FLASK_SERVER_URI = 'https://test-flask-server123.herokuapp.com'
const NODEJS_SERVER_URI = 'https://nodejs-backend-kl.herokuapp.com'
const REACTJS_SERVER_URI = 'https://reactjs-frontend-kl.herokuapp.com'


KEY_FILE_NAME = "google-cloud-key.json"
BUCKET_NAME = "netflix-clone-concobaebe.appspot.com"


// MOMO WALLET


const MOMO_PARTNER_CODE = "MOMOQMPL20220628";
const MOMO_ACCESS_KEY = "EJg10il7ySp6V9em";
const MOMO_SECRET_KEY = "cBHZBsgsZHzk5KRZESsMMXUb8Bd82toE";
const MOMO_HOSTNAME = "test-payment.momo.vn"

module.exports = {
    FLASK_SERVER_URI,    
    NODEJS_SERVER_URI,
    KEY_FILE_NAME,
    BUCKET_NAME,
    REACTJS_SERVER_URI,
    MOMO_PARTNER_CODE, 
    MOMO_ACCESS_KEY, 
    MOMO_SECRET_KEY,
    MOMO_HOSTNAME,

};