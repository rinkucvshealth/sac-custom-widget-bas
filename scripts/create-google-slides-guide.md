# Guide: Converting Presentation to Google Slides

## Option 1: Use Python Script (Recommended)

### Step 1: Install Python and required library
```bash
pip install python-pptx
```

### Step 2: Run the conversion script
```bash
cd scripts
python convert-to-ppt.py
```

### Step 3: Upload to Google Slides
1. Go to Google Slides (slides.google.com)
2. Click "Blank" or "New presentation"
3. Go to **File → Import slides**
4. Select the generated `BASIS_TEAM_PRESENTATION.pptx` file
5. Choose to import all slides

## Option 2: Online Converter

### Step 1: Use Markdown to PPT converter
1. Go to: https://www.markdowntoppt.com/ or https://dillinger.io/
2. Copy contents from `BASIS_TEAM_PRESENTATION.md`
3. Convert to PowerPoint format
4. Download the .pptx file
5. Upload to Google Slides

## Option 3: Direct Copy-Paste (Quick but Manual)

### For Each Slide:
1. Open `BASIS_TEAM_PRESENTATION.md`
2. For each slide section:
   - Copy the slide title
   - Create new slide in Google Slides
   - Paste title in title placeholder
   - Copy bullet points and content
   - Paste in content area
3. Format as needed

## Option 4: Use Pandoc (Advanced)

### Step 1: Install Pandoc
```bash
# Windows (with Chocolatey)
choco install pandoc

# Mac (with Homebrew)
brew install pandoc
```

### Step 2: Convert
```bash
pandoc BASIS_TEAM_PRESENTATION.md -o BASIS_TEAM_PRESENTATION.pptx
```

### Step 3: Upload to Google Slides
Follow Step 3 from Option 1

## Option 5: Export from Cursor/VS Code

### If you use a Markdown preview extension:
1. Open `BASIS_TEAM_PRESENTATION.md` in VS Code/Cursor
2. Use a Markdown to PDF extension
3. Convert PDF to PowerPoint using online tools
4. Upload to Google Slides

## Recommended: Use Option 1 (Python Script)

The Python script (`convert-to-ppt.py`) will:
- ✅ Automatically parse all slides
- ✅ Format titles and bullet points
- ✅ Create a proper PowerPoint file
- ✅ Ready for Google Slides import

**Just run the script and upload the .pptx file to Google Slides!**




