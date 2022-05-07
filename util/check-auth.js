const { AuthenticationError } = require('apollo-server');

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');


module.exports = (context) => {    
    // context = { ...headers }
    const authHeader = context.req.headers.authorization;
    console.log(`checking auth, what is in header? ${JSON.stringify(authHeader)}`);
    if (authHeader){
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try{
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch (err) {
                console.log(`Auth error?? ${err}`);
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        throw new Error('Authentication token must be Bearer [token]');        
    }
    throw new Error('Authorization token must be provided');
    // throw new Error({name: "AuthorizationError", message: "Authorization token must be provided"});

    
};