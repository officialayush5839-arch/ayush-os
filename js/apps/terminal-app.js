/**
 * AYUSH.OS — Interactive Terminal Application Module
 * High-fidelity command-line interface emulating a Unix terminal environment.
 * 
 * Export: window.TerminalApp = { getContent(), init(windowBody) }
 */

(function (root) {
  'use strict';

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const WELCOME_BANNER = 
`  ______   __  __  __  __  ______  __  __      ______  ______  
 /\\  __ \\ /\\ \\_\\ \\/\\ \\/\\ \\/\\  ___\\/\\ \\_\\ \\    /\\  __ \\/\\  ___\\ 
 \\ \\  __ \\\\ \\____ \\ \\ \\_\\ \\ \\___  \\ \\  __ \\   \\ \\ \\/\\ \\ \\___  \\
  \\ \\_\\ \\_\\\\/\\_____\\ \\_____\\/\\_____\\ \\_\\ \\_\\   \\ \\_____\\/\\_____\\
   \\/_/\\/_/ \\/_____/\\/_____/\\/_____/\\/_/\\/_/    \\/_____/\\/_____/
                                                                
AYUSH.OS [Version 2.0.26-prod]
Type <span class="cmd-accent">help</span> for a list of commands. Type <span class="cmd-accent">projects</span> to inspect repositories.
`;

  const TerminalApp = {
    /**
     * Generates HTML string for the terminal layout.
     * @returns {string} HTML markup
     */
    getContent: function () {
      return `
        <div class="terminal-container" style="height: 100%; min-height: 380px;">
          <div class="terminal-output" id="termOutput" role="log" aria-live="polite">${WELCOME_BANNER}</div>
          <div class="terminal-input-line">
            <span class="prompt">ayush@ayush-os:~$</span>
            <input type="text" class="terminal-input" id="termInput" autocomplete="off" spellcheck="false" autofocus aria-label="Terminal Command Input" />
          </div>
        </div>
      `;
    },

    /**
     * Initializes terminal events and command handling inside the window body.
     * @param {HTMLElement} windowBody 
     */
    init: function (windowBody) {
      if (!windowBody) return;

      const outputEl = windowBody.querySelector('.terminal-output');
      const inputEl = windowBody.querySelector('.terminal-input');
      const containerEl = windowBody.querySelector('.terminal-container');

      if (!outputEl || !inputEl) return;

      // History navigation stack
      const commandHistory = [];
      let historyIndex = -1;

      // Auto-focus input when clicking anywhere in terminal container
      if (containerEl) {
        containerEl.addEventListener('click', () => {
          inputEl.focus();
        });
      }

      // Safe scroll to bottom
      function scrollToBottom() {
        outputEl.scrollTop = outputEl.scrollHeight;
      }

      // Append rendered line to output
      function printOutput(htmlContent) {
        const line = document.createElement('div');
        line.innerHTML = htmlContent;
        outputEl.appendChild(line);
        scrollToBottom();
      }

      // Execute entered command
      function handleCommand(rawCmd) {
        const trimmed = rawCmd.trim();
        if (!trimmed) {
          printOutput(`<span class="prompt">ayush@ayush-os:~$</span>`);
          return;
        }

        // Print command prompt line
        printOutput(`<span class="prompt">ayush@ayush-os:~$</span> <span class="cmd-prefix">${escapeHtml(trimmed)}</span>`);

        const parts = trimmed.split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        const argString = args.join(' ');

        const profile = (typeof window !== 'undefined' && window.ownerProfile) ? window.ownerProfile : {};
        const identity = profile.identity || {};

        switch (command) {
          case 'help': {
            printOutput(`
<span class="cmd-accent">AYUSH.OS Command Directory:</span>
  <span class="cmd-highlight">whoami</span>              Print user credentials, bio, and coordinates
  <span class="cmd-highlight">projects</span>            List production systems & GitHub repos
  <span class="cmd-highlight">skills</span>              Display full technical skill taxonomy
  <span class="cmd-highlight">cat bio.txt</span>         Read personal biography & background
  <span class="cmd-highlight">cat founder.txt</span>     Print engineering philosophy statement
  <span class="cmd-highlight">contact</span>             Display communication handles & direct email
  <span class="cmd-highlight">theme [day|night|cyber]</span> Switch desktop aesthetic mode
  <span class="cmd-highlight">echo [text]</span>         Echo text back to stdout
  <span class="cmd-highlight">clear</span>               Clear screen buffer
  <span class="cmd-highlight">help</span>                Display this help overview
`);
            break;
          }

          case 'whoami': {
            printOutput(`
<span class="cmd-accent">Identity:</span> ${escapeHtml(identity.fullName || 'Ayush Vishwakarma')} (${escapeHtml(identity.pronouns || 'he/him')})
<span class="cmd-accent">Headline:</span> ${escapeHtml(identity.headline || 'I BUILD INTELLIGENT SYSTEMS.')}
<span class="cmd-accent">Roles:</span> ${(identity.roles || []).join(' · ')}
<span class="cmd-accent">Location:</span> ${escapeHtml(identity.location || 'Pune, India')} [${escapeHtml(identity.coordinates || '18.5204° N / 73.8567° E')}]
<span class="cmd-accent">Education:</span> ${escapeHtml(identity.education || 'Vishwakarma University (VU), Pune')} (Class of ${escapeHtml(identity.educationStart || '2025')})
<span class="cmd-accent">Domain:</span> ${escapeHtml(identity.domain || 'ayushvishwakarma.dev')}
`);
            break;
          }

          case 'projects': {
            const projects = Array.isArray(profile.projects) ? profile.projects : [];
            if (projects.length === 0) {
              printOutput('<span class="cmd-response">No project records found in canonical source.</span>');
            } else {
              let response = `<span class="cmd-accent">Catalogued Engineering Projects (${projects.length}):</span>\n`;
              projects.forEach((p, idx) => {
                const statusTag = p.status === 'verified' ? '[VERIFIED]' : '[DECLARED]';
                response += `\n<span class="cmd-highlight">[${idx + 1}] ${escapeHtml(p.title)}</span> — <span class="cmd-accent">${escapeHtml(p.category)}</span> <span style="font-size:0.8em;">${statusTag}</span>\n`;
                response += `    ${escapeHtml(p.tagline || p.description || '')}\n`;
                response += `    Tech: ${(p.tech || []).join(', ')}\n`;
                response += `    Repo: <a href="${escapeHtml(p.repo || '#')}" target="_blank" style="color: #58a6ff; text-decoration: underline;">${escapeHtml(p.repo || 'N/A')}</a>\n`;
              });
              printOutput(response);
            }
            break;
          }

          case 'skills': {
            const skills = profile.skills || {};
            let response = `<span class="cmd-accent">Technical Skill Stack:</span>\n`;
            for (const [category, items] of Object.entries(skills)) {
              const formattedCat = category.replace(/_/g, '/').toUpperCase();
              response += `  <span class="cmd-highlight">${formattedCat}:</span> ${(items || []).join(', ')}\n`;
            }
            printOutput(response);
            break;
          }

          case 'cat': {
            const file = (args[0] || '').toLowerCase();
            if (file === 'bio.txt') {
              printOutput(`
<span class="cmd-accent">=== bio.txt ===</span>
${escapeHtml(identity.intro || 'AI/ML developer focused on intelligent software, computer vision, and systems.')}

Location: ${escapeHtml(identity.location || 'Pune, India')}
Education: ${escapeHtml(identity.education || 'Vishwakarma University (VU), Pune')}
Contact: ${escapeHtml(identity.email || 'officialayush5839@gmail.com')}
`);
            } else if (file === 'founder.txt') {
              const founderText = profile.founderTxt || `I build.
I learn by making things real.
I care about the difference between a demo and a system.
I prefer evidence over exaggerated claims.

— Ayush Vishwakarma`;
              printOutput(`
<span class="cmd-accent">=== founder.txt ===</span>
${escapeHtml(founderText)}
`);
            } else if (!file) {
              printOutput('<span class="cmd-error">usage: cat [bio.txt | founder.txt]</span>');
            } else {
              printOutput(`<span class="cmd-error">cat: ${escapeHtml(file)}: No such file in working directory</span>`);
            }
            break;
          }

          case 'contact': {
            printOutput(`
<span class="cmd-accent">Reach Ayush Vishwakarma:</span>
  <span class="cmd-highlight">Email:</span>    <a href="mailto:${escapeHtml(identity.email || '')}" style="color:#58a6ff;">${escapeHtml(identity.email || '')}</a>
  <span class="cmd-highlight">GitHub:</span>   <a href="${escapeHtml(identity.github || '')}" target="_blank" style="color:#58a6ff;">${escapeHtml(identity.github || '')}</a> (${escapeHtml(identity.githubHandle || '')})
  <span class="cmd-highlight">LinkedIn:</span> <a href="${escapeHtml(identity.linkedin || '')}" target="_blank" style="color:#58a6ff;">${escapeHtml(identity.linkedin || '')}</a>
  <span class="cmd-highlight">Location:</span> ${escapeHtml(identity.location || 'Pune, India')} (IST / UTC+5:30)
`);
            break;
          }

          case 'theme': {
            const requestedTheme = (args[0] || '').toLowerCase();
            const validThemes = ['day', 'night', 'cyber'];
            if (!validThemes.includes(requestedTheme)) {
              printOutput(`<span class="cmd-error">Invalid theme "${escapeHtml(requestedTheme)}". Options: day, night, cyber</span>`);
            } else {
              document.documentElement.setAttribute('data-theme', requestedTheme);
              try {
                localStorage.setItem('ayush_os_theme', requestedTheme);
              } catch (e) {}

              // Update topbar theme buttons if present
              document.querySelectorAll('.theme-btn').forEach(btn => {
                if (btn.getAttribute('data-theme-set') === requestedTheme) {
                  btn.classList.add('active');
                } else {
                  btn.classList.remove('active');
                }
              });

              if (window.SoundEngine && typeof window.SoundEngine.themeSwitch === 'function') {
                window.SoundEngine.themeSwitch();
              }
              printOutput(`<span class="cmd-response">Theme updated to </span><span class="cmd-accent">${requestedTheme}</span>.`);
            }
            break;
          }

          case 'echo': {
            printOutput(`<span class="cmd-response">${escapeHtml(argString)}</span>`);
            break;
          }

          case 'clear': {
            outputEl.innerHTML = '';
            break;
          }

          default: {
            printOutput(`<span class="cmd-error">command not found: ${escapeHtml(command)}. Type <span class="cmd-accent">help</span> for available commands.</span>`);
            break;
          }
        }
      }

      // Handle Keydown on input
      inputEl.addEventListener('keydown', (e) => {
        // Trigger typing sound on standard typing keys
        if (!['Enter', 'ArrowUp', 'ArrowDown', 'Tab', 'Escape', 'Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
          if (window.SoundEngine && typeof window.SoundEngine.typing === 'function') {
            window.SoundEngine.typing();
          }
        }

        if (e.key === 'Enter') {
          e.preventDefault();
          const cmd = inputEl.value;
          if (cmd.trim()) {
            commandHistory.push(cmd);
            historyIndex = commandHistory.length;
          }
          inputEl.value = '';
          handleCommand(cmd);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (commandHistory.length > 0) {
            if (historyIndex > 0) historyIndex--;
            inputEl.value = commandHistory[historyIndex] || '';
            // Move cursor to end
            setTimeout(() => {
              inputEl.selectionStart = inputEl.selectionEnd = inputEl.value.length;
            }, 0);
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (commandHistory.length > 0) {
            if (historyIndex < commandHistory.length - 1) {
              historyIndex++;
              inputEl.value = commandHistory[historyIndex];
            } else {
              historyIndex = commandHistory.length;
              inputEl.value = '';
            }
          }
        }
      });

      // Initial focus
      setTimeout(() => {
        inputEl.focus();
        scrollToBottom();
      }, 50);
    }
  };

  // Expose globally on window
  if (typeof window !== 'undefined') {
    window.TerminalApp = TerminalApp;
  }

  // CommonJS export if applicable
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TerminalApp;
  }
})(typeof window !== 'undefined' ? window : this);
