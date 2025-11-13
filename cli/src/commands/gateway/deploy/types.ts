export interface DeployCommandFlags {
  repo?: string;
  verbose?: boolean;
}

export interface D1Database {
  binding: string;
  database_name: string;
  database_id: string;
  migrations_dir?: string;
}

export interface KVNamespace {
  binding: string;
  id: string;
}

export interface WranglerConfig {
  kv_namespaces?: KVNamespace[];
  d1_databases?: D1Database[];
  [key: string]: unknown;
}

export interface CloudflareResources {
  d1DatabaseId: string;
  kvNamespaceId: string;
  accountId?: string;
}

export interface JwtKeyPair {
  privateKey: string;
  publicKey: string;
}

export interface SecretInfo {
  name: string;
  type: string;
}
