import kagglehub
import os

# Download latest version
print("Downloading ISL dataset...")
path = kagglehub.dataset_download("prathumarikeri/indian-sign-language-isl")

print("Path to dataset files:", path)
print("\nDataset downloaded successfully!")
print("You can now use this path in your app.py")
