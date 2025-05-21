import { NextFunction, Request, Response, Router } from "express";
import { ValidationChain } from "express-validator";
import AuthHandlers from "./auth-handlers";
import FormHandler, { FormHandlerMutiples } from "./form-handlers";
import ValidationHandler from "./validation-handler";

type Wrapper = ((router: Router) => void);

type Handler = (
    req: Request,
    res: Response,
    next: NextFunction
) => any;

type Route = {
    path: string;
    method: string;
    validators?: ValidationChain[];
    authenticate?: boolean;
    authenticateEnterpriseUser?: boolean;
    authenticateViaQuery?: boolean;
    authenticateEnterpriseUserViaQuery?: boolean;
    authenticateResetPasswordEnterpriseUser?: boolean;
    authorized_roles?: string[];
    form_data?: boolean;
    form_data_multiple_file?: boolean;
    handler: Handler | Handler[];
    camDigiKeyRoles?: string[];
    authorizeApps?: string[];
    allowFromOrigin?: boolean;
    authenticationRefreshToken?: boolean;
    authenticationRefreshTokenEnterpriseUser?: boolean;
    authenticationBankToken?: boolean;
    authNSSFToken?: boolean;
    authenticateFile?: boolean;
};

export const applyMiddleware = (middleware: Wrapper[], router: Router) => {
    for (const f of middleware) {
        f(router);
    }
};

export const applyRoutes = (basePath: String, routes: Route[], router: Router) => {
    for (const route of routes) {
        const { method,
            path,
            validators,
            authenticate,
            authenticateEnterpriseUser,
            authenticateViaQuery,
            authenticateEnterpriseUserViaQuery,
            authenticateResetPasswordEnterpriseUser,
            authorized_roles,
            form_data,
            form_data_multiple_file,
            handler,
            authorizeApps,
            allowFromOrigin,
            authenticationRefreshToken,
            authenticationRefreshTokenEnterpriseUser,
            authNSSFToken,
            authenticateFile
        } = route;

        let middleware = [];
        middleware.push(basePath + path);

        if (authNSSFToken) {
            middleware.push(new AuthHandlers().authorizeNSSFToken());
        }

        if (authenticateFile) {
            middleware.push(new AuthHandlers().authenticateFile);
        }

        if (authenticate) {
            middleware.push(new AuthHandlers().authenticateJWT);
        }

        if (authenticationRefreshToken) {
            middleware.push(new AuthHandlers().authenticateJWTRefreshToken);
        }

        if (authenticateViaQuery) {
            middleware.push(new AuthHandlers().authenticateJWTViaQuery);
        }

        if (authenticateEnterpriseUser) {
            middleware.push(new AuthHandlers().authenticateEnterpriseUserJWT);
        }

        if (authenticationRefreshTokenEnterpriseUser) {
            middleware.push(new AuthHandlers().authenticateJWTRefreshTokenEnterpriseUser);
        }

        if (authenticateEnterpriseUserViaQuery) {
            middleware.push(new AuthHandlers().authenticateJWTViaQueryEnterpriseUser);
        }

        if (authenticateResetPasswordEnterpriseUser) {
            middleware.push(new AuthHandlers().authenticateJWTResetPasswordTokenEnterpriseUser);
        }

        if (authorized_roles) {
            middleware.push(new AuthHandlers().authorize(authorized_roles));
        }

        if (form_data) {
            middleware.push(new FormHandler().parse);
        }

        if (form_data_multiple_file) {
            middleware.push(new FormHandlerMutiples().parse);
        }

        if (allowFromOrigin) {
            middleware.push(new AuthHandlers().originAuthorize());
        }

        if (validators) {
            middleware.push(validators, new ValidationHandler().validate);
        }

        middleware.push(handler);
        (router as any)[method](...middleware);
    }
};