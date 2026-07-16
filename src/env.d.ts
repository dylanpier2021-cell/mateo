/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** GoHighLevel Inbound Webhook URL — receives lead + consent payloads. */
  readonly PUBLIC_GHL_INBOUND_WEBHOOK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
