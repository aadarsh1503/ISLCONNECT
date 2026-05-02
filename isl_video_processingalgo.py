# import os
# import cv2
# import wave
# import pyaudio
# import speech_recognition as sr
# from yt_dlp import YoutubeDL
# import subprocess

# ANIMATION_FOLDER = "../python-backend/INDIAN SIGN LANGUAGE ANIMATED VIDEOS/"
# OUTPUT_FOLDER = "output_v"
# os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# def download_video_from_url(url, output_folder):
#     try:
#         options = {
#             'format': 'bestvideo+bestaudio/best',
#             'outtmpl': os.path.join(output_folder, '%(title)s.%(ext)s'),
#             'merge_output_format': 'mp4'
#         }
#         with YoutubeDL(options) as ydl:
#             info = ydl.extract_info(url, download=True)
#             video_path = ydl.prepare_filename(info)
#             print(f"Video downloaded: {video_path}")
#             return video_path
#     except Exception as e:
#         print(f"Error downloading video: {e}")
#         return None

# def search_and_download_video(query, output_folder):
#     try:
#         options = {
#             'format': 'bestvideo+bestaudio/best',
#             'outtmpl': os.path.join(output_folder, '%(title)s.%(ext)s'),
#             'merge_output_format': 'mp4',
#             'noplaylist': True
#         }
#         with YoutubeDL(options) as ydl:
#             search_results = ydl.extract_info(f"ytsearch1:{query}", download=True)
#             if search_results['entries']:
#                 video_info = search_results['entries'][0]
#                 video_path = ydl.prepare_filename(video_info)
#                 print(f"Video downloaded: {video_path}")
#                 return video_path
#             else:
#                 print("No videos found for the search query.")
#                 return None
#     except Exception as e:
#         print(f"Error searching and downloading video: {e}")
#         return None

# def extract_audio(video_path, output_audio_path=None):
#     try:
#         if output_audio_path is None:
#             output_audio_path = os.path.splitext(video_path)[0] + ".wav"

#         command = [
#             "ffmpeg", "-i", video_path, "-vn", "-acodec", "pcm_s16le", "-ar", "44100", "-ac", "2", output_audio_path
#         ]
#         subprocess.run(command, check=True)
#         print(f"Audio extracted to: {output_audio_path}")
#         return output_audio_path

#     except subprocess.CalledProcessError as e:
#         print(f"Error extracting audio with FFmpeg: {e}")
#         return None

# def transcribe_audio_to_text(audio_path):
#     recognizer = sr.Recognizer()
#     with sr.AudioFile(audio_path) as source:
#         audio_data = recognizer.record(source)
#         try:
#             text = recognizer.recognize_google(audio_data)
#             print(f"Transcribed text: {text}")
#             return text
#         except sr.UnknownValueError:
#             print("Could not understand audio")
#         except sr.RequestError as e:
#             print(f"Error with speech recognition: {e}")
#         return ""

# def map_text_to_animations(text):
#     animation_files = []
#     for word in text.split():
#         word_lower = word.lower()
#         word_capitalized = word.capitalize()
#         word_animation_path = os.path.join(ANIMATION_FOLDER, f"{word_capitalized}.mp4")
#         if os.path.exists(word_animation_path):
#             animation_files.append(word_animation_path)
#         else:
#             print(f"Animation for word '{word}' not found. Checking character-level fallback.")
#             for char in word:
#                 char_lower = char.lower()
#                 char_capitalized = char.capitalize()
#                 char_animation_path = os.path.join(ANIMATION_FOLDER, f"{char_capitalized}.mp4")
#                 if os.path.exists(char_animation_path):
#                     animation_files.append(char_animation_path)
#                 else:
#                     print(f"Animation for character '{char}' not found.")
#     return animation_files

# def concatenate_videos(animation_files, output_video_path):
#     try:
#         frame_size = None
#         fps = 24
#         output_video = None

#         for animation_file in animation_files:
#             cap = cv2.VideoCapture(animation_file)
#             if not cap.isOpened():
#                 print(f"Error opening animation: {animation_file}")
#                 continue

#             if frame_size is None:
#                 frame_size = (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))
#                 output_video = cv2.VideoWriter(output_video_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, frame_size)

#             while True:
#                 ret, frame = cap.read()
#                 if not ret:
#                     break
#                 output_video.write(frame)

#             cap.release()

#         if output_video:
#             output_video.release()
#             print(f"Generated video: {output_video_path}")
#             return output_video_path
#         else:
#             print("No valid animations to concatenate.")
#             return None
#     except Exception as e:
#         print(f"Error concatenating videos: {e}")
#         return None

# def process_video(input_video_path):
#     print(f"Processing video: {input_video_path}")
#     audio_path = os.path.splitext(input_video_path)[0] + ".wav"
#     output_video_path = os.path.join(OUTPUT_FOLDER, os.path.basename(input_video_path))

#     audio_path = extract_audio(input_video_path, audio_path)
#     if not audio_path:
#         return None

#     text = transcribe_audio_to_text(audio_path)
#     if not text:
#         return None

#     animation_files = map_text_to_animations(text)
#     if not animation_files:
#         print("No animations mapped to the text.")
#         return None

#     return concatenate_videos(animation_files, output_video_path)

# def main():
#     print("Select an option:")
#     print("1. Enter a YouTube URL")
#     print("2. Search for a video on YouTube")
#     choice = input("Enter your choice (1 or 2): ")

