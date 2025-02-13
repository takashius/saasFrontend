interface ImportMetaEnv {
  readonly VITE_API_DEBUG: string
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
