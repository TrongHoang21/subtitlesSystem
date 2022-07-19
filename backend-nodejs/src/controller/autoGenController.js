const fetch = require("node-fetch");
const { FLASK_SERVER_URI } = require("../../env");

const handleAutoGen = async (req, res, next) => {
  //Prepare data
  const currentUser = req.body;
  const videoUrl = currentUser.currentProject.videoUrl;
  const videoStorageName = currentUser.currentProject.videoStorageName;
  const projectId = currentUser.currentProject.id;

  console.log("link sent to flask: ", currentUser.currentProject.videoUrl);

  postData(`${FLASK_SERVER_URI}/autoGen`, { videoUrl: videoUrl, videoStorageName: videoStorageName, projectId: projectId })
    .then((data) => {
      //console.log(data); // JSON data parsed by `data.json()` call

      if (data.success) {
        req.successResult = data;
        return next();
      } else {
        console.log("server auto gen lỗi: " + data.message);

        res.status(200).send({
          success: false,
          message: "server auto gen lỗi, kiểm tra tại server",
        });
        return next("route");
      }
    })
    .catch((err) => {
      console.log("server auto gen lỗi: " + err);

      res.status(200).send({
        success: false,
        message: "server auto gen lỗi: " + err,
      });
    });
};

//CREATE POST REQUEST TO FLASK SERVER
async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json();
}

module.exports = {
  handleAutoGen,
};
