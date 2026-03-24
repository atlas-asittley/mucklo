/* ========================================
   Professional Awesome Racing - App JS
   RACE. WIN. REPEAT.
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollTop();
  initFilterBar();
  initBlogSystem();
  setActiveNavLink();
});

/* --- Mobile Navigation --- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* --- Scroll to Top --- */
function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- Shop Filter Bar --- */
function initFilterBar() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const products = document.querySelectorAll('.product-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      products.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --- Set Active Nav Link --- */
function setActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    }
  });
}

/* ========================================
   Blog System
   ======================================== */

// Blog post index - edit this when adding new posts
const BLOG_POSTS = [
  {
    slug: 'welcome-to-professional-awesome',
    title: 'Welcome to Professional Awesome Racing',
    date: '2024-03-15',
    author: 'Derek',
    excerpt: 'We\'re thrilled to launch our new website! Here\'s what\'s coming in 2024 and beyond.',
    category: 'News'
  },
  {
    slug: 'time-attack-aero-guide',
    title: 'The Complete Guide to Time Attack Aerodynamics',
    date: '2024-02-28',
    author: 'Derek',
    excerpt: 'Everything you need to know about aerodynamic development for time attack competition.',
    category: 'Tech'
  },
  {
    slug: 'suspension-setup-basics',
    title: 'Suspension Setup Basics for Track Days',
    date: '2024-01-20',
    author: 'Derek',
    excerpt: 'A beginner\'s guide to getting your suspension dialed in for the track.',
    category: 'Tech'
  }
];

function initBlogSystem() {
  const blogList = document.getElementById('blog-list');
  if (blogList) renderBlogList(blogList);

  const postContent = document.getElementById('post-content');
  if (postContent) renderSinglePost(postContent);
}

function renderBlogList(container) {
  if (!BLOG_POSTS.length) {
    container.innerHTML = '<div class="empty-state"><h3>No posts yet</h3><p>Check back soon!</p></div>';
    return;
  }

  container.innerHTML = BLOG_POSTS.map(post => `
    <article class="card post-card">
      <div class="card-body">
        <span class="card-category">${post.category}</span>
        <h3><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
        <div class="post-meta">
          <span>📅 ${formatDate(post.date)}</span>
          <span>👤 ${post.author}</span>
        </div>
        <p>${post.excerpt}</p>
        <a href="post.html?slug=${post.slug}" class="card-link">Read More →</a>
      </div>
    </article>
  `).join('');
}

function renderSinglePost(container) {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  if (!slug) {
    container.innerHTML = '<div class="empty-state"><h3>Post not found</h3><p><a href="blog.html">Back to blog</a></p></div>';
    return;
  }

  const post = BLOG_POSTS.find(p => p.slug === slug);
  if (!post) {
    container.innerHTML = '<div class="empty-state"><h3>Post not found</h3><p><a href="blog.html">Back to blog</a></p></div>';
    return;
  }

  // Update page title
  document.title = `${post.title} | Professional Awesome Racing`;

  // Try to load markdown file
  fetch(`posts/${slug}.md`)
    .then(res => {
      if (!res.ok) throw new Error('Not found');
      return res.text();
    })
    .then(md => {
      const rendered = parseMarkdown(md);
      document.getElementById('post-title').textContent = post.title;
      document.getElementById('post-date').textContent = formatDate(post.date);
      document.getElementById('post-author').textContent = post.author;
      document.getElementById('post-category').textContent = post.category;
      container.innerHTML = rendered;
    })
    .catch(() => {
      // Fallback if markdown file doesn't exist yet
      document.getElementById('post-title').textContent = post.title;
      document.getElementById('post-date').textContent = formatDate(post.date);
      document.getElementById('post-author').textContent = post.author;
      document.getElementById('post-category').textContent = post.category;
      container.innerHTML = `<p>${post.excerpt}</p><p><em>Full post content coming soon.</em></p>`;
    });
}

/* --- Simple Markdown Parser --- */
function parseMarkdown(md) {
  let html = md;

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');

  // Paragraphs - wrap remaining text lines
  html = html.split('\n\n').map(block => {
    block = block.trim();
    if (!block) return '';
    if (block.startsWith('<')) return block;
    return `<p>${block.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');

  return html;
}

/* --- Date Formatter --- */
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/* --- Contact Form Handler --- */
function handleContactForm(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // In a real setup, this would send to a serverless function or form service
  // For now, show a success message
  const btn = form.querySelector('button[type="submit"]');
  const origText = btn.textContent;
  btn.textContent = 'Message Sent!';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = origText;
    btn.disabled = false;
    form.reset();
  }, 3000);

  console.log('Form submitted:', data);
}
