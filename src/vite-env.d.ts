/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string;
  readonly VITE_SERVER_URL: string;
  readonly VITE_CORE_SERVER_URL: string;
  readonly VITE_SERVICE_PERMISSION_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
