import { getCookieFromRequest } from '../utils/getCookie.js';

export function userValidation(req, res, next) {


    const userToken = getCookieFromRequest(req, 'access_token');  

        if (!userToken) {
            console.log('Usuario no autenticado:', userToken);
            console.log('Usuario no autenticado:', userToken);
            res.redirect('/signin');
        }
        else return;
}
