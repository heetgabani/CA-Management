// ============================================================
// CA-MANAGE COMPREHENSIVE SEED
// Gabani & Associates — Realistic Demo Data
// ============================================================
import {
  PrismaClient,
  UserRole,
  UserStatus,
  ClientType,
  ClientStatus,
  TaskStatus,
  TaskPriority,
  ComplianceType,
  ComplianceStatus,
  DocumentCategory,
  PhysicalFileStatus,
  NotificationType,
  AuditAction,
  LeadSource,
  StorageProvider,
  ReminderType,
  ReminderChannel,
  ReminderStatus,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── Helpers ──────────────────────────────────────────────
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function daysAgo(n: number) { return new Date(Date.now() - n * 86_400_000); }
function daysFromNow(n: number) { return new Date(Date.now() + n * 86_400_000); }
function rDate(start: Date, end: Date) { return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())); }
function fileSize(minKB: number, maxKB: number): bigint { return BigInt(rInt(minKB * 1024, maxKB * 1024)); }
function pad(n: number, w = 3) { return String(n).padStart(w, '0'); }
const FY = '2024-25';
const FY_NEXT = '2025-26';

// ─── Static Data ──────────────────────────────────────────
const GUJARATI_CITIES = ['Surat', 'Ahmedabad', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar', 'Navsari', 'Anand', 'Bharuch'];
const IP_LIST = ['192.168.1.10', '192.168.1.15', '192.168.1.20', '103.45.67.89', '103.45.67.91', '182.74.1.23'];
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Safari/604',
];

const BULK_INDIVIDUALS = [
  { first: 'Suresh', last: 'Kumar', email: 'suresh.kumar@gmail.com', mobile: '9825001001', city: 'Surat', pan: 'ABCPK1234A', occ: 'Software Developer' },
  { first: 'Anita', last: 'Sharma', email: 'anita.sharma@gmail.com', mobile: '9825001002', city: 'Ahmedabad', pan: 'BCDAT5678B', occ: 'Teacher' },
  { first: 'Deepak', last: 'Patel', email: 'deepak.patel@gmail.com', mobile: '9825001003', city: 'Surat', pan: 'CDEPL9012C', occ: 'Doctor' },
  { first: 'Meena', last: 'Joshi', email: 'meena.joshi@gmail.com', mobile: '9825001004', city: 'Rajkot', pan: 'DEFMJ3456D', occ: 'Homemaker' },
  { first: 'Vijay', last: 'Mehta', email: 'vijay.mehta@gmail.com', mobile: '9825001005', city: 'Vadodara', pan: 'EFGVM7890E', occ: 'Businessman' },
  { first: 'Kavita', last: 'Shah', email: 'kavita.shah@gmail.com', mobile: '9825001006', city: 'Surat', pan: 'FGHKS2345F', occ: 'Chartered Accountant' },
  { first: 'Ravi', last: 'Trivedi', email: 'ravi.trivedi@gmail.com', mobile: '9825001007', city: 'Ahmedabad', pan: 'GHIRT6789G', occ: 'Retired Banker' },
  { first: 'Pooja', last: 'Gupta', email: 'pooja.gupta@gmail.com', mobile: '9825001008', city: 'Surat', pan: 'HIJPG0123H', occ: 'IT Professional' },
  { first: 'Nitin', last: 'Agarwal', email: 'nitin.agarwal@gmail.com', mobile: '9825001009', city: 'Ahmedabad', pan: 'IJKNA4567I', occ: 'Lawyer' },
  { first: 'Sona', last: 'Patel', email: 'sona.patel@gmail.com', mobile: '9825001010', city: 'Surat', pan: 'JKLSP8901J', occ: 'Fashion Designer' },
  { first: 'Abhishek', last: 'Tiwari', email: 'abhishek.tiwari@gmail.com', mobile: '9825001011', city: 'Vadodara', pan: 'KLMAT3456K', occ: 'Marketing Manager' },
  { first: 'Heena', last: 'Modi', email: 'heena.modi@gmail.com', mobile: '9825001012', city: 'Surat', pan: 'LMNHM7890L', occ: 'Jewellery Business' },
  { first: 'Chirag', last: 'Patel', email: 'chirag.patel@gmail.com', mobile: '9825001013', city: 'Surat', pan: 'MNOCP2345M', occ: 'Restaurant Owner' },
  { first: 'Bhavna', last: 'Shah', email: 'bhavna.shah@gmail.com', mobile: '9825001014', city: 'Ahmedabad', pan: 'NOPBS6789N', occ: 'Nurse' },
  { first: 'Yash', last: 'Trivedi', email: 'yash.trivedi@gmail.com', mobile: '9825001015', city: 'Surat', pan: 'OPQYT1234O', occ: 'Freelancer' },
  { first: 'Priti', last: 'Jain', email: 'priti.jain@gmail.com', mobile: '9825001016', city: 'Rajkot', pan: 'PQRPJ5678P', occ: 'Teacher' },
  { first: 'Mihir', last: 'Desai', email: 'mihir.desai@gmail.com', mobile: '9825001017', city: 'Ahmedabad', pan: 'QRSMD9012Q', occ: 'Architect' },
  { first: 'Trupti', last: 'Patel', email: 'trupti.patel@gmail.com', mobile: '9825001018', city: 'Navsari', pan: 'RSTTP3456R', occ: 'Homemaker' },
  { first: 'Sanjay', last: 'Kapoor', email: 'sanjay.kapoor@gmail.com', mobile: '9825001019', city: 'Surat', pan: 'STUSK7890S', occ: 'Sales Manager' },
  { first: 'Dimple', last: 'Patel', email: 'dimple.patel@gmail.com', mobile: '9825001020', city: 'Surat', pan: 'TUVDP2345T', occ: 'Pharmacist' },
  { first: 'Harshil', last: 'Shah', email: 'harshil.shah@gmail.com', mobile: '9825001021', city: 'Ahmedabad', pan: 'UVWHS6789U', occ: 'Stock Trader' },
  { first: 'Ritu', last: 'Agarwal', email: 'ritu.agarwal@gmail.com', mobile: '9825001022', city: 'Surat', pan: 'VWXRA0123V', occ: 'Event Manager' },
];

const BULK_PROPRIETORSHIPS = [
  { name: 'Modi Textiles', owner: 'Sunil Modi', gstin: '24MODTX1234F1Z5', pan: 'ABCMT1234A', industry: 'Textile Trading', city: 'Surat' },
  { name: 'Patel Enterprises', owner: 'Kalpesh Patel', gstin: '24PATEN4567G1Z6', pan: 'BCDEN4567B', industry: 'General Merchant', city: 'Surat' },
  { name: 'Shah Saree House', owner: 'Nilesh Shah', gstin: '24SHASR7890H1Z7', pan: 'CDESR7890C', industry: 'Saree Retail', city: 'Surat' },
  { name: 'Gupta Hardware', owner: 'Arun Gupta', gstin: '24GUPTH2345I1Z8', pan: 'DEFGH2345D', industry: 'Hardware Supplies', city: 'Ahmedabad' },
  { name: 'Trivedi Consultancy', owner: 'Paresh Trivedi', gstin: '24TRIVC6789J1Z9', pan: 'EFGTC6789E', industry: 'Business Consulting', city: 'Surat' },
  { name: 'Jain Jewellers', owner: 'Mahesh Jain', gstin: '24JAINJ1234K1Z0', pan: 'FGHIJ1234F', industry: 'Gold Jewellery', city: 'Surat' },
  { name: 'Kumar Pharma', owner: 'Rakesh Kumar', gstin: '24KUMRP5678L1Z1', pan: 'GHIKP5678G', industry: 'Pharma Distribution', city: 'Vadodara' },
  { name: 'Singh Transport', owner: 'Gurpreet Singh', gstin: '24SINGT9012M1Z2', pan: 'HIJST9012H', industry: 'Logistics', city: 'Ahmedabad' },
  { name: 'Desai Digital', owner: 'Vishal Desai', gstin: '24DESAD3456N1Z3', pan: 'IJKDD3456I', industry: 'IT Services', city: 'Surat' },
  { name: 'Mehta Medicals', owner: 'Hiren Mehta', gstin: '24MEHTM7890O1Z4', pan: 'JKLMM7890J', industry: 'Medical Equipment', city: 'Rajkot' },
  { name: 'Patel Agro', owner: 'Bhupesh Patel', gstin: '24PATAG2345P1Z5', pan: 'KLMPA2345K', industry: 'Agricultural Products', city: 'Anand' },
  { name: 'Shah Construction', owner: 'Dilip Shah', gstin: '24SHAHC6789Q1Z6', pan: 'LMNSC6789L', industry: 'Building Contractor', city: 'Surat' },
  { name: 'Agarwal Foods', owner: 'Ramesh Agarwal', gstin: '24AGARW1234R1Z7', pan: 'MNOAF1234M', industry: 'Food Processing', city: 'Vadodara' },
  { name: 'Modi Electronics', owner: 'Lalit Modi', gstin: '24MODLE5678S1Z8', pan: 'NOPME5678N', industry: 'Electronics Retail', city: 'Ahmedabad' },
  { name: 'Kapoor Printing', owner: 'Sudhir Kapoor', gstin: '24KPOPR9012T1Z9', pan: 'OPQKP9012O', industry: 'Printing Services', city: 'Surat' },
];

