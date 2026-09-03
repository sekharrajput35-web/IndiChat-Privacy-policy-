import { FAQItem, PolicySection, SecurityCardItem, TimelineStep } from '../types';

export const SECURITY_CARDS: SecurityCardItem[] = [
  {
    id: 'sec-auth',
    title: 'Secure Authentication',
    shortDesc: 'Multi-factor verification and cryptographic session management designed to prevent unauthorized logins.',
    iconName: 'ShieldCheck',
    detailedExplanation:
      'IndiChat incorporates multi-layered authentication verification flows. Login sessions are issued through cryptographically signed access tokens with time-limited lifespans, automated device fingerprint recognition, and optional two-factor verification to ensure only authorized account holders gain access.',
    highlights: [
      'Time-bounded signed session tokens',
      'Suspicious login detection & proactive prompts',
      'Hardware security key and TOTP authenticator support',
    ],
  },
  {
    id: 'sec-crypto',
    title: 'Cryptographic Protection',
    shortDesc: 'Sensitive credentials are protected using appropriate cryptographic methods and should not be stored as readable plain text.',
    iconName: 'LockKeyhole',
    detailedExplanation:
      'Passwords and sensitive credentials are never stored or displayed as readable plain text. IndiChat utilizes industry-standard cryptographic salted one-way hashing algorithms (such as Argon2/bcrypt) alongside robust transport layer security (TLS 1.3) to protect data in transit between your client and our services.',
    highlights: [
      'Irreversible salted key derivation functions',
      'Zero plaintext credential storage across all databases',
      'Mandatory TLS 1.3 encryption across all communication endpoints',
    ],
  },
  {
    id: 'sec-account',
    title: 'Account Security',
    shortDesc: 'Granular device session management, instant remote logout, and real-time security alerts.',
    iconName: 'Smartphone',
    detailedExplanation:
      'You maintain comprehensive oversight of all devices connected to your IndiChat profile. From your security dashboard, you can inspect active devices, operating systems, approximate geographic sign-in locations, and revoke permissions for any session instantly with a single tap.',
    highlights: [
      'Active session inspection with remote revocation',
      'Immediate push and email alerts on new device logins',
      'Automated session termination following prolonged inactivity',
    ],
  },
  {
    id: 'sec-unauth',
    title: 'Unauthorized Access Protection',
    shortDesc: 'Dynamic rate limiting, automated anomaly detection, and brute-force mitigation shields.',
    iconName: 'ShieldAlert',
    detailedExplanation:
      'Our systems deploy adaptive rate-limiting algorithms and behavioral heuristics designed to identify and deflect automated brute-force attacks, credential stuffing, and irregular request spikes before they affect user accounts or platform stability.',
    highlights: [
      'Intelligent rate limiting on authentication endpoints',
      'Automated defense shields against automated credential stuffing',
      'Proactive account locking with verified challenge verification',
    ],
  },
  {
    id: 'sec-monitoring',
    title: 'Security Monitoring',
    shortDesc: 'Continuous infrastructure telemetry and proactive vulnerability management practices.',
    iconName: 'Activity',
    detailedExplanation:
      'IndiChat maintains active infrastructure monitoring to detect unusual activity patterns, operational anomalies, and system disruptions. Our engineering teams conduct ongoing vulnerability assessments and peer security reviews to reinforce platform integrity.',
    highlights: [
      'Continuous 24/7 infrastructure health telemetry',
      'Structured vulnerability disclosure programs',
      'Routine independent third-party audits and automated code scanning',
    ],
  },
  {
    id: 'sec-access',
    title: 'Access Controls',
    shortDesc: 'Strict principle of least privilege and role-based administrative authorization standards.',
    iconName: 'KeyRound',
    detailedExplanation:
      'Internal administrative access to systems is governed by strict Role-Based Access Control (RBAC) and least-privilege standards. Technical personnel can only access production environments when strictly required for service reliability, requiring audited hardware multi-factor authorization.',
    highlights: [
      'Zero default root privilege architecture',
      'Multi-party approval workflows for infrastructure updates',
      'Immutable audit logging of technical administrative actions',
    ],
  },
];

