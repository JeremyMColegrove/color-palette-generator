import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//@ts-ignore
import Please from 'pleasejs'
import Tile from './Tile'


function App() {
  const [palette, setPalette] = useState<string[]>([])


  function generatePalette() {
    //or
    const base = Please.make_color({format:'hsv'})[0]
    console.log(base)
    const colors = Please.make_scheme(
      base,
      {
          scheme_type: 'triadic',
          format: 'hex'
      })
      setPalette(colors)
  }
  return (
    <>
      <h1>Palette Generator</h1>
      <div className="card">
      <button onClick={generatePalette}>Generate Palette</button>
        
      </div>
      <div className="palette">
        {palette.map(color=><Tile color={color}/>)}
      </div>
      <p className="read-the-docs">
        Please <a href="" >share</a> this website
      </p>
    </>
  )
}

export default App
