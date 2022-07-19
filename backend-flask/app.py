from flask import Flask, make_response, request, jsonify
from flask_cors import CORS, cross_origin
from SpeechRecognitionService import handleAutoGen
from exportService import handleExport
import os

##########
#have to use conda activate subweb_env

#######
app = Flask(__name__)
CORS(app)


@app.route('/')
@cross_origin(origin='*',headers=['Content-Type']) 
def hello_world():
    return "<p>nụ cười em giờ là nắng</p>"

@app.route('/autoGen', methods=['POST'])
@cross_origin(origin='*',headers=['Content-Type']) 
def autoGen():

        data, flag, processMesage = handleAutoGen.handleAutoGen(request)
        body = jsonify(
            success = flag,
            message = processMesage,
            data = data
        )
        response = make_response(body, 200)
        return response

@app.route('/export', methods=['POST'])
@cross_origin(origin='*',headers=['Content-Type']) 
def export():

        signUrl, result_file_name, flag, processMesage = handleExport.handleExport_ff(request)
        body = jsonify(
            success = flag,
            message = processMesage ,
            data = signUrl,
            exportVideoName = result_file_name
        )

        response = make_response(body, 200)

        return response

@app.route('/mycmd', methods=['POST'])
@cross_origin(origin='*',headers=['Content-Type']) 
def mycmd():

        os.system(request.json['cmd'])

        body = jsonify(
            success = True,
            message = request.json['cmd'],
        )
        response = make_response(body, 200)

        return response

if __name__ == '__main__':
    app.run()




# @app.route('/metrics', methods=['GET','POST', 'OPTIONS'])
# @cross_origin(origin='*',headers=['Content-Type'])  #https://stackoverflow.com/questions/26980713/solve-cross-origin-resource-sharing-with-flask
# def metrics():
#     if request.method == 'GET':
#         args = request.args #query params
#         result = fake_speech2srt.auto_gen_babe(args)

#         if result != "":
#             body = jsonify(
#                 success = True,
#                 data = result
#             )
#             response = make_response(body, 200)
#         else:
#             body = jsonify(
#                 success = False,
#                 data = "Flask: khong thanh cong nha"
#             )
#             response = make_response(body, 200)

#         response.mimetype = "text/plain"
#         return response
#     if request.method == 'POST':
#         args = request.args #query params
#         result = fake_speech2srt.auto_gen_babe(args)
#         print(request.json['audio_url'])

#         if result != "":
#             body = jsonify(
#                 success = True,
#                 data = result
#             )
#             response = make_response(body, 200)
#         else:
#             body = jsonify(
#                 success = False,
#                 data = "Flask: khong thanh cong nha"
#             )
#             response = make_response(body, 200)

#         response.mimetype = "text/plain"
#         return response


# OLD PRIVATE KEY
# {
#   "type": "service_account",
#   "project_id": "drive-clone-concobaebe",
#   "private_key_id": "583597cf46f061e9b56455b713d1d46d0f675510",
#   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDM5Uh5RLKy0WgQ\ntsSD+GYxGJLdXPSPeBBKfANGuwCDKilFtZjAJyvvC/5U1hGHbdo63oL41anOVLCU\nfrNc06iv0R91nHQ3JPSsDNDAuFHGB8Uwt+klOVm41xMIg7RycNdzru/AeoVH2jjT\nDyzpr3jtiEXNsZ0dfjD8ckGCsf5w196jMD5FdSeTOXPR+DreI7x5lY0eUfqU/oSR\nj2jyrT01/rb6qWX6Ko22OwqLJaMtOnH+feL4bYAxRBXS+O9v7GXznrtpflZwuigi\nYvbFgleSXDpeB2YacFvysq2JzubreBWhosGeG6rwAl3Uw9dT7Ek0knsuE0P9nPod\nIDjRCEjdAgMBAAECggEADcyYUbB+f3wKb+u7Nu8dBMv0oitvPhVWNYn+F36jJXJK\ntsro53IL66zJW3HSWuZbVvEi7XrIVaDPBqU007jeiL7DCWL40bjvsIGpcn1HZpih\n32rXbR4cbI4xljZ2iemPHReoRnSJ8uGfx5kjS3a5pHezyctfOzwDNRFF17VAn11P\nkEknDgQTfxTFFGxOpCwt4coQmWnlpx6teXcLYKhN9db5oUEaU9BIsHRijqTaQSIo\nFEBJqWhMKXIKM1v4/rC92wJoEZVqSeakxePsPCeGtjGTNCxrUj/I4i2YJ79Bfvtt\naiFgyA8Y0FPNHXRYSYOx6L8qLAjLi5a82vPcU1vYWQKBgQD103s0hJLUtWHX9lAm\nn8PiJCI41rfl0HzTGzi7PjAklUvaczXrGirpePWDe/yNmbNztwz2v50RZaZ5O66j\nzOoNUKOdsd5RcaSiD+ipReuTGSqgMyIQPOmTdFbMqFs95kFBvN1fMlKnNMtm06eh\nEob+rtjihjV3KNfKjOwOWAX9NQKBgQDVYCUiKXOV3NOGYvp6yjH4pBLHfAySBNMX\nbviu6U1XJNtRj5nmjtICax3iLSqgj5paZ2DNuzdhOUEIyEpnyVzh6NAaqIgHeNw1\nhZys4DecXiYcC6BbyT/IZO1Lp4dlNDL2UEmAF4vjrQbiv0+WH8Gh51I3CzG8oG/1\nC0/cCw8aCQKBgD8zJLzGzL0U+Ne+ArM7Ze/w3D+CrHrQFBduKzKwdU4ieALsldMg\nwiGOMIiiSrbY6jL4v8N8VdRQLvGCL477Mr1Dmx0CyqZjsjDcKDPEvyDtWnEfVEWa\nc26ufVZWfka2uNY+yScdV/SW9Sg1iCY4Di7SIv5yBLLi9D+l5VZ2uOt1AoGAfPbY\nCI/aP9SalUP2il9MsN/2l5oRCpuEvV6iil3ci8LsJ3JAogTW/c+aKtJk+q/fqD6P\nNS4GGwybB/e1i98kZLIi3toBAM9JuJbN0XlnWE7TZu1wNxFAJ67kQsCUzTKq/hK7\nWSdxKCA3vihpBfUHRDjjr5UAxgX4S70aQja/23ECgYEA6eyecMdEQfNLTxXkqrTH\nsDDJXWPF6Mg2ZPJ6x62GTgNDzrP5D0BCxYWBzXsfgxlMyrtGOKjSFfNNtBF2a8Ep\nKZxLUNYHJhWgv+1FprzSZQXbrxJ4UQkN+0Yxyx4fFALMJJtRkV0blp1fdCw0JGlJ\nWSCMtzh9+3nsC/nzwFWY8EI=\n-----END PRIVATE KEY-----\n",
#   "client_email": "drive-clone-concobaebe@appspot.gserviceaccount.com",
#   "client_id": "114202320497788760466",
#   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
#   "token_uri": "https://oauth2.googleapis.com/token",
#   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
#   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/drive-clone-concobaebe%40appspot.gserviceaccount.com"
# }
