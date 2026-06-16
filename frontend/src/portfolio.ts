// Toutes tes données portfolio sont ici. Édite ce fichier, pas le terminal.

export interface Profile {
  name: string
  role: string
  location: string
  tagline: string
  email: string
  github: string
  linkedin: string
}

export interface SkillGroup {
  group: string
  items: string[]
}

export interface Project {
  name: string
  desc: string
  stack: string[]
  url: string
}

export interface ExperienceItem {
  period: string
  title: string
  company: string
  desc: string
}

export const profile: Profile = {
  name: 'Kevin Dinocera',
  role: 'Cloud / DevOps Engineer',
  location: 'France · eu-west-3',
  tagline: 'Infrastructure as code, automatisation et plateformes cloud.',
  email: 'kevin.dinocera@gmail.com',
  github: 'https://github.com/kdi-noce',
  linkedin: 'https://www.linkedin.com/in/',
}

export const about: string[] = [
  "Ingénieur Cloud / DevOps passionné par l'automatisation et l'infrastructure as code.",
  'Je conçois et déploie des plateformes cloud fiables, reproductibles et observables.',
  'Terraform, Kubernetes et CI/CD au quotidien — sur AWS comme sur OpenStack.',
]

export const skills: SkillGroup[] = [
  { group: 'Cloud', items: ['AWS', 'OpenStack', 'GCP'] },
  { group: 'IaC', items: ['Terraform', 'Ansible', 'Packer'] },
  { group: 'Conteneurs', items: ['Docker', 'Kubernetes', 'Helm'] },
  { group: 'CI/CD', items: ['GitLab CI', 'GitHub Actions', 'ArgoCD'] },
  { group: 'Observabilité', items: ['Prometheus', 'Grafana', 'Loki'] },
  { group: 'Langages', items: ['Python', 'Go', 'Bash'] },
]

export const projects: Project[] = [
  {
    name: 'infra-as-code',
    desc: 'Déploiement multi-cloud entièrement décrit en Terraform, modules réutilisables.',
    stack: ['Terraform', 'AWS', 'OpenStack'],
    url: 'https://github.com/kdi-noce',
  },
  {
    name: 'k8s-platform',
    desc: 'Cluster Kubernetes en GitOps avec ArgoCD, monitoring et autoscaling.',
    stack: ['Kubernetes', 'ArgoCD', 'Helm'],
    url: 'https://github.com/kdi-noce',
  },
  {
    name: 'observability-stack',
    desc: "Stack d'observabilité clé en main : métriques, logs et dashboards.",
    stack: ['Prometheus', 'Grafana', 'Loki'],
    url: 'https://github.com/kdi-noce',
  },
]

export const experience: ExperienceItem[] = [
  {
    period: '2023 — présent',
    title: 'Cloud / DevOps Engineer',
    company: 'Entreprise',
    desc: 'Automatisation des déploiements et fiabilisation des plateformes.',
  },
  {
    period: '2021 — 2023',
    title: 'Ingénieur Systèmes',
    company: 'Entreprise',
    desc: 'Administration cloud, scripting et CI/CD.',
  },
]
