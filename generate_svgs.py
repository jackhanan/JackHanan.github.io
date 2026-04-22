import os

svg_template = """<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
  <rect width="{width}" height="{height}" fill="#2d2d2d" />
  <text x="50%" y="50%" font-family="Inter, sans-serif" font-size="24" fill="#a0a0a0" text-anchor="middle" dominant-baseline="middle">{text}</text>
</svg>"""

folders = [
    "projects/project1",
    "projects/project2",
    "projects/project3",
    "projects/project4",
    "projects/other-projects"
]

files_to_generate = [
    {"name": "cover.svg", "width": 800, "height": 600, "text": "Cover Image"},
    {"name": "hero.svg", "width": 1920, "height": 1080, "text": "Hero Image"},
    {"name": "gallery1.svg", "width": 600, "height": 600, "text": "Gallery 1"},
    {"name": "gallery2.svg", "width": 600, "height": 600, "text": "Gallery 2"},
    {"name": "gallery3.svg", "width": 600, "height": 600, "text": "Gallery 3"},
    {"name": "gallery4.svg", "width": 600, "height": 600, "text": "Gallery 4"}
]

# For homepage
os.makedirs("assets", exist_ok=True)
for i in range(1, 5):
    with open(f"assets/cover{i}.svg", "w") as f:
        f.write(svg_template.format(width=800, height=600, text=f"Project {i} Cover"))
with open(f"assets/other-cover.svg", "w") as f:
    f.write(svg_template.format(width=800, height=600, text="Other Projects"))


for folder in folders:
    for file_info in files_to_generate:
        filepath = os.path.join(folder, file_info["name"])
        with open(filepath, "w") as f:
            f.write(svg_template.format(width=file_info["width"], height=file_info["height"], text=file_info["text"]))

print("Generated SVGs successfully.")
