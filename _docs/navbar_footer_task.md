# NavBar + Footer SSR Task

## What we're doing

Adding `NavBar` and `Footer` to `frontend/src/app/layout.tsx`. They exist as components but were never wired into the App Router layout.

Goal is SSR — components will be `"use client"` (so they hydrate for interactivity) but still render as HTML on first load.

---

## Progress

### Done
- `frontend/src/components/NavBar.tsx` — added `"use client"`, swapped imports:
  - `import { Link, useNavigate } from 'react-router-dom'` → `import Link from 'next/link'` + `import { useRouter } from 'next/navigation'`

### Still TODO

1. **Fix `useNavigate` call sites in `NavBar.tsx`**
   - `const navigate = useNavigate()` → `const router = useRouter()`
   - `logout(() => navigate('/'))` → `logout(() => router.push('/'))`

2. **Update `frontend/src/components/Footer.tsx`**
   - Add `"use client"` at top
   - `import { Link } from 'react-router-dom'` → `import Link from 'next/link'`

3. **Create `frontend/src/app/providers.tsx`**
   - `AuthProvider` is not in the layout at all — `useAuth` will crash without it
   ```tsx
   "use client";
   import { AuthProvider } from '@/context/AuthContext';
   export default function Providers({ children }: { children: React.ReactNode }) {
     return <AuthProvider>{children}</AuthProvider>;
   }
   ```

4. **Update `frontend/src/app/layout.tsx`**
   ```tsx
   import Providers from './providers';
   import NavBar from '@/components/NavBar';
   import Footer from '@/components/Footer';
   // ...
   <html lang="en">
     <body>
       <Providers>
         <NavBar />
         {children}
         <Footer />
       </Providers>
     </body>
   </html>
   ```

---

## Key facts

- `next.config.ts` has `images.disableStaticImages: true` — image imports are URL strings, no `.src` needed
- `AuthContext` uses `useState`/`useEffect`/`localStorage` — must stay client-side
- No existing `Providers` component — create fresh
- All page components are already `"use client"` — layout change won't break them
