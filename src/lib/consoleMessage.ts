/**
 * Designer Console Message
 * Displays a minimal, aesthetic cyberpunk-style message in the browser console
 */

export const showConsoleMessage = () => {
  // Clear console for clean display
  console.clear();

  // Cyberpunk ASCII art for "JR" - J and R side by side with clear spacing
  // J is on the left, R is on the right - both clearly visible
  const asciiJR = `
██╗   ██████╗ 
██║  ██╔══██╗
██║  ██████╔╝
██║  ██╔══██╗
██║  ██║  ██║
╚═╝  ╚═╝  ╚═╝
  `.trim();

  // Style for ASCII art - neon purple, larger for clarity
  const asciiStyle = `
    font-size: 24px;
    font-family: 'Courier New', 'Consolas', 'Monaco', monospace;
    color: #9333ea;
    line-height: 1.1;
    letter-spacing: 1px;
    font-weight: bold;
  `;

  // Subtitle style - minimal, using Orbitron-inspired styling
  const subtitleStyle = `
    font-size: 11px;
    font-family: 'Courier New', 'Consolas', monospace;
    color: #6b7280;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-weight: 600;
  `;

  // Display ASCII art
  console.log(
    `%c${asciiJR}%c\n%cFULL STACK DEVELOPER • GENAI ENGINEER • CREATIVE TECHNOLOGIST`,
    asciiStyle,
    '',
    subtitleStyle
  );

  // Subtle separator
  console.log(
    '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'color: #00e5ff; opacity: 0.15;'
  );
};

// Helper function for console commands (optional easter egg)
export const setupConsoleCommands = () => {
  (window as any).help = () => {
    console.log(
      `%cAvailable Commands:
%c  help()%c - Show this help message
%c  about()%c - About Jai Reddy
%c  contact()%c - Get contact information
%c  skills()%c - View tech stack`,
      'color: #00e5ff; font-weight: bold;',
      'color: #10b981;',
      'color: #6b7280;',
      'color: #10b981;',
      'color: #6b7280;',
      'color: #10b981;',
      'color: #6b7280;',
      'color: #10b981;',
      'color: #6b7280;'
    );
  };

  (window as any).about = () => {
    console.log(
      `%cAbout Jai Reddy:
%cFull Stack Developer + GenAI Engineer based in Hyderabad, India.
Specializing in React, TypeScript, AI integration, and cyberpunk aesthetics.
Building immersive digital experiences since 2019.`,
      'color: #00e5ff; font-weight: bold;',
      'color: #e5e7eb;'
    );
  };

  (window as any).contact = () => {
    console.log(
      `%cContact Information:
%cEmail: %cjaishuk.reddy7@gmail.com
%cLinkedIn: %chttps://linkedin.com/in/jaishuk-reddy-671777217
%cPortfolio: %chttps://jairedddy.vercel.app/`,
      'color: #00e5ff; font-weight: bold;',
      'color: #e5e7eb;',
      'color: #10b981;',
      'color: #e5e7eb;',
      'color: #10b981;',
      'color: #e5e7eb;',
      'color: #10b981;'
    );
  };

  (window as any).skills = () => {
    console.log(
      `%cTech Stack:
%cFrontend: React, Vue, TypeScript, Tailwind CSS, GSAP, Framer Motion
%cBackend: Python, FastAPI, Flask, Node.js
%cAI/ML: OpenAI, TensorFlow, PyTorch, RAG, Prompt Engineering
%cDesign: Figma, Adobe Suite, Spline, Webflow
%cDevOps: Git, GitHub, Docker, Vercel, Netlify`,
      'color: #00e5ff; font-weight: bold;',
      'color: #9333ea;',
      'color: #00e5ff;',
      'color: #10b981;',
      'color: #f59e0b;',
      'color: #6b7280;'
    );
  };
};
