import asyncHandler from 'express-async-handler';
import express, { Request, Response, Router as ExpressRouter } from 'express';
import ResponseInterface from '@interfaces/response.interface';
import Controller from '@core/Controller';

export default class Router {
  private router: ExpressRouter;

  constructor() {
    this.router = express.Router();
  }

  protected get(
    path: string,
    controllerClass: typeof Controller,
    method: string,
  ): ExpressRouter {
    return this.router.get(
      path,
      asyncHandler(async (req: Request, res: Response) => {
        const controllerInstance = new controllerClass(req, res);
        const instanceProto = Object.getPrototypeOf(controllerInstance);
        const isMethodExist = Object.keys(instanceProto).includes(method);

        if (isMethodExist) {
          return (controllerInstance as any)[method]();
        } else {
          // if method not found
          const response: ResponseInterface = {
            status_code: 404,
            message: 'Method related to endpoint not found',
            result: null,
          };
          return res.status(404).json(response);
        }
      }),
    );
  }

  protected error(): (
    err: Error,
    req: Request,
    res: Response,
    next: VoidFunction,
  ) => Response {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (err: Error, req: Request, res: Response, next: VoidFunction) => {
      const response: ResponseInterface = {
        status_code: 500,
        message: err.message,
        result: null,
      };
      return res.status(500).json(response);
    };
  }

  protected notFound(): (
    req: Request,
    res: Response,
    next: VoidFunction,
  ) => Response {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (req: Request, res: Response, next: VoidFunction) => {
      const response: ResponseInterface = {
        status_code: 404,
        message: 'Endpoint not found',
        result: null,
      };
      return res.status(404).json(response);
    };
  }
}
