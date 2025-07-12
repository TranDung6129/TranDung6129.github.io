# Automatic Tag Page Generation System

This Jekyll site includes an automatic tag page generation system that creates individual pages for each tag used in posts.

## How it works

### 1. Tag Detection
The system automatically scans all posts in the `_posts` directory and extracts all tags from the YAML frontmatter.

### 2. Page Generation
For each unique tag found, it creates a corresponding page in the `_tags` directory with:
- Layout: `tag` (uses `_layouts/tag.html`)
- Title: `#<tag-name>` (follows the requested format)
- Permalink: `/tags/<tag-slug>/`
- Automatic pagination (5 posts per page)
- Navigation buttons (Go to top/bottom)

### 3. Cleanup
The system also removes pages for tags that are no longer used in any posts.

## Recent Fixes (2025-07-12)

### ✅ Fixed Duplicate Title Issue
- **Problem**: Tag pages showed the title twice (once in header, once in content)
- **Solution**: Removed duplicate title from tag layout, keeping only the header title
- **Result**: Clean single title display with format `#<tag-name>`

### ✅ Added Navigation Buttons
- **Go to Top Button**: Fixed position button to scroll to page top
- **Go to Bottom Button**: Fixed position button to scroll to page bottom
- **Features**:
  - Smooth scrolling animation
  - Auto-hide/show based on scroll position
  - Responsive design for mobile devices
  - Vietnamese/English translations
  - Hover effects and transitions

## Usage

### Automatic Generation
The tag pages are automatically generated when you run:
```bash
./start.sh
```

### Manual Generation
You can also generate tag pages manually:
```bash
ruby scripts/generate_tag_pages.rb
```

### Adding Tags to Posts
Simply add tags to your post's frontmatter:
```yaml
---
title: "My Post"
tags:
  - tag1
  - tag2
  - tag3
---
```

## Features

- **Automatic**: No need to manually create tag pages
- **Clean URLs**: Each tag gets its own clean URL `/tags/tag-name/`
- **Single Title**: Fixed duplicate title issue
- **Navigation**: Go to top/bottom buttons with smooth scrolling
- **Pagination**: Tag pages automatically paginate when there are many posts
- **Responsive**: Works on all device sizes
- **Multilingual**: Vietnamese and English support
- **Maintenance**: Removes obsolete tag pages automatically
- **GitHub Pages Compatible**: Works with GitHub Pages constraints

## File Structure

```
_tags/
├── tag1.md
├── tag2.md
└── ...

_layouts/
└── tag.html          # Template for tag pages

scripts/
└── generate_tag_pages.rb  # Generation script

_data/
└── ui-text.yml       # Translations for UI elements
```

## Tag Page Layout

Each tag page includes:
- Title: `#<tag-name>` (single, no duplicates)
- List of all posts with that tag
- Pagination controls (Previous/Next)
- Navigation buttons (Go to top/bottom)
- Responsive design
- Filtering of hidden posts

## Navigation Buttons

### Go to Top Button
- Appears when scrolled down more than 300px
- Smooth scrolls to page top
- Fixed position (bottom-right)
- Circular design with arrow icon

### Go to Bottom Button
- Appears when not at bottom of page
- Smooth scrolls to page bottom
- Fixed position (above go-to-top button)
- Auto-hides when near bottom

### Styling
- Circular buttons with hover effects
- Box shadow for depth
- Responsive positioning for mobile
- Smooth transitions and animations

## Customization

### Modifying Tag Page Layout
Edit `_layouts/tag.html` to customize the appearance of tag pages.

### Changing Posts Per Page
Modify the `postsPerPage` variable in the JavaScript section of `_layouts/tag.html`.

### Customizing Navigation Buttons
Edit the CSS in `_layouts/tag.html` to change button appearance, position, or behavior.

### Adding Translations
Add new language translations in `_data/ui-text.yml`:
```yaml
your-language:
  back_to_top: "Your translation"
  go_to_bottom: "Your translation"
```

### Custom Tag Page Content
You can add custom content to individual tag pages by editing the generated files in `_tags/`.

## Troubleshooting

### Tags Not Appearing
1. Check that tags are properly formatted in post frontmatter
2. Run the generation script manually: `ruby scripts/generate_tag_pages.rb`
3. Rebuild the site: `bundle exec jekyll build`

### Duplicate Titles
This issue has been fixed. If you still see duplicate titles:
1. Clear your browser cache
2. Rebuild the site: `bundle exec jekyll build`
3. Check that you're using the latest version of `_layouts/tag.html`

### Navigation Buttons Not Working
1. Ensure JavaScript is enabled in your browser
2. Check browser console for errors
3. Verify that FontAwesome icons are loading
4. Test on different devices/browsers

### Broken Tag Links
1. Ensure the tag archive is configured in `_config.yml`:
   ```yaml
   tag_archive:
     type: liquid
     path: /tags/
   ```
2. Check that `_tags` directory is included in the site build
3. Verify that `_includes/tag-list.html` has the correct path_type

## Technical Details

- **Script**: `scripts/generate_tag_pages.rb`
- **Layout**: `_layouts/tag.html`
- **Directory**: `_tags/`
- **Pagination**: Client-side JavaScript
- **Navigation**: CSS + JavaScript with smooth scrolling
- **Translations**: `_data/ui-text.yml`
- **Compatibility**: GitHub Pages compatible (no plugins required)

## Browser Support

- Modern browsers with JavaScript support
- CSS3 features (transitions, transforms, flexbox)
- Smooth scrolling API (with fallback)
- Responsive design for all screen sizes 