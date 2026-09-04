declare module "jsonwebtoken" {
  export interface SignOptions {
    expiresIn?: string | number;
  }

  interface JsonWebToken {
    sign(payload: object, secret: string, options?: SignOptions): string;
    verify(token: string, secret: string): object | string;
  }

  const jwt: JsonWebToken;
  export default jwt;
}