export const TIMELINE_STEPS: TimelineStep[] = [
  {
    step: 1,
    title: 'You Create an Account',
    shortDesc: 'Provide essential credentials needed to establish your unique, secure identity.',
    detailedInfo:
      'When joining IndiChat, you provide basic account credentials (such as your phone number or email address and a secure password). Passwords are immediately processed using one-way cryptographic hashing before any storage occurs. We minimize unnecessary initial data collection to only what is necessary to create and safeguard your account.',
    iconName: 'UserPlus',
    tag: 'Essential Onboarding',
  },
  {
    step: 2,
    title: 'You Choose Privacy Settings',
    shortDesc: 'Select your default visibility and interaction preferences across all super app modules.',
    detailedInfo:
      'Upon sign-up or at any time thereafter, you configure your default privacy state. Whether publishing reels, launching live broadcasts, sharing marketplace items, or initiating private chats, you determine who can see your presence, comment on your posts, or send you direct messages.',
    iconName: 'Sliders',
    tag: 'Default Configuration',
  },
  {
    step: 3,
    title: 'You Use IndiChat',
    shortDesc: 'Communicate, create, shop, and explore within protected platform environments.',
    detailedInfo:
      'As you connect with creators, chat with friends, and discover marketplace goods, your data is processed solely to fulfill the services you request. All communications with our servers travel over encrypted TLS protocols, and sensitive interactions respect your active privacy toggles.',
    iconName: 'Sparkles',
    tag: 'Active Platform Use',
  },
  {
    step: 4,
    title: 'Your Settings Help Control Visibility',
    shortDesc: 'Platform access rules honor your explicit visibility designations for each piece of content.',
    detailedInfo:
      'When you select Private mode for supported content or features, that content is not publicly visible and access is restricted according to your selected privacy settings and authorized service operations. Only approved audiences can view or interact with your content.',
    iconName: 'Shield',
    tag: 'Visibility Enforcement',
  },
  {
    step: 5,
    title: 'You Can Manage Supported Privacy Preferences',
    shortDesc: 'Review, update, export, or adjust your data and preferences at any time.',
    detailedInfo:
      'Your control never expires. From the IndiChat Privacy Center, you can review your active devices, modify audience filters, download a copy of your personal account archive, or initiate account closure whenever you decide.',
    iconName: 'RefreshCw',
    tag: 'Ongoing Autonomy',
  },
];

