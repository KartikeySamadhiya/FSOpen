import { useState } from 'react'

const App = () => {
  const[clicks , setClicks] = useState({    //clicks stores the values
    left: 0 , right: 0                          //and set clicks is the function to update 
  })

  const handleLeftClicks = () =>{
    const newClicks = {
      ...clicks,
      left: clicks.left + 1
    }

    setClicks(newClicks)          //so here we update 
  }

  const handleRightClicks = () => {
    const newClicks = {
      ...clicks,
      right: clicks.right + 1
    }

    setClicks(newClicks)
  }
                              
  return(                       //immediate display of value by {}
    <div>                     
      {clicks.left}         
      <button onClick={ handleLeftClicks}>left</button>
      <button onClick={ handleRightClicks}>right</button>
      {clicks.right}
    </div>
  )

}

export default App