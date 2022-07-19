from SpeechRecognitionService.fake_speech2srt import FAKE_long_running_recognize
from SpeechRecognitionService.speech2srt import long_running_recognize
import moviepy.editor as mp
import os
from google.cloud import storage 

from env import KEY_FILE_NAME

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = KEY_FILE_NAME

from env import BUCKET_NAME

def handleAutoGen(request):
    
    # 1. Convert to wav file
    waw_filename = str(request.json['projectId']) + "_" + request.json['videoStorageName'] +  "_converted.wav"
    local_audio_uri = r"media/" + waw_filename
    clip = mp.VideoFileClip(request.json['videoUrl'])
    clip.audio.write_audiofile(local_audio_uri)
    print('wav converted')

    # 2. Upload to GCS and get the file location in GCS format (S-t-Text API requirements)
    gcs_audio_uri = 'gs://' + BUCKET_NAME + r'/' + waw_filename

    bucket_name = BUCKET_NAME
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(waw_filename)
    blob.upload_from_filename(local_audio_uri)
    print("upload wav to gcs done")



    # 3. this is real api, cost real money, be careful
    try:
        data = long_running_recognize(gcs_audio_uri, local_audio_uri)
        flag = True,
        processMessage = 'Transcribe done!'

    except Exception as e:
        print("An exception occurred in handleAutoGen " + str(e))
        data = ""
        flag = False
        processMessage = "An exception occurred in handleAutoGen " + str(e)

    # this is fake api
    # try:
    #     data = FAKE_long_running_recognize(gcs_audio_uri, local_audio_uri)
    #     flag = True,
    #     processMessage = 'Transcribe done!'

    # except Exception as e:
    #     print("An exception occurred in handleAutoGen " + str(e))
    #     data = ""
    #     flag = False
    #     processMessage = "An exception occurred in handleAutoGen " + str(e)


    
    # 4. DELETE MIDDLE FILES AFTER USE
    if os.path.exists(local_audio_uri):
        os.remove(local_audio_uri)

    # 5. Delete WAV on GCS too
    blob = bucket.blob(waw_filename)
    blob.delete()
    print("deleted wav from gcs done")

    return data, flag, processMessage



