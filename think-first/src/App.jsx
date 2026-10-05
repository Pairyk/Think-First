import { Link, Route, Routes } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Library from './pages/Library'
import './App.css'
import Session from './pages/Session'
import Builder from "./pages/Builder";
import AIBasics from "./pages/AIBasics";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/session/:methodId" element={<Session />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/learn" element={<AIBasics />} />
        <Route
          path="*"
          element={
            <main className="library-page container">
              <h1 className="section-title">Страница не найдена</h1>
              <Link className="button button-primary" to="/">
                На главную
              </Link>
            </main>
          }
        />
      </Routes>

      <Footer />
    </>
  )
}

export default App