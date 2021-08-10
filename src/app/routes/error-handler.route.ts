import Router from '@core/Router';

export default class ErrorHandlerRoute extends Router {
  route(): Array<any> {
    return [this.notFound(), this.error()];
  }
}
