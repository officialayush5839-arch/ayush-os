/**
 * Minimal Safe Markdown to Sanitized HTML Parser
 * Handles GitHub flavored markdown elements, tables, code blocks, lists,
 * and strips dangerous HTML tags/attributes to prevent XSS.
 */
window.SafeMarkdown = {
  render(md) {
    if (!md || typeof md !== 'string') return '';

    // Step 1: Normalize newlines
    let text = md.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Step 2: Extract and replace code blocks ```lang ... ```
    const codeBlocks = [];
    text = text.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const idx = codeBlocks.length;
      const safeCode = this.escapeHtml(code);
      codeBlocks.push(`<pre><code class="language-${lang}">${safeCode}</code></pre>`);
      return `@@CODE_BLOCK_${idx}@@`;
    });

    // Step 3: Extract and replace inline code `...`
    const inlineCodes = [];
    text = text.replace(/`([^`\n]+)`/g, (match, code) => {
      const idx = inlineCodes.length;
      inlineCodes.push(`<code>${this.escapeHtml(code)}</code>`);
      return `@@INLINE_CODE_${idx}@@`;
    });

    // Step 4: Tables
    text = text.replace(/((?:\|[^\n]+\|\n?)+)/g, (match) => {
      const rows = match.trim().split('\n');
      if (rows.length < 2) return match;
      let html = '<table>';
      let isHeader = true;
      for (const row of rows) {
        if (/^\|?\s*[-:]+[-| :]*\|?$/.test(row.trim())) {
          isHeader = false;
          continue;
        }
        const cols = row.split('|').filter((c, i, a) => i > 0 && i < a.length - 1);
        html += '<tr>';
        for (const col of cols) {
          const tag = isHeader ? 'th' : 'td';
          html += `<${tag}>${col.trim()}</${tag}>`;
        }
        html += '</tr>';
      }
      html += '</table>';
      return html;
    });

    // Step 5: Images ![alt](url)
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
      const cleanUrl = this.sanitizeUrl(url.trim());
      const safeAlt = this.escapeHtml(alt || 'Project graphic');
      return `<img src="${cleanUrl}" alt="${safeAlt}" loading="lazy" />`;
    });

    // Step 6: Links [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, url) => {
      const cleanUrl = this.sanitizeUrl(url.trim());
      const safeLabel = this.escapeHtml(label);
      return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer">${safeLabel}</a>`;
    });

    // Step 7: Blockquotes
    text = text.replace(/^\s*>\s*(.+)$/gm, '<blockquote><p>$1</p></blockquote>');

    // Step 8: Headings
    text = text.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
    text = text.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
    text = text.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
    text = text.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
    text = text.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
    text = text.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

    // Step 9: Horizontal rules
    text = text.replace(/^(?:---|\*\*\*|___)\s*$/gm, '<hr />');

    // Step 10: Unordered lists
    text = text.replace(/^\s*[-*+]\s+(.+)$/gm, '<li>$1</li>');
    text = text.replace(/((?:<li>[^\n]+<\/li>\n?)+)/g, '<ul>$1</ul>');

    // Step 11: Bold & Italic
    text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    text = text.replace(/___([^_]+)___/g, '<strong><em>$1</em></strong>');
    text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    text = text.replace(/_([^_]+)_/g, '<em>$1</em>');

    // Step 12: Paragraphs (split by double newline)
    const blocks = text.split(/\n\s*\n/);
    const parsedBlocks = blocks.map(block => {
      block = block.trim();
      if (!block) return '';
      if (/^<(?:h[1-6]|ul|ol|table|pre|blockquote|hr|div|img|p)/i.test(block)) {
        return block;
      }
      if (block.startsWith('@@CODE_BLOCK_')) return block;
      return `<p>${block.replace(/\n/g, '<br />')}</p>`;
    });
    text = parsedBlocks.join('\n');

    // Step 13: Restore inline code & code blocks
    text = text.replace(/@@INLINE_CODE_(\d+)@@/g, (match, idx) => inlineCodes[idx] || '');
    text = text.replace(/@@CODE_BLOCK_(\d+)@@/g, (match, idx) => codeBlocks[idx] || '');

    // Step 14: Final sanitize (prevent any inline script tags or onerror event handlers)
    text = this.sanitizeHtml(text);

    return text;
  },

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  sanitizeUrl(url) {
    if (!url) return '#';
    const trimmed = url.trim().replace(/^["']|["']$/g, '');
    // Disallow javascript:, data:text/html, vbscript:, etc.
    if (/^(?:javascript|vbscript|data:(?!image\/)):/i.test(trimmed)) {
      return '#';
    }
    return this.escapeHtml(trimmed);
  },

  sanitizeHtml(html) {
    // Remove script tags, object, embed, iframe with javascript
    let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    // Remove event handlers (onclick, onerror, onload, etc.)
    clean = clean.replace(/\son[a-zA-Z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');
    return clean;
  }
};
