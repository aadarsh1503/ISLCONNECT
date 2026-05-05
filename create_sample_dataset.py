import os

# Create sample ISL dataset structure for testing
SAMPLE_DATASET_PATH = "sample_isl_dataset"
os.makedirs(SAMPLE_DATASET_PATH, exist_ok=True)

# Create folders for A-Z
letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
for letter in letters:
    letter_folder = os.path.join(SAMPLE_DATASET_PATH, letter)
    os.makedirs(letter_folder, exist_ok=True)
    print(f"Created folder: {letter}")

print(f"\nSample dataset structure created at: {os.path.abspath(SAMPLE_DATASET_PATH)}")
print("\nNow add some sample images (.jpg) in each letter folder")
print("Or download from: https://www.kaggle.com/datasets/prathumarikeri/indian-sign-language-isl")
