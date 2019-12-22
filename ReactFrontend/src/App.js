import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from '@apollo/react-hooks'

const ALL_AUTHORS = gql`
{
  allAuthors {
    name
    id
    born
    bookCount
  }
}`;

const ALL_BOOKS = gql`
{
  allBooks {
    title
    author
    genres
    published
  }
}`;

const ADD_BOOK =gql`
  mutation addBook($title: String!, $author: String!, $published: String!, $genres: [String!]!) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author
      published
      genres
    }
  }
`;

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [page, setPage] = useState('authors')
  const allAuthors= useQuery(ALL_AUTHORS);
  const allBooks = useQuery(ALL_BOOKS);

  const handleError = (error) => {
    console.log(error);
    /*error.graphQLErrors[0]&& setErrorMessage(error.graphQLErrors[0].message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);*/
  };

  const [addBook] = useMutation(ADD_BOOK, {
    onError: handleError,
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }]
  });

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>
      {errorMessage &&
        <div style={{color: 'red'}}>
          {errorMessage}
        </div>
      }
     
      <Authors
       show={page === 'authors'}
       result={allAuthors}
      />
      

      <Books
        show={page === 'books'}
        result={allBooks}
      />

      <NewBook
        show={page === 'add'}
        addBook={addBook}
      />

    </div>
  )
}

export default App