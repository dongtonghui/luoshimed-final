#!/usr/bin/env python3
"""
提取网站图标并转换为 SVG 和 PNG 格式
"""

import os
import re
import base64
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

def extract_svg_icons_from_html():
    """从HTML文件中提取SVG图标"""
    svg_icons = {}
    
    html_files = list(Path('..').glob('*.html'))
    
    for html_file in html_files:
        content = html_file.read_text(encoding='utf-8')
        
        # 查找所有SVG标签
        svg_pattern = r'<svg[^>]*>.*?</svg>'
        matches = re.findall(svg_pattern, content, re.DOTALL)
        
        for i, svg in enumerate(matches):
            # 根据SVG内容生成名称
            icon_name = f"icon_{html_file.stem}_{i+1}"
            
            # 尝试根据path内容识别图标类型
            if 'M22 12h-4' in svg:
                icon_name = f"logo_{html_file.stem}"
            elif 'M5 12h14' in svg:
                icon_name = "arrow_right"
            elif 'M4 6h16' in svg:
                icon_name = "menu"
            elif 'M6 9l6' in svg:
                icon_name = "chevron_down"
            elif 'M19 9l-7' in svg:
                icon_name = "chevron_up"
            
            svg_icons[icon_name] = svg
    
    return svg_icons

def create_emoji_icon(emoji, name, output_dir_svg, output_dir_png, size=128):
    """将Emoji转换为SVG和PNG"""
    
    # 创建PNG
    try:
        img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
        draw = ImageDraw.Draw(img)
        
        # 尝试使用系统字体渲染emoji
        font_size = int(size * 0.7)
        
        # 尝试不同系统的emoji字体
        font_paths = [
            "/System/Library/Fonts/Apple Color Emoji.ttc",  # macOS
            "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf",  # Linux
            "/Windows/Fonts/seguiemj.ttf",  # Windows
            "/usr/share/fonts/truetype/emoji/EmojiOneColor.otf",  # Linux alternative
        ]
        
        font = None
        for font_path in font_paths:
            if os.path.exists(font_path):
                try:
                    font = ImageFont.truetype(font_path, font_size)
                    break
                except:
                    pass
        
        if font is None:
            # 使用默认字体
            font = ImageFont.load_default()
        
        # 计算居中位置
        bbox = draw.textbbox((0, 0), emoji, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        x = (size - text_width) // 2
        y = (size - text_height) // 2 - 5
        
        draw.text((x, y), emoji, font=font, embedded_color=True)
        
        # 保存PNG
        png_path = output_dir_png / f"{name}.png"
        img.save(png_path, 'PNG')
        
        # 创建SVG (使用emoji字符)
        svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="{size}" height="{size}" viewBox="0 0 {size} {size}" xmlns="http://www.w3.org/2000/svg">
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="{font_size}px">{emoji}</text>
</svg>'''
        
        svg_path = output_dir_svg / f"{name}.svg"
        svg_path.write_text(svg_content, encoding='utf-8')
        
        return True
    except Exception as e:
        print(f"    ✗ Emoji转换失败 {emoji}: {e}")
        return False

def main():
    script_dir = Path(__file__).parent
    svg_dir = script_dir / "svg"
    png_dir = script_dir / "png"
    
    svg_dir.mkdir(exist_ok=True)
    png_dir.mkdir(exist_ok=True)
    
    print("=" * 60)
    print("网站图标提取工具")
    print("=" * 60)
    
    # 1. 提取SVG图标
    print("\n1. 提取内联 SVG 图标...")
    svg_icons = extract_svg_icons_from_html()
    print(f"   找到 {len(svg_icons)} 个SVG图标")
    
    for name, svg in svg_icons.items():
        # 保存原始SVG
        svg_path = svg_dir / f"{name}.svg"
        svg_path.write_text(svg, encoding='utf-8')
        print(f"   ✓ {name}.svg")
    
    # 2. 处理Emoji图标
    print("\n2. 转换 Emoji 图标...")
    
    # 收集所有唯一的emoji
    emojis = {
        'trophy': '🏆',
        'scroll': '📜', 
        'hospital': '🏥',
        'medal': '🏅',
        'hospital2': '🏥',
        'chart': '📊',
        'calendar': '📅',
        'school': '🏫',
        'microscope': '🔬',
        'phone': '📞',
        'email': '✉️',
        'location': '📍',
        'map': '🗺️',
        'store': '🏪',
        'handshake': '🤝',
        'wrench': '🔧',
        'package': '📦',
        'tools': '🛠',
        'chart_up': '📈',
        'lock': '🔒',
        'clipboard': '📋',
        'check': '✅',
        'document': '📄',
        'shield': '🛡',
        'info': 'ℹ️',
    }
    
    success_count = 0
    for name, emoji in emojis.items():
        if create_emoji_icon(emoji, name, svg_dir, png_dir):
            print(f"   ✓ {name} ({emoji})")
            success_count += 1
        else:
            print(f"   ✗ {name} ({emoji})")
    
    print("\n" + "=" * 60)
    print(f"完成！")
    print(f"  SVG图标: {len(svg_icons)} 个")
    print(f"  Emoji图标: {success_count}/{len(emojis)} 个")
    print(f"输出目录:")
    print(f"  SVG: {svg_dir}")
    print(f"  PNG: {png_dir}")
    print("=" * 60)

if __name__ == "__main__":
    main()