export const PRIVACY_POLICY_SECTIONS: PolicySection[] = [
  {
    id: 'intro',
    number: 1,
    title: 'Introduction',
    summary: 'Our foundational commitment to protecting your privacy and personal data across the IndiChat ecosystem.',
    content: [
      'Welcome to IndiChat ("we", "our", or "us"). IndiChat is an all-in-one super app designed to empower users to chat, share posts, create and watch reels, broadcast live video, browse social discovery feeds, discover news, and engage in marketplace commerce ("the Services").',
      'We believe trust is earned through transparency, intentional design, and user autonomy. This Privacy Policy explains how we collect, use, safeguard, and manage information in connection with your use of our platform.',
      'IndiChat uses appropriate technical and organizational measures designed to protect user information against unauthorized access, accidental loss, alteration, or disclosure.',
    ],
  },
  {
    id: 'info-collected',
    number: 2,
    title: 'Information We Collect',
    summary: 'Specific categories of information collected for account access, security, and essential operations.',
    content: [
      'We aim to collect only the information necessary to provide secure account access and essential platform functionality. The categories of information we may collect include:',
    ],
    subsections: [
      {
        title: 'Phone Number',
        body: 'Used for supported account creation, two-step verification, SMS authentication codes, and account security notices.',
      },
      {
        title: 'Email Address',
        body: 'Used for account communication, security alerts, identity verification, account recovery where applicable, and service updates.',
      },
      {
        title: 'Password Credentials',
        body: 'Passwords must not be stored or displayed as readable plain text. Password credentials should be protected using appropriate cryptographic security practices, including salted cryptographic key derivation.',
      },
      {
        title: 'User-Generated Content & Profile Details',
        body: 'Information you choose to provide in your public or private profile (such as display name, bio, and profile picture) as well as content you intentionally upload (posts, reels, marketplace listings).',
      },
      {
        title: 'Technical and Operational Metadata',
        body: 'Basic device information, app version, approximate IP-derived region, and session diagnostic logs used exclusively for error diagnostics and anti-abuse protection.',
      },
    ],
  },
  {
    id: 'how-used',
    number: 3,
    title: 'How Information Is Used',
    summary: 'The operational purposes for which collected information is utilized.',
    content: [
      'We use the information collected strictly for legitimate operational, security, and service delivery purposes:',
      '• Account Access & Identity Authentication: Verifying your credentials when signing in from web, mobile, or linked devices.',
      '• Platform Delivery & Core Features: Enabling real-time messaging, video streaming, feed aggregation, and marketplace transactions.',
      '• Account Security & Fraud Prevention: Detecting unusual sign-in behaviors, preventing automated spam bots, and securing account recovery requests.',
      '• Service Communications: Delivering critical service announcements, security alerts, and customer support responses.',
      '• Compliance & Integrity: Enforcing platform Community Guidelines and complying with applicable legal obligations.',
    ],
  },
  {
    id: 'content-settings',
    number: 4,
    title: 'Content and Privacy Settings',
    summary: 'Explanation of Public, Private, and Custom visibility options.',
    content: [
      'IndiChat provides intuitive privacy controls for supported content and features across the application:',
      '• Public Mode: Content visibility follows the platform\'s public visibility rules, allowing your content to appear in search results and social discovery feeds.',
      '• Private Mode: When a user selects Private mode for supported content or features, that content is not publicly visible and access is restricted according to the user\'s selected privacy settings and authorized service operations.',
      '• Custom Mode: Users can choose supported visibility and privacy preferences, including specifying who can view, comment, react, send direct messages, or share their posts.',
    ],
  },
  {
    id: 'data-security',
    number: 5,
    title: 'Data Security',
    summary: 'Technical and organizational safeguards implemented to protect your data.',
    content: [
      'IndiChat uses appropriate technical and organizational measures designed to protect user information.',
      'Our multi-tiered defenses include TLS 1.3 encryption for data in transit, encrypted storage for data at rest, salted one-way cryptographic hashing for passwords, role-based administrative access controls, automated rate-limiting against brute force, and routine security evaluations.',
      'While no digital system can guarantee complete immunity from emerging threats, we consistently review and strengthen our security posture to protect your information against unauthorized access.',
    ],
  },
  {
    id: 'data-sharing',
    number: 6,
    title: 'Data Sharing',
    summary: 'Our strict practices regarding third-party sharing and processing.',
    content: [
      'IndiChat does not sell your personal information or credentials to third parties or data brokers.',
      'Information is only shared under limited, necessary circumstances:',
      '• Service Providers: Trusted cloud hosting, delivery networks, and SMS gateway providers operating under strict contractual confidentiality and data protection agreements.',
      '• User-Directed Sharing: When you choose to make content public, share a post to another contact, or initiate a marketplace transaction with another member.',
      '• Legal Requirements: If required by a valid, legally binding court order or governmental process, after thorough legal review.',
    ],
  },
  {
    id: 'user-control',
    number: 7,
    title: 'User Control',
    summary: 'Your rights and capabilities to manage, download, or delete your account information.',
    content: [
      'You maintain comprehensive control over your personal data on IndiChat:',
      '• Access & Update: You can review and update your account details, phone number, email address, and profile settings at any time.',
      '• Privacy Settings Management: You can adjust your visibility preferences, message permissions, and blocked accounts through the Privacy Center.',
      '• Data Portability: You can request a digital archive of your supported account data in a readable format.',
      '• Account Deletion: You can initiate account deletion. Upon verification, your account credentials and personal content are scheduled for permanent removal from active systems in accordance with our data retention schedule.',
    ],
  },
  {
    id: 'policy-updates',
    number: 8,
    title: 'Policy Updates',
    summary: 'How modifications to this policy will be communicated to you.',
    content: [
      'We may update this Privacy Policy periodically to reflect changes in our platform features, technological enhancements, or applicable legal requirements.',
      'When significant changes occur, we will notify you through prominent in-app notices, email communications to your registered address, or announcements on the Privacy Center before the revised policy takes effect.',
      'The "Last Updated" timestamp at the top of this policy indicates the effective date of the latest revisions.',
    ],
  },
  {
    id: 'contact',
    number: 9,
    title: 'Contact',
    summary: 'How to reach our dedicated Data Protection and Privacy team.',
    content: [
      'If you have questions, inquiries, or requests regarding this Privacy Policy, your privacy preferences, or the protection of your personal information, please contact our dedicated privacy office:',
      'Email: privacy@indichat.com',
      'IndiChat Security & Privacy Office',
      'We respond to all verified privacy and data inquiries within reasonable standard timeframes.',
    ],
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What information does IndiChat collect?',
    answer:
      'IndiChat aims to collect only the information necessary to provide secure account access and essential platform functionality. This primarily includes your phone number for authentication and SMS verification, your email address for account recovery and critical notices, securely hashed password credentials, and any optional profile information or content you intentionally choose to share on the platform.',
    category: 'collection',
  },
  {
    id: 'faq-2',
    question: 'How are passwords protected?',
    answer:
      'Passwords must not be stored or displayed as readable plain text. Password credentials are protected using appropriate cryptographic security practices, including salted one-way cryptographic key derivation algorithms (such as Argon2/bcrypt) and transport layer security (TLS 1.3) during transmission, ensuring your plain text password is never accessible to employees or stored in our databases.',
    category: 'security',
  },
  {
    id: 'faq-3',
    question: 'Can I control who sees my content?',
    answer:
      'Yes. IndiChat provides granular privacy controls for supported content and features. You can designate your posts, reels, live streams, or profile as Public, Private, or Custom. With Custom settings, you can define exact permissions for who can view, comment, react, direct message, or reshare your content.',
    category: 'control',
  },
  {
    id: 'faq-4',
    question: 'What happens when I select Private?',
    answer:
      'When a user selects Private mode for supported content or features, that content is not publicly visible and access is restricted according to the user\'s selected privacy settings and authorized service operations. It will not appear in the public discover feed or global search results for unapproved accounts.',
    category: 'control',
  },
  {
    id: 'faq-5',
    question: 'Can I access my account from another device?',
    answer:
      'Yes. You can access your IndiChat account across supported smartphones, tablets, and web browsers. Whenever a new device signs in, we prompt for verification and issue a notification. Through your Security Dashboard, you can review all active sessions and remotely terminate access on any device with one click.',
    category: 'account',
  },
  {
    id: 'faq-6',
    question: 'How does IndiChat protect my account?',
    answer:
      'IndiChat uses appropriate technical and organizational measures designed to protect user information. These include cryptographic session tokens, automated rate-limiting against brute force attacks, intelligent anomaly detection for suspicious sign-ins, optional multi-factor authentication, and continuous infrastructure health monitoring.',
    category: 'security',
  },
  {
    id: 'faq-7',
    question: 'Can I manage my privacy settings?',
    answer:
      'Yes, at any time. You can navigate to the IndiChat Privacy Center in the app or on the web to update visibility defaults, manage blocked accounts, adjust message and mention rules, download an archive of your account data, or request account closure.',
    category: 'control',
  },
];

