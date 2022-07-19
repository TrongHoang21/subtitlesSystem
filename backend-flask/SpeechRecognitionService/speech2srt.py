from collections import abc
from operator import length_hint
import time
from urllib import response #https://www.youtube.com/watch?v=uBzp5xGSZ6o&t=2s
# from google.cloud import speech_v1
# from google.cloud.speech_v1 import enums

from google.cloud import speech_v1
from google.cloud.speech_v1 import types, RecognitionAudio, RecognitionConfig
import os
import wave

from env import KEY_FILE_NAME

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = KEY_FILE_NAME
MAX_WORDS_A_SENTENCE = 10



def long_running_recognize(gcs_audio_uri, local_audio_uri):
  # API yêu cầu file để trên GCS và có format kiểu gs://, còn local_audio_uri để tìm ra frame rate và channel


    # The name of the audio file to transcribe
    print("Transcribing {} ...".format(gcs_audio_uri))
    client = speech_v1.SpeechClient()


    # processing frame_rate and channels
    frame_rate, channels = frame_rate_channel_count(local_audio_uri)
    print('frame_rate và channel tôi nhận được', frame_rate, '\n', channels)


    audio = speech_v1.RecognitionAudio(uri=gcs_audio_uri)

    config = speech_v1.RecognitionConfig(
        encoding=speech_v1.RecognitionConfig.AudioEncoding.LINEAR16,
        language_code='vi-VN',
        enable_word_time_offsets=True,
        enable_automatic_punctuation=True,
        sample_rate_hertz= frame_rate,
        audio_channel_count = channels,
    )

    # Detects speech in the audio file
    operation = client.long_running_recognize(config=config, audio=audio)
    response = operation.result()
    # print(response)

    # The first result includes start and end time word offsets
    i = 1
    srt_text = []



    for result in response.results:
        alternative = result.alternatives[0]
        sentence = alternative.transcript.strip()
        sentence_length = len(sentence.split(' '))
        sentence_wordsInfo = alternative.words
        sentence_wordsOnly = sentence.split(' ')

        # logging
        print('Số lượng từ của câu: ', sentence_length)
        print('Mảng các từ của câu: ', sentence_wordsOnly)


        if(sentence_length > MAX_WORDS_A_SENTENCE):     # Nếu một câu nói quá dài, phải chia nhỏ ra TRONGHOANG's CODE
            curIndex = 0 # reset after each sentence
            content = ''
            print('currentIndex: ', curIndex)
            print('sentence length: ', sentence_length)
            print('i: ', i)

            while(curIndex < sentence_length):  # seperate into batches (10 words/batch)

                start_hhmmss = time.strftime('%H:%M:%S', time.gmtime(
                    sentence_wordsInfo[curIndex].start_time.seconds))
                start_ms = int(sentence_wordsInfo[curIndex].start_time.microseconds / 1000)

                if(curIndex + MAX_WORDS_A_SENTENCE - 1 < sentence_length):   #get MAX_WORDS_A_SENTENCE (10) words
                    end_hhmmss = time.strftime('%H:%M:%S', time.gmtime(
                        sentence_wordsInfo[curIndex + MAX_WORDS_A_SENTENCE - 1].end_time.seconds))
                    end_ms = int(sentence_wordsInfo[curIndex + MAX_WORDS_A_SENTENCE - 1].end_time.microseconds / 1000)

                    srt_text.append(u"{}\n{},{} --> {},{}\n".format(
                        i, start_hhmmss, start_ms, end_hhmmss, end_ms))

                    content = sentence_wordsOnly[curIndex : curIndex + MAX_WORDS_A_SENTENCE] #[index start :end is not index end]
                    srt_text.append(u"{}\n\n".format(" ".join(content).strip()))

                    curIndex += MAX_WORDS_A_SENTENCE  # move to the first word of next batch

                    # logging
                    print("Câu nói lấy được: ", content)
                
                
                else:
                # when the end of the sentence

                    end_hhmmss = time.strftime('%H:%M:%S', time.gmtime(
                        sentence_wordsInfo[sentence_length-1].end_time.seconds))
                    end_ms = int(sentence_wordsInfo[sentence_length-1].end_time.microseconds / 1000)
                    
                    srt_text.append(u"{}\n{},{} --> {},{}\n".format(
                        i, start_hhmmss, start_ms, end_hhmmss, end_ms))

                    content = sentence_wordsOnly[curIndex : sentence_length]    #[index start :end is not index end]
                    srt_text.append(u"{}\n\n".format(" ".join(content).strip()))

                    curIndex = sentence_length # move to the first word of next batch           
                    
                    # logging
                    print("Câu nói lấy được: ", content)

                i += 1

        else:
        # lam nhu binh thuong
            start_hhmmss = time.strftime('%H:%M:%S', time.gmtime(
                alternative.words[0].start_time.seconds))
            start_ms = int(alternative.words[0].start_time.microseconds / 1000)

            end_hhmmss = time.strftime('%H:%M:%S', time.gmtime(
                alternative.words[-1].end_time.seconds))
            end_ms = int(alternative.words[-1].end_time.microseconds / 1000)

            srt_text.append(u"{}\n{},{} --> {},{}\n".format(
                i, start_hhmmss, start_ms, end_hhmmss, end_ms))
            
            srt_text.append(u"{}\n\n".format(alternative.transcript.strip()))

            # logging
            print("Câu nói lấy được: ", alternative.transcript.strip())

            i += 1
            
        
    return "".join(srt_text)

