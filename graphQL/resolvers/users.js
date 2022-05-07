const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const { validateLoginInput, validateRegisterInput } = require('../../util/validators');


const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');
const Organization = require('../../models/Organization');

function generateToken(user) {
    const token = jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h'});
    return token;
}

module.exports = {
    Query: {
        async getUsers(){
            try{
                const users = await User.find().sort({ createdAt: -1 });                
                return users;
            } catch(err) {
                throw new Error(err);
            }            
        }
    },
    Mutation: {        
        async login(_, {username, password}){
            const {errors, valid} = validateLoginInput(username, password);

            if(!valid) {
                errors.general = "Invalid credentials, try again";
                throw new UserInputError("Invalid credentials", {errors});
            }

            const user = await User.findOne({username});
            if(!user){
                errors.general = 'User not found';
                throw new UserInputError('Wrong credentials', {errors});
            } 
            const match = await bcrypt.compare(password, user.password);
            if(!match){
                errors.general = "Wrong credentials";
                throw new UserInputError("Wrong credentials", {errors});
            }
            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,                
                token,
                orgName: user.orgName
            };


        },
        async register(
            _, 
            {registerInput : {username, email, password, confirmPassword, orgName}}
            , 
            context, 
            info
            ){
            //TODO: Validate user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword, orgName);
            if(!valid){
                throw new UserInputError('Errors', {errors})
            }
            //TODO: Make sure user doesn't exist
            const user = await User.findOne({ username });
            
            if(user){
                throw new UserInputError('Username is taken', {
                    errors: {
                      username: 'This username is taken'
                    }
                })
            }                        
            password = await bcrypt.hash(password, 12);

            let theOrg = await Organization.findOne({ orgName });
            if (!theOrg) {                
                const newOrg = new Organization({
                    orgName,
                    createdAt: new Date().toISOString()
                })
                theOrg = await newOrg.save();
            }
           
            const newUser = new User({
                email,
                username,
                password,
                confirmPassword,
                orgName,
                createdAt: new Date().toISOString()
            });

            
            const res = await newUser.save();
           
            theOrg.users.push(newUser);
            await theOrg.save();
            
            // const token = jwt.sign({
            //     id: res.id,
            //     email: res.email,
            //     username: res.username
            // }, SECRET_KEY, { expiresIn: '1h'});
            const token = generateToken(res)

            return {
                ...res._doc,
                id: res._id,                
                token
            };
        } 
    }
}