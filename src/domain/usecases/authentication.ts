export interface Authetication {
  auth (email: string, password: string): Promise<string>
}
