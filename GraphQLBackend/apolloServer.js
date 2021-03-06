const { ApolloServer, gql, UserInputError } = require('apollo-server')
const uuid = require('uuid/v1')

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * It would be more sensible to associate book and the author by saving 
 * the author id instead of the name to the book.
 * For simplicity we however save the author name.
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const typeDefs = gql`
  type Book {
    title: String!
    published: String!
    author: String!
    id: ID!
    genres: [String!]!
  }
  type Author {
    name: String!
    id: ID!
    born: String
    bookCount: Int!
  }
  type Query {
    hello: String!
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
 
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: String!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: String!
    ): Author
  }
`


const resolvers = {
  Query: {
    hello: () => { return "world" },
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allAuthors: () => {
      //console.log(authors);
      console.log('all authors',new Date().toISOString())
      return authors
    },
    allBooks: (root, args) => {
      if(!args.author && !args.genre){
        console.log('all books')
        return books
      }

      const byAuthor = (book) => book.author === args.author;
      const byGenre = (book) => book.genres.includes(args.genre);
      
      if(args.author && args.genre){
        let b = books.filter(byGenre)
        console.log(b.filter(byAuthor))
        return b.filter(byAuthor)
      }
      else if (args.author) {
        console.log("by author")
        console.log(books.filter(byAuthor))
        return books.filter(byAuthor);
        
      }
      else if(args.genre) {
        console.log("by genre")
        console.log(books.filter(byGenre))
        return books.filter(byGenre);
      }
            
    }
  },
  Author: {
    bookCount: (root) => {
      const authorsBooks =books.filter(b => b.author === root.name)
      //console.log(authorsBooks);
      return authorsBooks.length
    }
  },
  Mutation: {
    addBook: (root, args) => {
      if (books.find(b => b.title === args.title)) {
        throw new UserInputError('book title must be unique', {
          invalidArgs: args.title,
        });
      }

      if (!authors.find(a => args.author=== a.name)){
        //add author to authors if they dont exist yet
        console.log('author not in list yet');
        const newAuthor = {
          name: args.author,
          id: uuid()
        }
        authors = authors.concat(newAuthor);
      };
      const newBook = { ...args, id: uuid() }
      books = books.concat(newBook)
      console.log(newBook);
      return newBook
    },
    editAuthor: (root, args) => {
      const authorToUpdate = authors.find(a => a.name === args.name);
      
      if(authorToUpdate) {//update
        const updatedAuthor = {...authorToUpdate, born: args.setBornTo}
        authors = authors.map((a) => a !==authorToUpdate ? a: updatedAuthor);
        console.log('edit author',updatedAuthor)
        return updatedAuthor
      }
      return null
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})