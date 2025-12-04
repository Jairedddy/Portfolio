# Jai Reddy – Portfolio

A high-polish, cyberpunk-inspired portfolio built with React, TypeScript, and advanced motion libraries. The site showcases projects, skills, and a fully wired contact form that delivers messages directly to the inbox via a Vercel Serverless Function.

## Highlights
- **Immersive Hero + Navigation** – Responsive layout with Lenis-powered smooth scrolling, GSAP timelines, and Framer Motion micro-interactions tied to the section theme.
- **Interactive About (“My Journey”)** – Animated stats counters, scroll-synced timeline, and dynamic neon progress column.
- **Skills Matrix & Projects Gallery** – Data-driven sections with category filtering, neon badges, and hover states tuned for both desktop and touch.
- **Contact Workflow** – Validated React form that posts to `/api/contact`, a serverless function that relays the message through Nodemailer/SMTP.
- **Optimized UX** – Tailwind CSS for styling, code-splitting via Vite, and reusable utilities/hooks (`useLenis`, `useAnime`, `useToast`, etc.).

## Tech Stack
| Layer | Tools |
| --- | --- |
| UI + State | React 18, TypeScript, React Query, Framer Motion, anime.js |
| Styling | Tailwind CSS, custom neon tokens, Radix UI Primitives |
| Animation + 3D | GSAP + ScrollTrigger, Lenis, Three.js scene, Particle overlays |
| Tooling | Vite, ESLint, Prettier, pnpm/npm |
| Backend | Vercel Serverless Function (`api/contact.ts`) with Nodemailer SMTP relay |

## Project Structure
```
├─ api/
│  └─ contact.ts          # Vercel serverless function for contact form
├─ public/
│  ├─ Jai-Reddy-Resume-20251205.pdf
│  └─ …assets
├─ src/
│  ├─ components/         # Hero, About, Skills, Projects, Contact, etc.
│  ├─ data/               # Skills + timeline data sources
│  ├─ hooks/              # useLenis, useAnime, toast helpers
│  ├─ pages/Index.tsx     # Landing page composition + scroll logic
│  └─ App.tsx / main.tsx  # React entry
├─ package.json
├─ tailwind.config.ts
├─ vite.config.ts
└─ README.md
```

## Environment Variables
Create a `.env` in the workspace root (or configure these in Vercel). Use the template below (`.env.example` is included in the repo):

```env
# Frontend (optional override – defaults to /api/contact)
VITE_CONTACT_ENDPOINT=/api/contact

# Backend mailer (required in Vercel > Settings > Environment Variables)
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=your-smtp-user@example.com
SMTP_PASS=your-app-password
TO_ADDRESS=destination@example.com
CLIENT_ORIGIN=http://localhost:8090
```

> **Tip:** When running locally with `vercel dev`, the serverless function reads the `.env`. On production, add the same keys under the Vercel project settings.

## Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Local development**
   ```bash
   npm run dev
   ```
   Vite serves the React app on [http://localhost:8090](http://localhost:8090). The contact form will call `/api/contact`; use `vercel dev` if you want to exercise the serverless function locally.
3. **Build**
   ```bash
   npm run build
   ```
4. **Preview production build**
   ```bash
   npm run preview
   ```

## Contact Function
- Located at `api/contact.ts` and deployed automatically on Vercel under `/api/contact`.
- Validates `name`, `email`, `subject`, `message`, enforces CORS, and relays via Nodemailer using the SMTP creds above.
- If you need to test locally without `vercel dev`, you can hit the endpoint after deploying/staging on Vercel, or temporarily run a Node script that imports the handler.

## Deployment (Vercel)
1. Connect the repository to Vercel.
2. Set the environment variables (see `.env` template).
3. Push to `main` (or any branch). Vercel will:
   - Build the Vite app.
   - Deploy `/api/contact` as a serverless function.
4. Add a custom domain or use the auto-generated preview URL.

## Scripts
| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Create production build (`dist/`) |
| `npm run preview` | Preview production output locally |
| `npm run lint` | Run ESLint over the project |

## Customization Notes
- **Resume:** Replace `public/Jai-Reddy-Resume-20251205.pdf` and the nav button will download the new file.
- **Data Sources:** Update `src/data/skillCategories.ts` and timeline arrays to change content without touching layout logic.
- **Theme:** Tailwind tokens live in `src/index.css` / `tailwind.config.ts`; adjust neon colors or fonts there.

## License & Contact
This project is released under the MIT License.  
Questions or collaboration ideas? Reach out via:
- **Email:** jaishuk.reddy7@gmail.com
- **LinkedIn:** [linkedin.com/in/jaishuk-reddy-671777217](https://linkedin.com/in/jaishuk-reddy-671777217)
- **GitHub:** [github.com/Jairedddy](https://github.com/Jairedddy)
- **Twitter:** [@jaishukreddy7](https://twitter.com/jaishukreddy7)

---
Crafted with React, GSAP, Lenis, and plenty of neon
