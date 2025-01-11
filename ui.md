Color Palette (Dark Theme)

Here’s the dark theme color scheme with green accents:

Component	Color Code	Usage
Primary Color	#10B981 (Green)	Buttons, links, and highlights.
Secondary Color	#059669 (Dark Green)	Hover states and secondary buttons.
Background Color	#1F2937 (Dark Gray)	Main background for pages.
Card Background	#374151 (Gray)	Background for cards and containers.
Text Color	#F9FAFB (White)	Primary text color.
Secondary Text	#9CA3AF (Light Gray)	Secondary text (e.g., descriptions).
Accent Color	#34D399 (Light Green)	Success messages and progress indicators.
Error Color	#EF4444 (Red)	Error messages and warnings.
Border Color	#4B5563 (Gray)	Borders for cards and input fields.
Typography

Font Family: Inter (Modern, clean, and highly readable).
Font Sizes:
Header 1 (H1): 32px (Page titles).
Header 2 (H2): 24px (Section titles).
Header 3 (H3): 20px (Sub-section titles).
Body Text: 16px (Main content).
Small Text: 14px (Captions, labels).
Page Layouts

1. Home Page

Purpose: Welcome users and allow them to upload a PDF.
Components:
Header:
Logo (left-aligned).
Navigation links (right-aligned): Home, About, Contact.
Hero Section:
Title: Interactive Documentation Platform.
Subtitle: Upload your PDF and start learning interactively..
Upload Button: Upload PDF (Primary Color: #10B981).
Footer:
Links: Privacy Policy, Terms of Service.
Social Media Icons.
2. Upload Page

Purpose: Allow users to upload a PDF file.
Components:
Header:
Same as Home Page.
Upload Section:
Drag-and-drop area (Card Background: #374151, Border: #4B5563).
Text: Drag and drop your PDF here or click to upload..
Upload Button: Upload (Primary Color: #10B981).
Footer:
Same as Home Page.
3. Documentation Page

Purpose: Display the processed documentation with interactive features.
Components:
Header:
Same as Home Page.
Sidebar:
Sections: Summary, Flowcharts, Tutorials, Code Editor.
Active Tab: Highlighted with Primary Color (#10B981).
Main Content:
Summary Section:
Title: Summary.
Content: Display summarized text (Text Color: #F9FAFB).
Flowcharts Section:
Title: Flowcharts.
Content: Display generated flowcharts (Image).
Tutorials Section:
Title: Tutorials.
Content: Step-by-step tutorials with collapsible sections.
Section Title: Step 1: Introduction (H3: 20px).
Content: Text and quizzes (Text Color: #F9FAFB).
Code Editor Section:
Title: Code Editor.
Content: Embedded code editor (CodeMirror or Monaco Editor).
Run Button: Run Code (Primary Color: #10B981).
Output Console: Background: #1F2937, Text: #F9FAFB.
Footer:
Same as Home Page.
4. Tutorials Page

Purpose: Display step-by-step tutorials with quizzes and code examples.
Components:
Header:
Same as Home Page.
Tutorial Sections:
Collapsible sections for each step.
Section Title: Step 1: Introduction (H3: 20px).
Content: Text, quizzes, and code examples.
Footer:
Same as Home Page.
5. Code Editor Page

Purpose: Provide a live code editor for users to apply their learnings.
Components:
Header:
Same as Home Page.
Code Editor:
Embedded code editor (CodeMirror or Monaco Editor).
Run Button: Run Code (Primary Color: #10B981).
Output Console: Background: #1F2937, Text: #F9FAFB.
Footer:
Same as Home Page.
Interactive Elements

Buttons:
Primary Button: Background: #10B981, Text: #1F2937.
Hover State: Background: #059669.
Input Fields:
Background: #374151, Border: #4B5563, Focus Border: #10B981.
Cards:
Background: #374151, Border: #4B5563, Shadow: Light shadow for depth.
Progress Indicators:
Color: #34D399 (Light Green).
Responsive Design

Mobile View:
Collapsible sidebar.
Stacked layout for sections.
Tablet View:
Sidebar on the left, main content on the right.
Desktop View:
Full-width layout with sidebar and main content side by side.
Example UI Screens

Home Page

Copy
-----------------------------------------
| Logo                          Nav Links|
-----------------------------------------
| Interactive Documentation Platform    |
| Upload your PDF and start learning.   |
| [Upload PDF]                          |
-----------------------------------------
| Footer                                |
-----------------------------------------
Documentation Page

Copy
-----------------------------------------
| Logo                          Nav Links|
-----------------------------------------
| Sidebar | Summary                      |
|         | Flowcharts                   |
|         | Tutorials                    |
|         | Code Editor                  |
-----------------------------------------
| Main Content                           |
| Summary: ...                           |
| Flowcharts: [Image]                    |
| Tutorials: Step 1: ...                 |
| Code Editor: [Editor] [Run Code]       |
-----------------------------------------
| Footer                                |
-----------------------------------------
Dark Theme Code Editor Styling

For the Code Editor, use a dark theme with green accents:

Editor Background: #1F2937.
Editor Text: #F9FAFB.
Syntax Highlighting:
Keywords: #34D399 (Light Green).
Strings: #10B981 (Green).
Comments: #6B7280 (Gray).

# UI Specifications

## Layout Structure

### 1. Navigation Bar
- Logo on the left
- Main navigation links:
  - Home
  - Documentation
  - My Progress
  - Community
- User profile menu on the right

### 2. Main Dashboard
- Welcome message with user progress summary
- Recent documents section
- Continue learning section
- Quick access to popular documentation

### 3. Documentation View
#### Left Sidebar
- Table of contents
- Search documentation
- Progress indicators

#### Main Content Area
- Interactive documentation content
- Step-by-step guides
- Embedded flowcharts
- Code examples
- Interactive quizzes

#### Right Sidebar
- Quick navigation
- Related topics
- Bookmarks

### 4. Code Editor Section
- Full-width code editor when active
- Language selector
- Run code button
- Output console
- Save/Share options

## Color Scheme
- Primary: #3B82F6 (Blue)
- Secondary: #10B981 (Green)
- Accent: #8B5CF6 (Purple)
- Background: #F9FAFB
- Text: #1F2937
- Error: #EF4444
- Success: #10B981

## Typography
- Headings: Inter
- Body: Inter
- Code: JetBrains Mono

## Components

### 1. PDF Upload Component
- Drag and drop zone
- File selection button
- Upload progress indicator
- File type validation
- Error handling display

### 2. Interactive Tutorial Card
- Title
- Progress indicator
- Estimated time
- Difficulty level
- Quick start button

### 3. Flowchart Display
- Zoomable interface
- Pan controls
- Step highlighting
- Interactive node clicking

### 4. Quiz Component
- Question display
- Multiple choice options
- Immediate feedback
- Progress tracking
- Score display

### 5. Code Editor
- Syntax highlighting
- Line numbers
- Auto-completion
- Error highlighting
- Run button
- Output display

### 6. Progress Tracking
- Circular progress indicators
- Achievement badges
- Milestone markers
- Learning streak counter

## Responsive Design
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## Animations
- Smooth transitions between sections
- Loading states
- Progress animations
- Hover effects
- Micro-interactions

## Accessibility
- ARIA labels
- Keyboard navigation
- High contrast mode
- Screen reader support
- Focus indicators