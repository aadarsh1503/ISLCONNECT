# MoviePy - Video Editing Examples

from moviepy.editor import (
    VideoFileClip, 
    ImageClip, 
    TextClip, 
    concatenate_videoclips, 
    CompositeVideoClip
)
import os

# Example 1: Basic Video Operations
def trim_video(input_path, output_path, start_time, end_time):
    """Trim video from start_time to end_time (in seconds)"""
    video = VideoFileClip(input_path)
    trimmed = video.subclip(start_time, end_time)
    trimmed.write_videofile(output_path)
    video.close()
    trimmed.close()

# Example 2: Add Text to Video
def add_text_overlay(input_path, output_path, text):
    """Add text overlay on video"""
    video = VideoFileClip(input_path)
    
    # Create text clip
    txt_clip = TextClip(
        text, 
        fontsize=50, 
        color='white',
        bg_color='black',
        font='Arial'
    ).set_duration(video.duration).set_position(('center', 'bottom'))
    
    # Composite video with text
    final = CompositeVideoClip([video, txt_clip])
    final.write_videofile(output_path)
    
    video.close()
    final.close()

# Example 3: Concatenate Multiple Videos
def merge_videos(video_paths, output_path):
    """Merge multiple videos into one"""
    clips = [VideoFileClip(path) for path in video_paths]
    final = concatenate_videoclips(clips, method="compose")
    final.write_videofile(output_path)
    
    for clip in clips:
        clip.close()
    final.close()

# Example 4: Create Video from Images
def images_to_video(image_paths, output_path, duration_per_image=2):
    """Create video from multiple images"""
    clips = []
    for img_path in image_paths:
        clip = ImageClip(img_path).set_duration(duration_per_image)
        clips.append(clip)
    
    final = concatenate_videoclips(clips, method="compose")
    final.write_videofile(output_path, fps=24)
    final.close()

# Example 5: Resize Video
def resize_video(input_path, output_path, width, height):
    """Resize video to specific dimensions"""
    video = VideoFileClip(input_path)
    resized = video.resize((width, height))
    resized.write_videofile(output_path)
    video.close()
    resized.close()

# Example 6: Extract Audio from Video
def extract_audio(input_path, output_audio_path):
    """Extract audio from video"""
    video = VideoFileClip(input_path)
    audio = video.audio
    audio.write_audiofile(output_audio_path)
    video.close()

# Example Usage
if __name__ == "__main__":
    # Uncomment to use
    # trim_video("input.mp4", "output_trimmed.mp4", 10, 30)
    # add_text_overlay("input.mp4", "output_text.mp4", "Hello World!")
    # merge_videos(["video1.mp4", "video2.mp4"], "merged.mp4")
    # images_to_video(["img1.jpg", "img2.jpg"], "slideshow.mp4", duration_per_image=3)
    # resize_video("input.mp4", "output_resized.mp4", 1280, 720)
    # extract_audio("input.mp4", "audio.mp3")
    pass
