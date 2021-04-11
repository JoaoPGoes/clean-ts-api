import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, unauthorized } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse, EmailValidator, Authetication } from './login-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authetication

  constructor (emailValidator: EmailValidator, authentication: Authetication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const acessToken = await this.authentication.auth(email, password)
      if (!acessToken) {
        return unauthorized()
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
