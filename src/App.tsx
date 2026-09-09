import { useEffect } from 'react';
import { RouterProvider, useRouter } from './router';
import { LangProvider } from './context/LanguageContext';
import { Nav } from './components/layout/Nav';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ForAdultsPage } from './pages/ForAdultsPage';
import { ForStudentsPage } from './pages/ForStudentsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

function AppInner() {
  const { route } = useRouter();

  useEffect(() => {
    document.body.dataset.density = 'default';
  }, []);

  const pages = {
    home: HomePage,
    'for-adults': ForAdultsPage,
    'for-students': ForStudentsPage,
    about: AboutPage,
    contact: ContactPage,
  };

  const Page = pages[route] ?? HomePage;

  return (
    <>
      <Nav />
      <main key={route}>
        <Page />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <RouterProvider>
        <AppInner />
      </RouterProvider>
    </LangProvider>
  );
}
