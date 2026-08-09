import os
from PIL import Image

def main():
    folder = "/Users/adam/.gemini/antigravity/brain/41955f15-6ca8-4c8e-8c4f-cc4814f0f1f0/.user_uploaded"
    name = "media__1784795530223.png"
    path = os.path.join(folder, name)
    try:
        img = Image.open(path)
        width, height = img.size
        # Sample pixels
        pixels = [img.getpixel((0, 0)), img.getpixel((10, 10)), img.getpixel((width-1, 0))]
        
        has_transparency = False
        extrema = None
        if img.mode == 'RGBA':
            alpha = img.split()[-1]
            extrema = alpha.getextrema()
            has_transparency = extrema[0] < 255
            
        print(f"File: {name}, Mode: {img.mode}, Size: {img.size}, Sample Pixels: {pixels}, Extrema Alpha: {extrema}, Has Transparency: {has_transparency}")
    except Exception as e:
        print(f"Error reading {name}: {e}")

if __name__ == "__main__":
    main()
