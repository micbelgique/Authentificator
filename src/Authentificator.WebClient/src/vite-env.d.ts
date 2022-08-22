/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_IDENTITY_CLIENT_ID: string
  readonly VITE_BLOB_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

