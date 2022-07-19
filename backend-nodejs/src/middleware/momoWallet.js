const { REACTJS_SERVER_URI, NODEJS_SERVER_URI, MOMO_PARTNER_CODE, MOMO_ACCESS_KEY, MOMO_SECRET_KEY, MOMO_HOSTNAME } = require('../../env')

const payInMomo = (userId, policyId, payNumber, clientResponse) => {
  //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  //parameters
  var partnerCode = MOMO_PARTNER_CODE;
  var accessKey = MOMO_ACCESS_KEY;
  var secretkey = MOMO_SECRET_KEY;
  var requestId = partnerCode + new Date().getTime();
  var orderId = requestId;
  var orderInfo = "Thanh toán dịch vụ phụ đề bằng ví MoMo";
  var ipnUrl = NODEJS_SERVER_URI + '/notifyAfterPurchase';
  var redirectUrl = REACTJS_SERVER_URI + "/dev_pricingResult";
  var amount = payNumber;
  var requestType = "captureWallet";
  var extraData = "userId_" + userId + '_policyId_' + policyId; //pass empty value if your merchant does not have stores

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    "accessKey=" +   accessKey +
    "&amount=" +    amount +
    "&extraData=" +    extraData +
    "&ipnUrl=" +    ipnUrl +
    "&orderId=" +    orderId +
    "&orderInfo=" +    orderInfo +
    "&partnerCode=" +    partnerCode +
    "&redirectUrl=" +    redirectUrl +
    "&requestId=" +    requestId +
    "&requestType=" +    requestType;

  //puts raw signature
//   console.log("--------------------RAW SIGNATURE----------------");
//   console.log(rawSignature);

  //signature
  const crypto = require("crypto");
  var signature = crypto.createHmac("sha256", secretkey).update(rawSignature).digest("hex");
  console.log("--------------------SIGNATURE----------------");
  console.log(signature);

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: "en",
  });
  //Create the HTTPS objects
  const https = require("https");
  const options = {
    hostname: MOMO_HOSTNAME,
    port: 443,
    path: "/v2/gateway/api/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
  };
  //Send the request and get the response
  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    res.setEncoding("utf8");
    res.on("data", (body) => {
      console.log("Body: ");
      console.log(body);
      console.log("payUrl: ");
      console.log(JSON.parse(body).payUrl);

      clientResponse.status(200).send({
        success: true,
        message: "Đây là link thanh toán",
        payUrl: JSON.parse(body).payUrl
      })
    });
    res.on("end", () => {
      console.log("No more data in response.");
    });
  });

  req.on("error", (e) => {
    console.log(`problem with request: ${e.message}`);

    clientResponse.status(200).send({
        success: false,
        message: "Lấy link thanh toán thất bại: " + e.message,
        payUrl: ''
      })
  });
  // write data to request body
  console.log("Sending....");
  req.write(requestBody);
  req.end();
};

module.exports = {
    payInMomo
}