def frame_rate_channel_count(audio_file_name):
    print(audio_file_name)
    with wave.open(audio_file_name, "rb") as wave_file:
        frame_rate = wave_file.getframerate()
        channels = wave_file.getnchannels()
        return frame_rate,channels





# dont use this below, it's old


def write_srt(out_file, srt_text):
    srt_file = out_file + ".srt"
    print("Writing {} subtitles to: {}".format('vi-VN', srt_file))
    f = open(srt_file, "w")
    f.writelines(srt_text)
    f.close()
    return

def write_txt(out_file, text):
    txt_file = out_file + ".txt"
    print("Writing text to: {}".format(txt_file))
    f = open(txt_file, "w")
    f.writelines(text)
    f.close()
    return


#dependency: https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbkdZZElkVEFkQUhtZWRFcjgzU3VBUXIxVGlKd3xBQ3Jtc0ttdDJYZG5peE9yVjAySkUyRXhRQnBVanRvdktGdUpZdlUyT3VlOXdMQTQwajN4dE9QS2NrRkF2b0V2T1BBQjlySHVVQkUyY2VFMDdkRXFnQ1dIZkZpN09QYV95V2lCY0tTVm5vcUJrSXBqaXk0Sklvbw&q=https%3A%2F%2Fcloud.google.com%2Fcommunity%2Ftutorials%2Fspeech2srt&v=uBzp5xGSZ6o
def original_sample_long_running_recognize(gcs_audio_uri, local_audio_uri):
    # API yêu cầu file để trên GCS và có format kiểu gs://, còn local_audio_uri để tìm ra frame rate và channel


    # The name of the audio file to transcribe
    print("Transcribing {} ...".format(gcs_audio_uri))
    client = speech_v1.SpeechClient()




    # processing frame_rate and channels
    frame_rate, channels = frame_rate_channel_count(local_audio_uri)
    print('frame_rate và channel tôi nhận được', frame_rate, '\n', channels)


    audio = speech_v1.RecognitionAudio(uri=gcs_audio_uri)

    config = speech_v1.RecognitionConfig(
        encoding=speech_v1.RecognitionConfig.AudioEncoding.LINEAR16,
        language_code='vi-VN',
        enable_word_time_offsets=True,
        enable_automatic_punctuation=True,
        sample_rate_hertz= frame_rate,
        audio_channel_count = channels,
    )

    # Detects speech in the audio file
    operation = client.long_running_recognize(config=config, audio=audio)
    response = operation.result()
    print(response)
    # The first result includes start and end time word offsets
    i = 1
    srt_text = []
    text = []
    for result in response.results:

        print(i, ': ', result)





        #result = response.results[0]
        # First alternative is the most probable result
        alternative = result.alternatives[0]

        start_hhmmss = time.strftime('%H:%M:%S', time.gmtime(
            alternative.words[0].start_time.seconds))
        start_ms = int(alternative.words[0].start_time.microseconds / 1000)

        end_hhmmss = time.strftime('%H:%M:%S', time.gmtime(
            alternative.words[-1].end_time.seconds))
        end_ms = int(alternative.words[-1].end_time.microseconds / 1000)

        srt_text.append(u"{}\n{},{} --> {},{}\n".format(
            i, start_hhmmss, start_ms, end_hhmmss, end_ms))
        
        srt_text.append(u"{}\n\n".format(alternative.transcript.strip()))
        text.append(u"{}\n".format(alternative.transcript.strip()))
        i += 1
    print("Transcribing finished rui nha!")

    write_txt('sample_response', response)
    return "".join(srt_text)

    # return response

