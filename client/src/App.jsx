import { Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ResultsPage from './pages/ResultsPage'
import HubsPage from './pages/HubsPage'
import HubDetailPage from './pages/HubDetailPage'
import AboutPage from './pages/AboutPage'

function App() {
    return (
        <LanguageProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/results" element={<ResultsPage />} />
                    <Route path="/hubs" element={<HubsPage />} />
                    <Route path="/hub/:id" element={<HubDetailPage />} />
                    <Route path="/about" element={<AboutPage />} />
                </Routes>
            </Layout>
        </LanguageProvider>
    )
}

export default App
