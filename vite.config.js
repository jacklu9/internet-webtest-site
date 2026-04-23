import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isGitHubPagesBuild = process.env.GITHUB_PAGES === 'true'
const explicitBasePath = process.env.VITE_BASE_PATH

export default defineConfig({
  base: explicitBasePath || (isGitHubPagesBuild && repoName ? `/${repoName}/` : '/'),
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