export const POLICY_SECTIONS = PRIVACY_POLICY_SECTIONS;

export const SECURITY_PILLARS = [
  {
    id: 'pillar-auth',
    algorithm: 'Ed25519 & JWT',
    title: 'Authentication & Session Integrity',
    description: 'Cryptographically signed session tokens and multi-factor authorization safeguards prevent session hijacking.',
  },
  {
    id: 'pillar-hashing',
    algorithm: 'Argon2id / PBKDF2',
    title: 'Irreversible Password Hashing',
    description: 'User passwords and admin credentials undergo salted key derivation with 100,000+ iterations before storage.',
  },
  {
    id: 'pillar-transport',
    algorithm: 'TLS 1.3 / AES-256-GCM',
    title: 'Transport Layer Protection',
    description: 'Every socket and HTTP request is encrypted in flight with perfect forward secrecy and modern cipher suites.',
  },
  {
    id: 'pillar-ratelimit',
    algorithm: 'Token Bucket / Heuristic',
    title: 'Adaptive Brute-Force Defense',
    description: 'Intelligent request throttling and suspicious signature scoring isolate unauthorized credential testing.',
  },
  {
    id: 'pillar-storage',
    algorithm: 'AES-GCM at Rest',
    title: 'Hardened Database Storage',
    description: 'Database engines encrypt sensitive columns and configuration states behind platform security boundaries.',
  },
  {
    id: 'pillar-rbac',
    algorithm: 'Zero Trust & RBAC',
    title: 'Least Privilege Access Governance',
    description: 'Strict Role-Based Access Control governs administrative access with immutable telemetry logging.',
  },
];

export const DATA_FLOW_STEPS = [
  {
    step: 1,
    title: 'Credential Ingestion & Pre-Hashing',
    description: 'Data submitted across client portals is encapsulated in TLS 1.3 tunnels and verified before database dispatch.',
    summary: 'Data submitted across client portals is encapsulated in TLS 1.3 tunnels and verified before database dispatch.',
    status: 'Operational',
    standard: 'TLS 1.3 Mandatory',
  },
  {
    step: 2,
    title: 'Cryptographic Salt & One-Way Key Derivation',
    description: 'PBKDF2 / Argon2id applies unique cryptographic entropy per record to guarantee zero plaintext exposure.',
    summary: 'PBKDF2 / Argon2id applies unique cryptographic entropy per record to guarantee zero plaintext exposure.',
    status: 'Enforced',
    standard: '100,000 Iterations',
  },
  {
    step: 3,
    title: 'Session Token Generation & Ephemeral Lifespan',
    description: 'Cryptographically random tokens issued with explicit expiration times prevent replay vulnerabilities.',
    summary: 'Cryptographically random tokens issued with explicit expiration times prevent replay vulnerabilities.',
    status: 'Active',
    standard: 'Secure Bearer Token',
  },
  {
    step: 4,
    title: 'Audit Logging & Anomaly Scoring',
    description: 'Every authentication event records tamper-resistant telemetry without logging plaintext credentials.',
    summary: 'Every authentication event records tamper-resistant telemetry without logging plaintext credentials.',
    status: 'Monitored',
    standard: 'Zero-Credential Logging',
  },
  {
    step: 5,
    title: 'Encrypted Persistence & Isolation',
    description: 'Administrative and public data partitions maintain strict role isolation and automated backups.',
    summary: 'Administrative and public data partitions maintain strict role isolation and automated backups.',
    status: 'Isolated',
    standard: 'Multi-Tenant Isolation',
  },
];
