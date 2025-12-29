import re
import json
from collections import Counter
from datetime import datetime

# --- CONFIGURATION ---
FILE_PATH = '_chat.txt'  # Put your chat file in the same folder
OUTPUT_FILE = 'src/data.json' # We'll output this for the React app

def parse_chat():
    # Regex to match: [27/11/24, 6:07:33 PM] Tanieshaa: Message
    # Handles the hidden LRO mark (\u200e) and narrow spaces (\u202f)
    pattern = re.compile(r'\[(\d{2}/\d{2}/\d{2}),\s?(\d{1,2}:\d{2}:\d{2})\s?([AP]M)\]\s(.*?):\s(.*)')
    
    messages = []
    
    print("⏳ Parsing chat file...")
    
    try:
        with open(FILE_PATH, 'r', encoding='utf-8') as f:
            for line in f:
                # Clean invisible characters that WhatsApp adds
                clean_line = line.replace('\u200e', '').replace('\u202f', ' ').strip()
                match = pattern.search(clean_line)
                
                if match:
                    date_str, time_str, ampm, author, content = match.groups()
                    
                    # Create a datetime object for sorting/analyzing
                    dt_str = f"{date_str} {time_str} {ampm}"
                    dt_obj = datetime.strptime(dt_str, "%d/%m/%y %I:%M:%S %p")
                    
                    messages.append({
                        "date": date_str,
                        "hour": dt_obj.hour,
                        "author": author,
                        "content": content,
                        "is_media": "omitted" in content # Tracks media files
                    })
    except FileNotFoundError:
        print(f"❌ Error: Could not find {FILE_PATH}. Make sure it's in the folder.")
        return

    print(f"✅ Successfully parsed {len(messages)} messages.")
    return messages

def analyze_data(messages):
    if not messages: return
    
    # 1. Basic Counts
    total_messages = len(messages)
    author_counts = Counter(m['author'] for m in messages)
    media_count = sum(1 for m in messages if m['is_media'])
    
    # 2. Top Words (Filtering out common stop words)
    stop_words = {'the', 'and', 'to', 'a', 'of', 'in', 'is', 'it', 'you', 'that', 'for', 'omitted', 'audio', 'image', 'video', 'sticker', 'deleted', 'this', 'have', 'with', 'just', 'what', 'like', 'yeah', 'okay', 'nahi', 'hini', 'bhi', 'tha', 'hai', 'kya'}
    
    words = []
    for m in messages:
        if not m['is_media']:
            # Split by space and clean punctuation
            clean_content = re.sub(r'[^\w\s]', '', m['content'].lower())
            for w in clean_content.split():
                if len(w) > 3 and w not in stop_words:
                    words.append(w)
                    
    top_words = Counter(words).most_common(5)

    # 3. Time Analysis (Who texts when)
    hours = [m['hour'] for m in messages]
    peak_hour = Counter(hours).most_common(1)[0][0]
    
    # Convert 24h to 12h for display
    peak_hour_str = datetime.strptime(str(peak_hour), "%H").strftime("%I %p")

    # 4. First & Last Date
    start_date = messages[0]['date']
    end_date = messages[-1]['date']

    # 5. Who texts more?
    top_sender = author_counts.most_common(1)[0][0]

    # Structure data for Frontend
    stats = {
        "summary": {
            "total": total_messages,
            "media_shared": media_count,
            "start_date": start_date,
            "end_date": end_date
        },
        "authors": dict(author_counts),
        "top_sender": top_sender,
        "top_words": [{"text": w, "value": c} for w, c in top_words],
        "peak_time": peak_hour_str
    }
    
    # Ensure src directory exists
    import os
    if not os.path.exists('src'):
        os.makedirs('src')

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(stats, f, indent=2)
    
    print(f"✨ stats.json generated in {OUTPUT_FILE}!")

# Run the pipeline
msgs = parse_chat()
analyze_data(msgs)