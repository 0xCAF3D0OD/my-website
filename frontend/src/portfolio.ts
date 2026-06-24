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

export interface EducationItem {
  period: string
  school: string
  detail: string
}

export const profile: Profile = {
  name: 'Kevin Di Nocera',
  role: 'DevOps Engineer / Platform Engineer',
  location: 'Suisse · Switzerland West',
  tagline: 'Infrastructure as code, automatisation et plateformes cloud.',
  email: 'kevin.dinocera@protonmail.com',
  github: 'https://github.com/0xCAF3D0OD',
  linkedin: 'www.linkedin.com/in/kevin-di-nocera',
}

export const about: string[] = [
  "Ingénieur DevOps / Plateforme junior spécialisé dans l'Infrastructure as Code et " +
  "l'orchestration cloud. Compétences pratiques en Terraform, Ansible, Kubernetes, Helm, AWS, " +
  "Azure et CI/CD, acquises lors d'un stage chez NAGRA Kudelski et dans le cadre d'un projet personnel " +
  "déployé en production. Passionné par l'automatisation, l'évolutivité et les outils maison.",
]

export const about_biography: string[] = [
  "Diplômé de l'école 42 (Lausanne), je possède une solide expérience en tant que " +
  "DevOps / Platform Engineer, principalement acquise durant mon stage au sein du " +
  "groupe NAGRA Kudelski. Au sein de l'équipe SRE de la branche IoT, " +
  "ainsi que par mes multiples projets personnels, " +
  "j'ai développé une expertise que je valide actuellement par la préparation de " +
  "la certification CKA (Certified Kubernetes Administrator)." +
  "Passionné par l'automatisation, l'évolutivité et la cybersécurité, " +
  "j'ai plusieurs CTF à mon actif, notamment Insomni'hack et Black Alps. " +
  "Grand amateur de sport, j'ai fait partie de la sélection nationale d'athlétisme (4x100m) et " +
  "suis multimédaillé national sur 100m et 200m. Et détenteur du record cantonal sur 100 mètres." +
  "Je suis également médaillé d'argent avec la Bobteam Kuonen " +
  "lors des championnats suisses de bobsleigh à St-Moritz en 2019."
]

export const skills: SkillGroup[] = [
  { group: 'Cloud', items: ['AWS', 'Azure', 'OpenStack'] },
  { group: 'IaC', items: ['Terraform', 'Ansible'] },
  { group: 'Conteneurs', items: ['Docker', 'Kubernetes K3s', 'Helm'] },
  { group: 'CI/CD', items: ['GitLab CI', 'GitHub Actions', 'ArgoCD'] },
  { group: 'Observabilité', items: ['Prometheus', 'Grafana'] },
  { group: 'Langages', items: ['Python', 'Bash', 'Typescript'] },
]

export const projects: Project[] = [
  {
    name: 'alloremplacant.ch / Educhat',
    desc:
      "Plateforme de mise en relation pour l'enseignement " +
      'obligatoire vaudois (DGEO) : les établissements publient des missions, ' +
      'les remplaçant·e·s les trouvent et y postulent.',
    stack: ['Terraform', 'Kubernetes K3s', 'Ansible', 'Docker', 'GitHub actions', 'Helm', 'Azure'],
    url: 'https://github.com/0xCAF3D0OD/Educhat',
  },
  {
    name: 'Terraform-oci',
    desc:
      "Ce projet introduit l'utilisation de la Cli d'oci qui sert à configurer son propre compte " +
      "il contient la configuration pour la mise en place d'une infrastructure Oracle Cloud Infrastructure " +
      '(OCI) sécurisée avec Terraform, suivant le principe du Moindre Privilège.',
    stack: ['OCI', 'python', 'terraform'],
    url: 'https://github.com/0xCAF3D0OD/terraform-oci',
  },
  {
    name: 'Cloud-1',
    desc:
      "Ce projet consiste à automatiser le déploiement d'un serveur web complet, exécutant " +
      'simultanément WordPress, PHPMyAdmin et une base de données via des conteneurs Docker ' +
      "individuels, tout en utilisant Ansible pourl'automatisation.",
    stack: ['Ansible', 'Azure vm', 'Docker', 'Terraform'],
    url: 'https://github.com/0xCAF3D0OD/ansible-azure',
  },
  {
    name: 'Inception-of-Things',
    desc:
      "Ce projet introduit l'utilisation de K3d et K3s avec Vagrant pour configurer une machine " +
      "virtuelle personnelle, explorer K3s et ses Ingress, et découvrir K3d, simplifiant l'accès " +
      'à Kubernetes.',
    stack: ['Kubernetes', 'Vagrant', 'ArgoCD'],
    url: 'https://github.com/0xCAF3D0OD/42Inception-of-Things',
  },
]

export const experience: ExperienceItem[] = [
  {
    period: '15.11.2024 — 15.11.2025',
    title: 'DevOps / Platform Engineer stage',
    company: 'NAGRA Kudelski Group',
    desc:
      "Création d'un portail de monitoring pour centraliser la supervision des projets GitLab " +
      "de l'équipe SRE.\n" +
      "Résultat : Réduction du temps d'analyse des projets par l'équipe SRE de 1-3 min à 2-5 secondes.",
  },
  {
    period: '08.01.2024 — 08.07.2024',
    title: 'Web Developer stage',
    company: 'Retraites Populaires',
    desc:
      "Développement d'un POC pour optimiser l'expérience utilisateur du site Erentes.\n" +
      "Création d'une console back-office (Vue.js, TypeScript, PHP, PostgreSQL) avec automatisation\n" +
      'du déploiement via Jenkins.',
  },
]

// Formation — à compléter / corriger librement.
export const education: EducationItem[] = [
  {
    period: '2021 - 2023',
    school: 'École 42 (Lausanne)',
    detail:
      'Cursus informatique par projets (peer-learning), spécialisation systèmes & cloud.' +
      "est un campus de formation en informatique innovant, situé au cœur du parc scientifique de " +
      "l'EPFL (Ecublens/Lausanne). Membre du réseau mondial d'écoles 42, elle propose " +
      "un cursus d'excellence en développement informatique totalement gratuit, " +
      "sans cours magistraux, sans professeurs et ouvert à tous, quels que soient " +
      "les diplômes antérieurs.",
  },
]
