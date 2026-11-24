import os
from PIL import Image, ImageDraw, ImageFont

def create_cover():
    src_path = "public/posts/post1-compressor-raw.jpg"
    out_path = "public/posts/post1-compressor.jpg"
    
    if not os.path.exists(src_path):
        print("Source not found")
        return
        
    img = Image.open(src_path).convert("RGBA")
    
    # Target 4:5 Instagram feed size: 1080 x 1350
    target_w, target_h = 1080, 1350
    
    # Crop to 4:5 aspect ratio centered
    w, h = img.size
    target_ratio = target_w / target_h
    current_ratio = w / h
    
    if current_ratio > target_ratio:
        # Image is wider: crop sides
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        img = img.crop((left, 0, left + new_w, h))
    else:
        # Image is taller: crop top/bottom
        new_h = int(w / target_ratio)
        top = (h - new_h) // 2
        img = img.crop((0, top, w, top + new_h))
        
    img = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    # Create dark gradient overlays for maximum text legibility
    overlay = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    draw_overlay = ImageDraw.Draw(overlay)
    
    # Top dark gradient for headline
    for y in range(480):
        alpha = int(220 * (1 - (y / 480) ** 0.8))
        draw_overlay.line([(0, y), (target_w, y)], fill=(6, 78, 59, alpha)) # Deep emerald dark tint
        
    # Extra dark shadow behind main text
    for y in range(380):
        alpha = int(140 * (1 - (y / 380)))
        draw_overlay.line([(0, y), (target_w, y)], fill=(10, 15, 20, alpha))
        
    # Bottom dark gradient for branding
    for y in range(target_h - 180, target_h):
        progress = (y - (target_h - 180)) / 180
        alpha = int(210 * progress)
        draw_overlay.line([(0, y), (target_w, y)], fill=(6, 78, 59, alpha))
        
    # Composite overlay
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)
    
    # Load fonts (fallback to Arial / default)
    try:
        font_badge = ImageFont.truetype("arialbd.ttf", 26)
        font_title = ImageFont.truetype("arialbd.ttf", 62)
        font_sub = ImageFont.truetype("arial.ttf", 32)
        font_brand = ImageFont.truetype("arialbd.ttf", 28)
        font_tag = ImageFont.truetype("arial.ttf", 24)
    except:
        font_badge = ImageFont.load_default()
        font_title = font_badge
        font_sub = font_badge
        font_brand = font_badge
        font_tag = font_badge
        
    # 1. Badge Pill at Top
    badge_text = " ⚠️ ALERTA RDC 1002/2025 "
    badge_x, badge_y = 60, 60
    
    # Draw badge background pill
    draw.rounded_rectangle([badge_x, badge_y, badge_x + 380, badge_y + 48], radius=14, fill=(13, 148, 136, 240), outline=(255, 255, 255, 180), width=2)
    draw.text((badge_x + 18, badge_y + 8), badge_text, font=font_badge, fill=(255, 255, 255, 255))
    
    # 2. Main Title (Big & Punchy)
    title_line1 = "Você já olhou embaixo"
    title_line2 = "do compressor hoje?"
    draw.text((60, 135), title_line1, font=font_title, fill=(255, 255, 255, 255), stroke_width=2, stroke_fill=(0, 0, 0, 160))
    draw.text((60, 210), title_line2, font=font_title, fill=(52, 211, 153, 255), stroke_width=2, stroke_fill=(6, 78, 59, 200)) # Emerald highlight
    
    # 3. Subtitle
    sub_text = "A água acumulada que pode interditar o seu consultório."
    draw.text((62, 295), sub_text, font=font_sub, fill=(226, 232, 240, 240), stroke_width=1, stroke_fill=(0, 0, 0, 180))
    
    # 4. Bottom Footer Branding
    draw.text((60, target_h - 110), "🛡️ OdontoShield", font=font_brand, fill=(255, 255, 255, 255))
    draw.text((60, target_h - 70), "Biossegurança & Compliance Odontológico", font=font_tag, fill=(167, 243, 208, 230))
    draw.text((target_w - 280, target_h - 85), "@odontoshield.app", font=font_brand, fill=(255, 255, 255, 240))
    
    # Convert back to RGB and save
    final_img = img.convert("RGB")
    final_img.save(out_path, "JPEG", quality=95)
    print(f"Cover generated successfully at {out_path}")

if __name__ == "__main__":
    create_cover()
