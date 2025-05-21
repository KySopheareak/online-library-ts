import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import moment from "moment";
import passport from "passport";
import ConfigModel from "../models/config.model";
import tokenModel from "../models/token.model";
import userModel from "../models/user.model";
import "../utils/auth-handler";
import * as Constants from "../utils/constants";


dotenv.config();
export default class AuthHandlers {
    //! To Authenticate User using Access Token
    public authenticateJWT(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt-access-token", { session: false }, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(401).json({ status: 401, message: err.stack });
            }
            if (!user) {
                return res.status(401).json({ status: 401, message: "Unauthorized" });
            } else if (!user.is_active) {
                return res.json({ status: 401, message: "User is no active" });
            } else {
                req.loginUser = user;

                return next();
            }
        })(req, res, next);
    }

    //! To Authenticate Enterprise User using Access Token
    public authenticateEnterpriseUserJWT(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt-access-token-enterprise-user", { session: false }, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(401).json({ status: 401, message: err.stack });
            }
            if (!user) {
                return res.status(401).json({ status: 401, message: "Unauthorized" });
            } else if (!user.is_active) {
                return res.json({ status: 401, message: "User is no active" });
            } else {
                req.loginUser = user;

                return next();
            }
        })(req, res, next);
    }

    //! To Authenticate User Getting File (Mobile)
    public authenticateFile(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt-access-token-query-parameter", { session: false }, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(401).json({ status: -1, message: err.stack });
            }
            if (!user) {
                return res.status(401).json({ status: 0, message: "Unauthorized" });
            } else if (!user.is_active) {
                return res.json({ status: 0, message: "User is no active" });
            } else {
                req.loginUser = user;
                return next();
            }
        })(req, res, next);
    }

    //! To Authorize role of user
    public authorize(role_options: string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            if (role_options.length === 0 || role_options.includes(Constants.ROLES.ALL)) {
                return next();
            }
            let loginUser = req.loginUser as any;
            if (!loginUser) {
                return res.json({ status: 401, message: "Unauthorized permission." });
            }

            if (!loginUser.role) {
                return res.json({ status: 401, message: "Unauthorized permission." });
            }

            let role_name = loginUser.role.name;
            if (!role_options.includes(role_name)) {
                return res.json({ status: 401, message: "Unauthorized permission." });
            }

            return next();
        };
    }

    //! To Authorize nssf old system
    public authorizeNSSFToken() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {

                let tokenBearer = req.headers["authorization"];

                if (!tokenBearer || !tokenBearer.startsWith("Bearer ")) {
                    return res.json({ status: 401, message: "Invalid token" });
                }

                let token = tokenBearer.slice("Bearer ".length, tokenBearer.length);

                if (!token) {
                    return res.json({ status: 401, message: "Unauthorized permission." });
                }

                let t = await tokenModel.findOne({ token: token });
                let user = await userModel.findOne({ username: t?.id });

                if (!user) {
                    return res.json({ status: 401, message: "Unauthorized permission." });
                }

                // check expired
                if (moment().isAfter(moment(t?.token_expired_in))) {
                    return res.json({ status: 402, message: "Token is expired" });
                }

                req.loginUser = t;
                return next();

            } catch (error) {
                return res
                    .json({ status: 401, message: "Unauthorized permission." });
            }
        };
    }
    
    public originAuthorize() {
        return async (req: Request, res: Response, next: NextFunction) => {
            let origin = req.headers.origin;

            const { NODE_ENV = "development" } = process.env;
            if (NODE_ENV == "development") {
                return next();
            }

            if (!origin)
                return res
                    .json({ status: 401, message: "Cross-Origin is not allow." });

            let config = await ConfigModel.findOne({
                name: "allow_origin",
                value: origin,
            });

            if (config) return next();

            return res
                .json({ status: 401, message: "Cross-Origin is not allow." });
        };
    }

    //! To Authenticate User Using Refresh Token
    public authenticateJWTRefreshToken(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt-refresh-token", { session: false }, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(402).json({ status: -1, message: err.stack });
            }
            if (!user) {
                return res.status(402).json({ status: 402, message: "Unauthorized" });
            } else if (!user.is_active) {
                return res.json({ status: 401, message: "User is no active" });
            } else {
                req.loginUser = user;
                return next();
            }
        })(req, res, next);
    }

    //! To Authenticate Enterprise User Using Refresh Token
    public authenticateJWTRefreshTokenEnterpriseUser(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt-refresh-token-enterprise-user", { session: false }, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(402).json({ status: -1, message: err.stack });
            }
            if (!user) {
                return res.status(402).json({ status: 402, message: "Unauthorized" });
            } else if (!user.is_active) {
                return res.json({ status: 401, message: "User is no active" });
            } else {
                req.loginUser = user;
                return next();
            }
        })(req, res, next);
    }

    //! To Authenticate User using Access Token via Query of URL
    public authenticateJWTViaQuery(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt-access-token-via-query", { session: false }, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(401).json({ status: 401, message: err.stack });
            }
            if (!user) {
                return res.status(401).json({ status: 401, message: "Unauthorized" });
            } else if (!user.is_active) {
                return res.json({ status: 401, message: "User is no active" });
            } else {
                req.loginUser = user;

                return next();
            }
        })(req, res, next);
    }

    //! To Authenticate User using Access Token via Query of URL
    public authenticateJWTViaQueryEnterpriseUser(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt-access-token-via-query-enterprise-user", { session: false }, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(401).json({ status: 401, message: err.stack });
            }
            if (!user) {
                return res.status(401).json({ status: 401, message: "Unauthorized" });
            } else if (!user.is_active) {
                return res.json({ status: 401, message: "User is no active" });
            } else {
                req.loginUser = user;

                return next();
            }
        })(req, res, next);
    }


    //! To Authenticate Enterprise User Using Refresh Token
    public authenticateJWTResetPasswordTokenEnterpriseUser(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt-reset-password-enterprise-user-token", { session: false }, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(402).json({ status: -1, message: err.stack });
            }
            if (!user) {
                return res.status(402).json({ status: 402, message: "Unauthorized" });
            } else if (!user.is_active) {
                return res.json({ status: 401, message: "User is no active" });
            } else {
                req.loginUser = user;
                return next();
            }
        })(req, res, next);
    }
}