#     if choice == "1":
#         url = input("Enter the YouTube video URL: ")
#         video_path = download_video_from_url(url, OUTPUT_FOLDER)
#     elif choice == "2":
#         query = input("Enter the search query: ")
#         video_path = search_and_download_video(query, OUTPUT_FOLDER)
#     else:
#         print("Invalid choice. Exiting.")
#         return

#     if video_path:
#         final_video = process_video(video_path)
#         if final_video:
#             print(f"Sign language video created: {final_video}")
#         else:
#             print("Failed to create sign language video.")
#     else:
#         print("No video processed.")

# if __name__ == "__main__":
#     main()



import os
import cv2
import subprocess
import hashlib
from threading import Thread
from queue import Queue
from yt_dlp import YoutubeDL
import speech_recognition as sr


ANIMATION_FOLDER = "../python-backend/INDIAN SIGN LANGUAGE ANIMATED VIDEOS/"
FREEZE_IMAGE_PATH = "../python-backend/freeze.jpeg"
OUTPUT_FOLDER = "output_v"
CACHE_FOLDER = "animation_cache"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
os.makedirs(CACHE_FOLDER, exist_ok=True)

def generate_hash(text):
    """Generate a unique hash for the given text."""
    return hashlib.md5(text.encode()).hexdigest()

def get_cached_animation(word):
    """Check if an animation for the word exists in the cache."""
    hashed_word = generate_hash(word)
    cache_path = os.path.join(CACHE_FOLDER, f"{hashed_word}.mp4")
    return cache_path if os.path.exists(cache_path) else None

def store_animation(word, animation_frames):
    """Store generated animation frames as a video in the cache."""
    hashed_word = generate_hash(word)
    cache_path = os.path.join(CACHE_FOLDER, f"{hashed_word}.mp4")
    height, width, _ = animation_frames[0].shape
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(cache_path, fourcc, 20.0, (width, height))

    for frame in animation_frames:
        out.write(frame)
    out.release()
    print(f"Animation cached: {cache_path}")
    return cache_path

def map_text_to_animations(word):
    """Map a word to its corresponding animation file."""
    word_animation_path = os.path.join(ANIMATION_FOLDER, f"{word.capitalize()}.mp4")
    return word_animation_path if os.path.exists(word_animation_path) else None

def process_animation(word, animation_queue, freeze_img):
    """Process and enqueue animation frames for a given word."""
    cached_animation = get_cached_animation(word)
    animation_path = cached_animation or map_text_to_animations(word)

    if not animation_path:
        animation_queue.put(freeze_img)
        return


    if not cached_animation:
        animation_frames = []
        cap = cv2.VideoCapture(animation_path)
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            animation_frames.append(frame)
            animation_queue.put(frame)
        cap.release()
        store_animation(word, animation_frames)
    else:
     
        cap = cv2.VideoCapture(animation_path)
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            animation_queue.put(frame)
        cap.release()
 
def display_animation(text_queue, animation_queue):
    """Display animations based on the text queue."""
    freeze_img = cv2.imread(FREEZE_IMAGE_PATH)
    while True:
        try:
            word = text_queue.get(timeout=1)
            if word:
                process_animation(word, animation_queue, freeze_img)
            else:
                animation_queue.put(freeze_img)
        except:
            
            continue

def extract_audio_live(video_path):
    """
    Extracts audio from the video file and converts it to WAV format.
    """
    audio_path = os.path.splitext(video_path)[0] + ".wav"
    try:
       
        command = f"ffmpeg -i \"{video_path}\" -ar 16000 -ac 1 -y \"{audio_path}\""
        subprocess.run(command, shell=True, check=True)
        print(f"Audio extracted to {audio_path}")
        return audio_path
    except subprocess.CalledProcessError as e:
        print(f"Error extracting audio: {e}")
        return None

def transcribe_audio_live(audio_process, text_queue):
    """Transcribe audio in real time and enqueue recognized words."""
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_process) as source:
        while True:
            try:
                audio = recognizer.listen(source, timeout=2)
                text = recognizer.recognize_google(audio)
                for word in text.split():
                    text_queue.put(word)
            except Exception as e:
                print(f"Error during transcription: {e}")

def download_video_from_url(url, output_folder):
    """Download a video from the given URL."""
    ydl_opts = {'outtmpl': os.path.join(output_folder, '%(title)s.%(ext)s'), 'format': 'best'}
    try:
        with YoutubeDL(ydl_opts) as ydl:
            result = ydl.extract_info(url, download=True)
            return ydl.prepare_filename(result)
    except Exception as e:
        print(f"Error downloading video: {e}")
        return None

def play_video(video_path, animation_queue):
    """Play the video and overlay animations in real time."""
    cap = cv2.VideoCapture(video_path)
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if not animation_queue.empty():
            overlay_frame = animation_queue.get()
            frame = cv2.addWeighted(frame, 0.7, overlay_frame, 0.3, 0)
        cv2.imshow("Video", frame)
        if cv2.waitKey(25) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()

def main():
    """Main function to execute the animation system."""
    print("Enter the YouTube video URL:")
    url = input("URL: ")

    video_path = download_video_from_url(url, OUTPUT_FOLDER)
    if not video_path:
        print("Failed to download video.")
        return

    audio_process = extract_audio_live(video_path)
    if not audio_process:
        print("Failed to extract audio.")
        return

    text_queue = Queue()
    animation_queue = Queue()

    transcription_thread = Thread(target=transcribe_audio_live, args=(audio_process, text_queue))
    animation_thread = Thread(target=display_animation, args=(text_queue, animation_queue))
    transcription_thread.start()
    animation_thread.start()

    play_video(video_path, animation_queue)

    transcription_thread.join()
    animation_thread.join()

if __name__ == "__main__":
    main()
