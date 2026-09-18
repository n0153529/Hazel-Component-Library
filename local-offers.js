/* =========================================================
   LOCAL OFFERS — data + interaction logic
   Static prototype: everything lives in memory, no backend.
   Replace COUNCILS / CATEGORIES / OFFERS with real API data
   when this is wired up. Render functions are written the
   same way as the other Hazel prototype pages (one data
   object, full-innerHTML re-render on change, no framework).
   ========================================================= */

/* ---------------- Icons (feather-style, matches the rest of the library) ---------------- */
const ICON = {
  fileText: `<svg viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 2v6h6M8 13h8M8 17h8M8 9h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 20.5s-7.6-4.6-10-9.3C.4 7.8 2.2 4.5 5.7 4c2-.3 3.9.6 5 2.3a5.7 5.7 0 0 1 1.3 0 5.9 5.9 0 0 1 5-2.3c3.5.5 5.3 3.8 3.7 7.2-2.4 4.7-10 9.3-10 9.3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  message: `<svg viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4A9 9 0 0 1 8 19l-5 1 1.4-4.2A8.4 8.4 0 1 1 21 11.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2 2 7l10 5 10-5-10-5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M2 12l10 5 10-5M2 17l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none"><circle cx="6" cy="12" r="2.5" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="6" r="2.5" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="18" r="2.5" stroke="currentColor" stroke-width="2"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  sparkle: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v2M7 11v2M1 7h2M11 7h2M3.22 3.22l1.41 1.41M9.36 9.36l1.42 1.42M3.22 10.78l1.41-1.41M9.36 4.64l1.42-1.42" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  uploadCloud: `<svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M7 17a4 4 0 0 1-1-7.87A5 5 0 0 1 15.9 7 4.5 4.5 0 0 1 17 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 20v-8m0 0-3 3m3-3 3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
};

/* ---------------- Councils ---------------- */
const COUNCILS = [
  {
    id: 'hazelton', name: 'Hazelton City Council', initials: 'HC', brandColor: '#104751',
    description: 'Hazelton City Council supports every child in our care and all care leavers up to age 25. Our local offer sets out the practical, financial and emotional support you\u2019re entitled to as you move towards independence.',
    childrenInCare: 312, careLeavers: 428,
    docs: {
      localOffer: { name: 'Hazelton Local Offer 2026', meta: 'PDF \u00b7 2.4 MB \u00b7 Updated Jan 2026' },
      strategy: { name: 'Care Leaver Strategy 2025\u20132028', missing: true },
      housing: { name: 'Housing Allocations Policy', missing: true }
    }
  },
  {
    id: 'bramwell', name: 'Bramwell Borough Council', initials: 'BB', brandColor: '#5b2333',
    description: 'Bramwell Borough Council is committed to giving care experienced young people the same start in life as their peers. This page brings together our local offer, strategy and housing commitments in one place.',
    childrenInCare: 184, careLeavers: 251,
    docs: {
      localOffer: { name: 'Bramwell Local Offer 2025\u201326', meta: 'PDF \u00b7 1.8 MB \u00b7 Updated Nov 2025' },
      strategy: { name: 'Corporate Parenting Strategy', missing: true },
      housing: { name: 'Housing Allocations Scheme', missing: true }
    }
  },
  {
    id: 'oakfield', name: 'Oakfield County Council', initials: 'OC', brandColor: '#1e3a5f',
    description: 'Oakfield County Council is another test council now which works with partners across the county to make sure care leavers know what support is available and how to access it, wherever they choose to live.',
    childrenInCare: 402, careLeavers: 519,
    docs: {
      localOffer: { name: 'Oakfield Local Offer', meta: 'PDF \u00b7 3.1 MB \u00b7 Updated Aug 2025' },
      strategy: { name: 'Care Leavers Strategy 2024\u20132027', missing: true },
      housing: { name: 'Housing Allocations Policy', missing: true }
    }
  }
];

/* ---------------- Offer types ---------------- */
const TYPE_BADGE = {
  'Career Insights': 'badge-info',
  'Taster Sessions': 'badge-primary',
  'Work Experience': 'badge-warning',
  'Job': 'badge-success',
  'Apprenticeships': 'badge-orange',
  'Free Offers': 'badge-success',
  'Discounted': 'badge-orange',
  'Volunteering': 'badge-info',
  'Other Offers': 'badge-neutral'
};

/* ---------------- Categories: icon, tone, tags (from the category/tag doc), title templates, target count ---------------- */
const CATEGORIES = [
  { id:'housing', title:'Housing & Accommodation', icon:'\ud83c\udfe0', tone:'primary', target:21,
    tags:['Housing options','Accommodation','Supported accommodation','Social housing','Private renting','Staying Put','Staying Close','Semi independent living','Independent accommodation','Homelessness prevention','Emergency accommodation','Temporary accommodation','Rent deposits','Rent in advance','Rent guarantors','Tenancy support','Moving support','Furniture','Household essentials','Housing after custody'],
    types:['Free Offers','Other Offers','Discounted'],
    templates:[
      {title:'Home Ready \u2013 A Safe Home Checklist', desc:'A step by step checklist to help you set up and settle into your first home. Covers everything from utilities and locks to making the place feel like yours.'},
      {title:'Welcome Baby \u2013 Essentials Grant & Support', desc:'A one off grant towards the essentials you need when you\u2019re expecting or have a new baby. Includes a cot, pram and a starter pack of clothing and supplies.'},
      {title:'Rent Deposit & Guarantor Scheme', desc:'Help covering a deposit or finding a guarantor so you can secure a tenancy. Works with local landlords and letting agents who already know the scheme.'},
      {title:'Furniture & Household Essentials Fund', desc:'A one off fund to help furnish your new home with the basics. Covers a bed, sofa, white goods and kitchen essentials to get you settled quickly.'},
      {title:'Housing After Custody Support', desc:'Support to arrange somewhere safe to live before and after you leave custody. A named worker starts planning with you from several weeks before release.'},
      {title:'Emergency Accommodation Helpline', desc:'A 24 hour line for young people who need somewhere safe to stay tonight. Trained staff will find you emergency accommodation and follow up the next day.'},
      {title:'Staying Put Arrangement Guidance', desc:'Guidance on staying with your former foster family past your 18th birthday. Explains how the arrangement works, what support continues and how to set it up.'},
      {title:'Tenancy Ready Workshop', desc:'A short workshop covering everything you need to know before signing a tenancy. Includes budgeting for rent, understanding contracts and tenant rights.'}
    ]
  },
  { id:'money', title:'Money & Financial Support', icon:'\ud83d\udcb7', tone:'success', target:14,
    tags:['Financial support','Leaving care allowance','Setting Up Home Allowance','Leaving care grant','Benefits','Benefit applications','Council tax support','Council tax exemption','Grants','Bursaries','Savings','Junior ISAs','Bank accounts','Budgeting','Debt advice','Household bills','Financial literacy','Income maximisation','Cost of living support','Emergency financial assistance'],
    types:['Free Offers','Other Offers'],
    templates:[
      {title:'Setting Up Home Allowance', desc:'A one off payment to help you set up your first independent home. Paid directly once your tenancy has been confirmed by your personal adviser.'},
      {title:'Leaving Care Grant Application', desc:'Find out how much you could get and how to apply for your leaving care grant. A benefits adviser will talk you through the application step by step.'},
      {title:'Benefits Ready Before Release', desc:'Get your benefit claims sorted before you leave care or custody. Avoids gaps in payment by starting the paperwork weeks ahead of your move.'},
      {title:'Get Your Own Bank Account', desc:'Step by step support opening your first bank account. Covers identity documents, choosing an account and setting up online banking safely.'},
      {title:'Budgeting & Money Skills Workshop', desc:'A practical session covering budgeting, bills and everyday money skills. Small groups, real examples and a take home budgeting planner.'},
      {title:'Council Tax Exemption Support', desc:'Find out if you\u2019re exempt from council tax as a care leaver and how to apply. Most young people qualify automatically once their status is confirmed.'}
    ]
  },
  { id:'education', title:'Education & Learning', icon:'\ud83c\udf93', tone:'info', target:9,
    tags:['Education','School','Post 16 education','College','Further education','University','Higher education','Postgraduate study','GCSEs','Functional Skills','Vocational qualifications','Education bursaries','Student finance','Education equipment','Laptops','Travel to education','SEND support','Returning to education','Study support','Barriers to learning'],
    types:['Taster Sessions','Free Offers','Other Offers'],
    templates:[
      {title:'University Bursary Fund', desc:'Extra financial support for care leavers going on to university. Paid each term on top of any student finance you already receive.'},
      {title:'Free Laptop for Study', desc:'A free laptop for care leavers starting a course or apprenticeship. Comes preloaded with the software most colleges and courses expect.'},
      {title:'Returning to Education Support', desc:'One to one support if you\u2019re thinking about going back into education. Helps you find the right course and sort out funding before you enrol.'}
    ]
  },
  { id:'jobs', title:'Jobs, Training & Careers', icon:'\ud83d\udcbc', tone:'warning', target:44,
    tags:['Employment','Jobs','Apprenticeships','Traineeships','Work experience','Internships','Taster opportunities','Careers advice','Career planning','Employability programmes','Vocational training','Supported employment','Reasonable adjustments','Interview preparation','Work clothing','Work equipment','Travel to work','Self employment','Enterprise','Staying in employment'],
    types:['Career Insights','Taster Sessions','Work Experience','Job','Apprenticeships','Volunteering'],
    templates:[
      {title:'Care Experienced Apprenticeship Pathway', desc:'A guaranteed apprenticeship pathway built for care experienced young people. Employers on this scheme have committed to interview every applicant.'},
      {title:'Leaving Custody Interview & Work Starter Fund', desc:'Interview clothing and a work starter fund for young people leaving custody. Covers travel to interviews as well as the first week of essentials.'},
      {title:'Guaranteed Careers Conversation', desc:'A guaranteed one to one careers conversation, no experience needed. Just bring whatever ideas you have, however small or unformed.'},
      {title:'Unlock Employer Insight Calls', desc:'Short calls with local employers to find out what different careers are really like. A relaxed way to ask questions without any pressure.'},
      {title:'Work Experience Taster Week', desc:'A week long taster placement to try out a career before you commit. Travel and lunch costs are covered for the full week.'},
      {title:'Interview Clothing Fund', desc:'Funding towards smart clothing for job interviews. Redeemable at partner shops so you can pick something that fits and feels right.'},
      {title:'Traineeship Programme', desc:'A funded traineeship combining training, work experience and support. Most young people move straight into an apprenticeship or job afterwards.'},
      {title:'Career Insights Evening', desc:'An evening event with employers from a range of local industries. Food is provided and you can drop in for as long or as little as you like.'},
      {title:'Supported Internship Scheme', desc:'A supported internship for young people who need extra help into work. A job coach works alongside you throughout the placement.'},
      {title:'Self Employment Starter Grant', desc:'A small grant and mentoring for care leavers starting their own business. Mentors have started their own businesses and know the early struggles.'},
      {title:'Employability Skills Bootcamp', desc:'A short course covering CVs, applications and interview skills. Ends with a mock interview and honest, useful feedback.'},
      {title:'Work Equipment Grant', desc:'Funding towards tools, uniform or equipment needed to start a new job. Ask your personal adviser before your first day to avoid delays.'},
      {title:'Careers Speed Networking', desc:'Meet several local employers in one evening in a relaxed, informal setting. A good way to make contacts even if you’re not job hunting yet.'},
      {title:'Job Club Drop In', desc:'A weekly drop in session with help writing CVs and finding vacancies. No appointment needed, just turn up during opening hours.'},
      {title:'Volunteering to Employment Pathway', desc:'Build experience through volunteering with a clear route into paid work. Many placements have led directly to a paid role with the same organisation.'}
    ]
  },
  { id:'health', title:'Health & Wellbeing', icon:'\u2764\ufe0f', tone:'success', target:6,
    tags:['Physical health','Mental health','Emotional wellbeing','Healthy living','GP registration','Healthcare registration','Dentistry','Eye care','Opticians','Prescriptions','Sexual health','Substance misuse','Pregnancy support','Maternity support','Health histories','Health records','Children\u2019s health services','Adult health services','CAMHS transition','Healthcare after custody'],
    types:['Free Offers','Other Offers'],
    templates:[
      {title:'My Mental Health \u2013 Asking for Help Is Strong', desc:'Simple ways to ask for help and where to turn when things feel hard. No referral needed, just a phone number and someone who will listen.'},
      {title:'Health Ready Before Release', desc:'Getting your GP, dentist and prescriptions sorted before you leave custody. A named health worker checks everything is in place before your release date.'},
      {title:'GP Registration Support', desc:'Help registering with a GP surgery near your new home. Staff can fill in the forms with you and explain how to book your first appointment.'}
    ]
  },
  { id:'relationships', title:'Relationships & Support Networks', icon:'\ud83e\udd1d', tone:'orange', target:11,
    tags:['Personal advisers','Mentors','Independent visitors','Former carers','Foster carers','Residential staff','Siblings','Family relationships','Family reconnection','Partners','Parenting relationships','Trusted adults','Positive relationships','Bereavement support','Peer support','Befriending','Loneliness','Social isolation','Community networks','Support networks','Tours'],
    types:['Other Offers','Volunteering'],
    templates:[
      {title:'HELP ORGANISE: Sunday Dinner Club', desc:'Help plan and run a monthly dinner club for care experienced young people. A relaxed way to build cooking skills and meet others in a similar position.'},
      {title:'Ask Anything \u2013 Practical Parenting Panel', desc:'An informal panel where you can ask parents anything about raising a family. No question is off limits and nothing is judged.'},
      {title:'Parents Like Me \u2013 Care Experienced Peer Group', desc:'A peer support group for care experienced parents and parents to be. Meets monthly with free cr\u00e8che places for younger children.'},
      {title:'Mentor Matching Scheme', desc:'Get matched with a trained mentor for regular one to one support. Mentors commit to at least six months so the relationship has time to build.'}
    ]
  },
  { id:'community', title:'Community, Activities & Having Your Say', icon:'\ud83c\udfad', tone:'info', target:9,
    tags:['Sport','Leisure','Gyms','Hobbies','Arts','Culture','Events','Trips','Activities','Discounts','Concessions','Free activities','Volunteering','Youth groups','Care leaver forums','Participation','Consultation','Co production','Voting','Civic involvement','Bag of money'],
    types:['Free Offers','Volunteering','Other Offers'],
    templates:[
      {title:'Help Me Turn My Idea Into a Project', desc:'Turn your own idea into a funded community project with support along the way. A worker helps you plan it out and apply for the money you need.'},
      {title:'Got an Idea? Try It with \u00a3300', desc:'Apply for up to \u00a3300 in seed funding to try out your idea. No business plan required, just a short form and a quick chat.'},
      {title:'Create and Chill Youth Space', desc:'A relaxed drop in space with free activities and food every week. Games, art materials and a quiet corner if you just want to sit and chat.'}
    ]
  },
  { id:'independent-living', title:'Independent Living & Everyday Life', icon:'\ud83c\udfe1', tone:'primary', target:5,
    tags:['Independent living','Life skills','Cooking','Shopping','Laundry','Cleaning','Household skills','Home maintenance','Utilities','Energy bills','Water bills','Insurance','Travel','Public transport','Driving','Provisional licences','Driving lessons','Identification documents','Digital access','Online safety'],
    types:['Free Offers','Discounted','Other Offers'],
    templates:[
      {title:'Free Provisional Driving Licence', desc:'Your first provisional driving licence paid for, start to finish. Your personal adviser handles the application so there’s nothing to pay upfront.'},
      {title:'Life Skills Cooking Course', desc:'Learn to cook simple, affordable meals from scratch. Small group sessions with all ingredients and equipment provided.'}
    ]
  },
  { id:'advice-rights', title:'Advice, Rights & Leaving Care Support', icon:'\u2696\ufe0f', tone:'warning', target:7,
    tags:['Advice','Rights','Care leaver status','Care leaver entitlements','Personal adviser entitlement','Pathway planning','Transition planning','Advocacy','Legal advice','Complaints','Appeals','Challenges','Care records','Access to files','Immigration','Asylum','Nationality','Citizenship','Police and courts','Support up to age 25'],
    types:['Other Offers'],
    templates:[
      {title:'Your Rights, Advice & Advocacy', desc:'Find out about your rights as a care leaver and how to get independent advocacy. Advocates are independent of the council and work only for you.'},
      {title:'Dads Together \u2013 Care Experienced Fathers', desc:'A support group for care experienced dads and dads to be. Meets fortnightly in a relaxed, informal setting with no pressure to talk.'},
      {title:'My Independent Pregnancy Companion', desc:'One to one support through pregnancy from someone who understands care. Your companion can come to appointments with you if that helps.'}
    ]
  },
  { id:'extra-support', title:'Extra Support When You Need It', icon:'\ud83d\udee1\ufe0f', tone:'orange', target:8,
    tags:['Disability support','Additional needs','Specialist support','Neurodiversity','SEND','Care experienced parents','Parents to be','Young carers','Domestic abuse','Safeguarding','Exploitation','Trafficking','Modern slavery','Victims of crime','Offending','Custody','Resettlement','Prison release','Migrant care leavers','Crisis support'],
    types:['Other Offers'],
    templates:[
      {title:'Get My ID Ready Before Release', desc:'Getting your ID documents sorted before you leave custody or care. Covers a birth certificate, provisional licence and proof of address.'},
      {title:'Victim of Crime Compensation Support', desc:'Support making a claim if you\u2019ve been a victim of crime. A caseworker helps you gather evidence and complete the application.'},
      {title:'Immigration & Right to Work Support', desc:'Advice on immigration status and your right to work in the UK. Sessions are confidential and run by a qualified immigration adviser.'}
    ]
  },
  { id:'discounts', title:'Discounts & Free', icon:'\ud83c\udff7\ufe0f', tone:'success', target:16,
    tags:['Free','Percentage discount','Fixed price','Buy one get one free','One off offer','Ongoing offer','Seasonal offer','Limited availability','Online offer','In store offer','Promo code required','Membership required','Advance booking required','New customer offer','Referral offer','Minimum spend applies','Eligibility required','Proof of eligibility required'],
    types:['Free Offers','Discounted'],
    templates:[
      {title:'Free Cinema Tickets for Care Leavers', desc:'Free monthly cinema tickets, just show your Hazel Card. Valid at any participating cinema, no booking required in advance.'},
      {title:'20% Off Local Gym Membership', desc:'A discounted membership rate at participating local gyms. Includes access to classes and the pool where available.'},
      {title:'Free Driving Theory Test Voucher', desc:'A free voucher covering the cost of your driving theory test. Ask your personal adviser for the code before you book online.'},
      {title:'Buy One Get One Free Caf\u00e9 Offer', desc:'Buy one get one free on hot drinks at participating cafes. Just show your Hazel Card at the till before you order.'},
      {title:'Discounted Bus Travel Pass', desc:'A reduced price travel pass for local bus routes. Renews automatically each month once you\u2019ve set it up once.'},
      {title:'Free Winter Coat Voucher', desc:'A one off voucher towards a warm winter coat. Redeemable at any participating high street store in the local area.'}
    ]
  }
];

/* ---------------- Generate the offer dataset ---------------- */
const OFFERS = [];
(function generateOffers(){
  let uid = 1;
  CATEGORIES.forEach(cat => {
    for (let i = 0; i < cat.target; i++){
      const tpl = cat.templates[i % cat.templates.length];
      const council = COUNCILS[i % COUNCILS.length];
      const type = cat.types[i % cat.types.length];
      const tags = [
        cat.tags[i % cat.tags.length],
        cat.tags[(i + 5) % cat.tags.length]
      ];
      if (i % 2 === 0 && cat.tags.length > 3) tags.push(cat.tags[(i + 11) % cat.tags.length]);
      OFFERS.push({
        id: 'off-' + (uid++),
        categoryId: cat.id,
        title: tpl.title,
        desc: tpl.desc,
        councilId: council.id,
        type: type,
        tags: [...new Set(tags)]
      });
    }
  });
})();

/* ---------------- Helpers ---------------- */
function councilById(id){ return COUNCILS.find(c => c.id === id); }
function categoryById(id){ return CATEGORIES.find(c => c.id === id); }
function initialsOf(name){
  return name.split(' ').filter(Boolean).slice(0,2).map(w => w[0]).join('').toUpperCase();
}
function offersForCouncil(councilId){
  return councilId === 'all' ? OFFERS : OFFERS.filter(o => o.councilId === councilId);
}
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

/* ---------------- State ---------------- */
const state = {
  council: 'all',   // 'all' or a council id
  mode: null,            // null | 'category' | 'search' | 'all'
  categoryId: null,
  tags: [],
  query: '',
  visibleCount: 24,
  saved: new Set()
};

/* ---------------- Toast ---------------- */
let toastTimer = null;
function showToast(msg){
  const el = document.getElementById('loToast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ---------------- Render: council select ---------------- */
function renderCouncilSelect(){
  const sel = document.getElementById('councilSelect');
  sel.innerHTML = `<option value="all">All local authorities</option>` +
    COUNCILS.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('');
  sel.value = state.council;
}

/* ---------------- Render: LA header ---------------- */
/* The wrap itself carries the council's brand colour as a full-bleed
   background (this is the piece a local authority will eventually set
   themselves) — everything inside is styled to read on top of an
   arbitrary dark brand colour. When no single council is in scope we
   fall back to the neutral dashboard dark-green and a generic message. */
function renderLaHeader(){
  const wrapEl = document.getElementById('laHeaderWrap');
  const cardEl = document.getElementById('laHeaderCard');

  if (state.council === 'all'){
    // No single authority in scope, so there's no one council's brand
    // to show — hide the whole banded section rather than show a
    // generic placeholder in someone else's colour.
    wrapEl.style.display = 'none';
    return;
  }

  wrapEl.style.display = '';
  const c = councilById(state.council);
  const offerCount = offersForCouncil(c.id).length;
  wrapEl.style.background = c.brandColor || 'var(--brand-dark-green)';
  cardEl.innerHTML = `
    <div class="la-logo-circle" style="color:${c.brandColor || 'var(--brand-dark-green)'}">${c.initials}</div>
    <div class="la-header-copy">
      <div class="h2">${escapeHtml(c.name)}</div>
      <p class="small">${escapeHtml(c.description)}</p>
    </div>
    <div class="la-stats">
      <div class="la-stat"><div class="num">${c.childrenInCare}</div><div class="lbl">Children in care</div></div>
      <div class="la-stat"><div class="num">${c.careLeavers}</div><div class="lbl">Care leavers supported</div></div>
      <div class="la-stat"><div class="num">${offerCount}</div><div class="lbl">Local offers published</div></div>
    </div>
    <div class="la-header-lower">
      <div class="la-docs-row">
        ${docCard(c.docs.localOffer, 'Local Offer')}
        ${docCard(c.docs.strategy, 'Strategy')}
        ${docCard(c.docs.housing, 'Housing allocations')}
      </div>
    </div>`;
}

function docCard(doc, label){
  if (doc.missing){
    return `
      <div class="doc-card">
        <div class="doc-thumb missing">
          <div class="doc-thumb-icon">${ICON.uploadCloud}</div>
          <div class="doc-thumb-title">No documentation found</div>
          <div class="doc-thumb-hint">Awaiting council upload</div>
        </div>
        <div class="doc-card-head">
          <div class="doc-name doc-name-missing">${escapeHtml(doc.name)}</div>
        </div>
        <div class="doc-meta">Not yet published</div>
      </div>`;
  }
  return `
    <div class="doc-card">
      <div class="doc-thumb">${ICON.fileText}<span class="ext">PDF</span></div>
      <div class="doc-card-head">
        <div class="doc-name">${escapeHtml(doc.name)}</div>
        <div class="doc-icon-actions">
          <button class="icon-btn icon-btn-sm" title="View" aria-label="View ${escapeHtml(doc.name)}" onclick="showToast('Opening document preview')">${ICON.eye}</button>
          <button class="icon-btn icon-btn-sm" title="Download" aria-label="Download ${escapeHtml(doc.name)}" onclick="showToast('Downloading document')">${ICON.download}</button>
        </div>
      </div>
      <div class="doc-meta">${escapeHtml(doc.meta)}</div>
    </div>`;
}

/* ---------------- Render: category grid ---------------- */
function renderCategoryGrid(){
  const grid = document.getElementById('catGrid');
  const pool = offersForCouncil(state.council);
  grid.innerHTML = CATEGORIES.map(cat => {
    const count = pool.filter(o => o.categoryId === cat.id).length;
    const active = state.mode === 'category' && state.categoryId === cat.id;
    return `
      <button class="cat-box ${active ? 'active' : ''}" data-cat="${cat.id}">
        <div class="cat-image tone-${cat.tone}">${cat.icon}</div>
        <div class="cat-box-body">
          <div class="cat-box-title">${escapeHtml(cat.title)}</div>
          <div class="cat-box-count">${count} offer${count === 1 ? '' : 's'}</div>
        </div>
      </button>`;
  }).join('');
  grid.querySelectorAll('.cat-box').forEach(btn => {
    btn.addEventListener('click', () => selectCategory(btn.getAttribute('data-cat')));
  });

  const note = document.getElementById('categoryScopeNote');
  note.textContent = state.council === 'all'
    ? 'Showing categories across all local authorities'
    : `Showing categories for ${councilById(state.council).name}`;
}

/* ---------------- Selection handlers ---------------- */
function selectCategory(catId){
  state.mode = 'category';
  state.categoryId = catId;
  state.tags = [];
  state.query = '';
  state.visibleCount = 24;
  document.getElementById('searchInput').value = '';
  document.getElementById('btnClearSearch').style.display = 'none';
  renderCategoryGrid();
  renderListing();
  // The category grid swaps for the listing in place (no layout jump),
  // but if the person clicked a category box near the bottom of a long
  // grid, the listing that appears above it can render off the top of
  // the viewport. Bring the listing heading into view so they land
  // somewhere useful rather than staying stranded at the old scroll
  // position.
  document.getElementById('listingTitle').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function toggleTag(tag){
  const i = state.tags.indexOf(tag);
  if (i === -1) state.tags.push(tag); else state.tags.splice(i,1);
  state.visibleCount = 24;
  renderListing();
}

// Clicking a tag chip directly on an offer card (rather than one of the
// filter pills above the listing) jumps straight to that offer's category,
// filtered down to just that one tag — the same end result as choosing the
// category then pressing the tag pill, collapsed into a single click.
function selectOfferTag(catId, tag){
  state.mode = 'category';
  state.categoryId = catId;
  state.tags = [tag];
  state.query = '';
  state.visibleCount = 24;
  document.getElementById('searchInput').value = '';
  document.getElementById('btnClearSearch').style.display = 'none';
  document.getElementById('btnAllOffers').classList.remove('active');
  renderCategoryGrid();
  renderListing();
  document.getElementById('listingTitle').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearTags(){
  state.tags = [];
  state.visibleCount = 24;
  renderListing();
}

function clearListing(){
  state.mode = null;
  state.categoryId = null;
  state.tags = [];
  state.query = '';
  document.getElementById('searchInput').value = '';
  document.getElementById('btnClearSearch').style.display = 'none';
  document.getElementById('btnAllOffers').classList.remove('active');
  document.getElementById('listingSection').style.display = 'none';
  document.getElementById('categorySection').style.display = '';
  renderCategoryGrid();
}

/* ---------------- Filtering ---------------- */
function matchesQuery(offer, q){
  const cat = categoryById(offer.categoryId);
  const council = councilById(offer.councilId);
  const haystack = [offer.title, offer.desc, offer.type, cat.title, council.name, ...offer.tags]
    .join(' ').toLowerCase();
  return haystack.includes(q.toLowerCase());
}

function getFilteredOffers(){
  let list = offersForCouncil(state.council);
  if (state.mode === 'search' && state.query.trim()){
    list = list.filter(o => matchesQuery(o, state.query.trim()));
  } else if (state.mode === 'category'){
    list = list.filter(o => o.categoryId === state.categoryId);
    if (state.tags.length){
      list = list.filter(o => o.tags.some(t => state.tags.includes(t)));
    }
  }
  // mode === 'all' -> council filter only
  return list;
}

/* ---------------- Render: listing ---------------- */
function renderListing(){
  const section = document.getElementById('listingSection');

  // Anti-jump: filtering (tags, search, load more) can change the
  // number of offer cards a lot, which changes the page's scrollable
  // height. If that happens while the user is scrolled down, the
  // browser yanks the scroll position back to fit — it reads as the
  // page "jumping around". Lock the section to its current on-screen
  // height first, then animate down/up to the new height, so the
  // resize is a smooth scroll rather than an instant snap.
  const wasVisible = section.style.display === 'block';
  const prevHeight = wasVisible ? section.offsetHeight : null;

  section.style.display = 'block';
  document.getElementById('categorySection').style.display = 'none';

  const iconEl = document.getElementById('listingIcon');
  const titleEl = document.getElementById('listingTitle');
  const tagsEl = document.getElementById('listingTags');

  if (state.mode === 'category'){
    const cat = categoryById(state.categoryId);
    iconEl.className = 'listing-icon cat-icon tone-' + cat.tone;
    iconEl.textContent = cat.icon;
    titleEl.textContent = cat.title;
    tagsEl.style.display = 'flex';
    tagsEl.innerHTML = cat.tags.map(t => `<button class="tag-pill ${state.tags.includes(t) ? 'selected' : ''}" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join('') +
      (state.tags.length ? `<button class="btn btn-dashed btn-sm" id="btnClearTags">${ICON.x} Clear tags</button>` : '');
    tagsEl.querySelectorAll('.tag-pill').forEach(el => {
      el.addEventListener('click', () => toggleTag(el.getAttribute('data-tag')));
    });
    const clearTagsBtn = document.getElementById('btnClearTags');
    if (clearTagsBtn) clearTagsBtn.addEventListener('click', clearTags);
  } else if (state.mode === 'search'){
    iconEl.className = 'listing-icon cat-icon tone-primary';
    iconEl.innerHTML = ICON.search;
    titleEl.textContent = `Search results for \u201c${state.query}\u201d`;
    tagsEl.style.display = 'none';
    tagsEl.innerHTML = '';
  } else {
    iconEl.className = 'listing-icon cat-icon tone-primary';
    iconEl.innerHTML = ICON.layers;
    titleEl.textContent = 'All offers';
    tagsEl.style.display = 'none';
    tagsEl.innerHTML = '';
  }

  const filtered = getFilteredOffers();
  document.getElementById('listingCount').textContent =
    `${filtered.length} offer${filtered.length === 1 ? '' : 's'}${state.council !== 'all' ? ' \u00b7 ' + councilById(state.council).name : ''}`;

  const grid = document.getElementById('offerGrid');
  const visible = filtered.slice(0, state.visibleCount);

  if (!filtered.length){
    grid.innerHTML = `
      <div class="lo-empty" style="grid-column:1/-1">
        <div class="h5">No offers match yet</div>
        <div class="small">Try clearing a tag, choosing a different council, or searching a different word.</div>
      </div>`;
  } else {
    grid.innerHTML = visible.map(offerCard).join('');
    grid.querySelectorAll('.offer-fav').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        showToast('Sign in to save offers to your favourites');
      });
    });
    grid.querySelectorAll('.offer-share').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        showToast('Share link copied');
      });
    });
    grid.querySelectorAll('.offer-chip-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectOfferTag(btn.getAttribute('data-cat'), btn.getAttribute('data-tag'));
      });
    });
    // Thumbnail, title and "View offer" all open the same offer-details
    // popup — one demo popup shared by every card for now (see the note
    // on the modal markup in local-offers.html).
    grid.querySelectorAll('.js-open-offer').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        openOfferModal();
      });
    });
  }

  document.getElementById('loadMoreWrap').style.display = filtered.length > state.visibleCount ? 'flex' : 'none';

  if (wasVisible && prevHeight){
    const newHeight = section.scrollHeight;
    if (Math.abs(newHeight - prevHeight) > 2){
      section.style.height = prevHeight + 'px';
      section.style.overflow = 'hidden';
      void section.offsetHeight; // force reflow so the browser registers the locked height
      requestAnimationFrame(() => {
        section.style.transition = 'height .22s ease';
        section.style.height = newHeight + 'px';
      });
      clearTimeout(renderListing._settleTimer);
      renderListing._settleTimer = setTimeout(() => {
        section.style.transition = '';
        section.style.height = '';
        section.style.overflow = '';
      }, 260);
    }
  }
}

