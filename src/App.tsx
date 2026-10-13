import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import SiteLayout from './components/shell/SiteLayout'
import NotFoundPage from './pages/NotFoundPage'
import { pageLoaders } from './routes'

const HomePage = lazy(pageLoaders.home)
const ProjectsPage = lazy(pageLoaders.projects)
const ProjectDetailPage = lazy(pageLoaders.projectDetail)
const ExperiencePage = lazy(pageLoaders.experience)
const SkillsPage = lazy(pageLoaders.skills)
const AchievementsPage = lazy(pageLoaders.achievements)
const BlogPage = lazy(pageLoaders.blog)
const ArticlePage = lazy(pageLoaders.article)
const ContactPage = lazy(pageLoaders.contact)
const ResumePage = lazy(pageLoaders.resume)
const PrivacyPage = lazy(pageLoaders.privacy)
const Admin = lazy(pageLoaders.admin)

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
