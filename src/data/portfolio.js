// Static portfolio content (projects + experience) migrated from index.html.
export const projects = [
  {
    featured: true,
      number: '01',
    tags: [{
        label: 'Analytic',
        color: 'coral'
      },
      {
        label: 'Web',
        color: 'mint'
      }
    ],
    title: 'Field Management Resource',
    desc: 'Built interactive data models and visual farm reports called Taniku. Integrated multi-source data to support operational decision-making and business performance monitoring.',
    tech: ['Web', 'Data Modeling', 'Business Reporting'],
    links: 'https://tyoprataama.github.io/project',
  },
  {
    featured: true,
    number: '02',
    tags: [{ label: 'Team Project', color: 'blue' }],
    title: 'Comprehensive OHS Field Audit: Industrial Sugar Mill Djombang Baru',
    desc:
      "A multi-disciplinary Occupational Health and Safety (OHS) audit conducted at PT Sinergi Gula Nusantara. This report provides a 360-degree safety analysis, covering mechanical (PTP/PAPA), electrical, and fire safety systems, while ensuring compliance with KEMNAKER's national standards for OSH Management Systems (SMK3) and industrial ergonomics.",
    tech: ['SMK3 Standards', 'Risk Mitigation', 'Industrial Hygiene', 'Regulatory Compliance'],
  },
  {
    featured: true,
      number: '03',
    tags: [
      { label: 'Web', color: 'mint' },
      { label: 'Team Project', color: 'mint' },
    ],
    title: 'Resource Management System',
    desc:
      'Designed and implemented an internal resource tracking website for SoftwareSeni Indonesia. Coordinated a cross-functional team using SCRUM to deliver the project on schedule.',
    tech: ['TypeScript', 'Material UI', 'SCRUM'],
  },
]

export const experiences = [
  {
    accent: 'mint',
    period: 'Mar 2026',
    title: 'Ahli K3 Umum (AK3U)',
    company: '(Kementerian Tenaga Kerja & Badan Nasional Sertifikasi Profesi) · Certified',
    desc:
      'Certified in hazard identification, risk assessment, accident prevention, safety management systems, and emergency response procedures. Competent in safety monitoring, reporting, and regulatory compliance evaluation.',
  },
  {
    accent: 'coral',
    period: 'Oct 2023 — Present',
    title: 'Farm & Livestock Operations',
    company: 'Family Agricultural Business · Kediri',
    desc:
      'Managing end to end agricultural operations across multiple land sites, covering seedling preparation, planting, crop maintenance, irrigation management, and sugarcane harvesting. Coordinating daily schedules, monitoring field conditions, and maintaining operational records for family-owned farming and livestock activities.',
  },
  {
    accent: 'red',
    period: '2022 · 2024',
    title: 'Fresh Graduate Academy',
    company: 'Apprenticeship',
    desc:
      'Led data preparation, modeling, and visualization using Power BI. Delivered analysis and reports to support strategic business decisions for key stakeholders.',
  },
  {
    accent: 'amber',
    period: 'Aug — Oct 2022',
    title: 'Frontend Developer Intern',
    company: 'SoftwareSeni Indonesia · Internship',
    desc:
      'Designed and implemented a resource management website using React and TypeScript. Coordinated team workflow using SCRUM project management methodology.',
  },
]
