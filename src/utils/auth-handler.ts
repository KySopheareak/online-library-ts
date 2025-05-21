// import dotenv from 'dotenv';
// import passport from 'passport';
// import { ExtractJwt, Strategy as JwtStrategy, VerifiedCallback } from 'passport-jwt';
// import UserModel from '../models/user.model';
// dotenv.config();

// const access_token_jwt_opts = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: process.env.secret
// }
// //! Middleware for Validate Access Token
// passport.use('jwt-access-token', new JwtStrategy(access_token_jwt_opts, async (jwt_payload: any, done: VerifiedCallback) => {
//     try {
//         const user = await UserModel.findById(jwt_payload.id).populate({ path: 'role' })
//         if (user) {
//             return done(null, user);
//         } else {
//             return done(null, false);
//         }
//     } catch (err) {
//         return done(err, false);
//     }
// }));


// const refresh_token_jwt_opts = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: process.env.refresh_token_secret
// }
// //! Middleware for Validate Refresh Token
// passport.use('jwt-refresh-token', new JwtStrategy(refresh_token_jwt_opts, async (jwt_payload: any, done: VerifiedCallback) => {
//     try {
//         const user = await UserModel.findById(jwt_payload.id).populate({ path: 'role' })
//         if (user) {
//             return done(null, user);
//         } else {
//             return done(null, false);
//         }
//     } catch (err) {
//         return done(err, false);
//     }
// }));

// const access_token_jwt_via_query_opts = {
//     jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
//     secretOrKey: process.env.secret
// }
// //! Middleware for Validate Access Token
// passport.use('jwt-access-token-via-query', new JwtStrategy(access_token_jwt_via_query_opts, async (jwt_payload: any, done: VerifiedCallback) => {
//     try {
//         const user = await UserModel.findById(jwt_payload.id).populate({ path: 'role' })
//         if (user) {
//             return done(null, user);
//         } else {
//             return done(null, false);
//         }
//     } catch (err) {
//         return done(err, false);
//     }
// }));