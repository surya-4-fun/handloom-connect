// Ambient type declarations for Supabase Edge Functions (Deno runtime)
// Provides editor autocompletion and eliminates TypeScript errors when viewing Edge Functions in IDEs.

declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    delete(key: string): void;
    toObject(): Record<string, string>;
  }

  export const env: Env;

  export function serve(
    handler: (req: Request) => Response | Promise<Response>,
    options?: { port?: number; onListen?: () => void }
  ): void;
}

declare module "https://deno.land/std@0.177.0/http/server.ts" {
  export function serve(
    handler: (req: Request) => Response | Promise<Response>,
    options?: { port?: number; onListen?: () => void }
  ): void;
}

declare module "https://*" {
  const content: any;
  export default content;
  export const serve: any;
  export const createClient: any;
  export const corsHeaders: any;
}

declare module "jsr:*" {
  const content: any;
  export default content;
}

declare module "npm:*" {
  const content: any;
  export default content;
}
