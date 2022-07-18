const express = require('express');
// Import ApolloServer
const { ApolloServer } = require('apollo-server-express');

// Import the typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
// Create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers
});
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  // Integrate the Apollo server with the Express application as middleware
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      // Log where we can go to tet our GQL API
      console.log(`Use GraphQl at http://localhost:${PORT}${server.graphqlPath}`)
    })
  })
};

// Call async function to start the server
startApolloServer(typeDefs, resolvers);