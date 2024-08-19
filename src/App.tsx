import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Please, { ColorMutations, HSV, SchemeOptions } from './Pleasejs'
import Tile from './Tile'


function App() {
  const [palette, setPalette] = useState<string[]>([])
  const colorRef = useRef<HTMLInputElement>()
  const checkRef = useRef<HTMLInputElement>()
  const selectRef = useRef<HTMLSelectElement>()
  const scheme_options:SchemeOptions[] = ["monochromatic", "complementary", "split-complementary", "double-complementary", "analogous", "triadic"]
  
  useEffect(()=>{
    generatePalette()
  }, [])
  
  
  function generatePalette() {
    var value = colorRef.current.value
    var hsv
    //or
    if (checkRef.current.checked) {
      hsv = Please.make_color({format:'hsv'})[0] as HSV
    } else {
      hsv = ColorMutations.HEX_to_HSV(value)
    }

    const scheme = scheme_options[selectRef.current.selectedIndex]
    const colors = Please.make_scheme(
      hsv,
      {
          scheme_type: scheme,
          format: 'hex'
      }) as string[]

      setPalette(colors)
  }
  return (
    <>
      <h1>Palette Generator</h1>
      
      <div className='container'>
      <input defaultValue="#b272bf" type="color" ref={colorRef}/>
      
      <label >Random Color? <input defaultChecked id="random" type="checkbox" ref={checkRef}></input></label>
      {/* 'monochromatic' 'complementary' 'split-complementary'  'double-complementary' 'analogous' 'triadic' */}
      
      <select ref={selectRef}>
        <option value="m">Monochromatic</option>
        <option value="c">Complementary</option>
        <option value="s">Split-complementary</option>
        <option value="d">Double-complementary</option>
        <option selected value="a">Analogous</option>
        <option  value="t">Triadic</option>

      </select>
      </div>
      
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
