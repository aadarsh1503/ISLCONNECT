from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import whisper
import requests
from io import BytesIO
from PIL import Image
import numpy as np
try:
    from moviepy.editor import VideoFileClip, ImageClip, concatenate_videoclips, TextClip, CompositeVideoClip
except ImportError:
    from moviepy import VideoFileClip, ImageClip, concatenate_videoclips, TextClip, CompositeVideoClip
from yt_dlp import YoutubeDL
import subprocess
import random
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Online ISL dataset - using GitHub or any CDN
# You can host images on GitHub, Imgur, or any image hosting service
ISL_ONLINE_BASE_URL = "https://raw.githubusercontent.com/YOUR_USERNAME/isl-dataset/main/Indian"
USE_ONLINE_DATASET = os.getenv('USE_ONLINE_DATASET', 'false').lower() == 'true'
ISL_DATASET_PATH = os.getenv('ISL_DATASET_PATH', '')

OUTPUT_FOLDER = "output_v"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Load Whisper model once at startup
print("Loading Whisper model...")
whisper_model = whisper.load_model("base")
print("Whisper model loaded!")

app = Flask(__name__)
CORS(app)

def get_isl_image_online(letter):
    """Fetch ISL image from online source"""
    try:
        # Try multiple image numbers (1-10) randomly
        img_num = random.randint(1, 10)
        url = f"{ISL_ONLINE_BASE_URL}/{letter}/{img_num}.jpg"
        
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            img = Image.open(BytesIO(response.content))
            return np.array(img)
        return None
    except Exception as e:
        print(f"Error fetching online image for {letter}: {e}")
        return None

def get_isl_image_local(letter):
    """Get ISL image from local dataset"""
    try:
        import glob
        char_folder = os.path.join(ISL_DATASET_PATH, letter)
        if os.path.exists(char_folder):
            images = glob.glob(os.path.join(char_folder, "*.jpg"))
            if images:
                return random.choice(images)
        return None
    except Exception as e:
        print(f"Error getting local image for {letter}: {e}")
        return None

def create_isl_video_from_text_online(text, output_path):
    """Create ISL video using online or local images"""
    try:
        print(f"Creating ISL video for text: {text[:50]}...")
        
        clips = []
        words = text.split()
        current_word = ""
        
        for word in words[:20]:
            word_clean = ''.join(c for c in word if c.isalnum()).upper()
            current_word = word_clean
            
            for char in word_clean:
                img_data = None
                
                # Try online first if enabled
                if USE_ONLINE_DATASET:
                    img_array = get_isl_image_online(char)
                    if img_array is not None:
                        # Save temp image
                        temp_path = f"temp_{char}.jpg"
                        Image.fromarray(img_array).save(temp_path)
                        img_data = temp_path
                
                # Fallback to local
                if img_data is None and ISL_DATASET_PATH:
                    img_data = get_isl_image_local(char)
                
                if img_data:
                    img_clip = ImageClip(img_data).set_duration(0.5)
                    
                    try:
                        txt_clip = TextClip(
                            f"{char}\n({current_word})",
                            font='Arial',
                            fontsize=50,
                            color='white',
                            bg_color='black',
                            size=(img_clip.w, None)
                        ).set_duration(0.5).set_position(('center', 'bottom'))
                        
                        video_clip = CompositeVideoClip([img_clip, txt_clip])
                        clips.append(video_clip)
                    except:
                        clips.append(img_clip)
                    
                    print(f"Added ISL image for: {char}")
                    
                    # Clean up temp file
                    if USE_ONLINE_DATASET and os.path.exists(f"temp_{char}.jpg"):
                        os.remove(f"temp_{char}.jpg")
        
        if clips:
            final_video = concatenate_videoclips(clips, method="compose")
            final_video.write_videofile(output_path, fps=24, codec='libx264', audio=False)
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

# Use the online version in your routes
@app.route('/text_to_sign', methods=['POST'])
def text_to_sign():
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        
        if not text:
            return jsonify({"error": "No text provided"}), 400
        
        print(f"Converting text to ISL: {text}")
        
        output_filename = f"text_isl_{hash(text)}.mp4"
        output_path = os.path.join(OUTPUT_FOLDER, output_filename)
        
        isl_video = create_isl_video_from_text_online(text, output_path)
        
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
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print(f"Using online dataset: {USE_ONLINE_DATASET}")
    print(f"Local dataset path: {ISL_DATASET_PATH}")
    app.run(debug=True)
