import type { PropsWithChildren } from 'react'
import Header from './Header'

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <div className="bg-gradient-to-br from-background to-muted">
            <Header />
            <main className='min-h-screen container mx-auto px-4 py-8'>
                {children}
            </main>
            <footer className='border-t backdrop-blur py-10 [backdrop-filter]:bg-background/60'>
                <div className='container mx-auto px-4 text-center text-gray-500'>
                    <p>Made with ❤️ by Neeraj</p>
                </div>
            </footer>
        </div>
    )
}

export default Layout