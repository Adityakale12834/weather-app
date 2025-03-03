import './App.css'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import { useSelector } from 'react-redux'
function App() {
  const theme = useSelector((state) => state.theme.value);
  return (
    <div className={theme !== 'dark' ?  'white' : "dark"}>
      <Navbar/>
      <Hero/>
    </div>
  )
}

export default App
