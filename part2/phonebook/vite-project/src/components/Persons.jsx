const Persons = ({ personsToShow, handleDeletePerson }) => {
  return (
  <div>
    {personsToShow.map(person => (
      <p key={person.id}>
        {person.name} {person.number}{' '}
        <button onClick={() => handleDeletePerson(person.id, person.name)}>
            delete
          </button>
      </p>
    ))}
  </div>
  )
}

export default Persons