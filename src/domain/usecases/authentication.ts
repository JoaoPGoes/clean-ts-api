export interface AuthenticationModel {
  email: string
  password: string
}

export interface Authetication {
  auth (authentication: AuthenticationModel): Promise<string>
}
