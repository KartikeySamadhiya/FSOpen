import { useState } from 'react'

const History = (props) => {  //conditoinal rendering
  if(props.allClicks.length === 0){
    return(
      <div>
        press buttons to use
      </div>
    )
  }

  return(
    <div>
      button press history: {props.allClicks.join('')}
    </div>
  )
}

const App = () => {
  const[left , setLeft] = useState(0)
  const [right , setRight] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleLeftClick = () =>{    //we're not creating new object here
    setAll(allClicks.concat('L'))   //instead directly passing to the set function
    setLeft(left+1)
  }

  const handlerightClick = () =>{
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <buttom onClick={handlerightClick}>right</buttom>
      {right}
      <History allClicks = {allClicks}/> 
    </div>
  )
}//joins all the items into a single string, separated by the string passed as the function parameter here empty

export default App