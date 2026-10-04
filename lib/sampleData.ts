import { ColumnDef, ReportMeta, ReportRow } from './types';

export const DEFAULT_COLUMNS: ColumnDef[] = [
  { id: 'col_no', key: 'no', label: 'No', width: 8, align: 'center', type: 'number' },
  { id: 'col_subject', key: 'subject', label: 'Subject', width: 34, align: 'left', type: 'text' },
  { id: 'col_pub', key: 'publication', label: 'Publication', width: 22, align: 'left', type: 'text' },
  { id: 'col_page', key: 'pageNo', label: 'Page No', width: 12, align: 'center', type: 'text' },
  { id: 'col_section', key: 'section', label: 'Section', width: 18, align: 'left', type: 'text' },
  { id: 'col_heading', key: 'heading', label: 'Heading With Link', width: 50, align: 'left', type: 'link_image' },
];

export const DEFAULT_REPORT_META: ReportMeta = {
  companyName: 'Red Apple PR  PVT LTD',
  reportTitle: 'Media Monitoring Daily Update',
  reportDate: '24th August 2026',
  clickInstruction: '(Kindly click the link)',
  quickCategoryTabs: [
    'Digital & Economy News - PRESS',
    'Digital & Economy News - E News',
  ],
  sectionTitle: 'PRESS',
  footerNote: 'End of Press Report',
  themeColor: '#1E3A8A', // Deep corporate navy
  textColor: '#FFFFFF',
  mergeDuplicateSubjects: true,
  embedThumbnailsInExcel: true,
};

