export const CAREER_SKILL_TREES = {
  tech: {
    id: 'tech',
    name: 'Technology',
    description: 'Master the digital realm and build the future.',
    specializations: [
      {
        id: 'frontend',
        name: 'Frontend Development',
        description: 'Craft beautiful and responsive user interfaces.',
        nodes: [
          {
            id: 'typescript',
            name: 'TypeScript',
            desc: 'Type-safe code reduces bugs and improves maintainability.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { salaryMult: 0.03, stressReduction: 1 },
            prereqs: [],
          },
          {
            id: 'ui_framework',
            name: 'UI Framework Expert',
            desc: 'Master modern frameworks to build reactive UIs at scale.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { salaryMult: 0.04, happiness: 1 },
            prereqs: ['typescript'],
          },
          {
            id: 'ui_design',
            name: 'UI/UX Design',
            desc: 'Design intuitive and accessible interfaces users love.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { happiness: 3, fame: 1 },
            prereqs: [],
          },
          {
            id: 'animation',
            name: 'Animation & Motion',
            desc: 'Bring interfaces to life with smooth, delightful animations.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { fame: 2, happiness: 2 },
            prereqs: ['ui_design'],
          },
          {
            id: 'perf_opt',
            name: 'Performance Optimization',
            desc: 'Make blazing-fast applications that users and bosses love.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { salaryMult: 0.05, promotionChance: 0.03 },
            prereqs: ['ui_framework', 'animation'],
          },
        ],
      },
      {
        id: 'backend',
        name: 'Backend Development',
        description: 'Build robust and scalable server systems.',
        nodes: [
          {
            id: 'database',
            name: 'Database Design',
            desc: 'Design efficient data models and lightning-fast queries.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { salaryMult: 0.03, stressReduction: 1 },
            prereqs: [],
          },
          {
            id: 'api_design',
            name: 'API Design',
            desc: 'Design clean, versioned APIs that scale.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { salaryMult: 0.04, happiness: 1 },
            prereqs: ['database'],
          },
          {
            id: 'security',
            name: 'Security Hardening',
            desc: 'Protect systems from vulnerabilities and attacks.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { salaryMult: 0.05, fame: 1 },
            prereqs: [],
          },
          {
            id: 'scalability',
            name: 'Scalability & Architecture',
            desc: 'Design systems that scale to millions of users.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { salaryMult: 0.06, promotionChance: 0.03 },
            prereqs: ['api_design', 'security'],
          },
        ],
      },
      {
        id: 'devops',
        name: 'DevOps & Infrastructure',
        description: 'Manage infrastructure and streamline deployments.',
        nodes: [
          {
            id: 'cicd',
            name: 'CI/CD Pipelines',
            desc: 'Automate testing and deployment for rapid iteration.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { salaryMult: 0.03, stressReduction: 1 },
            prereqs: [],
          },
          {
            id: 'containers',
            name: 'Containerization',
            desc: 'Master Docker and orchestration for portable apps.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { salaryMult: 0.04, happiness: 1 },
            prereqs: ['cicd'],
          },
          {
            id: 'monitoring',
            name: 'Monitoring & Observability',
            desc: 'Keep systems healthy with deep observability.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { stressReduction: 3, fame: 1 },
            prereqs: [],
          },
          {
            id: 'cloud_arch',
            name: 'Cloud Architecture',
            desc: 'Design multi-cloud resilient infrastructure.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { salaryMult: 0.06, promotionChance: 0.03 },
            prereqs: ['containers', 'monitoring'],
          },
        ],
      },
    ],
  },
  medical: {
    id: 'medical',
    name: 'Medical',
    description: 'Heal the sick, advance medicine, save lives.',
    specializations: [
      {
        id: 'surgery',
        name: 'Surgery',
        description: 'Perform life-saving operations with precision.',
        nodes: [
          {
            id: 'anatomy',
            name: 'Advanced Anatomy',
            desc: 'Deep understanding of the human body.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { salaryMult: 0.03, stressReduction: 1 },
            prereqs: [],
          },
          {
            id: 'robotics',
            name: 'Robotic Surgery',
            desc: 'Master robotic-assisted surgical systems.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { salaryMult: 0.05, fame: 1 },
            prereqs: ['anatomy'],
          },
          {
            id: 'trauma',
            name: 'Trauma Surgery',
            desc: 'Excel in high-pressure emergency surgeries.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { salaryMult: 0.04, promotionChance: 0.02 },
            prereqs: [],
          },
          {
            id: 'lead_surgeon',
            name: 'Lead Surgeon',
            desc: 'Lead surgical teams on complex cases.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { salaryMult: 0.06, happiness: 2 },
            prereqs: ['robotics', 'trauma'],
          },
        ],
      },
      {
        id: 'research',
        name: 'Medical Research',
        description: 'Discover breakthroughs and cure diseases.',
        nodes: [
          {
            id: 'genetics',
            name: 'Genetics',
            desc: 'Understand the building blocks of life.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { salaryMult: 0.03, fame: 1 },
            prereqs: [],
          },
          {
            id: 'clinical_trials',
            name: 'Clinical Trials',
            desc: 'Design and run effective clinical studies.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { salaryMult: 0.04, happiness: 1 },
            prereqs: ['genetics'],
          },
          {
            id: 'pharma_rd',
            name: 'Pharmaceutical R&D',
            desc: 'Develop new drugs and treatments.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { salaryMult: 0.05, promotionChance: 0.03 },
            prereqs: [],
          },
          {
            id: 'nobel_work',
            name: 'Breakthrough Research',
            desc: 'Publish groundbreaking studies that change medicine.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { fame: 4, salaryMult: 0.06 },
            prereqs: ['clinical_trials', 'pharma_rd'],
          },
        ],
      },
      {
        id: 'general',
        name: 'General Practice',
        description: 'Build lasting relationships with patients.',
        nodes: [
          {
            id: 'bedside',
            name: 'Bedside Manner',
            desc: 'Put patients at ease with empathy and clarity.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { happiness: 2, stressReduction: 2 },
            prereqs: [],
          },
          {
            id: 'diagnosis',
            name: 'Expert Diagnosis',
            desc: 'Identify rare conditions others miss.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { salaryMult: 0.04, fame: 1 },
            prereqs: ['bedside'],
          },
          {
            id: 'preventive',
            name: 'Preventive Medicine',
            desc: 'Keep patients healthy before they get sick.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { happiness: 3, health: 1 },
            prereqs: [],
          },
          {
            id: 'dept_head',
            name: 'Department Head',
            desc: 'Lead your department to excellence.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { salaryMult: 0.05, promotionChance: 0.03 },
            prereqs: ['diagnosis', 'preventive'],
          },
        ],
      },
    ],
  },
  business: {
    id: 'business',
    name: 'Business & Finance',
    description: 'Build empires, manage money, lead markets.',
    specializations: [
      {
        id: 'management',
        name: 'Management',
        description: 'Lead teams and drive organizational success.',
        nodes: [
          {
            id: 'team_lead',
            name: 'Team Leadership',
            desc: 'Inspire teams to achieve more together.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { salaryMult: 0.03, happiness: 1 },
            prereqs: [],
          },
          {
            id: 'project_mgmt',
            name: 'Project Management',
            desc: 'Deliver complex projects on time and budget.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { salaryMult: 0.04, stressReduction: 2 },
            prereqs: ['team_lead'],
          },
          {
            id: 'strategy',
            name: 'Strategic Planning',
            desc: 'See the big picture and plan for the future.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { salaryMult: 0.05, promotionChance: 0.02 },
            prereqs: [],
          },
          {
            id: 'exec_dir',
            name: 'Executive Direction',
            desc: 'Set vision and lead entire divisions.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { salaryMult: 0.06, fame: 2 },
            prereqs: ['project_mgmt', 'strategy'],
          },
        ],
      },
      {
        id: 'finance',
        name: 'Finance & Investment',
        description: 'Grow wealth and master financial markets.',
        nodes: [
          {
            id: 'accounting',
            name: 'Accounting',
            desc: 'Master financial statements and reporting.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { salaryMult: 0.03, stressReduction: 1 },
            prereqs: [],
          },
          {
            id: 'analysis',
            name: 'Financial Analysis',
            desc: 'Evaluate investments and company performance.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { salaryMult: 0.04, happiness: 1 },
            prereqs: ['accounting'],
          },
          {
            id: 'portfolio',
            name: 'Portfolio Management',
            desc: 'Manage multi-million dollar investment portfolios.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { salaryMult: 0.05, promotionChance: 0.03 },
            prereqs: [],
          },
          {
            id: 'cio',
            name: 'Chief Investment Officer',
            desc: 'Lead investment strategy for entire firms.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { salaryMult: 0.07, fame: 2 },
            prereqs: ['analysis', 'portfolio'],
          },
        ],
      },
      {
        id: 'marketing',
        name: 'Marketing & Branding',
        description: 'Shape perceptions and drive demand.',
        nodes: [
          {
            id: 'digital_mkt',
            name: 'Digital Marketing',
            desc: 'Master SEO, SEM, and social media campaigns.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { salaryMult: 0.03, fame: 1 },
            prereqs: [],
          },
          {
            id: 'brand_strat',
            name: 'Brand Strategy',
            desc: 'Build and position iconic brands.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { salaryMult: 0.04, happiness: 1 },
            prereqs: ['digital_mkt'],
          },
          {
            id: 'market_res',
            name: 'Market Research',
            desc: 'Uncover consumer insights and market trends.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { salaryMult: 0.04, promotionChance: 0.02 },
            prereqs: [],
          },
          {
            id: 'cmo',
            name: 'Chief Marketing Officer',
            desc: 'Lead marketing strategy at the highest level.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { salaryMult: 0.06, fame: 3 },
            prereqs: ['brand_strat', 'market_res'],
          },
        ],
      },
    ],
  },
  creative: {
    id: 'creative',
    name: 'Creative Arts',
    description: 'Create art, inspire audiences, leave a legacy.',
    specializations: [
      {
        id: 'performance',
        name: 'Performance',
        description: 'Captivate audiences on stage and screen.',
        nodes: [
          {
            id: 'stage_pres',
            name: 'Stage Presence',
            desc: 'Command attention whenever you perform.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { fame: 2, happiness: 1 },
            prereqs: [],
          },
          {
            id: 'vocal_mastery',
            name: 'Vocal Mastery',
            desc: 'Train your voice for range, power, and control.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { fame: 2, salaryMult: 0.04 },
            prereqs: ['stage_pres'],
          },
          {
            id: 'acting',
            name: 'Method Acting',
            desc: 'Dive deep into characters for authentic performances.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { fame: 3, happiness: 2 },
            prereqs: [],
          },
          {
            id: 'a_list',
            name: 'A-List Star',
            desc: 'Reach the pinnacle of fame as a household name.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { fame: 5, salaryMult: 0.06 },
            prereqs: ['vocal_mastery', 'acting'],
          },
        ],
      },
      {
        id: 'production',
        name: 'Production & Direction',
        description: 'Create and shape artistic works behind the scenes.',
        nodes: [
          {
            id: 'music_prod',
            name: 'Music Production',
            desc: 'Produce hit records in the studio.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { fame: 1, salaryMult: 0.03 },
            prereqs: [],
          },
          {
            id: 'directing',
            name: 'Directing',
            desc: 'Lead creative vision for film, TV, or theater.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { fame: 2, salaryMult: 0.04 },
            prereqs: ['music_prod'],
          },
          {
            id: 'sound_eng',
            name: 'Sound Engineering',
            desc: 'Master acoustics and audio production.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { salaryMult: 0.04, stressReduction: 2 },
            prereqs: [],
          },
          {
            id: 'creative_dir',
            name: 'Creative Director',
            desc: 'Shape the artistic vision of major productions.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { fame: 3, salaryMult: 0.06 },
            prereqs: ['directing', 'sound_eng'],
          },
        ],
      },
      {
        id: 'visual',
        name: 'Visual Arts',
        description: 'Create stunning visuals across media.',
        nodes: [
          {
            id: 'photography',
            name: 'Photography',
            desc: 'Capture breathtaking images.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { fame: 1, happiness: 2 },
            prereqs: [],
          },
          {
            id: 'digital_art',
            name: 'Digital Art & Design',
            desc: 'Create compelling digital artwork and illustrations.',
            maxLevel: 3,
            costPerLevel: 1,
            effects: { fame: 2, salaryMult: 0.03 },
            prereqs: ['photography'],
          },
          {
            id: 'cinematography',
            name: 'Cinematography',
            desc: 'Master lighting, camera, and visual storytelling.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { fame: 2, salaryMult: 0.04 },
            prereqs: [],
          },
          {
            id: 'master_artist',
            name: 'Master Artist',
            desc: 'Create iconic works that stand the test of time.',
            maxLevel: 2,
            costPerLevel: 1,
            effects: { fame: 4, salaryMult: 0.05 },
            prereqs: ['digital_art', 'cinematography'],
          },
        ],
      },
    ],
  },
};

