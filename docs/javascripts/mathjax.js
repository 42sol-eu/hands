// MathJax configuration for mathematical expressions
window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex"
  }
};

// Additional custom JavaScript for enhanced functionality
document.addEventListener('DOMContentLoaded', function() {
  // Add copy buttons to code blocks
  const codeBlocks = document.querySelectorAll('pre > code');
  codeBlocks.forEach(function(codeBlock) {
    if (codeBlock.textContent.trim().length > 0) {
      const button = document.createElement('button');
      button.className = 'md-clipboard md-icon';
      button.type = 'button';
      button.title = 'Copy to clipboard';
      button.innerHTML = '<svg viewBox="0 0 24 24"><path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"></path></svg>';
      
      button.addEventListener('click', function() {
        navigator.clipboard.writeText(codeBlock.textContent).then(function() {
          button.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path></svg>';
          setTimeout(function() {
            button.innerHTML = '<svg viewBox="0 0 24 24"><path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"></path></svg>';
          }, 2000);
        });
      });
      
      const pre = codeBlock.parentElement;
      pre.style.position = 'relative';
      pre.appendChild(button);
    }
  });

  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Enhanced table responsiveness
  const tables = document.querySelectorAll('table');
  tables.forEach(function(table) {
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    wrapper.style.overflowX = 'auto';
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
});