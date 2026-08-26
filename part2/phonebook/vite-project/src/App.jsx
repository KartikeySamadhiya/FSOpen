import { useState , useEffect} from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [infoMessage, setInfoMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
          setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  const handleFilterChange = (e) => setFilter(e.target.value)
  const handleDeletePerson = (id, name) =>{
    if(window.confirm(`Delete ${name}?`)){
      personService
        .remove(id)
        .then( () => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error =>{
          alert(`The contact '${name}' was already deleted from the server`)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const changedPerson = { ...existingPerson, number : newNumber}
      

        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')

            setInfoMessage(`Updated ${returnedPerson.name}'s number`)
            setTimeout(() => setInfoMessage(null), 5000)
          })
      }
      return
    }

    const personObject = {
      name : newName ,
      number : newNumber
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')    // Clear the input fields after adding a new person
          setNewNumber('')
      })

  }

  const personsToShow = filter === '' 
    ? persons 
    : persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} handleDeletePerson={handleDeletePerson}/>
    </div>
  )
}

export default App






/*
App.jsx is the Boss: It owns the master ledger (persons state) and knows how to update it using setPersons.

Persons.jsx is the Display Screen: It doesn't own the ledger; its only job is to draw the names and buttons on the screen.

handleDeletePerson is a Remote Control Button: The Boss creates a function that erases a person and hands that function (the remote button) to Persons.jsx as a prop.

When a user clicks "delete" on the display screen, Persons.jsx presses the remote button and sends the specific id back up to App.jsx.
*/
















/*import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' , number: '040-123456' },
  ]) 
  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')


  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()

    const nameExists = persons.some(person => person.name === newName)
    if(nameExists){
      alert(`${newName} is already added to the phonebook`)
      return 
    }


    const nameObject = {
      name : newName ,
      number : newNumber
    }

    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
  }


  const personsToShow = filter === ''
    ? persons 
    : persons.filter(person =>
      person.name.toLowerCase().includes(filter.toLowerCase())
    )

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with: <input value={filter} onChange={handleFilterChange} />
      </div>
      <h2>add a new</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
        {personsToShow.map(person => (
          <p key={person.name}>{person.name} {person.number}</p>
      ))}
    </div>
  )
}

export default App
*/