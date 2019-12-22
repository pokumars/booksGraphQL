import React, { useState } from 'react'

const Authors = ({show, result, editAuthor}) => {
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  if (!show) {
    return null
  }
  if ( result.loading ) return <div>loading ...</div>;
  if ( result.error ) return `Error! ${ result.error.message}`;

  const submitBirthYear = async (event) => {
    event.preventDefault();
    console.log('submitBirthYear...', birthYear, name)
    //const setBornTo = birthYear
    await editAuthor({
      variables: { name, setBornTo:birthYear }
    })

    console.log('submitBirthYear...')

    setName('')
    setBirthYear('')
  }
  
  const authors =result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      
      <h2> Change birth year</h2>
      <form onSubmit={submitBirthYear}>
      <label>
          Name
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {authors.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
          </select>
        </label>
        <div>
          born
          <input
            type='number'
            value={birthYear}
            onChange={({ target }) => setBirthYear(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default Authors