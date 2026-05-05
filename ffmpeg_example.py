# FFmpeg-Python - Video Processing Examples

import ffmpeg
import os

# Example 1: Convert Video Format
def convert_video_format(input_path, output_path):
    """Convert video to different format (e.g., .avi to .mp4)"""
    try:
        (
            ffmpeg
            .input(input_path)
            .output(output_path)
            .run(overwrite_output=True)
        )
        print(f"Converted: {output_path}")
    except ffmpeg.Error as e:
        print(f"Error: {e.stderr.decode()}")

# Example 2: Extract Audio from Video
def extract_audio(input_path, output_audio_path):
    """Extract audio from video file"""
    try:
        (
            ffmpeg
            .input(input_path)
            .output(output_audio_path, acodec='pcm_s16le', ar='44100', ac=2)
            .run(overwrite_output=True)
        )
        print(f"Audio extracted: {output_audio_path}")
    except ffmpeg.Error as e:
        print(f"Error: {e.stderr.decode()}")

# Example 3: Trim Video
def trim_video(input_path, output_path, start_time, duration):
    """Trim video (start_time and duration in seconds)"""
    try:
        (
            ffmpeg
            .input(input_path, ss=start_time, t=duration)
            .output(output_path)
            .run(overwrite_output=True)
        )
        print(f"Trimmed video: {output_path}")
    except ffmpeg.Error as e:
        print(f"Error: {e.stderr.decode()}")

# Example 4: Add Subtitles to Video
def add_subtitles(input_video, subtitle_file, output_path):
    """Burn subtitles into video"""
    try:
        (
            ffmpeg
            .input(input_video)
            .output(
                output_path,
                vf=f"subtitles={subtitle_file}"
            )
            .run(overwrite_output=True)
        )
        print(f"Subtitles added: {output_path}")
    except ffmpeg.Error as e:
        print(f"Error: {e.stderr.decode()}")

# Example 5: Resize Video
def resize_video(input_path, output_path, width, height):
    """Resize video to specific dimensions"""
    try:
        (
            ffmpeg
            .input(input_path)
            .filter('scale', width, height)
            .output(output_path)
            .run(overwrite_output=True)
        )
        print(f"Resized video: {output_path}")
    except ffmpeg.Error as e:
        print(f"Error: {e.stderr.decode()}")

# Example 6: Merge Video and Audio
def merge_video_audio(video_path, audio_path, output_path):
    """Merge separate video and audio files"""
    try:
        video = ffmpeg.input(video_path)
        audio = ffmpeg.input(audio_path)
        (
            ffmpeg
            .output(video, audio, output_path, vcodec='copy', acodec='aac')
            .run(overwrite_output=True)
        )
        print(f"Merged: {output_path}")
    except ffmpeg.Error as e:
        print(f"Error: {e.stderr.decode()}")

# Example 7: Get Video Info
def get_video_info(input_path):
    """Get video metadata (duration, resolution, etc.)"""
    try:
        probe = ffmpeg.probe(input_path)
        video_info = next(s for s in probe['streams'] if s['codec_type'] == 'video')
        
        print(f"Duration: {float(probe['format']['duration'])} seconds")
        print(f"Resolution: {video_info['width']}x{video_info['height']}")
        print(f"FPS: {eval(video_info['r_frame_rate'])}")
        print(f"Codec: {video_info['codec_name']}")
        
        return probe
    except ffmpeg.Error as e:
        print(f"Error: {e.stderr.decode()}")

# Example 8: Compress Video
def compress_video(input_path, output_path, crf=28):
    """Compress video (crf: 0-51, lower = better quality, 23 is default)"""
    try:
        (
            ffmpeg
            .input(input_path)
            .output(output_path, crf=crf, preset='medium')
            .run(overwrite_output=True)
        )
        print(f"Compressed video: {output_path}")
    except ffmpeg.Error as e:
        print(f"Error: {e.stderr.decode()}")

# Example 9: Create GIF from Video
def video_to_gif(input_path, output_gif, start_time=0, duration=5):
    """Convert video segment to GIF"""
    try:
        (
            ffmpeg
            .input(input_path, ss=start_time, t=duration)
            .filter('fps', fps=10)
            .filter('scale', 320, -1)
            .output(output_gif)
            .run(overwrite_output=True)
        )
        print(f"GIF created: {output_gif}")
    except ffmpeg.Error as e:
        print(f"Error: {e.stderr.decode()}")

# Example Usage
if __name__ == "__main__":
    # Uncomment to use
    # convert_video_format("input.avi", "output.mp4")
    # extract_audio("video.mp4", "audio.wav")
    # trim_video("input.mp4", "trimmed.mp4", start_time=10, duration=30)
    # resize_video("input.mp4", "resized.mp4", 1280, 720)
    # get_video_info("input.mp4")
    # compress_video("input.mp4", "compressed.mp4", crf=28)
    # video_to_gif("input.mp4", "output.gif", start_time=5, duration=3)
    pass
