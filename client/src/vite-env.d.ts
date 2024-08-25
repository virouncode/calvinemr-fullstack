/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_XANO_BASE_URL: string;
  readonly VITE_CLINIC_NAME: string;
  readonly VITE_PDF_EMBED_API_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