const BULK_PARTNERSHIPS = [
  { name: 'Patel & Brothers Trading', partners: 'Dinesh Patel, Mahesh Patel', gstin: '24PATBR1234A1Z5', pan: 'ABCPB1234A', city: 'Surat' },
  { name: 'Shah & Shah Exports', partners: 'Haresh Shah, Naresh Shah', gstin: '24SHAEX5678B1Z6', pan: 'BCDES5678B', city: 'Surat' },
  { name: 'Mehta & Associates Consulting', partners: 'Dilip Mehta, Chirag Mehta', gstin: '24METAC9012C1Z7', pan: 'CDEMC9012C', city: 'Ahmedabad' },
  { name: 'Gujarat Steel Works', partners: 'Ramesh Patel, Suresh Patel', gstin: '24GUJSW3456D1Z8', pan: 'DEFGS3456D', city: 'Rajkot' },
  { name: 'Surat Diamond House', partners: 'Vijay Shah, Ajay Shah', gstin: '24SURDH7890E1Z9', pan: 'EFGSD7890E', city: 'Surat' },
  { name: 'Rajkot Precision Parts', partners: 'Ashok Trivedi, Niren Trivedi', gstin: '24RAJPP2345F1Z0', pan: 'FGHRP2345F', city: 'Rajkot' },
  { name: 'Vadodara Chemicals', partners: 'Anil Joshi, Sunil Joshi', gstin: '24VADCH6789G1Z1', pan: 'GHIVC6789G', city: 'Vadodara' },
  { name: 'Ahmedabad Realty', partners: 'Bimal Desai, Kamal Desai', gstin: '24AHMAR1234H1Z2', pan: 'HIJAR1234H', industry: 'Real Estate', city: 'Ahmedabad' },
  { name: 'Gandhinagar Software Solutions', partners: 'Ronak Bhatt, Mitesh Bhatt', gstin: '24GANSS5678I1Z3', pan: 'IJKGS5678I', city: 'Gandhinagar' },
  { name: 'Anand Dairy Products', partners: 'Jayesh Amin, Alpesh Amin', gstin: '24ANADP9012J1Z4', pan: 'JKLAD9012J', city: 'Anand' },
];

const BULK_LLPS = [
  { name: 'TechStar LLP', llpin: 'AAA-1234', gstin: '24TECST1234A1Z5', pan: 'AABTS1234A', city: 'Surat' },
  { name: 'Innovate Solutions LLP', llpin: 'AAB-5678', gstin: '24INNSL5678B1Z6', pan: 'AACIS5678B', city: 'Ahmedabad' },
  { name: 'Green Energy LLP', llpin: 'AAC-9012', gstin: '24GRENE9012C1Z7', pan: 'AADGE9012C', city: 'Gandhinagar' },
  { name: 'Coastal Exports LLP', llpin: 'AAD-3456', gstin: '24COAEX3456D1Z8', pan: 'AAECE3456D', city: 'Surat' },
  { name: 'MediCare LLP', llpin: 'AAE-7890', gstin: '24MEDCR7890E1Z9', pan: 'AAFMC7890E', city: 'Ahmedabad' },
];

const BULK_PVT_LTD = [
  { name: 'Surat Polyester Pvt Ltd', cin: 'U17100GJ2018PTC123456', gstin: '24SURPL1234A1Z5', pan: 'AAGSP1234A', city: 'Surat' },
  { name: 'Gujarat Pharma Pvt Ltd', cin: 'U24230GJ2019PTC234567', gstin: '24GUJPH5678B1Z6', pan: 'AAHGP5678B', city: 'Ahmedabad' },
  { name: 'Innovex Technologies Pvt Ltd', cin: 'U72200GJ2020PTC345678', gstin: '24INNXT9012C1Z7', pan: 'AAIIT9012C', city: 'Surat' },
];

const DOC_NAMES_BY_CATEGORY: Record<string, string[]> = {
  KYC: ['Aadhaar Card.pdf', 'PAN Card.pdf', 'Passport Copy.pdf', 'Voter ID.pdf', 'Driving License.pdf', 'Electricity Bill.pdf'],
  GST: ['GST Certificate.pdf', 'GSTR-1.pdf', 'GSTR-3B.pdf', 'GSTR-9.pdf', 'GST Audit Report.pdf', 'Input Tax Credit Ledger.pdf'],
  INCOME_TAX: ['ITR Acknowledgement.pdf', 'Form 16.pdf', 'Form 16A.pdf', 'Tax Computation.pdf', 'Capital Gains Statement.pdf'],
  AUDIT: ['Audit Report FY2025.pdf', 'Balance Sheet FY2025.pdf', 'P&L Statement FY2025.pdf', 'Cash Flow Statement.pdf', 'Notes to Accounts.pdf'],
  BANK_STATEMENTS: ['Bank Statement Mar2025.pdf', 'Bank Statement Feb2025.pdf', 'FD Certificate.pdf', 'Bank Certificate.pdf'],
  AGREEMENTS: ['Partnership Deed.pdf', 'LLP Agreement.pdf', 'Rent Agreement.pdf', 'MOU.pdf', 'Service Agreement.pdf'],
  LICENSES: ['Trade License.pdf', 'Udyam Certificate.pdf', 'FSSAI License.pdf', 'Drug License.pdf', 'Import Export Code.pdf'],
  ROC: ['MOA.pdf', 'AOA.pdf', 'Certificate of Incorporation.pdf', 'DIR-3 KYC.pdf', 'ROC Annual Return.pdf'],
  DSC: ['DSC Certificate.pdf', 'DSC Renewal Application.pdf'],
  TDS: ['Form 26AS.pdf', 'TDS Certificate.pdf', 'TDS Return.pdf', 'Traces Statement.pdf'],
  FINANCIAL_STATEMENTS: ['Trial Balance.xlsx', 'Ledger Report.xlsx', 'Purchase Register.xlsx', 'Sales Register.xlsx'],
  OTHER: ['Investment Proofs.pdf', 'Insurance Policy.pdf', 'Property Documents.pdf', 'Court Order.pdf'],
};

const TASK_TITLES = [
  'Prepare ITR for AY 2025-26', 'File GSTR-3B for March 2025', 'Collect Investment Proofs',
  'Prepare Balance Sheet FY2025', 'TDS Return Q4 FY2025', 'ROC Annual Filing',
  'DSC Renewal Application', 'Audit Documentation Compilation', 'Bank Reconciliation Statement',
  'Advance Tax Calculation Q1 FY2026', 'GST Annual Return GSTR-9', 'PF/ESI Compliance Check',
  'Income Tax Notice Reply', 'Form 16 Issuance', 'Professional Tax Filing',
  'Board Resolution Drafting', 'DIR-3 KYC Filing', 'Udyam Registration',
  'MSME Certificate Renewal', 'Capital Gains Statement Preparation', 'Form 26AS Reconciliation',
  'Partner Current Account Statement', 'Prepare Cash Flow Statement', 'Review Loan Documents',
  'Verify GST Input Credit', 'Collect Bank Statement', 'Update Depreciation Schedule',
  'Prepare Salary Register', 'File PT Return', 'Respond to GST Notice',
];

const COMPLIANCE_TITLES_BY_TYPE: Partial<Record<ComplianceType, string[]>> = {
  GST_MONTHLY: ['GSTR-3B Filing — March 2025', 'GSTR-3B Filing — February 2025', 'GSTR-3B Filing — January 2025', 'GSTR-1 Filing — March 2025'],
  GST_QUARTERLY: ['GSTR-1 Quarterly — Q4 FY2025', 'GSTR-3B Quarterly — Q3 FY2025'],
  GST_ANNUAL: ['GSTR-9 Annual Return FY2025', 'GSTR-9C Reconciliation FY2025'],
  TDS_QUARTERLY: ['TDS Return Q4 FY2025', 'TDS Return Q3 FY2025', 'TDS Return Q2 FY2025'],
  INCOME_TAX: ['ITR Filing AY 2025-26', 'ITR Filing AY 2024-25', 'Advance Tax Q1 FY2026'],
  AUDIT: ['Tax Audit Report FY2025', 'Statutory Audit FY2025', 'Internal Audit Q4'],
  ROC_ANNUAL: ['ROC Annual Return FY2025', 'MGT-7 Filing', 'AOC-4 Financial Filing'],
  DSC_RENEWAL: ['DSC Renewal — Class 3', 'DSC Renewal — Class 2', 'DSC Upgrade to Class 3'],
  PROFESSIONAL_TAX: ['Professional Tax Return FY2025', 'PT Registration Renewal'],
  ADVANCE_TAX: ['Advance Tax Q1 FY2026', 'Advance Tax Q4 FY2025', 'Advance Tax Q3 FY2025'],
  CUSTOM: ['Loan NOC from Bank', 'Net Worth Certificate', 'Turnover Certificate', 'Project Report Preparation'],
};

