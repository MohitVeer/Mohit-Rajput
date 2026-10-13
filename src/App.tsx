import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import SiteLayout from './components/shell/SiteLayout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'))
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'))
const SkillsPage = lazy(() => import('./pages/SkillsPage'))
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const ArticlePage = lazy(() => import('./pages/ArticlePage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const ResumePage = lazy(() => import('./pages/ResumePage'))
const PrivacyPage = lazy(() => import('./components/PrivacyNotice'))
const Admin = lazy(() => import('./components/Admin'))

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:slug" element={<ProjectDetailPage />} />
        <Route path="experience" element={<ExperiencePage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="achievements" element={<AchievementsPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<ArticlePage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="resume" element={<ResumePage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
