import { useState } from 'react'

const Button = ({handleClick, text}) => {
  return(
    <button onClick={handleClick}>{text}</button>
  )
}


const StatisticLine = ({text , value}) => {
  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}


const Statistics = (props) => {
  const all = props.good + props.neutral + props.bad
  const average = (props.good - props.bad) / all
  const percentage = (props.good/all) * 100

  if (all === 0) {
    return(
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }

  return(
    <div>
      <h1>statistics</h1>

      <table>
        <tbody>
          <StatisticLine text="good" value={props.good}/>
          <StatisticLine text="neutral" value={props.neutral}/>
          <StatisticLine text="bad" value={props.bad}/>
          <StatisticLine text="all" value={all}/>
          <StatisticLine text="average" value={average}/>
          <StatisticLine text="percentage" value={percentage}/>  
        </tbody>
      </table>

    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick = {() => setGood(good+1)}text="good"/>
      <Button handleClick = {() => setNeutral(neutral+1)}text="neutral"/>
      <Button handleClick = {() => setBad(bad+1)}text="bad"/>

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App

/*<button onClick={ () => {
        setBad(bad+1)
        setAll(all+1)
        setAverage((good-bad-1)/(all+1))
        setPercentage((good/(all+1))*100)
      }}>bad</button>


<p>good {props.good}</p>
      <p>neutral {props.neutral}</p>
      <p>bad {props.bad}</p>
      <p>all {all}</p>
      <p>average {average}</p>
      <p>percentage {percentage}</p>

  */