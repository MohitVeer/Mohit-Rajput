import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const source = resolve(process.argv[2] ?? 'node_modules/simple-icons')
const outDir = resolve('public/tech')
const indexFile = resolve('src/data/techIconIndex.ts')

const TITLES = [
  'JavaScript', 'TypeScript', 'Python', 'OpenJDK', 'C', 'C++', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'Scala', 'Perl', 'Lua', 'R', 'Haskell', 'Elixir',
  'HTML5', 'CSS', 'Sass', 'Less', 'Markdown', 'JSON', 'GraphQL', 'WebAssembly',
  'React', 'Vue.js', 'Nuxt', 'Angular', 'Svelte', 'Next.js', 'Gatsby', 'Astro', 'Remix', 'Redux', 'jQuery', 'Bootstrap', 'Tailwind CSS', 'Bulma', 'Ant Design', 'Chakra UI',
  'styled-components', 'Framer', 'Three.js', 'D3.js', 'Chart.js', 'Storybook', 'Vite', 'Webpack', 'Babel', 'Rollup.js', 'esbuild', 'Gulp', 'Grunt', 'npm', 'Yarn', 'pnpm',
  'ESLint', 'Prettier', 'Jest', 'Vitest', 'Mocha', 'Cypress', 'Selenium', 'Testing Library', 'PWA', 'Axios', 'Lodash', 'Socket.io', 'Pinia',
  'Node.js', 'Express', 'NestJS', 'Fastify', 'Deno', 'Bun', 'Django', 'Flask', 'FastAPI', 'Laravel', 'Symfony', 'Spring', 'Spring Boot', 'Ruby on Rails', '.NET', 'Electron', 'Flutter', 'Ionic',
  'PostgreSQL', 'MySQL', 'MariaDB', 'SQLite', 'MongoDB', 'Redis', 'Elasticsearch', 'Apache Cassandra', 'Firebase', 'Supabase', 'Prisma', 'Neo4j', 'Snowflake', 'Databricks', 'Apache Kafka', 'RabbitMQ',
  'Google Cloud', 'DigitalOcean', 'Netlify', 'Vercel', 'Cloudflare', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'GitLab', 'Bitbucket', 'CircleCI', 'Travis CI', 'Linux', 'Ubuntu', 'Nginx', 'Apache',
  'Git', 'GitHub', 'Figma', 'Sketch', 'Postman', 'Insomnia', 'Swagger', 'OpenAPI Initiative', 'Jira', 'Confluence', 'Trello', 'Asana', 'Notion', 'Miro', 'Linear', 'IntelliJ IDEA', 'WebStorm', 'PyCharm', 'Android Studio', 'Xcode', 'Vim', 'Neovim', 'Obsidian',
  'Shopify', 'WordPress', 'WooCommerce', 'Wix', 'Squarespace', 'Webflow', 'Drupal', 'Joomla', 'Contentful', 'Strapi', 'Sanity', 'Ghost', 'BigCommerce', 'PrestaShop',
  'Mailchimp', 'Stripe', 'PayPal', 'Zapier', 'Google Analytics', 'Google Tag Manager', 'Hotjar', 'Looker', 'Metabase',
  'Anthropic', 'Claude', 'Hugging Face', 'TensorFlow', 'PyTorch', 'LangChain', 'Google Gemini',
  'OWASP', 'Kali Linux', 'Wireshark', 'Metasploit', 'Burp Suite', 'Zoom', 'Discord', 'Auth0', 'Okta', 'Sentry', 'Datadog', 'Grafana', 'Prometheus', 'New Relic', 'Splunk', 'Algolia', 'Puppeteer', 'Lighthouse',
  'Firefox', 'Safari', 'Opera', 'Brave', 'Mozilla', 'WebGL', 'OpenGL', 'Unity', 'Unreal Engine', 'Blender', 'Arduino', 'Raspberry Pi', 'MQTT', 'Lottiefiles', 'RxJS', 'Zod',
]

const EXTRA_NAMES = {
  html5: ['html'],
  javascript: ['js', 'es6', 'ecmascript'],
  typescript: ['ts'],
  go: ['golang'],
  postgresql: ['postgres'],
  mongodb: ['mongo'],
  kubernetes: ['k8s'],
  tailwindcss: ['tailwind'],
  openjdk: ['java'],
  react: ['react native'],
  angular: ['angularjs'],
  vuedotjs: ['vuex'],
  sass: ['scss'],
  adobecommerce: ['magento'],
  googlecloud: ['gcp'],
  dotnet: ['aspnet', 'asp.net'],
  npm: ['npmjs'],
}

const slugOf = (title) => title.toLowerCase().replace(/\+/g, 'plus').replace(/\./g, 'dot').replace(/&/g, 'and').replace(/[^a-z0-9]/g, '')

const data = JSON.parse(readFileSync(join(source, 'data/simple-icons.json'), 'utf8'))
const byTitle = new Map(data.map((entry) => [entry.title.toLowerCase(), entry]))
const wanted = [...new Set(TITLES)]

const picked = []
const missing = []
for (const title of wanted) {
  const entry = byTitle.get(title.toLowerCase())
  if (!entry) {
    missing.push(title)
    continue
  }
  const slug = entry.slug ?? slugOf(entry.title)
  if (!existsSync(join(source, 'icons', `${slug}.svg`))) {
    missing.push(title)
    continue
  }
  const names = [...new Set([entry.title, ...(entry.aliases?.aka ?? []), ...(EXTRA_NAMES[slug] ?? [])])]
  picked.push({ slug, hex: entry.hex, names })
}

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })
for (const icon of picked) copyFileSync(join(source, 'icons', `${icon.slug}.svg`), join(outDir, `${icon.slug}.svg`))

picked.sort((a, b) => a.slug.localeCompare(b.slug))
const quote = (value) => `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const body = picked.map((icon) => `  { slug: ${quote(icon.slug)}, hex: ${quote(icon.hex)}, names: [${icon.names.map(quote).join(', ')}] },`).join('\n')
writeFileSync(indexFile, `export interface TechIconEntry {\n  slug: string\n  hex: string\n  names: string[]\n}\n\nexport const techIconIndex: TechIconEntry[] = [\n${body}\n]\n`)

console.log(`${picked.length} icons written to public/tech, index written to src/data/techIconIndex.ts`)
if (missing.length > 0) console.log(`not in the icon set: ${missing.join(', ')}`)
console.log(`${readdirSync(outDir).length} files, ${(readdirSync(outDir).reduce((sum, file) => sum + readFileSync(join(outDir, file)).length, 0) / 1024).toFixed(0)} KB`)
