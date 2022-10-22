/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_STAGE: string
  readonly VITE_REGISTRAR_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}