export function getTreeIdForJob(job) {
  if (!job || !job.careerPath) {
    return null;
  }
  const map = {
    tech: 'tech',
    data: 'tech',
    medical: 'medical',
    medical_support: 'medical',
    pharma: 'medical',
    vet: 'medical',
    therapy: 'medical',
    legal: 'legal',
    executive: 'business',
    marketing: 'business',
    finance: 'business',
    entertainment: 'creative',
    music: 'creative',
    media: 'creative',
  };
  return map[job.careerPath] || null;
}

export function getCareerEffects(person, treeId) {
  const base = {
    salaryMult: 0,
    stressReduction: 0,
    happiness: 0,
    fame: 0,
    health: 0,
    promotionChance: 0,
    raiseBonus: 0,
  };
  const nodes = person.careerData?.nodes;
  if (!nodes || !treeId || !CAREER_SKILL_TREES[treeId]) {
    return base;
  }

  const tree = CAREER_SKILL_TREES[treeId];
  for (const spec of tree.specializations) {
    for (const node of spec.nodes) {
      const key = `${spec.id}_${node.id}`;
      const level = nodes[key] || 0;
      if (level > 0 && node.effects) {
        for (const [effectKey, val] of Object.entries(node.effects)) {
          base[effectKey] = (base[effectKey] || 0) + val * level;
        }
      }
    }
  }
  return base;
}

export function getSalaryMultiplier(person) {
  const treeId = getTreeIdForJob(person.job);
  if (!treeId || !person.careerData) {
    return 1;
  }
  const effects = getCareerEffects(person, treeId);
  return 1 + (effects.salaryMult || 0);
}

export function awardSkillPoints(person, points) {
  if (!person.careerData) {
    person.careerData = { totalSkillPointsEarned: 0, availableSkillPoints: 0, nodes: {} };
  }
  person.careerData.availableSkillPoints = (person.careerData.availableSkillPoints || 0) + points;
  person.careerData.totalSkillPointsEarned =
    (person.careerData.totalSkillPointsEarned || 0) + points;
}

export function calculateTotalSkillPoints(person) {
  return person.careerData?.totalSkillPointsEarned || 0;
}

export function calculateSpentSkillPoints(person) {
  const nodes = person.careerData?.nodes || {};
  return Object.values(nodes).reduce((sum, level) => sum + level, 0);
}
