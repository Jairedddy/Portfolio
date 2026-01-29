import { createRoot } from "react-dom/client";
import App from './App.tsx'
import './index.css'
import { showConsoleMessage, setupConsoleCommands } from './lib/consoleMessage.ts'

// Show designer console message
showConsoleMessage();
setupConsoleCommands();

createRoot(document.getElementById("root")!).render(<App />);