function offerCard(offer){
  const cat = categoryById(offer.categoryId);
  const council = councilById(offer.councilId);
  const chipTags = offer.tags.slice(0, 2);
  return `
    <article class="offer-card">
      <div class="offer-thumb-wrap">
        <div class="offer-thumb-img tone-${cat.tone} js-open-offer" style="background:linear-gradient(155deg, var(--${cat.tone === 'primary' ? 'primary' : cat.tone}), var(--brand-dark-green))">${cat.icon}</div>
        <div class="offer-actions">
          <button class="offer-fav" aria-label="Save offer">${ICON.heart}</button>
          <button class="offer-share" aria-label="Share offer">${ICON.share}</button>
        </div>
      </div>
      <div class="offer-body">
        <div class="offer-title js-open-offer">${escapeHtml(offer.title)}</div>
        <p class="offer-desc">${escapeHtml(offer.desc)}</p>
        <div class="offer-council-row">
          <div class="avatar avatar-primary">${council.initials}</div>
          <div class="offer-council-name">${escapeHtml(council.name)}</div>
        </div>
        <div class="offer-chip-stack">
          <div class="offer-chips">
            ${chipTags.map(t => `<button type="button" class="badge badge-primary offer-chip-btn" data-cat="${cat.id}" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join('')}
          </div>
          <div class="offer-eligibility">
            <span class="badge badge-warning">Sign in to check eligibility</span>
          </div>
        </div>
        <button class="btn btn-primary btn-block js-open-offer">View offer</button>
      </div>
    </article>`;
}

/* ---------------- Wire up top-level controls ---------------- */
function initControls(){
  document.getElementById('councilSelect').addEventListener('change', (e) => {
    state.council = e.target.value;
    renderLaHeader();
    renderCategoryGrid();
    if (state.mode) renderListing();
  });

  document.getElementById('btnAllOffers').addEventListener('click', () => {
    state.mode = 'all';
    state.categoryId = null;
    state.tags = [];
    state.query = '';
    state.visibleCount = 24;
    document.getElementById('searchInput').value = '';
    document.getElementById('btnClearSearch').style.display = 'none';
    document.getElementById('btnAllOffers').classList.add('active');
    renderCategoryGrid();
    renderListing();
  });

  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    const val = e.target.value;
    document.getElementById('btnClearSearch').style.display = val ? 'grid' : 'none';
    document.getElementById('btnAllOffers').classList.remove('active');
    if (val.trim()){
      state.mode = 'search';
      state.query = val;
      state.tags = [];
      state.categoryId = null;
      state.visibleCount = 24;
      renderCategoryGrid();
      renderListing();
    } else if (state.mode === 'search'){
      clearListing();
    }
  });

  document.getElementById('btnClearSearch').addEventListener('click', () => {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
    searchInput.focus();
  });

  // Decorative/affordance button on the right of the search pill —
  // focuses the input rather than submitting anything (there's no
  // separate "go" step, filtering already happens live on input).
  document.getElementById('btnSearchIcon').addEventListener('click', () => {
    searchInput.focus();
  });

  document.getElementById('btnChat').addEventListener('click', () => {
    showToast('Chat with these documents is coming soon');
  });

  document.getElementById('btnClearListing').addEventListener('click', clearListing);
  document.getElementById('btnLoadMore').addEventListener('click', () => {
    state.visibleCount += 24;
    renderListing();
  });

  document.getElementById('btnLocateMe').addEventListener('click', () => {
    showToast('Finding your location\u2026');
    setTimeout(() => {
      state.council = 'hazelton';
      document.getElementById('councilSelect').value = 'hazelton';
      renderLaHeader();
      renderCategoryGrid();
      if (state.mode) renderListing();
      showToast('Showing offers for Hazelton City Council');
      document.getElementById('laHeaderCard').scrollIntoView({ behavior:'smooth', block:'start' });
    }, 700);
  });
}

/* ---------------- Offer details popup ---------------- */
function openOfferModal(){
  document.getElementById('offerModalBackdrop').hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeOfferModal(){
  document.getElementById('offerModalBackdrop').hidden = true;
  if (document.getElementById('offerLightboxBackdrop').hidden){
    document.body.style.overflow = '';
  }
}

function openOfferLightbox(){
  document.getElementById('offerLightboxBackdrop').hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeOfferLightbox(){
  document.getElementById('offerLightboxBackdrop').hidden = true;
  if (document.getElementById('offerModalBackdrop').hidden){
    document.body.style.overflow = '';
  }
}

function initOfferModal(){
  const modalBackdrop = document.getElementById('offerModalBackdrop');
  const lightboxBackdrop = document.getElementById('offerLightboxBackdrop');

  document.getElementById('btnCloseOfferModal').addEventListener('click', closeOfferModal);
  // Click anywhere outside the modal card (i.e. directly on the dimmed
  // backdrop) closes it; clicks that land on the modal itself shouldn't.
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeOfferModal();
  });

  document.getElementById('offerModal').querySelectorAll('.offer-fav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showToast('Sign in to save offers to your favourites');
    });
  });
  document.getElementById('offerModal').querySelectorAll('.offer-share').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showToast('Share link copied');
    });
  });

  document.getElementById('btnExpandOfferImage').addEventListener('click', (e) => {
    e.stopPropagation();
    openOfferLightbox();
  });
  document.querySelector('.offer-modal-media').addEventListener('click', (e) => {
    if (e.target.closest('.offer-actions') || e.target.closest('.offer-modal-expand')) return;
    openOfferLightbox();
  });

  document.getElementById('offerModal').querySelector('.offer-modal-cta').addEventListener('click', () => {
    showToast('Sign in & claim this offer');
  });

  document.getElementById('btnCloseLightbox').addEventListener('click', closeOfferLightbox);
  lightboxBackdrop.addEventListener('click', (e) => {
    if (e.target === lightboxBackdrop) closeOfferLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!lightboxBackdrop.hidden) closeOfferLightbox();
    else if (!modalBackdrop.hidden) closeOfferModal();
  });
}

/* ---------------- Init ---------------- */
renderCouncilSelect();
renderLaHeader();
renderCategoryGrid();
initControls();
initOfferModal();
