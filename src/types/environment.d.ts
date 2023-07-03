declare namespace NodeJS {
  export interface ProcessEnv {
    readonly DB_URL: string;
    readonly FACEBOOK_CLIENT: string;
    readonly FACEBOOK_SECRET: string;
    readonly GOOGLE_CLIENT: string;
    readonly GOOGLE_SECRET: string;
    readonly NEXTAUTH_SECRET: string;
    readonly NEXTAUTH_URL_INTERNAL: string;
    readonly NEXTAUTH_URL: string;
    readonly NEXT_PUBLIC_PAYPAL_CLIENT: string;
    readonly NEXT_PUBLIC_PAYPAL_CLIENT_LIVE: string;
    readonly NEXT_PUBLIC_PAYPAL_SECRET: string;
    readonly NEXT_PUBLIC_PAYPAL_SECRET_LIVE: string;
    readonly NEXT_PUBLIC_PAYPAL_CLIENT_ID: string;
    readonly RECAPTCHA_KEY: string;
    readonly RECAPTCHA_SECRET: string;
    readonly ROOT_DIR: string;
    readonly TWITTER_CLIENT: string;
    readonly TWITTER_SECRET: string;
  }
}
