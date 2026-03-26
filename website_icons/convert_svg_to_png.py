#!/usr/bin/env python3
"""
将SVG图标转换为PNG格式
需要安装: pip install cairosvg
"""

import os
from pathlib import Path

def convert_svg_to_png():
    script_dir = Path(__file__).parent
    svg_dir = script_dir / "svg"
    png_dir = script_dir / "png"
    
    # 获取所有SVG文件（排除emoji生成的）
    svg_files = [f for f in svg_dir.glob("*.svg") if not f.name.startswith(tuple(['trophy', 'scroll', 'hospital', 'medal', 'chart', 'calendar', 'school', 'microscope', 'phone', 'email', 'location', 'map', 'store', 'handshake', 'wrench', 'package', 'chart_up', 'lock', 'clipboard', 'check', 'document', 'shield', 'info']))]
    
    print(f"找到 {len(svg_files)} 个SVG图标需要转换")
    print("-" * 60)
    
    success = 0
    failed = 0
    
    for svg_file in svg_files:
        png_file = png_dir / f"{svg_file.stem}.png"
        
        # 使用 cairosvg 转换
        try:
            import cairosvg
            cairosvg.svg2png(url=str(svg_file), write_to=str(png_file), output_width=128, output_height=128)
            print(f"  ✓ {svg_file.name} → {png_file.name}")
            success += 1
        except ImportError:
            # 如果没有cairosvg，使用替代方法
            print(f"  ⚠ cairosvg未安装，使用替代方法...")
            try:
                # 尝试使用 ImageMagick 的 convert 命令
                cmd = f'convert -background none "{svg_file}" -resize 128x128 "{png_file}"'
                result = os.system(cmd)
                if result == 0:
                    print(f"  ✓ {svg_file.name} → {png_file.name}")
                    success += 1
                else:
                    print(f"  ✗ {svg_file.name} (转换失败)")
                    failed += 1
            except Exception as e:
                print(f"  ✗ {svg_file.name}: {e}")
                failed += 1
        except Exception as e:
            print(f"  ✗ {svg_file.name}: {e}")
            failed += 1
    
    print("-" * 60)
    print(f"转换完成: 成功 {success}, 失败 {failed}")
    
    return success, failed

if __name__ == "__main__":
    convert_svg_to_png()
