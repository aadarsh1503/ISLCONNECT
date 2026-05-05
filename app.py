from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import whisper
try:
    from moviepy.editor import VideoFileClip, ImageClip, concatenate_videoclips, TextClip, CompositeVideoClip
except ImportError:
    from moviepy import VideoFileClip, ImageClip, concatenate_videoclips, TextClip, CompositeVideoClip
from yt_dlp import YoutubeDL
import subprocess
import random
import glob
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Assuming the same constants and functions from your code
ISL_DATASET_PATH = os.getenv('ISL_DATASET_PATH', r"C:\Users\aadar\.cache\kagglehub\datasets\prathumarikeri\indian-sign-language-isl\versions\1\Indian")
OUTPUT_FOLDER = "output_v"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Load Whisper model once at startup
print("Loading Whisper model...")
whisper_model = whisper.load_model("base")
print("Whisper model loaded!")

app = Flask(__name__)
CORS(app)

# Serve video files from output folder
@app.route('/videos/<path:filename>')
def serve_video(filename):
    return send_from_directory(OUTPUT_FOLDER, filename)

@app.route('/text_to_sign', methods=['POST'])
def text_to_sign():
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        
        if not text:
            return jsonify({"error": "No text provided"}), 400
        
        print(f"Converting text to ISL: {text}")
        
        # Create ISL video from text
        output_filename = f"text_isl_{hash(text)}.mp4"
        output_path = os.path.join(OUTPUT_FOLDER, output_filename)
        
        isl_video = create_isl_video_from_text(text, output_path)
        
        if isl_video:
            video_url = f"http://127.0.0.1:5000/videos/{output_filename}"
            return jsonify({
                "message": "ISL video created successfully",
                "video_path": video_url,
                "text": text
            }), 200
        else:
            return jsonify({"error": "Failed to create ISL video"}), 500
            
    except Exception as e:
        print(f"Error in text_to_sign: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/process_video', methods=['POST'])
def process_video_request():
    try:
        # Retrieve the URL or search query from the request
        data = request.get_json()
        if 'url' in data:
            video_path = download_video_from_url(data['url'], OUTPUT_FOLDER)
        elif 'query' in data:
            video_path = search_and_download_video(data['query'], OUTPUT_FOLDER)
        else:
            return jsonify({"error": "No URL or query provided"}), 400

        if not video_path:
            return jsonify({"error": "Video download failed"}), 400

        # Transcribe the video
        transcription_result = transcribe_audio_with_whisper(video_path)
        
        if not transcription_result or not transcription_result.get('text'):
            print("Transcription failed. Returning original video...")
            video_filename = os.path.basename(video_path)
            video_url = f"http://127.0.0.1:5000/videos/{video_filename}"
            return jsonify({
                "message": "Video processed (transcription failed)", 
                "video_path": video_url,
                "transcription": ""
            }), 200
        
        transcription_text = transcription_result['text']
        print(f"Transcription: {transcription_text[:100]}...")
        
        # Create ISL video from transcribed text
        isl_video_filename = "isl_" + os.path.basename(video_path)
        isl_video_path = os.path.join(OUTPUT_FOLDER, isl_video_filename)
        
        isl_video = create_isl_video_from_text(transcription_text, isl_video_path)
        
        if isl_video:
            video_url = f"http://127.0.0.1:5000/videos/{isl_video_filename}"
        else:
            # Fallback to original video
            video_filename = os.path.basename(video_path)
            video_url = f"http://127.0.0.1:5000/videos/{video_filename}"
        
        return jsonify({
            "message": "ISL video created successfully", 
            "video_path": video_url,
            "transcription": transcription_text
        }), 200

    except Exception as e:
        print(f"Error processing video: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
def download_video_from_url(url, output_folder):
    try:
        options = {
            'format': 'bestvideo+bestaudio/best',
            'outtmpl': os.path.join(output_folder, '%(title)s.%(ext)s'),
            'merge_output_format': 'mp4',
            'noplaylist': True  # Only download single video, not playlist
        }
        with YoutubeDL(options) as ydl:
            info = ydl.extract_info(url, download=True)
            video_path = ydl.prepare_filename(info)
            print(f"Video downloaded: {video_path}")
            return video_path
    except Exception as e:
        print(f"Error downloading video: {e}")
        return None

def search_and_download_video(query, output_folder):
    try:
        options = {
            'format': 'bestvideo+bestaudio/best',
            'outtmpl': os.path.join(output_folder, '%(title)s.%(ext)s'),
            'merge_output_format': 'mp4',
            'noplaylist': True
        }
        with YoutubeDL(options) as ydl:
            search_results = ydl.extract_info(f"ytsearch1:{query}", download=True)
            if search_results['entries']:
                video_info = search_results['entries'][0]
                video_path = ydl.prepare_filename(video_info)
                print(f"Video downloaded: {video_path}")
                return video_path
            else:
                print("No videos found for the search query.")
                return None
    except Exception as e:
        print(f"Error searching and downloading video: {e}")
        return None

def add_subtitles_to_video(video_path, transcription_result, output_path):
    """Add subtitles to video using FFmpeg"""
    try:
        print(f"Adding subtitles to video: {video_path}")
        
        # Get transcribed text
        text = transcription_result.get('text', '').strip()
        if not text:
            print("No text to add")
            return video_path
        
        # Create subtitle file (SRT format) with safe filename
        srt_filename = os.path.basename(output_path).replace('.mp4', '.srt')
        srt_path = os.path.join(OUTPUT_FOLDER, srt_filename)
        
        video = VideoFileClip(video_path)
        duration = video.duration
        video.close()
        
        # Simple subtitle: show full text for entire video duration
        with open(srt_path, 'w', encoding='utf-8') as f:
            f.write("1\n")
            f.write("00:00:00,000 --> " + format_time(duration) + "\n")
            f.write(text + "\n\n")
        
        # Escape paths for Windows
        srt_path_escaped = srt_path.replace('\\', '/').replace(':', '\\:')
        
        # Use FFmpeg to burn subtitles into video
        command = [
            'ffmpeg', '-i', video_path,
            '-vf', f"subtitles='{srt_path_escaped}':force_style='FontSize=24,PrimaryColour=&HFFFFFF&,OutlineColour=&H000000&,BorderStyle=3,Outline=2,Shadow=0,MarginV=50'",
            '-c:a', 'copy',
            '-y',
            output_path
        ]
        
        print(f"Running FFmpeg command...")
        result = subprocess.run(command, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"Video with subtitles created: {output_path}")
            # Clean up subtitle file
            if os.path.exists(srt_path):
                os.remove(srt_path)
            return output_path
        else:
            print(f"FFmpeg failed, returning original video")
            print(f"Error: {result.stderr[:500]}")
            return video_path
            
    except Exception as e:
        print(f"Error adding subtitles: {e}")
        import traceback
        traceback.print_exc()
        return video_path

def format_time(seconds):
    """Convert seconds to SRT time format"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"

def create_isl_video_from_text(text, output_path):
    """Create ISL sign language video from text using dataset images with captions"""
    try:
        print(f"Creating ISL video for text: {text[:50]}...")
        
        clips = []
        words = text.split()
        current_word = ""
        
        for word in words[:20]:  # Limit to first 20 words for performance
            word_clean = ''.join(c for c in word if c.isalnum()).upper()
            current_word = word_clean
            
            for char in word_clean:
                # Find ISL image for this character
                char_folder = os.path.join(ISL_DATASET_PATH, char)
                
                if os.path.exists(char_folder):
                    # Get random image from folder
                    images = glob.glob(os.path.join(char_folder, "*.jpg"))
                    if images:
                        img_path = random.choice(images)
                        # Create 2.5 second clip for each character (much slower)
                        # Resize to consistent 800x800 size
                        img_clip = ImageClip(img_path).set_duration(2.5).resize((800, 800))
                        
                        # Add text caption showing the letter and word
                        try:
                            txt_clip = TextClip(
                                f"{char}\n({current_word})",
                                font='Arial',
                                fontsize=60,
                                color='white',
                                bg_color='black',
                                size=(800, None)
                            ).set_duration(2.5).set_position(('center', 'bottom'))
                            
                            # Composite image with text
                            video_clip = CompositeVideoClip([img_clip, txt_clip])
                            clips.append(video_clip)
                        except:
                            # Fallback: just use image without text
                            clips.append(img_clip)
                        
                        print(f"Added ISL image for: {char}")
        
        if clips:
            # Concatenate all clips
            final_video = concatenate_videoclips(clips, method="compose")
            final_video.write_videofile(
                output_path,
                fps=20,
                codec='libx264',
                audio=False
            )
            final_video.close()
            print(f"ISL video created: {output_path}")
            return output_path
        else:
            print("No ISL images found for text")
            return None
            
    except Exception as e:
        print(f"Error creating ISL video: {e}")
        import traceback
        traceback.print_exc()
        return None

def transcribe_audio_with_whisper(video_path):
    """Transcribe audio using Whisper with word timestamps"""
    try:
        print(f"Transcribing with Whisper: {video_path}")
        result = whisper_model.transcribe(video_path, word_timestamps=True)
        print(f"Transcription complete: {result['text']}")
        return result
    except Exception as e:
        print(f"Whisper transcription error: {e}")
        return None

def process_video(input_video_path):
    print(f"Processing video: {input_video_path}")
    output_video_path = os.path.join(OUTPUT_FOLDER, "isl_" + os.path.basename(input_video_path))

    # Transcribe with Whisper
    transcription_result = transcribe_audio_with_whisper(input_video_path)
    
    if not transcription_result or not transcription_result.get('text'):
        print("Transcription failed. Returning original video...")
        return input_video_path
    
    print(f"Transcribed text: {transcription_result['text']}")
    
    # Add subtitles to video
    final_video = add_subtitles_to_video(input_video_path, transcription_result, output_video_path)
    
    return final_video

def main():
    print("Select an option:")
    print("1. Enter a YouTube URL")
    print("2. Search for a video on YouTube")
    choice = input("Enter your choice (1 or 2): ")

    if choice == "1":
        url = input("Enter the YouTube video URL: ")
        video_path = download_video_from_url(url, OUTPUT_FOLDER)
    elif choice == "2":
        query = input("Enter the search query: ")
        video_path = search_and_download_video(query, OUTPUT_FOLDER)
    else:
        print("Invalid choice. Exiting.")
        return

    if video_path:
        final_video = process_video(video_path)
        if final_video:
            print(f"Sign language video created: {final_video}")
        else:
            print("Failed to create sign language video.")
    else:
        print("No video processed.")
@app.route('/upload_video', methods=['POST'])
def upload_video():
    try:
        video_file = request.files['video']
        video_path = os.path.join(OUTPUT_FOLDER, video_file.filename)
        video_file.save(video_path)
        
        final_video = process_video(video_path)

        if final_video:
            return jsonify({"message": "Sign language video created", "video_path": final_video}), 200
        else:
            return jsonify({"error": "Failed to create sign language video"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/isl_image/<letter>', methods=['GET'])
def get_isl_image(letter):
    """Serve a random ISL image for a given letter"""
    try:
        letter = letter.upper()
        char_folder = os.path.join(ISL_DATASET_PATH, letter)
        
        if os.path.exists(char_folder):
            images = glob.glob(os.path.join(char_folder, "*.jpg"))
            if images:
                img_path = random.choice(images)
                return send_from_directory(os.path.dirname(img_path), os.path.basename(img_path))
        
        return jsonify({"error": "Image not found"}), 404
    except Exception as e:
        print(f"Error serving ISL image: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
