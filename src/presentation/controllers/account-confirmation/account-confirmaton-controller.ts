import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest, ok, serverError } from '../../helpers/http/http-helper'
import { MissingParamError, InvalidError } from '../../errors'
import { AccountVerify } from '../../../domain/usecases/verify-account'

export class AccountConfirmationController implements Controller {
  constructor (private readonly accountConfirmation: AccountVerify) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id, token } = httpRequest.query
      if (!id) {
        return badRequest(new MissingParamError('id'))
      }
      if (!token) {
        return badRequest(new MissingParamError('token'))
      }
      const isConfirmated = await this.accountConfirmation.confirm(id, token)
      if (!isConfirmated) {
        return badRequest(new InvalidError())
      }
      return ok({ Message: 'Confirmation Accepted' })
    } catch (error) {
      return serverError(error)
    }
  }
}