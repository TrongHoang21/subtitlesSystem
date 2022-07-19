import wave

def FAKE_long_running_recognize(gcs_audio_uri, local_audio_uri):
    fake_srt = """1
00:00:00,400 --> 00:00:03,177
Dường như nắng đã làm má em thêm hồng

2
00:00:04,177 --> 00:00:5,009
Làn mây bay đã yêu tóc em

3
00:00:6,009 --> 00:00:7,655
Trộm nhìn anh khẽ cười khiến em thẹn thùng

4
00:00:7,655 --> 00:00:8,720
Áo trắng em bây giờ, tan trường
    """

    print("finish transcribe nha!")

    print('Tôi nhận được name')
    print(gcs_audio_uri)

    print('số channel tôi nhận được')
    frame_rate,channels = channel_count(local_audio_uri)
    print(frame_rate, '\n', channels)
    
    return fake_srt

# def frame_rate_channel_count(audio_file_name):
#     print(audio_file_name)
#     with wave.open(audio_file_name, "rb") as wave_file:
#         frame_rate = wave_file.getframerate()
#         channels = wave_file.getnchannels()
#         return frame_rate,channels

def channel_count(audio_file_name):

    with wave.open(audio_file_name, "rb") as wave_file:
        frame_rate = wave_file.getframerate()
        channels = wave_file.getnchannels()
        return frame_rate,channels