// Generates a sample newspaper clipping SVG data URL for Himalayn Editorial.jpg
export function createSampleEditorialImage(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="20" y="20" width="560" height="45" fill="#1e3a8a"/>
    <text x="300" y="50" font-family="Georgia, serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">HIMALAYAN EDITORIAL - PRESS CUTTING</text>
    
    <text x="35" y="95" font-family="Arial, sans-serif" font-size="12" fill="#64748b">PUBLICATION: E-DailyFT.lk · SECTION: Business · PAGE: ii · DATE: 24th August 2026</text>
    <line x1="30" y1="108" x2="570" y2="108" stroke="#94a3b8" stroke-width="1.5"/>
    
    <text x="35" y="140" font-family="Georgia, serif" font-size="18" font-weight="bold" fill="#0f172a">Digital Payments, Fintech &amp; Financial Sector Regulation</text>
    <text x="35" y="170" font-family="Arial, sans-serif" font-size="13" fill="#334155">Central Bank accelerates national payment switch upgrades as digital transaction volumes</text>
    <text x="35" y="190" font-family="Arial, sans-serif" font-size="13" fill="#334155">surge across leading retail banks. Regulatory oversight tightens on open banking APIs</text>
    <text x="35" y="210" font-family="Arial, sans-serif" font-size="13" fill="#334155">and cross-border merchant settlements under the revised fintech guideline framework.</text>

    <rect x="35" y="235" width="250" height="130" fill="#e2e8f0" stroke="#94a3b8" stroke-dasharray="3,3"/>
    <text x="160" y="305" font-family="Arial, sans-serif" font-size="13" fill="#475569" text-anchor="middle">[ INFOGRAPHIC / PRESS SCAN ]</text>

    <text x="305" y="255" font-family="Arial, sans-serif" font-size="12" fill="#334155">"The integration of modern payment systems</text>
    <text x="305" y="275" font-family="Arial, sans-serif" font-size="12" fill="#334155">remains paramount for economic stability</text>
    <text x="305" y="295" font-family="Arial, sans-serif" font-size="12" fill="#334155">and micro-enterprise growth in the region."</text>
    <text x="305" y="325" font-family="Arial, sans-serif" font-size="11" font-style="italic" fill="#64748b">— Financial Markets Taskforce Report</text>
    
    <rect x="305" y="345" width="265" height="22" fill="#dbeafe"/>
    <text x="437" y="360" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#1e40af" text-anchor="middle">VERIFIED MEDIA CLIPPING · RED APPLE PR</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_REPORT_ROWS: ReportRow[] = [
  {
    id: 'row-1',
    no: 1,
    subject: 'Digital Payments, Fintech & Financial Sector Regulation',
    publication: 'E-DailyFT.lk',
    pageNo: 'ii',
    section: 'Business',
    heading: 'Himalayn Editorial.jpg',
    imageName: 'Himalayn Editorial.jpg',
    imageDataUrl: createSampleEditorialImage(),
    linkUrl: '/api/uploads/Himalayn_Editorial.jpg',
  },
  {
    id: 'row-2',
    no: 2,
    subject: '',
    publication: 'E-DailyFT.lk',
    pageNo: '1',
    section: 'News',
    heading: 'New AML law widens liability risks for bank staff: Justice Nawaz',
    linkUrl: 'https://www.ft.lk/top-story/New-AML-law-widens-liability-risks-for-bank-staff/26-765432',
  },
  {
    id: 'row-3',
    no: 3,
    subject: '',
    publication: 'The Morning',
    pageNo: '10',
    section: 'business',
    heading: 'Phoenix IT Lanka wins Check Point SMB award for second consecutive year',
    linkUrl: 'https://www.themorning.lk/articles/phoenix-it-lanka-check-point-award',
  },
  {
    id: 'row-4',
    no: 4,
    subject: 'Digital, Technology, Data & Platform-Related Legislation',
    publication: 'The Island',
    pageNo: '10',
    section: 'Entertainment',
    heading: 'Digital transformation of hobbies',
    linkUrl: 'https://island.lk/digital-transformation-of-hobbies/',
  },
  {
    id: 'row-5',
    no: 5,
    subject: '',
    publication: 'Daily FT',
    pageNo: '9',
    section: 'IT/Telecom',
    heading: 'Sleeping data, living risks: Protecting what your organisation stores in the dark',
    linkUrl: 'https://www.ft.lk/it-telecom-tech/Sleeping-data-living-risks/10526-765431',
  },
  {
    id: 'row-6',
    no: 6,
    subject: '',
    publication: 'E-DailyFT.lk',
    pageNo: '9',
    section: 'IT/Telecom',
    heading: 'Kaspersky GReAT expert details risks when blind trust in AI moves faster than verification',
    linkUrl: 'https://www.ft.lk/it-telecom-tech/Kaspersky-GReAT-expert-details-risks/10526-765430',
  },
  {
    id: 'row-7',
    no: 7,
    subject: 'Import Duties, Customs, Local Taxation & Fiscal Policy',
    publication: 'Daily News',
    pageNo: '1',
    section: 'News',
    heading: 'Govt revenue reaches Rs. 2.956 trillion upto June 30',
    linkUrl: 'https://www.dailynews.lk/2026/08/24/local/govt-revenue-june-record',
  },
  {
    id: 'row-8',
    no: 8,
    subject: '',
    publication: 'Daily News',
    pageNo: '5',
    section: 'News',
    heading: 'President directs expediting tank rehabilitation to withstand EL Nino effect',
    linkUrl: 'https://www.dailynews.lk/2026/08/24/local/tank-rehabilitation-el-nino',
  },
  {
    id: 'row-9',
    no: 9,
    subject: '',
    publication: 'Daily Mirror',
    pageNo: '7',
    section: 'Business',
    heading: "People's Bank sustains strong growth momentum with Rs.32.6BN record pre-tax profit in 1H 2026",
    linkUrl: 'https://www.dailymirror.lk/business/Peoples-Bank-records-32bn-profit/215-289012',
  },
  {
    id: 'row-10',
    no: 10,
    subject: '',
    publication: 'The Morning',
    pageNo: '3',
    section: 'News',
    heading: 'Rs 10 m for Muslim places of worship in Gampaha',
    linkUrl: 'https://www.themorning.lk/articles/worship-places-gampaha-allocation',
  },
  {
    id: 'row-11',
    no: 11,
    subject: '',
    publication: 'E-DailyFT.lk',
    pageNo: 'ii',
    section: 'Business',
    heading: 'NCE to lead exporters’ delegation to India to unlock new opportunities',
    linkUrl: 'https://www.ft.lk/business/NCE-to-lead-exporters-delegation-to-India/34-765428',
  },
  {
    id: 'row-12',
    no: 12,
    subject: 'Political & Macroeconomic Developments , affecting the operating Environment',
    publication: 'E-DailyFT.lk',
    pageNo: '16',
    section: 'Issues/Opinion',
    heading: 'Economic Reforms: Do it now',
    linkUrl: 'https://www.ft.lk/columns/Economic-Reforms-Do-it-now/4-765425',
  },
  {
    id: 'row-13',
    no: 13,
    subject: '',
    publication: 'The Morning',
    pageNo: '9',
    section: 'business',
    heading: "Sri Lanka's logistics sector needs reforms, FDI to drive growth",
    linkUrl: 'https://www.themorning.lk/articles/sri-lanka-logistics-fdi-reforms',
  },
  {
    id: 'row-14',
    no: 14,
    subject: '',
    publication: 'The Morning',
    pageNo: '11',
    section: 'business',
    heading: 'Historic milestone in Sri Lankan pineapple exports to Pakistan',
    linkUrl: 'https://www.themorning.lk/articles/pineapple-exports-pakistan-milestone',
  },
  {
    id: 'row-15',
    no: 15,
    subject: '',
    publication: 'The Morning',
    pageNo: '4',
    section: 'issues',
    heading: '22A amid international scrutiny',
    linkUrl: 'https://www.themorning.lk/articles/22a-international-scrutiny-analysis',
  },
  {
    id: 'row-16',
    no: 16,
    subject: '',
    publication: 'The Island',
    pageNo: '8',
    section: 'Financial Review',
    heading: 'Economic managers face urgent need for vigilant policy management amid external pressures',
    linkUrl: 'https://island.lk/economic-managers-face-urgent-need-for-vigilant-policy/',
  },
  {
    id: 'row-17',
    no: 17,
    subject: 'Device , electronic &hardware related policy and regulation',
    publication: 'The Island',
    pageNo: '8',
    section: 'Financial Review',
    heading: 'Foreign diplomats briefed on Sri Lanka Economic and Investment Summit 2026',
    linkUrl: 'https://island.lk/foreign-diplomats-briefed-on-sri-lanka-economic-summit/',
  },
  {
    id: 'row-18',
    no: 18,
    subject: '',
    publication: 'Daily Mirror',
    pageNo: '7',
    section: 'Business',
    heading: 'As inflation bites, shoppers ditch brand for bargains',
    linkUrl: 'https://www.dailymirror.lk/business/Shoppers-ditch-brands-for-bargains/215-289010',
  },
  {
    id: 'row-19',
    no: 19,
    subject: '',
    publication: 'The Morning',
    pageNo: '',
    section: 'business',
    heading: 'Foreign diplomats briefed on Ceylon Chamber of Commerce Economic and Investment Summit 2026',
    linkUrl: 'https://www.themorning.lk/articles/diplomats-ceylon-chamber-summit',
  },
  {
    id: 'row-20',
    no: 20,
    subject: '',
    publication: 'The Island',
    pageNo: '3',
    section: 'News',
    heading: "UN welcomes Sri Lanka's efforts to bring back refugees from India",
    linkUrl: 'https://island.lk/un-welcomes-efforts-refugees-india/',
  },
  {
    id: 'row-21',
    no: 21,
    subject: '',
    publication: 'Daily News',
    pageNo: '11',
    section: 'business',
    heading: 'NCE to lead exporters’ delegation to India to unlock new market opportunities',
    linkUrl: 'https://www.dailynews.lk/2026/08/24/business/nce-delegation-india',
  },
  {
    id: 'row-22',
    no: 22,
    subject: '',
    publication: 'The Morning',
    pageNo: '9',
    section: 'business',
    heading: 'Multilateral borrowing set to get costlier: WB',
    linkUrl: 'https://www.themorning.lk/articles/multilateral-borrowing-costlier-world-bank',
  },
  {
    id: 'row-23',
    no: 23,
    subject: '',
    publication: 'The Morning',
    pageNo: '11',
    section: 'business',
    heading: 'NCE to lead exporters’ delegation to India to unlock new market opportunities',
    linkUrl: 'https://www.themorning.lk/articles/nce-exporters-india-delegation-2',
  },
];
