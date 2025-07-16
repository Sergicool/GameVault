import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1 className='text-4xl font-bold text-blue-600 text-center'> Hello World!</h1>
      </div>
    </>
  )
}

export default App
