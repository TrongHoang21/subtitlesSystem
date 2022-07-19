import os
from google.cloud import storage 
import datetime
import ffmpeg
import json

from env import BUCKET_NAME

def handleExport_ff(request):

    # PREPARE DATA
    res=""
    project_id = ""
    sub_file_name = 'media/subtitles.srt'
    video_file_name = ""
    result_file_name = ""
    
    
    if request.json['projectId'] and request.json['videoUrl']:
        if 'subData' in request.json and request.json['subData'] != '':
            with open(sub_file_name, 'w', encoding='utf8') as f:
                f.write(request.json['subData'])
        else:
            with open(sub_file_name, 'w', encoding='utf8') as f:
                f.write('1\n00:00:01,400 --> 00:00:02,177\n') # write empty file

        project_id = "" + str(request.json['projectId'])
        result_file_name = project_id + "_exportResult.mp4"
        video_file_name = request.json['videoUrl']


        print("PREPARE DATA DONE")
    else:
        print("ERORR FROM DATA")
        return "ERORR FROM DATA"

    try:
        # PROCESSING
        (
        ffmpeg
        .input(video_file_name)
        .filter('scale', w=1280, h=720)
        .filter('subtitles', sub_file_name)
        .output(result_file_name, map='0',crf=18)
        .overwrite_output()
        .run()
        )
        print("PROCESSING DONE")

        # UPLOAD TO GCS DIRECTLY
        bucket_name = BUCKET_NAME
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(result_file_name)
        blob.upload_from_filename(result_file_name)
        print("UPLOAD FILE TO GCS DONE")

        # GET DOWNLOAD URL
        download_signUrl = blob.generate_signed_url(datetime.datetime(2106, 10, 14))   #random expiration time
        res = download_signUrl

        flag = True
        processMessage = "Result updated to GCS, FFMPEG-PYTHON."

    except Exception as e:
        res= ''
        result_file_name = ''
        print("An exception occurred in handleExport " + str(e))
        flag = False
        processMessage = "An exception occurred in handleExport " + str(e)


    # DELETE MIDDLE FILES AFTER USE --> There maybe an slight bug if upload to GCS notdone. but prog still runs.
    if os.path.exists(result_file_name):
        os.remove(result_file_name)
    if os.path.exists(sub_file_name):
        os.remove(sub_file_name)
    print("DELETE MIDDLE FILES AFTER USE DONE")

    # RETURN VIDEO RESULT
    return res, result_file_name, flag, processMessage





#ERORR WITH THE HEROKU BUILDPACKS IMAGEMAGICK 6.9 --> DONT USE THIS
from moviepy.editor import *
from moviepy.video.tools.subtitles import SubtitlesClip, file_to_subtitles
import re

# this is to fix magick bugs not found is commented when deployed
# from moviepy.config import change_settings, IMAGEMAGICK_BINARY
# change_settings({"IMAGEMAGICK_BINARY": "vendor/imagemagick/bin/convert"})


def handleExport_depricated(request):

    TextClip.list('font')

    # PREPARE REQUEST ID FOR FILENAMES
    print("chua xu ly request id ")

    res=""
    result_file_name = "requestId_exportResult.mp4"
    try:
        # PREPARE SUBDATA
        subData = processSrtFormatData(request.json['subData'])
        subtitles = SubtitlesClip(subData, styleForText)
        print("PREPARE SUBDATA DONE")

        # LOAD VIDEO
        video = VideoFileClip(request.json['videoUrl'])
        print("LOAD VIDEO ON: " + request.json['videoUrl'])

        # PROCESSING
        result = CompositeVideoClip([video, subtitles.set_pos(('center','bottom'))])
        
        result.write_videofile(result_file_name, fps=video.fps, temp_audiofile="temp-audio.m4a", remove_temp=True, codec="libx264", audio_codec="aac")
        print("PROCESSING DONE")

        # UPLOAD TO GCS DIRECTLY
        bucket_name = BUCKET_NAME
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(result_file_name)
        blob.upload_from_filename(result_file_name)
        print("UPLOAD FILE TO GCS DONE")

        # GET DOWNLOAD URL
        download_signUrl = blob.generate_signed_url(datetime.datetime(2106, 10, 14))   #random expiration time
        res = download_signUrl

    except NameError:
        res="An exception occurred in handleExport " + NameError
        print("An exception occurred in handleExport " + NameError)

    # DELETE MIDDLE FILES AFTER USE
    if os.path.exists(result_file_name):
        os.remove(result_file_name)
    else:
        print("The middle file does not exist")
    print("DELETE MIDDLE FILES AFTER USE DONE")

    # RETURN VIDEO RESULT
    return res

def styleForText(txt):
    return TextClip(txt, font='FreeMono', fontsize=12, color='white')

def processSrtFormatData(content):
    #this function Hoang rewriten to adapt to Moviepy SubtitlesClip
    """ Converts a srt file into subtitles.

    The returned list is of the form ``[((ta,tb),'some text'),...]``
    and can be fed to SubtitlesClip.

    Only works for '.srt' format for the moment.
    content is subData like this: "subData":"1\n00:00:03,400 --> 00:00:04,177\nIn this lesson
    """
    times_texts = []
    current_times = None
    current_text = ""
    contentArr = content.split('\n')
    for line in contentArr:
        times = re.findall("([0-9]*:[0-9]*:[0-9]*,[0-9]*)", line)
        if times:
            current_times = [cvsecs(t) for t in times]
        elif line.strip() == '':
            times_texts.append((current_times, current_text.strip('\n')))
            current_times, current_text = None, ""
        elif current_times:
            current_text += line
            current_text += '\n'

    return times_texts
    