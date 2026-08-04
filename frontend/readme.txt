# 1. Create the React app using Vite inside the 'frontend' folder
npm create vite@latest frontend 

# 2. Move into the frontend folder
cd frontend
npm run dev

------------------------------------------------------------
npm install tailwindcss @tailwindcss/vite

    Configure the Vite plugin
    Add the @tailwindcss/vite plugin to your Vite configuration.

    In vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})

Import Tailwind CSS : Add an @import to your CSS file that imports Tailwind CSS.
@import "tailwindcss";


-------------------------------------------------------------
# 3. Install core dependencies
npm install axios react-router-dom formik yup react-toastify recharts lucide-react

# 4. Install Tailwind CSS & PostCSS tooling as dev dependencies
npm install -D tailwindcss postcss autoprefixer

# 5. Initialize Tailwind CSS config files
npx tailwindcss init -p

-------------------------------------------------------------

