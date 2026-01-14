import { Outlet } from 'react-router-dom'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
            <Header />

            <main className="flex-grow">
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}
