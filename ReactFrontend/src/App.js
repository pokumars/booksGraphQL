import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { gql } from 'apollo-boost'
import { ApolloConsumer, Query } from 'react-apollo'
import { useQuery } from '@apollo/react-hooks'

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

const App = () => {
  const [page, setPage] = useState('authors')
  const allAuthors= useQuery(ALL_AUTHORS);
  const allBooks = useQuery(ALL_BOOKS);

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>
     
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
      />

    </div>
  )
}

export default App