async function main() {
  console.log('🌱 Seeding Gabani & Associates...\n');

  // ── Guard: skip if already seeded ──────────────────────
  const existing = await prisma.tenant.findUnique({ where: { slug: 'gabani-associates' } });
  if (existing) {
    console.log('⚠️  Already seeded. Run "prisma migrate reset" to re-seed.');
    return;
  }

  // ═══════════════════════════════════════════════════════
  // PERMISSIONS
  // ═══════════════════════════════════════════════════════
  console.log('🔑 Creating permissions...');
  const permDefs = [
    { module: 'client', action: 'create' }, { module: 'client', action: 'read' },
    { module: 'client', action: 'update' }, { module: 'client', action: 'delete' },
    { module: 'client', action: 'export' }, { module: 'document', action: 'upload' },
    { module: 'document', action: 'read' }, { module: 'document', action: 'delete' },
    { module: 'document', action: 'share' }, { module: 'document', action: 'download' },
    { module: 'task', action: 'create' }, { module: 'task', action: 'read' },
    { module: 'task', action: 'update' }, { module: 'task', action: 'delete' },
    { module: 'task', action: 'assign' }, { module: 'compliance', action: 'create' },
    { module: 'compliance', action: 'read' }, { module: 'compliance', action: 'update' },
    { module: 'compliance', action: 'delete' }, { module: 'staff', action: 'invite' },
    { module: 'staff', action: 'read' }, { module: 'staff', action: 'update' },
    { module: 'staff', action: 'remove' }, { module: 'firm', action: 'read' },
    { module: 'firm', action: 'update' }, { module: 'reports', action: 'read' },
    { module: 'reports', action: 'export' }, { module: 'audit', action: 'read' },
  ];
  for (const p of permDefs) {
    await prisma.permission.upsert({
      where: { module_action: p }, update: {}, create: p,
    });
  }

  // ═══════════════════════════════════════════════════════
  // SUPER ADMIN TENANT
  // ═══════════════════════════════════════════════════════
  const superTenant = await prisma.tenant.upsert({
    where: { slug: 'super-admin' },
    update: {},
    create: { slug: 'super-admin', name: 'LedgerFlow Admin', plan: 'enterprise', maxUsers: 9999, maxStorage: BigInt(1_099_511_627_776) },
  });
  const superHash = await bcrypt.hash('SuperAdmin@123', 12);
  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: superTenant.id, email: 'admin@camanage.in' } },
    update: {},
    create: { tenantId: superTenant.id, email: 'admin@camanage.in', passwordHash: superHash, firstName: 'Super', lastName: 'Admin', role: 'SUPER_ADMIN', status: 'ACTIVE', isEmailVerified: true },
  });

  // ═══════════════════════════════════════════════════════
  // GABANI & ASSOCIATES TENANT + FIRM
  // ═══════════════════════════════════════════════════════
  console.log('🏢 Creating Gabani & Associates...');
  const tenant = await prisma.tenant.create({
    data: {
      slug: 'gabani-associates',
      name: 'Gabani & Associates',
      plan: 'professional',
      maxUsers: 25,
      maxStorage: BigInt(53_687_091_200), // 50 GB
      planExpiry: daysFromNow(365),
    },
  });

  const firm = await prisma.firm.create({
    data: {
      tenantId: tenant.id,
      name: 'Gabani & Associates',
      displayName: 'Gabani & Associates — Chartered Accountants',
      gstNumber: '24GABAN1234A1Z5',
      pan: 'GABAN1234A',
      tan: 'SRTA12345A',
      email: 'info@gabaniassociates.in',
      phone: '9824001234',
      website: 'www.gabaniassociates.in',
      addresses: {
        create: {
          line1: '304, Titanium City Centre',
          line2: 'Anand Nagar',
          city: 'Surat',
          state: 'Gujarat',
          pincode: '395007',
          isPrimary: true,
        },
      },
    },
  });

  // ═══════════════════════════════════════════════════════
  // STAFF — 8 MEMBERS
  // ═══════════════════════════════════════════════════════
  console.log('👥 Creating staff members...');
  const staffHash = await bcrypt.hash('Staff@1234', 12);
  const ownerHash = await bcrypt.hash('Heet@1234', 12);

  const staffDefs = [
    { first: 'Heet', last: 'Gabani', email: 'gabanihh@gmail.com', phone: '9824567890', role: UserRole.FIRM_OWNER, hash: ownerHash, joined: daysAgo(730), lastLogin: daysAgo(0) },
    { first: 'Rajesh', last: 'Patel', email: 'rajesh.patel@gabaniassociates.in', phone: '9824111101', role: UserRole.PARTNER, hash: staffHash, joined: daysAgo(680), lastLogin: daysAgo(1) },
    { first: 'Priya', last: 'Shah', email: 'priya.shah@gabaniassociates.in', phone: '9824111102', role: UserRole.MANAGER, hash: staffHash, joined: daysAgo(540), lastLogin: daysAgo(0) },
    { first: 'Amit', last: 'Desai', email: 'amit.desai@gabaniassociates.in', phone: '9824111103', role: UserRole.ACCOUNTANT, hash: staffHash, joined: daysAgo(420), lastLogin: daysAgo(2) },
    { first: 'Neha', last: 'Mehta', email: 'neha.mehta@gabaniassociates.in', phone: '9824111104', role: UserRole.ACCOUNTANT, hash: staffHash, joined: daysAgo(380), lastLogin: daysAgo(1) },
    { first: 'Rahul', last: 'Joshi', email: 'rahul.joshi@gabaniassociates.in', phone: '9824111105', role: UserRole.EXECUTIVE, hash: staffHash, joined: daysAgo(270), lastLogin: daysAgo(0) },
    { first: 'Karan', last: 'Modi', email: 'karan.modi@gabaniassociates.in', phone: '9824111106', role: UserRole.EXECUTIVE, hash: staffHash, joined: daysAgo(180), lastLogin: daysAgo(3) },
    { first: 'Riya', last: 'Patel', email: 'riya.patel@gabaniassociates.in', phone: '9824111107', role: UserRole.INTERN, hash: staffHash, joined: daysAgo(90), lastLogin: daysAgo(1) },
  ];

  const staff: any[] = [];
  for (const s of staffDefs) {
    const u = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        firmId: firm.id,
        email: s.email,
        passwordHash: s.hash,
        firstName: s.first,
        lastName: s.last,
        displayName: `${s.first} ${s.last}`,
        phone: s.phone,
        role: s.role,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        lastLoginAt: s.lastLogin,
        createdAt: s.joined,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${s.first}${s.last}`,
      },
    });
    staff.push(u);
  }
  const [heet, rajesh, priya, amit, neha, rahul, karan, riya] = staff;
  console.log(`  ✔ ${staff.length} staff members created`);

  // ═══════════════════════════════════════════════════════
  // CLIENT 1 — Aman Verma (Individual)
  // ═══════════════════════════════════════════════════════
  console.log('\n📋 Creating Client 1: Aman Verma...');
  const aman = await prisma.client.create({
    data: {
      tenantId: tenant.id,
      firmId: firm.id,
      clientCode: 'GA-001',
      fileNumber: 'F-001',
      clientType: ClientType.INDIVIDUAL,
      firstName: 'Aman',
      lastName: 'Verma',
      displayName: 'Aman Verma',
      primaryMobile: '9876543210',
      primaryEmail: 'aman.verma@example.com',
      pan: 'ABCDE1234F',
      aadhaar: 'XXXX-XXXX-1234',
      status: ClientStatus.ACTIVE,
      assignedPartnerId: rajesh.id,
      assignedAccountantId: amit.id,
      leadSource: LeadSource.REFERRAL,
      notes: 'Files returns every year on time. Needs tax saving advice.',
      onboardedAt: daysAgo(500),
      createdAt: daysAgo(500),
      addresses: { create: { tenantId: tenant.id, line1: '12, Patel Nagar, Navrangpura', city: 'Ahmedabad', state: 'Gujarat', pincode: '380009', isPrimary: true } },
    },
  });

  // Folders
  const amanKYC = await prisma.documentFolder.create({ data: { tenantId: tenant.id, clientId: aman.id, name: 'KYC Documents', isSystem: true, sortOrder: 1 } });
  const amanITR = await prisma.documentFolder.create({ data: { tenantId: tenant.id, clientId: aman.id, name: 'Income Tax', isSystem: true, sortOrder: 2 } });
  const amanBank = await prisma.documentFolder.create({ data: { tenantId: tenant.id, clientId: aman.id, name: 'Bank Statements', isSystem: true, sortOrder: 3 } });

  // Documents
  const amanDocs = [
    { name: 'Aadhaar.pdf', cat: DocumentCategory.KYC, folder: amanKYC.id, size: fileSize(150, 400), fy: null },
    { name: 'PAN Card.pdf', cat: DocumentCategory.KYC, folder: amanKYC.id, size: fileSize(100, 300), fy: null },
    { name: 'Form16_2025.pdf', cat: DocumentCategory.INCOME_TAX, folder: amanITR.id, size: fileSize(300, 800), fy: FY },
    { name: 'BankStatement_March2025.pdf', cat: DocumentCategory.BANK_STATEMENTS, folder: amanBank.id, size: fileSize(400, 1200), fy: FY },
    { name: 'InvestmentProofs.pdf', cat: DocumentCategory.INCOME_TAX, folder: amanITR.id, size: fileSize(200, 600), fy: FY },
  ];
  const amanDocIds: string[] = [];
  for (const d of amanDocs) {
    const doc = await prisma.document.create({
      data: {
        tenantId: tenant.id, clientId: aman.id, folderId: d.folder,
        uploadedById: amit.id, name: d.name, originalName: d.name,
        category: d.cat, mimeType: 'application/pdf', size: d.size,
        extension: 'pdf', storageKey: `uploads/${tenant.id}/${aman.id}/${d.name}`,
        storageProvider: StorageProvider.LOCAL, version: 1, isLatest: true,
        financialYear: d.fy ?? undefined, createdAt: rDate(daysAgo(400), daysAgo(30)),
      },
    });
    amanDocIds.push(doc.id);
  }

  // Compliance
  const amanComp = await prisma.compliance.create({
    data: {
      tenantId: tenant.id, clientId: aman.id, assigneeId: amit.id,
      type: ComplianceType.INCOME_TAX, title: 'ITR Filing AY 2025-26',
      status: ComplianceStatus.FILED, priority: TaskPriority.HIGH,
      dueDate: new Date('2025-07-31'), filedDate: new Date('2025-07-15'),
      period: 'AY 2025-26', financialYear: FY_NEXT,
      remarks: 'Filed on time. Refund of ₹18,420 expected.', isRecurring: true,
      createdAt: daysAgo(200),
    },
  });

  // Task
  const amanTask = await prisma.task.create({
    data: {
      tenantId: tenant.id, clientId: aman.id, assigneeId: amit.id, createdById: rajesh.id,
      title: 'Collect Investment Proofs from Aman Verma',
      description: 'Collect 80C investment proofs: ELSS, PPF statement, LIC premium receipt, NPS contribution.',
      status: TaskStatus.COMPLETED, priority: TaskPriority.MEDIUM,
      dueDate: daysAgo(80), completedAt: daysAgo(85), estimatedHrs: 1,
      tags: ['ITR', 'Investment', 'AY2025-26'], createdAt: daysAgo(120),
    },
  });
  await prisma.taskComment.create({ data: { taskId: amanTask.id, tenantId: tenant.id, userId: amit.id, content: 'Received ELSS statement from client via email.', createdAt: daysAgo(100) } });
  await prisma.taskComment.create({ data: { taskId: amanTask.id, tenantId: tenant.id, userId: amit.id, content: 'PPF and LIC premium receipts received physically. All proofs collected.', createdAt: daysAgo(85) } });

  // Physical File
  const amanFile = await prisma.physicalFile.create({
    data: {
      tenantId: tenant.id, clientId: aman.id,
      fileNumber: 'PF-001',
      description: 'Aman Verma — ITR & KYC Documents',
      boxNumber: 'A1', shelfNumber: '2', cabinetNumber: '1',
      location: 'Cabinet 1, Shelf 2, Box A1', status: PhysicalFileStatus.IN_OFFICE,
      tags: ['ITR', 'KYC', 'AY2025-26'], createdAt: daysAgo(500),
    },
  });
  await prisma.physicalFileMovement.create({
    data: { physicalFileId: amanFile.id, tenantId: tenant.id, movedById: amit.id, action: 'FILED', toLocation: 'Cabinet 1, Shelf 2, Box A1', reason: 'Initial filing', createdAt: daysAgo(500) },
  });

  // Notes
  await prisma.note.create({ data: { tenantId: tenant.id, clientId: aman.id, userId: rajesh.id, title: 'Tax Planning Note', content: 'Client is in 30% tax bracket. Advised to maximize 80C investments and consider NPS for additional 50K deduction under 80CCD(1B).', isPinned: true, tags: ['tax-planning', 'priority'], createdAt: daysAgo(150) } });
  await prisma.note.create({ data: { tenantId: tenant.id, clientId: aman.id, userId: amit.id, content: 'Received Form 16 from Infosys. TDS as per Form 16 matches 26AS.', tags: ['form16'], createdAt: daysAgo(90) } });

  // Timeline
  for (const [action, desc, ago] of [
    ['CLIENT_CREATED', 'Client Aman Verma onboarded', 500],
    ['DOCUMENT_UPLOADED', 'Aadhaar and PAN uploaded', 490],
    ['TASK_CREATED', 'Task: Collect Investment Proofs created', 120],
    ['COMPLIANCE_CREATED', 'ITR AY 2025-26 compliance added', 200],
    ['DOCUMENT_UPLOADED', 'Form 16 and Bank Statement uploaded', 90],
    ['TASK_COMPLETED', 'Investment proofs collection completed', 85],
    ['COMPLIANCE_FILED', 'ITR AY 2025-26 filed successfully', 15],
  ]) {
    await prisma.clientTimeline.create({ data: { clientId: aman.id, tenantId: tenant.id, userId: amit.id, action: action as string, description: desc as string, createdAt: daysAgo(ago as number) } });
  }
  console.log('  ✔ Aman Verma complete');

  // ═══════════════════════════════════════════════════════
  // CLIENT 2 — Shulaabh Packaging (Proprietorship)
  // ═══════════════════════════════════════════════════════
  console.log('📋 Creating Client 2: Shulaabh Packaging...');
  const shulaabh = await prisma.client.create({
    data: {
      tenantId: tenant.id, firmId: firm.id,
      clientCode: 'GA-002', fileNumber: 'F-002',
      clientType: ClientType.PROPRIETORSHIP,
      displayName: 'Shulaabh Packaging',
      businessName: 'Shulaabh Packaging',
      firstName: 'Jignesh', lastName: 'Patel',
      primaryMobile: '9898989898',
      primaryEmail: 'contact@shulaabhpackaging.com',
      gstin: '24ABCDE1234F1Z5', pan: 'ABCDE1234F',
      status: ClientStatus.ACTIVE,
      assignedPartnerId: rajesh.id, assignedAccountantId: neha.id,
      leadSource: LeadSource.REFERRAL,
      notes: 'Turnover ~2.5 Cr. Monthly GST filer. DSC expires in 25 days.',
      onboardedAt: daysAgo(600), createdAt: daysAgo(600),
      addresses: { create: { tenantId: tenant.id, line1: 'Plot 45, GIDC Phase 2', city: 'Surat', state: 'Gujarat', pincode: '394220', isPrimary: true } },
    },
  });

  const spGST = await prisma.documentFolder.create({ data: { tenantId: tenant.id, clientId: shulaabh.id, name: 'GST', isSystem: true, sortOrder: 1 } });
  const spKYC = await prisma.documentFolder.create({ data: { tenantId: tenant.id, clientId: shulaabh.id, name: 'KYC', isSystem: true, sortOrder: 2 } });
  const spBank = await prisma.documentFolder.create({ data: { tenantId: tenant.id, clientId: shulaabh.id, name: 'Bank Statements', isSystem: true, sortOrder: 3 } });

  const spDocDefs = [
    { name: 'GST Certificate.pdf', cat: DocumentCategory.GST, folder: spGST.id, size: fileSize(100, 300) },
    { name: 'PAN Card.pdf', cat: DocumentCategory.KYC, folder: spKYC.id, size: fileSize(80, 200) },
    { name: 'Udyam Certificate.pdf', cat: DocumentCategory.LICENSES, folder: spKYC.id, size: fileSize(120, 300) },
    { name: 'Bank Statement Mar2025.pdf', cat: DocumentCategory.BANK_STATEMENTS, folder: spBank.id, size: fileSize(500, 1500) },
    { name: 'Sales Register FY2025.xlsx', cat: DocumentCategory.FINANCIAL_STATEMENTS, folder: spGST.id, size: fileSize(200, 600), ext: 'xlsx', mime: 'application/vnd.ms-excel' },
    { name: 'Purchase Register FY2025.xlsx', cat: DocumentCategory.FINANCIAL_STATEMENTS, folder: spGST.id, size: fileSize(200, 600), ext: 'xlsx', mime: 'application/vnd.ms-excel' },
  ];
  for (const d of spDocDefs) {
    await prisma.document.create({
      data: {
        tenantId: tenant.id, clientId: shulaabh.id, folderId: d.folder, uploadedById: neha.id,
        name: d.name, originalName: d.name, category: d.cat,
        mimeType: (d as any).mime ?? 'application/pdf', size: d.size,
        extension: (d as any).ext ?? 'pdf', storageKey: `uploads/${tenant.id}/${shulaabh.id}/${d.name}`,
        storageProvider: StorageProvider.LOCAL, version: 1, isLatest: true,
        financialYear: FY, createdAt: rDate(daysAgo(500), daysAgo(20)),
      },
    });
  }

  // Compliance (2)
  const spComp1 = await prisma.compliance.create({
    data: {
      tenantId: tenant.id, clientId: shulaabh.id, assigneeId: neha.id,
      type: ComplianceType.GST_MONTHLY, title: 'GSTR-3B Filing — May 2025',
      status: ComplianceStatus.NOT_STARTED, priority: TaskPriority.HIGH,
      dueDate: daysFromNow(10), period: 'May 2025', financialYear: FY_NEXT,
      isRecurring: true, createdAt: daysAgo(10),
    },
  });
  await prisma.compliance.create({
    data: {
      tenantId: tenant.id, clientId: shulaabh.id, assigneeId: neha.id,
      type: ComplianceType.DSC_RENEWAL, title: 'DSC Renewal — Class 3',
      status: ComplianceStatus.NOT_STARTED, priority: TaskPriority.URGENT,
      dueDate: daysFromNow(25), period: 'June 2025',
      remarks: 'Urgent — expires in 25 days. Needed for GST filing.', createdAt: daysAgo(5),
    },
  });

  // Tasks (2)
  await prisma.task.create({
    data: {
      tenantId: tenant.id, clientId: shulaabh.id, assigneeId: neha.id, createdById: rajesh.id,
      title: 'Collect Purchase Register — May 2025',
      description: 'Client to share purchase register in Excel for GSTR-2B reconciliation.',
      status: TaskStatus.PENDING, priority: TaskPriority.HIGH,
      dueDate: daysFromNow(7), estimatedHrs: 1, tags: ['GST', 'PurchaseRegister'], createdAt: daysAgo(5),
    },
  });
  await prisma.task.create({
    data: {
      tenantId: tenant.id, clientId: shulaabh.id, assigneeId: neha.id, createdById: priya.id,
      title: 'Review GSTR-2B vs Purchase Register for May 2025',
      description: 'Reconcile auto-populated GSTR-2B with purchase register. Identify missing ITC.',
      status: TaskStatus.IN_PROGRESS, priority: TaskPriority.HIGH,
      dueDate: daysFromNow(12), estimatedHrs: 3, tags: ['GST', 'Reconciliation'], createdAt: daysAgo(3),
    },
  });

  // Physical File
  const spFile = await prisma.physicalFile.create({
    data: {
      tenantId: tenant.id, clientId: shulaabh.id,
      fileNumber: 'PF-002',
      description: 'Shulaabh Packaging — GST & Business Documents',
      boxNumber: 'B3', shelfNumber: '1', cabinetNumber: '2',
      location: 'Cabinet 2, Shelf 1, Box B3', status: PhysicalFileStatus.IN_OFFICE,
      tags: ['GST', 'Proprietorship', FY], createdAt: daysAgo(600),
    },
  });
  await prisma.physicalFileMovement.create({ data: { physicalFileId: spFile.id, tenantId: tenant.id, movedById: neha.id, action: 'FILED', toLocation: 'Cabinet 2, Shelf 1, Box B3', createdAt: daysAgo(600) } });

  // Notes (6)
  const spNotes = [
    { title: 'GST Compliance History', content: 'Client has been regular in monthly GST filing. Only one late filing in Nov 2024 — penalty ₹200 paid.', pinned: true },
    { content: 'Turnover for FY2025: ₹2.48 Cr. Expecting ₹3 Cr in FY2026.' },
    { content: 'DSC expiring 30 June 2025. Client informed. Renewal process to be initiated this week.' },
    { content: 'Client uses Tally Prime for accounting. Data exported monthly.' },
    { content: 'MSME registration as "Small Enterprise". Udyam No. GJ-01-0012345.' },
    { content: 'Bank account: HDFC Current A/c No. xxxxxx1234, Surat branch.' },
  ];
  for (const n of spNotes) {
    await prisma.note.create({ data: { tenantId: tenant.id, clientId: shulaabh.id, userId: neha.id, title: n.title, content: n.content, isPinned: !!(n as any).pinned, createdAt: rDate(daysAgo(300), daysAgo(5)) } });
  }

  // Reminders (3)
  await prisma.reminder.create({ data: { tenantId: tenant.id, clientId: shulaabh.id, complianceId: spComp1.id, createdById: neha.id, title: 'GSTR-3B Due in 10 days', type: ReminderType.GST_DUE, status: ReminderStatus.ACTIVE, dueDate: daysFromNow(10), channels: [ReminderChannel.IN_APP, ReminderChannel.EMAIL] } });
  await prisma.reminder.create({ data: { tenantId: tenant.id, clientId: shulaabh.id, createdById: neha.id, title: 'DSC Expiry — Shulaabh Packaging', type: ReminderType.DSC_EXPIRY, status: ReminderStatus.ACTIVE, dueDate: daysFromNow(25), channels: [ReminderChannel.IN_APP, ReminderChannel.WHATSAPP] } });
  await prisma.reminder.create({ data: { tenantId: tenant.id, clientId: shulaabh.id, createdById: rajesh.id, title: 'Collect Purchase Register', type: ReminderType.CUSTOM, status: ReminderStatus.ACTIVE, dueDate: daysFromNow(7), channels: [ReminderChannel.IN_APP] } });

  // 15 Timeline entries
  const spTimeline = [
    ['CLIENT_CREATED', 'Shulaabh Packaging onboarded', 600],
    ['DOCUMENT_UPLOADED', 'GST Certificate uploaded', 580],
    ['DOCUMENT_UPLOADED', 'PAN Card uploaded', 575],
    ['TASK_CREATED', 'GST filing task created for Q1', 540],
    ['COMPLIANCE_CREATED', 'GST monthly compliance schedule created', 500],
    ['COMPLIANCE_FILED', 'GSTR-3B filed for Oct 2024', 245],
    ['NOTE_ADDED', 'GST compliance history noted', 240],
    ['COMPLIANCE_FILED', 'GSTR-3B filed for Nov 2024 (late)', 210],
    ['AUDIT_LOG', 'Profile updated — Udyam number added', 200],
    ['COMPLIANCE_FILED', 'GSTR-3B filed for Dec 2024', 155],
    ['COMPLIANCE_FILED', 'GSTR-3B filed for Jan 2025', 125],
    ['COMPLIANCE_FILED', 'GSTR-3B filed for Feb 2025', 95],
    ['DOCUMENT_UPLOADED', 'Sales Register FY2025 uploaded', 30],
    ['COMPLIANCE_FILED', 'GSTR-3B filed for Mar 2025', 25],
    ['REMINDER_SET', 'DSC renewal reminder set', 5],
  ];
  for (const [action, desc, ago] of spTimeline) {
    await prisma.clientTimeline.create({ data: { clientId: shulaabh.id, tenantId: tenant.id, userId: neha.id, action: action as string, description: desc as string, createdAt: daysAgo(ago as number) } });
  }
  console.log('  ✔ Shulaabh Packaging complete');

  // ═══════════════════════════════════════════════════════
  // CLIENT 3 — Sunrise Trading Co. (Partnership)
  // ═══════════════════════════════════════════════════════
  console.log('📋 Creating Client 3: Sunrise Trading Co....');
  const sunrise = await prisma.client.create({
    data: {
      tenantId: tenant.id, firmId: firm.id,
      clientCode: 'GA-003', fileNumber: 'F-003',
      clientType: ClientType.PARTNERSHIP,
      displayName: 'Sunrise Trading Co.',
      businessName: 'Sunrise Trading Co.',
      gstin: '24AAAAA9999A1Z5', pan: 'AAAAA9999A',
      primaryEmail: 'info@sunrisetrading.in', primaryMobile: '9812345678',
      status: ClientStatus.ACTIVE,
      assignedPartnerId: priya.id, assignedAccountantId: rahul.id,
      leadSource: LeadSource.REFERRAL,
      notes: 'Partnership firm — Rakesh Shah & Manish Shah. Turnover ~5.8 Cr. Requires audit.',
      onboardedAt: daysAgo(700), createdAt: daysAgo(700),
      addresses: { create: { tenantId: tenant.id, line1: 'G-12, Industrial Estate', city: 'Rajkot', state: 'Gujarat', pincode: '360003', isPrimary: true } },
      contacts: {
        createMany: {
          data: [
            { tenantId: tenant.id, name: 'Rakesh Shah', designation: 'Managing Partner', phone: '9876001001', email: 'rakesh@sunrisetrading.in', isPrimary: true },
            { tenantId: tenant.id, name: 'Manish Shah', designation: 'Partner', phone: '9876001002', email: 'manish@sunrisetrading.in' },
          ],
        },
      },
    },
  });

  const srGST = await prisma.documentFolder.create({ data: { tenantId: tenant.id, clientId: sunrise.id, name: 'GST', isSystem: true, sortOrder: 1 } });
  const srAudit = await prisma.documentFolder.create({ data: { tenantId: tenant.id, clientId: sunrise.id, name: 'Audit', isSystem: true, sortOrder: 2 } });
  const srDocs = [
    { name: 'Partnership Deed.pdf', cat: DocumentCategory.AGREEMENTS, folder: srGST.id, size: fileSize(200, 600) },
    { name: 'GST Certificate.pdf', cat: DocumentCategory.GST, folder: srGST.id, size: fileSize(100, 300) },
    { name: 'PAN Card.pdf', cat: DocumentCategory.KYC, folder: srGST.id, size: fileSize(80, 200) },
    { name: 'Bank Statement FY2025.pdf', cat: DocumentCategory.BANK_STATEMENTS, folder: srAudit.id, size: fileSize(800, 2000) },
    { name: 'Audit Report FY2025.pdf', cat: DocumentCategory.AUDIT, folder: srAudit.id, size: fileSize(500, 1500) },
    { name: 'Balance Sheet FY2025.pdf', cat: DocumentCategory.FINANCIAL_STATEMENTS, folder: srAudit.id, size: fileSize(300, 800) },
  ];
  for (const d of srDocs) {
    await prisma.document.create({
      data: {
        tenantId: tenant.id, clientId: sunrise.id, folderId: d.folder, uploadedById: rahul.id,
        name: d.name, originalName: d.name, category: d.cat,
        mimeType: 'application/pdf', size: d.size, extension: 'pdf',
        storageKey: `uploads/${tenant.id}/${sunrise.id}/${d.name}`,
        storageProvider: StorageProvider.LOCAL, version: 1, isLatest: true,
        financialYear: FY, createdAt: rDate(daysAgo(600), daysAgo(15)),
      },
    });
  }

  // Compliance (3)
  const [srC1Status, srC2Status, srC3Status] = [ComplianceStatus.IN_PROGRESS, ComplianceStatus.NOT_STARTED, ComplianceStatus.FILED] as const;
  await prisma.compliance.create({ data: { tenantId: tenant.id, clientId: sunrise.id, assigneeId: rahul.id, type: ComplianceType.GST_MONTHLY, title: 'GSTR-3B Filing — May 2025', status: srC1Status, priority: TaskPriority.HIGH, dueDate: daysFromNow(10), period: 'May 2025', financialYear: FY_NEXT, isRecurring: true, createdAt: daysAgo(10) } });
  await prisma.compliance.create({ data: { tenantId: tenant.id, clientId: sunrise.id, assigneeId: rahul.id, type: ComplianceType.AUDIT, title: 'Tax Audit Report FY2025', status: srC2Status, priority: TaskPriority.HIGH, dueDate: new Date('2025-09-30'), period: 'FY2025', financialYear: FY, createdAt: daysAgo(30) } });
  await prisma.compliance.create({ data: { tenantId: tenant.id, clientId: sunrise.id, assigneeId: rahul.id, type: ComplianceType.ROC_ANNUAL, title: 'ROC Annual Filing FY2025', status: srC3Status, priority: TaskPriority.MEDIUM, dueDate: new Date('2025-11-30'), filedDate: new Date('2025-11-20'), period: 'FY2025', financialYear: FY, createdAt: daysAgo(200), completedAt: new Date('2025-11-20') } });

  // Tasks (3)
  await prisma.task.create({ data: { tenantId: tenant.id, clientId: sunrise.id, assigneeId: rahul.id, createdById: priya.id, title: 'Prepare Audit Documentation Package', description: 'Compile all vouchers, bills, and supporting documents for FY2025 tax audit.', status: TaskStatus.IN_PROGRESS, priority: TaskPriority.HIGH, dueDate: daysFromNow(30), estimatedHrs: 8, tags: ['Audit', FY], createdAt: daysAgo(20) } });
  await prisma.task.create({ data: { tenantId: tenant.id, clientId: sunrise.id, assigneeId: priya.id, createdById: heet.id, title: 'Review Balance Sheet FY2025', description: 'Final review of Balance Sheet prepared by Rahul. Check all schedules and notes to accounts.', status: TaskStatus.PENDING, priority: TaskPriority.HIGH, dueDate: daysFromNow(45), estimatedHrs: 4, tags: ['Audit', 'BalanceSheet'], createdAt: daysAgo(15) } });
  await prisma.task.create({ data: { tenantId: tenant.id, clientId: sunrise.id, assigneeId: rajesh.id, createdById: priya.id, title: 'Partner Approval for Audit Report', description: 'Get digital signatures and approval from both partners before submitting audit report.', status: TaskStatus.PENDING, priority: TaskPriority.URGENT, dueDate: daysFromNow(60), estimatedHrs: 1, tags: ['Audit', 'Approval'], createdAt: daysAgo(10) } });

  // Physical File
  const srFile = await prisma.physicalFile.create({
    data: {
      tenantId: tenant.id, clientId: sunrise.id, fileNumber: 'PF-003',
      description: 'Sunrise Trading Co. — Partnership & Audit Documents',
      boxNumber: 'C5', shelfNumber: '4', cabinetNumber: '3',
      location: 'Cabinet 3, Shelf 4, Box C5', status: PhysicalFileStatus.IN_OFFICE,
      tags: ['Partnership', 'Audit', FY], createdAt: daysAgo(700),
    },
  });
  await prisma.physicalFileMovement.create({ data: { physicalFileId: srFile.id, tenantId: tenant.id, movedById: rahul.id, action: 'FILED', toLocation: 'Cabinet 3, Shelf 4, Box C5', createdAt: daysAgo(700) } });

  // 10 Notes
  const srNoteTexts = [
    'Partnership firm — 2 partners. Profit sharing 60:40 (Rakesh:Manish).',
    'Turnover FY2025: ₹5.82 Cr. Expected FY2026: ₹7 Cr+.',
    'Tax audit applicable u/s 44AB. Deadline: 30 Sep 2025.',
    'Partners have separate DSCs. Rakesh Shah DSC valid till Dec 2025.',
    'GSTR-9 and GSTR-9C pending for FY2024. To be filed before 31 Dec 2025.',
    'Bank: SBI Current A/c, Rajkot. Two accounts — operational and salary.',
    'Stock valuation method: FIFO. Closing stock FY2025: ₹48.2 Lakh.',
    'TDS deducted on rent (194I) — ₹48,000 per year. Quarterly return filed.',
    'Advance tax paid Q3 FY2025: ₹4,20,000. Balance payable in Q4.',
    'Client prefers WhatsApp communication for reminders.',
  ];
  for (const content of srNoteTexts) {
    await prisma.note.create({ data: { tenantId: tenant.id, clientId: sunrise.id, userId: pick([priya, rahul]).id, content, createdAt: rDate(daysAgo(400), daysAgo(5)) } });
  }

  // 20 Timeline entries
  const srTimeline = [
    ['CLIENT_CREATED', 'Sunrise Trading Co. onboarded', 700],
    ['DOCUMENT_UPLOADED', 'Partnership Deed uploaded', 680],
    ['DOCUMENT_UPLOADED', 'GST Certificate and PAN uploaded', 670],
    ['COMPLIANCE_CREATED', 'GST monthly compliance created', 650],
    ['TASK_CREATED', 'FY2024 ITR task created', 600],
    ['COMPLIANCE_FILED', 'GSTR-3B filed for Aug 2024', 480],
    ['COMPLIANCE_FILED', 'GSTR-3B filed for Sep 2024', 450],
    ['COMPLIANCE_FILED', 'TDS Q2 FY2025 filed', 440],
    ['COMPLIANCE_FILED', 'GSTR-3B filed for Oct 2024', 420],
    ['NOTE_ADDED', 'Advance tax note added', 400],
    ['DOCUMENT_UPLOADED', 'Bank Statement Q2 uploaded', 380],
    ['COMPLIANCE_FILED', 'GSTR-3B filed for Nov 2024', 390],
    ['COMPLIANCE_FILED', 'GSTR-3B filed for Dec 2024', 360],
    ['COMPLIANCE_FILED', 'TDS Q3 FY2025 filed', 310],
    ['COMPLIANCE_FILED', 'GSTR-3B filed for Jan 2025', 330],
    ['COMPLIANCE_FILED', 'GSTR-3B filed for Feb 2025', 300],
    ['DOCUMENT_UPLOADED', 'Audit Report FY2025 uploaded', 30],
    ['TASK_CREATED', 'Audit documentation task created', 20],
    ['COMPLIANCE_FILED', 'ROC Annual Return FY2025 filed', 15],
    ['TASK_CREATED', 'Balance sheet review task created', 10],
  ];
  for (const [action, desc, ago] of srTimeline) {
    await prisma.clientTimeline.create({ data: { clientId: sunrise.id, tenantId: tenant.id, userId: rahul.id, action: action as string, description: desc as string, createdAt: daysAgo(ago as number) } });
  }
  console.log('  ✔ Sunrise Trading Co. complete');

  // ═══════════════════════════════════════════════════════
  // BULK CLIENTS (55)
  // ═══════════════════════════════════════════════════════
  console.log('\n👥 Creating 55 bulk clients...');
  const bulkClients: any[] = [];
  let clientNum = 4;

  const assignStaff = () => ({
    partner: pick([rajesh, priya, heet]),
    accountant: pick([amit, neha, rahul, karan]),
  });

  // Individuals (22)
  for (const ind of BULK_INDIVIDUALS) {
    const { partner, accountant } = assignStaff();
    const c = await prisma.client.create({
      data: {
        tenantId: tenant.id, firmId: firm.id,
        clientCode: `GA-${pad(clientNum)}`, fileNumber: `F-${pad(clientNum)}`,
        clientType: ClientType.INDIVIDUAL,
        firstName: ind.first, lastName: ind.last,
        displayName: `${ind.first} ${ind.last}`,
        primaryMobile: ind.mobile, primaryEmail: ind.email,
        pan: ind.pan,
        status: ClientStatus.ACTIVE,
        assignedPartnerId: partner.id, assignedAccountantId: accountant.id,
        leadSource: pick([LeadSource.REFERRAL, LeadSource.DIRECT, LeadSource.WEBSITE]),
        notes: `${ind.occ}. Requires ITR filing annually.`,
        onboardedAt: rDate(daysAgo(700), daysAgo(60)),
        createdAt: rDate(daysAgo(700), daysAgo(60)),
        addresses: { create: { tenantId: tenant.id, line1: `${rInt(1, 99)}, ${pick(['Park Society', 'Shyam Nagar', 'New Colony', 'Garden Society'])}`, city: ind.city, state: 'Gujarat', pincode: `3${rInt(90000, 99999)}`, isPrimary: true } },
      },
    });
    bulkClients.push(c);
    clientNum++;
  }

  // Proprietorships (15)
  for (const prop of BULK_PROPRIETORSHIPS) {
    const { partner, accountant } = assignStaff();
    const c = await prisma.client.create({
      data: {
        tenantId: tenant.id, firmId: firm.id,
        clientCode: `GA-${pad(clientNum)}`, fileNumber: `F-${pad(clientNum)}`,
        clientType: ClientType.PROPRIETORSHIP,
        displayName: prop.name, businessName: prop.name,
        firstName: prop.owner.split(' ')[0], lastName: prop.owner.split(' ')[1] || '',
        primaryMobile: `98${rInt(10000000, 99999999)}`,
        primaryEmail: `contact@${prop.name.toLowerCase().replace(/\s+/g, '')}.in`,
        gstin: prop.gstin, pan: prop.pan,
        status: ClientStatus.ACTIVE,
        assignedPartnerId: partner.id, assignedAccountantId: accountant.id,
        leadSource: pick([LeadSource.REFERRAL, LeadSource.DIRECT]),
        notes: `${prop.industry} business. GST filer.`,
        onboardedAt: rDate(daysAgo(700), daysAgo(60)),
        createdAt: rDate(daysAgo(700), daysAgo(60)),
        addresses: { create: { tenantId: tenant.id, line1: `${rInt(1, 200)}, GIDC Industrial Estate`, city: prop.city, state: 'Gujarat', pincode: `3${rInt(90000, 99999)}`, isPrimary: true } },
      },
    });
    bulkClients.push(c);
    clientNum++;
  }

  // Partnerships (10)
  for (const part of BULK_PARTNERSHIPS) {
    const { partner, accountant } = assignStaff();
    const c = await prisma.client.create({
      data: {
        tenantId: tenant.id, firmId: firm.id,
        clientCode: `GA-${pad(clientNum)}`, fileNumber: `F-${pad(clientNum)}`,
        clientType: ClientType.PARTNERSHIP,
        displayName: part.name, businessName: part.name,
        primaryMobile: `98${rInt(10000000, 99999999)}`,
        primaryEmail: `info@${part.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
        gstin: part.gstin, pan: part.pan,
        status: ClientStatus.ACTIVE,
        assignedPartnerId: partner.id, assignedAccountantId: accountant.id,
        leadSource: pick([LeadSource.REFERRAL, LeadSource.DIRECT]),
        notes: `Partnership firm. ${part.partners ? `Partners: ${part.partners}.` : ''}`,
        onboardedAt: rDate(daysAgo(700), daysAgo(60)),
        createdAt: rDate(daysAgo(700), daysAgo(60)),
        addresses: { create: { tenantId: tenant.id, line1: `${rInt(1, 100)}, Commercial Complex`, city: part.city, state: 'Gujarat', pincode: `3${rInt(90000, 99999)}`, isPrimary: true } },
      },
    });
    bulkClients.push(c);
    clientNum++;
  }

  // LLPs (5)
  for (const llp of BULK_LLPS) {
    const { partner, accountant } = assignStaff();
    const c = await prisma.client.create({
      data: {
        tenantId: tenant.id, firmId: firm.id,
        clientCode: `GA-${pad(clientNum)}`, fileNumber: `F-${pad(clientNum)}`,
        clientType: ClientType.LLP,
        displayName: llp.name, businessName: llp.name,
        primaryMobile: `98${rInt(10000000, 99999999)}`,
        primaryEmail: `contact@${llp.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
        gstin: llp.gstin, pan: llp.pan, llpin: llp.llpin,
        status: ClientStatus.ACTIVE,
        assignedPartnerId: partner.id, assignedAccountantId: accountant.id,
        leadSource: LeadSource.REFERRAL,
        notes: `LLP. Annual ROC filing and GST compliance required.`,
        onboardedAt: rDate(daysAgo(500), daysAgo(60)),
        createdAt: rDate(daysAgo(500), daysAgo(60)),
        addresses: { create: { tenantId: tenant.id, line1: `${rInt(100, 999)}, Business Hub`, city: llp.city, state: 'Gujarat', pincode: `3${rInt(90000, 99999)}`, isPrimary: true } },
      },
    });
    bulkClients.push(c);
    clientNum++;
  }

  // Private Limited (3)
  for (const pvt of BULK_PVT_LTD) {
    const { partner, accountant } = assignStaff();
    const c = await prisma.client.create({
      data: {
        tenantId: tenant.id, firmId: firm.id,
        clientCode: `GA-${pad(clientNum)}`, fileNumber: `F-${pad(clientNum)}`,
        clientType: ClientType.PRIVATE_LIMITED,
        displayName: pvt.name, businessName: pvt.name,
        primaryMobile: `98${rInt(10000000, 99999999)}`,
        primaryEmail: `info@${pvt.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
        gstin: pvt.gstin, pan: pvt.pan, cin: pvt.cin,
        status: ClientStatus.ACTIVE,
        assignedPartnerId: partner.id, assignedAccountantId: accountant.id,
        leadSource: LeadSource.REFERRAL,
        notes: `Private Limited Company. Full compliance: GST, ROC, TDS, Audit.`,
        onboardedAt: rDate(daysAgo(500), daysAgo(60)),
        createdAt: rDate(daysAgo(500), daysAgo(60)),
        addresses: { create: { tenantId: tenant.id, line1: `${rInt(100, 999)}, Corporate Park`, city: pvt.city, state: 'Gujarat', pincode: `3${rInt(90000, 99999)}`, isPrimary: true } },
      },
    });
    bulkClients.push(c);
    clientNum++;
  }

  console.log(`  ✔ ${bulkClients.length} bulk clients created`);
  const allClients = [aman, shulaabh, sunrise, ...bulkClients];

  // ═══════════════════════════════════════════════════════
  // BULK DOCUMENTS (~480 more to reach ~500 total)
  // ═══════════════════════════════════════════════════════
  console.log('\n📄 Creating bulk documents...');
  const docCategories = Object.keys(DOC_NAMES_BY_CATEGORY) as (keyof typeof DOC_NAMES_BY_CATEGORY)[];
  const catEnum: DocumentCategory[] = [
    DocumentCategory.KYC, DocumentCategory.GST, DocumentCategory.INCOME_TAX,
    DocumentCategory.AUDIT, DocumentCategory.BANK_STATEMENTS, DocumentCategory.AGREEMENTS,
    DocumentCategory.LICENSES, DocumentCategory.ROC, DocumentCategory.DSC,
    DocumentCategory.TDS, DocumentCategory.FINANCIAL_STATEMENTS, DocumentCategory.OTHER,
  ];
  const catMap: Record<string, DocumentCategory> = {
    KYC: DocumentCategory.KYC, GST: DocumentCategory.GST, INCOME_TAX: DocumentCategory.INCOME_TAX,
    AUDIT: DocumentCategory.AUDIT, BANK_STATEMENTS: DocumentCategory.BANK_STATEMENTS,
    AGREEMENTS: DocumentCategory.AGREEMENTS, LICENSES: DocumentCategory.LICENSES,
    ROC: DocumentCategory.ROC, DSC: DocumentCategory.DSC, TDS: DocumentCategory.TDS,
    FINANCIAL_STATEMENTS: DocumentCategory.FINANCIAL_STATEMENTS, OTHER: DocumentCategory.OTHER,
  };

  const uploaders = [amit, neha, rahul, karan, riya, priya];
  let docCount = 17; // already created above
  const DOCS_TARGET = 500;

  // ~8-9 docs per bulk client
  for (const client of bulkClients) {
    const numDocs = rInt(6, 12);
    for (let d = 0; d < numDocs && docCount < DOCS_TARGET; d++) {
      const catKey = pick(docCategories);
      const docName = pick(DOC_NAMES_BY_CATEGORY[catKey]);
      const isXlsx = docName.endsWith('.xlsx');
      const uploader = pick(uploaders);
      await prisma.document.create({
        data: {
          tenantId: tenant.id, clientId: client.id,
          uploadedById: uploader.id,
          name: docName, originalName: docName,
          category: catMap[catKey],
          mimeType: isXlsx ? 'application/vnd.ms-excel' : 'application/pdf',
          size: fileSize(isXlsx ? 50 : 80, isXlsx ? 600 : 2000),
          extension: isXlsx ? 'xlsx' : 'pdf',
          storageKey: `uploads/${tenant.id}/${client.id}/${Date.now()}_${docName}`,
          storageProvider: StorageProvider.LOCAL, version: 1, isLatest: true,
          financialYear: pick([FY, FY_NEXT, '2023-24', null]),
          createdAt: rDate(daysAgo(500), daysAgo(5)),
        },
      });
      docCount++;
    }
  }
  console.log(`  ✔ ${docCount} total documents created`);

  // ═══════════════════════════════════════════════════════
  // BULK TASKS (to reach 150 total)
  // ═══════════════════════════════════════════════════════
  console.log('\n✅ Creating bulk tasks...');
  const taskStatuses = [TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED, TaskStatus.CANCELLED, TaskStatus.UNDER_REVIEW];
  const taskPriorities = [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH, TaskPriority.URGENT];
  const assignees = [amit, neha, rahul, karan, riya, priya, rajesh];
  let taskCount = 6; // already created above

  for (const client of [...bulkClients, aman, shulaabh, sunrise]) {
    const numTasks = rInt(1, 4);
    for (let t = 0; t < numTasks && taskCount < 150; t++) {
      const status = pick(taskStatuses);
      const dueOffset = pick([-30, -15, -7, 7, 14, 30, 45, 60]);
      const assignee = pick(assignees);
      await prisma.task.create({
        data: {
          tenantId: tenant.id, clientId: client.id,
          assigneeId: assignee.id, createdById: pick([heet, rajesh, priya]).id,
          title: pick(TASK_TITLES),
          description: `Task for ${client.displayName}. Please complete before due date.`,
          status, priority: pick(taskPriorities),
          dueDate: daysFromNow(dueOffset),
          completedAt: status === TaskStatus.COMPLETED ? daysAgo(rInt(1, 30)) : undefined,
          estimatedHrs: pick([1, 2, 3, 4, 6, 8]),
          tags: [FY], createdAt: rDate(daysAgo(200), daysAgo(1)),
        },
      });
      taskCount++;
    }
  }
  console.log(`  ✔ ${taskCount} total tasks created`);

  // ═══════════════════════════════════════════════════════
  // BULK COMPLIANCE (to reach 100 total)
  // ═══════════════════════════════════════════════════════
  console.log('\n📊 Creating bulk compliance records...');
  const compTypes = [
    ComplianceType.GST_MONTHLY, ComplianceType.GST_QUARTERLY, ComplianceType.TDS_QUARTERLY,
    ComplianceType.INCOME_TAX, ComplianceType.ADVANCE_TAX, ComplianceType.AUDIT,
    ComplianceType.ROC_ANNUAL, ComplianceType.DSC_RENEWAL, ComplianceType.PROFESSIONAL_TAX,
    ComplianceType.CUSTOM,
  ];
  const compStatuses = [
    ComplianceStatus.NOT_STARTED, ComplianceStatus.IN_PROGRESS, ComplianceStatus.FILED,
    ComplianceStatus.OVERDUE, ComplianceStatus.APPROVED,
  ];
  let compCount = 6; // already created above

  for (const client of bulkClients) {
    const numComps = rInt(1, 3);
    for (let c = 0; c < numComps && compCount < 100; c++) {
      const type = pick(compTypes);
      const status = pick(compStatuses);
      const titlesForType = COMPLIANCE_TITLES_BY_TYPE[type] ?? [`${type.replace(/_/g, ' ')} — ${FY}`];
      const dueDaysOffset = pick([-45, -30, -15, 10, 20, 30, 45, 60, 90]);
      const assignee = pick(assignees);
      await prisma.compliance.create({
        data: {
          tenantId: tenant.id, clientId: client.id, assigneeId: assignee.id,
          type, title: pick(titlesForType),
          status, priority: pick([TaskPriority.MEDIUM, TaskPriority.HIGH, TaskPriority.LOW]),
          dueDate: daysFromNow(dueDaysOffset),
          filedDate: status === ComplianceStatus.FILED ? daysAgo(rInt(1, 60)) : undefined,
          completedAt: status === ComplianceStatus.FILED ? daysAgo(rInt(1, 60)) : undefined,
          period: pick(['Apr 2025', 'May 2025', 'Q4 FY2025', 'AY 2025-26', FY]),
          financialYear: pick([FY, FY_NEXT]),
          isRecurring: Math.random() > 0.4,
          createdAt: rDate(daysAgo(300), daysAgo(1)),
        },
      });
      compCount++;
    }
  }
  console.log(`  ✔ ${compCount} total compliance records created`);

  // ═══════════════════════════════════════════════════════
  // BULK PHYSICAL FILES (to reach 100 total)
  // ═══════════════════════════════════════════════════════
  console.log('\n🗂  Creating bulk physical files...');
  const pfStatuses = [PhysicalFileStatus.IN_OFFICE, PhysicalFileStatus.ISSUED_TO_CLIENT, PhysicalFileStatus.ISSUED_TO_STAFF, PhysicalFileStatus.ARCHIVED];
  const boxes = ['A', 'B', 'C', 'D', 'E', 'F'];
  let pfCount = 3;
  let pfNum = 4;

  for (const client of bulkClients) {
    if (pfCount >= 100) break;
    const status = pick(pfStatuses);
    const box = `${pick(boxes)}${rInt(1, 9)}`;
    const shelf = String(rInt(1, 5));
    const cabinet = String(rInt(1, 6));
    const issuedTo = status === PhysicalFileStatus.ISSUED_TO_STAFF ? pick(assignees) : null;

    const pf = await prisma.physicalFile.create({
      data: {
        tenantId: tenant.id, clientId: client.id,
        fileNumber: `PF-${pad(pfNum)}`,
        description: `${client.displayName} — ${pick(['KYC', 'GST', 'ITR', 'Audit', 'Bank Docs'])} Documents FY${pick([FY, '2023-24'])}`,
        boxNumber: box, shelfNumber: shelf, cabinetNumber: cabinet,
        location: `Cabinet ${cabinet}, Shelf ${shelf}, Box ${box}`,
        status,
        issuedToId: issuedTo?.id,
        issuedToName: issuedTo ? `${issuedTo.firstName} ${issuedTo.lastName}` : undefined,
        issuedDate: status !== PhysicalFileStatus.IN_OFFICE ? daysAgo(rInt(5, 30)) : undefined,
        expectedReturn: status === PhysicalFileStatus.ISSUED_TO_STAFF ? daysFromNow(rInt(3, 14)) : undefined,
        tags: [FY], createdAt: rDate(daysAgo(700), daysAgo(30)),
      },
    });
    await prisma.physicalFileMovement.create({
      data: { physicalFileId: pf.id, tenantId: tenant.id, movedById: pick(assignees).id, action: 'FILED', toLocation: `Cabinet ${cabinet}, Shelf ${shelf}, Box ${box}`, createdAt: rDate(daysAgo(700), daysAgo(30)) },
    });
    if (issuedTo) {
      await prisma.physicalFileMovement.create({
        data: { physicalFileId: pf.id, tenantId: tenant.id, movedById: pick([rajesh, priya, heet]).id, issuedToId: issuedTo.id, action: 'ISSUED', fromLocation: `Cabinet ${cabinet}, Shelf ${shelf}, Box ${box}`, toLocation: `${issuedTo.firstName} ${issuedTo.lastName}'s desk`, reason: 'Required for client meeting', createdAt: daysAgo(rInt(5, 30)) },
      });
    }
    pfCount++;
    pfNum++;
  }
  console.log(`  ✔ ${pfCount} total physical files created`);

  // ═══════════════════════════════════════════════════════
  // NOTIFICATIONS (200)
  // ═══════════════════════════════════════════════════════
  console.log('\n🔔 Creating notifications...');
  const notifTemplates = [
    { type: NotificationType.TASK_ASSIGNED, title: 'New Task Assigned', body: (c: string) => `You have been assigned a new task for ${c}.` },
    { type: NotificationType.TASK_DUE, title: 'Task Due Tomorrow', body: (c: string) => `Task for ${c} is due tomorrow. Please review.` },
    { type: NotificationType.TASK_COMPLETED, title: 'Task Completed', body: (c: string) => `Task for ${c} has been marked as completed.` },
    { type: NotificationType.COMPLIANCE_DUE, title: 'Compliance Due Soon', body: (c: string) => `Compliance deadline approaching for ${c}.` },
    { type: NotificationType.DOCUMENT_UPLOADED, title: 'New Document Uploaded', body: (c: string) => `A new document has been uploaded for ${c}.` },
    { type: NotificationType.CLIENT_ADDED, title: 'New Client Added', body: (c: string) => `${c} has been added as a new client.` },
    { type: NotificationType.REMINDER, title: 'Reminder', body: (c: string) => `Reminder: GST deadline for ${c} is approaching.` },
    { type: NotificationType.SYSTEM, title: 'System Update', body: (_: string) => 'LedgerFlow has been updated with new features.' },
  ];

  const notifRecipients = [heet, rajesh, priya, amit, neha, rahul, karan];
  const notifBatch: any[] = [];
  for (let i = 0; i < 200; i++) {
    const tmpl = pick(notifTemplates);
    const client = pick(allClients);
    const recipient = pick(notifRecipients);
    const isRead = Math.random() > 0.35;
    notifBatch.push({
      tenantId: tenant.id, userId: recipient.id,
      type: tmpl.type, title: tmpl.title,
      body: tmpl.body(client.displayName),
      link: `/clients/${client.id}`,
      isRead, readAt: isRead ? rDate(daysAgo(30), daysAgo(0)) : undefined,
      createdAt: rDate(daysAgo(90), daysAgo(0)),
    });
  }
  await prisma.notification.createMany({ data: notifBatch });
  console.log('  ✔ 200 notifications created');

  // ═══════════════════════════════════════════════════════
  // AUDIT LOGS (1000)
  // ═══════════════════════════════════════════════════════
  console.log('\n📋 Creating audit logs (1000)...');
  const auditActions = [AuditAction.CREATE, AuditAction.UPDATE, AuditAction.DELETE, AuditAction.LOGIN, AuditAction.LOGOUT, AuditAction.UPLOAD, AuditAction.DOWNLOAD];
  const auditEntities = ['CLIENT', 'DOCUMENT', 'TASK', 'COMPLIANCE', 'USER', 'PHYSICAL_FILE', 'NOTE'];
  const auditDescriptions: Record<string, string[]> = {
    CLIENT: ['Client record created', 'Client profile updated', 'Client status changed', 'Client assigned to staff'],
    DOCUMENT: ['Document uploaded', 'Document downloaded', 'Document deleted', 'Document shared'],
    TASK: ['Task created', 'Task status updated', 'Task assigned to staff', 'Task completed', 'Task comment added'],
    COMPLIANCE: ['Compliance record created', 'Compliance status updated', 'Compliance filed', 'Due date updated'],
    USER: ['User logged in', 'User logged out', 'Password changed', 'Profile updated', 'User invited'],
    PHYSICAL_FILE: ['Physical file registered', 'File issued to staff', 'File returned', 'File location updated'],
    NOTE: ['Note created', 'Note updated', 'Note pinned', 'Note deleted'],
  };
  const allUserIds = staff.map(s => s.id);
  const BATCH_SIZE = 100;

  for (let batch = 0; batch < 10; batch++) {
    const logs: any[] = [];
    for (let i = 0; i < BATCH_SIZE; i++) {
      const entity = pick(auditEntities);
      const action = pick(auditActions);
      const client = pick(allClients);
      const userId = pick(allUserIds);
      logs.push({
        tenantId: tenant.id, userId,
        action, entityType: entity, entityId: client.id,
        description: pick(auditDescriptions[entity]),
        ipAddress: pick(IP_LIST), userAgent: pick(USER_AGENTS),
        deviceInfo: pick(['Chrome on Windows', 'Safari on Mac', 'Chrome on Android', 'Safari on iPhone']),
        status: Math.random() > 0.05 ? 'SUCCESS' : 'FAILED',
        createdAt: rDate(daysAgo(365), daysAgo(0)),
      });
    }
    await prisma.auditLog.createMany({ data: logs });
  }
  console.log('  ✔ 1000 audit logs created');

  // ═══════════════════════════════════════════════════════
  // ACTIVITIES
  // ═══════════════════════════════════════════════════════
  console.log('\n📌 Creating activity feed...');
  const activityTemplates = [
    { action: 'DOCUMENT_UPLOADED', desc: (c: string) => `Document uploaded for ${c}` },
    { action: 'TASK_CREATED', desc: (c: string) => `New task created for ${c}` },
    { action: 'TASK_COMPLETED', desc: (c: string) => `Task completed for ${c}` },
    { action: 'COMPLIANCE_FILED', desc: (c: string) => `Compliance filed for ${c}` },
    { action: 'NOTE_ADDED', desc: (c: string) => `Note added for ${c}` },
    { action: 'CLIENT_UPDATED', desc: (c: string) => `${c} profile updated` },
    { action: 'FILE_ISSUED', desc: (c: string) => `Physical file issued for ${c}` },
  ];
  const activityBatch: any[] = [];
  for (let i = 0; i < 300; i++) {
    const client = pick(allClients);
    const tmpl = pick(activityTemplates);
    const userId = pick(allUserIds);
    activityBatch.push({
      tenantId: tenant.id, clientId: client.id, userId,
      entityType: 'CLIENT', entityId: client.id,
      action: tmpl.action, description: tmpl.desc(client.displayName),
      createdAt: rDate(daysAgo(180), daysAgo(0)),
    });
  }
  await prisma.activity.createMany({ data: activityBatch });
  console.log('  ✔ 300 activities created');

  // ═══════════════════════════════════════════════════════
  // STORAGE USAGE SUMMARY
  // ═══════════════════════════════════════════════════════
  await prisma.storageUsage.create({
    data: {
      tenantId: tenant.id,
      usedBytes: BigInt(1_073_741_824), // ~1 GB
      fileCount: docCount,
    },
  });

  // ═══════════════════════════════════════════════════════
  // REMINDERS — ADDITIONAL
  // ═══════════════════════════════════════════════════════
  console.log('\n⏰ Creating additional reminders...');
  const reminderDefs = [
    { client: aman, title: 'ITR AY 2026-27 Filing Reminder', type: ReminderType.INCOME_TAX_DUE, due: daysFromNow(120) },
    { client: sunrise, title: 'Audit Report Deadline — Sunrise Trading', type: ReminderType.AUDIT_DUE, due: daysFromNow(115) },
    { client: shulaabh, title: 'GSTR-3B Due — June 2025', type: ReminderType.GST_DUE, due: daysFromNow(20) },
    { client: pick(bulkClients), title: 'TDS Q1 FY2026 Due Date', type: ReminderType.TDS_DUE, due: daysFromNow(35) },
    { client: pick(bulkClients), title: 'Professional Tax Return Due', type: ReminderType.COMPLIANCE_DUE, due: daysFromNow(15) },
    { client: pick(bulkClients), title: 'DSC Expiry Reminder', type: ReminderType.DSC_EXPIRY, due: daysFromNow(45) },
    { client: pick(bulkClients), title: 'ROC Annual Filing Reminder', type: ReminderType.ROC_DUE, due: daysFromNow(90) },
  ];
  for (const r of reminderDefs) {
    await prisma.reminder.create({
      data: {
        tenantId: tenant.id, clientId: r.client.id, createdById: pick([heet, rajesh, priya]).id,
        title: r.title, type: r.type, status: ReminderStatus.ACTIVE,
        dueDate: r.due, channels: [ReminderChannel.IN_APP, ReminderChannel.EMAIL],
      },
    });
  }
  console.log('  ✔ Reminders created');

  // ═══════════════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════════════
  console.log('\n' + '═'.repeat(55));
  console.log('✅  SEED COMPLETE — Gabani & Associates');
  console.log('═'.repeat(55));
  console.log(`  Tenant      : gabani-associates`);
  console.log(`  Firm        : Gabani & Associates, Surat`);
  console.log(`  Staff       : ${staff.length} members`);
  console.log(`  Clients     : ${allClients.length} total`);
  console.log(`  Documents   : ~${docCount}`);
  console.log(`  Tasks       : ~${taskCount}`);
  console.log(`  Compliance  : ~${compCount}`);
  console.log(`  Phys. Files : ~${pfCount}`);
  console.log(`  Notifs      : 200`);
  console.log(`  Audit Logs  : 1000`);
  console.log(`  Activities  : 300`);
  console.log('─'.repeat(55));
  console.log('  Login       : gabanihh@gmail.com / Heet@1234');
  console.log('  Staff login : <email> / Staff@1234');
  console.log('═'.repeat(55) + '\n');
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
