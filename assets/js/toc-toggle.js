document.addEventListener('DOMContentLoaded', function() {
  console.log('TOC script loaded - Simple navigation only');
  const tocPanel = document.querySelector('.toc-panel');
  const tocLinks = document.querySelectorAll('.toc__menu a');
  
  console.log('Found TOC panel:', !!tocPanel);
  console.log('Found TOC links:', tocLinks.length);
  
  if (!tocPanel || tocLinks.length === 0) return;
  
  // Add toggle functionality for nested lists
  function addToggleToNestedLists() {
    const nestedLists = tocPanel.querySelectorAll('.toc__menu ul ul');
    console.log('Found nested lists:', nestedLists.length);
    
    nestedLists.forEach(function(nestedList, index) {
      const parentLi = nestedList.parentElement;
      const parentLink = parentLi.querySelector('a');
      
      console.log(`Processing nested list ${index + 1}:`, nestedList);
      
      if (parentLink && nestedList.children.length > 0) {
        // Add toggle button
        const toggleBtn = document.createElement('span');
        toggleBtn.className = 'toc-toggle';
        toggleBtn.innerHTML = '▶';
        toggleBtn.style.cssText = `
          cursor: pointer;
          float: right;
          font-size: 0.8em;
          color: #666;
          transition: transform 0.2s ease;
          margin-left: 0.5em;
          user-select: none;
        `;
        
        // Insert toggle button after the link text
        parentLink.appendChild(toggleBtn);
        
        // Add click handler
        toggleBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          console.log('Toggle clicked');
          const isCollapsed = nestedList.style.display === 'none';
          
          if (isCollapsed) {
            nestedList.style.display = 'block';
            toggleBtn.innerHTML = '▼';
            toggleBtn.style.transform = 'rotate(0deg)';
            console.log('Expanded');
          } else {
            nestedList.style.display = 'none';
            toggleBtn.innerHTML = '▶';
            toggleBtn.style.transform = 'rotate(0deg)';
            console.log('Collapsed');
          }
        });
        
        // Initially collapse nested sections
        nestedList.style.display = 'none';
        toggleBtn.innerHTML = '▶';
        toggleBtn.style.transform = 'rotate(0deg)';
        
        console.log('Added toggle to:', parentLink.textContent);
      }
    });
  }
  
  // Removed auto-highlighting functionality to prevent bugs
  // TOC will now work as a simple navigation without scroll-based highlighting
  
  // Smooth scroll for TOC links
  tocLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      // Don't interfere with toggle buttons
      if (this.querySelector('.toc-toggle')) return;
      
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        console.log('📍 Scrolling to:', target.textContent.trim());
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Initialize
  addToggleToNestedLists();
  
  // No scroll listener needed - removed auto-highlighting
}); 