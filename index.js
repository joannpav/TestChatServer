const { ApolloServer } = require('apollo-server');
const cors = require('cors')
const mongoose = require('mongoose');

const typeDefs = require('./graphQL/typeDefs');
const resolvers = require('./graphQL/resolvers');
// const { MONGODB } = process.env.MONGODB || require('./config.js');
const PORT = process.env.PORT || 5000;

const JiraAPI = require('./api/JiraAPI');

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: false
}


const server = new ApolloServer({
    dataSources: () => ({
        jiraAPI: new JiraAPI()
    }),
    context: ({ req }) =>  ({ req }),        
    typeDefs,
    resolvers,    
    playground: true,
    introspection: true,
});

// server.applyMiddleware({
//     app,
//     cors: false
//   })
  

mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,    
})
.then(() => {        
    return server.listen({ port: PORT })
}).then(res => {
        console.log("mongodb connected");
        console.log(`Server running at ${res.url}`)
}).catch(err => {
    console.log(err);
})