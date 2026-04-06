import json
import os

input_file = r'C:\Users\noepo\.gemini\antigravity\brain\5f85f183-a6bf-4030-86f8-5bd4449aff6c\.system_generated\steps\573\output.txt'
output_file = r'c:\Users\noepo\Desktop\ANTIGRAVITY\LINKEDIN LEAD MAGNET\src\integrations\supabase\types.ts'

with open(input_file, 'r', encoding='utf-8') as f:
    data = json.load(f)
    types_content = data['types']

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(types_content)

print(f"File {output_file} fixed successfully.")
