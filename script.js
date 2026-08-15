
<script>
    //<![CDATA[
let currentPage = 1;
const itemsPerPage = 6;
let currentFilteredList = [];
let userCoords = null;
const ADMIN_WHATSAPP_NUMBER = "919177583840";

// Telangana All 33 Districts List
const telanganaDistricts = [
    "Adilabad", "Bhadradri Kothagudem", "Hanamkonda", "Hyderabad", "Jagtial",
    "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar",
    "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial",
    "Medak", "Medchal Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda",
    "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla",
    "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad",
    "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"
];

function toggleNavbar() {
    const menu = document.getElementById('navbarMenu');
    const openIcon = document.getElementById('navIconOpen');
    const closeIcon = document.getElementById('navIconClose');
    
    menu.classList.toggle('hidden');
    openIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
}

// Pre-Admission Modal Functions
function openPreAdmissionModal() {
    document.getElementById('preAdmissionModal').classList.remove('hidden');
}

function closePreAdmissionModal() {
    document.getElementById('preAdmissionModal').classList.add('hidden');
}

// ==========================================
// REPORT POPUP MODAL FUNCTIONS (FIXED)
// ==========================================
function openReportModal(hName, hAddress) {
    const modal = document.getElementById('reportModal');
    if (modal) {
        document.getElementById('reportHospitalName').innerText = hName;
        document.getElementById('reportHospitalAddress').innerText = hAddress;
        modal.classList.remove('hidden');
    } else {
        // Fallback agar HTML modal na mile to direct WhatsApp
        let text = `Report Issue for Hospital: ${hName} (${hAddress})`;
        window.open(`https://api.whatsapp.com/send?phone=${ADMIN_WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`, '_blank');
    }
}

function closeReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) modal.classList.add('hidden');
}

function submitReportModal() {
    let name = document.getElementById('reportHospitalName').innerText;
    let address = document.getElementById('reportHospitalAddress').innerText;
    let issueType = document.getElementById('reportReasonSelect') ? document.getElementById('reportReasonSelect').value : 'Incorrect Information';
    let userMsg = document.getElementById('reportUserMessage') ? document.getElementById('reportUserMessage').value : '';

    let text = `*Report Issue - Telangana Healthcare Hub*%0A` +
               `🏥 *Hospital:* ${encodeURIComponent(name)}%0A` +
               `📍 *Address:* ${encodeURIComponent(address)}%0A` +
               `⚠️ *Issue Type:* ${encodeURIComponent(issueType)}%0A` +
               `📝 *Details:* ${encodeURIComponent(userMsg)}`;

    window.open(`https://api.whatsapp.com/send?phone=${ADMIN_WHATSAPP_NUMBER}&text=${text}`, '_blank');
    closeReportModal();
}

// Master Database of Surgery / Treatment Packages
const masterPackageList = [
    {
        code: "MED-SURG-102",
        name: "Laparoscopic Cholecystectomy (Gallbladder Removal)",
        schemes: "✅ Rajiv Aarogyasri | ✅ NEHS (Employees & Pensioners)",
        coverageType: "Fully Cashless",
        details: "Includes Pre-op, Surgery, IPD & Post-op Medicines",
        specialty: "General & Multispecialty",
        hospitals: [
            { name: "Area Hospital - Golconda", distance: "1.9 km away" },
            { name: "CARE Hospitals Malakpet", distance: "3.2 km away" },
            { name: "Ozone Hospitals - Kothapet", distance: "4.5 km away" }
        ]
    },
    {
        code: "MED-SURG-204",
        name: "Phacoemulsification with IOL (Cataract Eye Surgery)",
        schemes: "✅ Rajiv Aarogyasri | ✅ NEHS (Employees & Pensioners)",
        coverageType: "Fully Cashless",
        details: "Includes Intraocular Lens, OT Charges & Post-op Eyedrops",
        specialty: "Eye & Dental",
        hospitals: [
            { name: "Sarojini Devi Eye Hospital", distance: "1.2 km away" },
            { name: "Dr Agarhwal Health Care", distance: "2.5 km away" },
            { name: "Maxivision Eye Hospitals", distance: "3.8 km away" }
        ]
    },
    {
        code: "MED-SURG-309",
        name: "HEMODIALYSIS (Chronic Kidney Disease Care)",
        schemes: "✅ Rajiv Aarogyasri | ✅ NEHS (Employees & Pensioners)",
        coverageType: "Fully Cashless per Session",
        details: "Includes Dialysis Consumables, Tubing & Associated Sessions",
        specialty: "Oncology",
        hospitals: [
            { name: "Asian Institute of Nephrology and Urology", distance: "2.1 km away" },
            { name: "Osmania General Hospital", distance: "3.0 km away" },
            { name: "Apollo Hospitals", distance: "4.2 km away" }
        ]
    },
    {
        code: "MED-SURG-412",
        name: "PCNL / Ureteroscopy (Kidney Stone Laser Treatment)",
        schemes: "✅ Rajiv Aarogyasri | ✅ NEHS (Employees & Pensioners)",
        coverageType: "Fully Cashless",
        details: "Includes Laser Lithotripsy, Anesthesia & IPD Stay",
        specialty: "Oncology",
        hospitals: [
            { name: "Asian Institute of Nephrology and Urology", distance: "2.1 km away" },
            { name: "Yashoda Hospitals - Somajiguda", distance: "3.4 km away" },
            { name: "CARE Hospitals Malakpet", distance: "4.1 km away" }
        ]
    },
    {
        code: "MED-SURG-515",
        name: "Coronary Angioplasty with Drug-Eluting Stent (Heart Care)",
        schemes: "✅ Rajiv Aarogyasri | ✅ NEHS (Employees & Pensioners)",
        coverageType: "Fully Cashless",
        details: "Includes Stent Cost, Cardiac Catheterization & ICU Stay",
        specialty: "Cardiology",
        hospitals: [
            { name: "Yashoda Hospitals SEC-BAD", distance: "2.8 km away" },
            { name: "Apollo Hospitals Secunderabad", distance: "3.5 km away" },
            { name: "Care Hospital Banjara Hills", distance: "4.0 km away" }
        ]
    }
];

function handlePackageSearchInput() {
    const query = document.getElementById('packageSearchInput').value.toLowerCase().trim();
    const box = document.getElementById('packageSuggestionsBox');
    
    if(!query) {
        box.classList.add('hidden');
        box.innerHTML = '';
        return;
    }

    const matches = masterPackageList.filter(p => p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query));
    
    if(matches.length === 0) {
        box.classList.add('hidden');
        box.innerHTML = '';
        return;
    }

    box.innerHTML = '';
    matches.forEach(m => {
        let div = document.createElement('div');
        div.className = 'px-4 py-2.5 hover:bg-slate-100 cursor-pointer border-b border-slate-100 text-xs text-slate-700 flex justify-between items-center';
        div.innerHTML = `<span><strong>${m.name}</strong></span> <span class='text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold'>${m.code}</span>`;
        div.onclick = function() {
            document.getElementById('packageSearchInput').value = m.name;
            box.classList.add('hidden');
            renderPackageResult(m);
        };
        box.appendChild(div);
    });
    box.classList.remove('hidden');
}

function executePackageSearch() {
    const query = document.getElementById('packageSearchInput').value.toLowerCase().trim();
    const box = document.getElementById('packageSuggestionsBox');
    if(box) box.classList.add('hidden');

    if(!query) {
        alert("Please enter a surgery or treatment name in the search box first!");
        return;
    }

    const found = masterPackageList.find(p => p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query));
    if(found) {
        renderPackageResult(found);
    } else {
        const customPkg = {
            code: "MED-SURG-999",
            name: document.getElementById('packageSearchInput').value,
            schemes: "✅ Rajiv Aarogyasri | ✅ NEHS (Employees & Pensioners)",
            coverageType: "Fully Cashless",
            details: "Includes Pre-op consultation, surgical procedure, IPD stay & post-op medicines.",
            specialty: "General & Multispecialty",
            hospitals: [
                { name: "Area Hospital - Golconda", distance: "1.9 km away" },
                { name: "CARE Hospitals Malakpet", distance: "3.2 km away" },
                { name: "Yashoda Hospitals", distance: "4.5 km away" }
            ]
        };
        renderPackageResult(customPkg);
    }
}

function renderPackageResult(pkg) {
    document.getElementById('resPkgCode').innerText = "Package Code: " + pkg.code;
    document.getElementById('resPkgTitle').innerText = "Package Name: " + pkg.name;
    document.getElementById('resPkgSchemes').innerText = pkg.schemes;
    document.getElementById('resPkgCoverageType').innerText = pkg.coverageType;
    document.getElementById('resPkgDetails').innerText = pkg.details;

    const hospContainer = document.getElementById('resPkgHospitalsList');
    hospContainer.innerHTML = '';
    pkg.hospitals.forEach(h => {
        let div = document.createElement('div');
        div.className = 'bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs';
        div.innerHTML = `<p class='font-semibold text-slate-900'>${h.name}</p><span class='text-[10px] text-blue-600 font-medium'>${h.distance}</span>`;
        hospContainer.appendChild(div);
    });

    window.activePackageSpecialty = pkg.specialty || "General & Multispecialty";

    document.getElementById('packageSearchResultCard').classList.remove('hidden');
    document.getElementById('packageSearchResultCard').scrollIntoView({ behavior: 'smooth' });
}

function filterHospitalsByPackageSpecialty() {
    const cardSel = document.getElementById('healthCardSelect');
    if(cardSel) cardSel.value = "NEHS Card";
    document.getElementById('stateSelect').value = "Telangana";
    updateDistricts();
    document.getElementById('hospitalTypeSelect').value = "All";
    document.getElementById('specializationFilter').value = window.activePackageSpecialty || "General & Multispecialty";
    
    displayHubInfo();
}

const nehsRawData = [


{"hospitalName": "SRI RAM MULTY SPECIALITY DENTAL CARE", "address": "Netaji chowk, opposite to Agrawal sweets, Ponnar, Ravindra Nagar Colony, Adilabad, Telangana 504001", "contacts": ["G SURESH: 9133613548"], "district": "Adilabad", "lat": 19.6641, "lng": 78.5320},









{
    "hospitalName": "KIMS HOSPITAL(A UNIT OF SRINITHA HOSPITALS AND RESEARCH PRIVATE LIMITED)",
    "address": "Kumuram Bheem Asifabad, Telangana",
    "contacts": ["CH RAJU: 9912405875"],
    "district": "Kumuram Bheem Asifabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "CHC - KHAGAZNAGAR",
    "address": "Kagaznagar, Kumuram Bheem Asifabad, Telangana",
    "contacts": [
      "MR/MS INDURI PADMALATHA: 9493736169",
      "MR/MS KUNSOTH SAGARIKA: 9908541228"
    ],
    "district": "Kumuram Bheem Asifabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "District Hospital, Asifabad",
    "address": "Asifabad, Kumuram Bheem Asifabad, Telangana",
    "contacts": [
      "DR CHENNA KESHAVA: 9515654441",
      "MR/MS KAMDE SANGARAKSHITHA: 8985117896",
      "MR/MS MD.SULAMAN: 9866787801"
    ],
    "district": "Kumuram Bheem Asifabad",
    "lat": null,
    "lng": null
  },

























{
    "hospitalName": "SAI CARES MULTISPECIALITY DENTAL CLINIC",
    "address": "Khammam, Telangana",
    "contacts": ["G PRIYANKA: 7794922431"],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRUJAN ORTHO AND ACCIDENT CARE HOSPITAL",
    "address": "Khammam, Telangana",
    "contacts": [
      "Dr R.Sandhyrani: 9848156422",
      "MR/MS T.USHA RANI: 9908867372",
      "Mr/Ms TELURI.PUNNARAO: 9640449988"
    ],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "VASAN HEALTH CARE PRIVATE LIMITED",
    "address": "Khammam, Telangana",
    "contacts": [
      "MR / MS UPPU. BHASKAR RAO: 8499937337",
      "MS KILARI . SRILATHA: 8333816009",
      "Mr/Ms RAMA KUMARI M: 9848278558"
    ],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "VASHISTA MULTI SPECIALITY HOSPITAL",
    "address": "Khammam, Telangana",
    "contacts": ["KANDHULA ASHOK KUMAR: 9676803075"],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SURYA DENTAL HOSPITAL",
    "address": "Khammam, Telangana",
    "contacts": ["Dr NANAPANENNIRAJESH: 9848777366"],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "CHC - NELAKONDAPALLY",
    "address": "Nelakondapally, Khammam, Telangana",
    "contacts": ["Dr RAJESH KOMMU: 8333817455"],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "JAGRUTH SUPER SPECIALITY HOSPITAL",
    "address": "Khammam, Telangana",
    "contacts": ["MR CHIRRA.RAMESH: 9603619492"],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "GRACE GENERAL HOSPITAL",
    "address": "Khammam, Telangana",
    "contacts": ["KIRAN: 8367466466"],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI RAM KIDNEY INFERTILITY AND LAPAROSCOPIC CENTRE",
    "address": "Khammam, Telangana",
    "contacts": [
      "DR K SRIKALA: 9848260218",
      "MR / MS POLAMPALLI SAIDULU: 9666418870",
      "MR/MS B.LALITHA: 9849535221",
      "Mr/Ms P. PAVITHRA: 8333816242"
    ],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI RAKSHA HOSPITALS",
    "address": "Khammam, Telangana",
    "contacts": [
      "DR GONGURA VENKATESWARLLU: 9246947773",
      "MR UDUTHA GOPI: 9705291282",
      "MR/MS CHOWDAVARAPU .SRIKANTH: 9014159154",
      "MR/MS G.ASEERVADHAM: 9704265010"
    ],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SANKALPA C STAR HOSPITAL (A UNIT OF SANKALAP HEALTH CARE)",
    "address": "Khammam, Telangana",
    "contacts": ["NIKIL: 9866849844"],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI SAI MULTI SPECIALITY HOSPITAL",
    "address": "Khammam, Telangana",
    "contacts": [
      "DR SAMINENI ROHINI: 9441319557",
      "MR/MS V. SARASWATHY: 9553038103"
    ],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "DR SHARAT MAXIVISION EYE HOSPITALS LLP",
    "address": "Khammam, Telangana",
    "contacts": ["MR / MS G PRANEETHA: 8333816246"],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AREA HOSPITAL - SATHUPALLY",
    "address": "Sathupally, Khammam, Telangana",
    "contacts": [
      "Dr K.Venkateswarlu: 8985238903",
      "MR/MS LAKAVATHU.KRISHNA: 9959133832",
      "MR/MS P.Srinivasarao: 9000430689",
      "MR/MS VEMU.MOHAN RAO: 9912685229"
    ],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "GOVT CIVIL HOPITAL MADHIRA",
    "address": "Madhira, Khammam, Telangana",
    "contacts": [],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI RAGHURAM HOSPITALS",
    "address": "Khammam, Telangana",
    "contacts": ["MR G NAGABHUSNANAM: 9160236216"],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Government General Hospital- Khammam",
    "address": "Khammam, Telangana",
    "contacts": [
      "Dr B.Balu: 9390402485",
      "MR/MS CHENNA.DURGA PRASAD: 9948191125",
      "MR/MS N.KISHORE: 9010667572",
      "MR/MS S.VENKATA REDDY: 7995229233",
      "MR/MS SK.MAJEED MIYA: 8333816709",
      "Mr/Ms DONTAGANI HARISH BABU: 9000066349"
    ],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "KVR GENERAL AND EMERGENCY HOSPITAL",
    "address": "Khammam, Telangana",
    "contacts": ["MR/MS SK.JAN: 7893075665"],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AREA HOSPITAL - PENUBALLI",
    "address": "Penuballi, Khammam, Telangana",
    "contacts": [
      "DR P VASUMATHI DEVI: 9989024373",
      "Mr / Ms SHAIK.MAHABOOBI: 8333816256"
    ],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SIVA EMERGENCY AND MULTISPECIALITY HOSPITAL",
    "address": "Khammam, Telangana",
    "contacts": [
      "Dr. NAMBURU SUNIL KUMAR: 9440115756",
      "MR/MS A.SIVAREDDY: 7680857993",
      "MR/MS DARA.PRAVEEN KUMAR: 9618428377",
      "MR/MS J.VEKANNA: 8333816009"
    ],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "PRASUNA ORTHOPAEDIC AND MULTISPECIALITY HOSPITAL",
    "address": "Khammam, Telangana",
    "contacts": [
      "Dr. HARIPRASAD: 9848159618",
      "Mr/Ms MD. ZAREENA: 9297258047"
    ],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "JABISETTY HOSPITAL",
    "address": "Khammam, Telangana",
    "contacts": ["GOUTHAM JABISETTY: 9989856576"],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "PARUCHURI SUPER SPECIALITY DENTAL CLINIC",
    "address": "Khammam, Telangana",
    "contacts": ["Mr. P.VENKATWSWARA RAO: 9848777366"],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "PARTHA DENTAL",
    "address": "Khammam, Telangana",
    "contacts": [
      "Dr Dr.Venkanna: 9247940838",
      "Dr Dr.Venkanna: 9989142585"
    ],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AKHILA EYE HOSPITAL AUNITOFMANDMHEALTHCARESERVICES",
    "address": "Khammam, Telangana",
    "contacts": [
      "DR GHANTA MADHAVI: 7995774444",
      "MR/MS SIVARATHRI.SRINIVAS RAO: 9618895825"
    ],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI RAGHURAM HOSPITAL",
    "address": "Khammam, Telangana",
    "contacts": ["MR/MS AKSHINTALA.ANURADHA: 9966299640"],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "ARKA HOSPITAL",
    "address": "Khammam, Telangana",
    "contacts": ["Prasad: 9676340870"],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "M/s Madhavi Hospital",
    "address": "Khammam, Telangana",
    "contacts": ["Muralidhar D: 9701513531"],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "NAGUBANDI DENTAL HOSPITAL",
    "address": "Khammam, Telangana",
    "contacts": ["Dr MADHAVI: 9246903363"],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MAMATHA GENERAL AND SUPER SPECIALITY HOSPITAL A UNIT OF MAMATHA EDUCATIONAL SOCIETY",
    "address": "Khammam, Telangana",
    "contacts": [
      "DR V.SHANKARARAO: 8008904785",
      "MR / MS KUKATLA.KARUNA JYOTHI: 9703049032",
      "MR/MS SAMPETA. NAGESWAR RAO: 8333817236"
    ],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "KAMALA HOSPITAL AND RESEARCH CENTRE FOR THALASSEMIA AND SICKLE CELL PATIENTS A UNIT OF THALASSEMIA AND SICKLE CELL SOCIETY",
    "address": "Khammam, Telangana",
    "contacts": [
      "DR M HARSHAVARDHAN RAO: 9059781611",
      "G PRANEETHA: 8333817400"
    ],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "DR AGARWALS HEALTH CARE LIMITED",
    "address": "Khammam, Telangana",
    "contacts": ["VUPPU BHASKAR RAO: 9849058355"],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "NEW LIFE EMERGENCY AND MULTISPECIALITY HOSPITAL",
    "address": "Khammam, Telangana",
    "contacts": [
      "Dr. RAMA KRISHNA: 8008007716",
      "MR/MS P.RAMADEVI: 8688046716"
    ],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "TARUN ORTHOPEDIC AND ACCIDENT CARE HOSPITAL",
    "address": "Khammam, Telangana",
    "contacts": [
      "Dr. M NARAYANA: 8125631849",
      "MR/MS VURUGONDA.USHARANI: 9490464763"
    ],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "RITHANYA HOSPITAL DIAGNOSTICS",
    "address": "Khammam, Telangana",
    "contacts": [
      "Dr.A.LAXMI DEEPA: 8328581019",
      "MR/MS K.PRASANNA KUMAR: 9866511627",
      "Mr / Ms MUTHINENI. SRIDEVI: 9573396783"
    ],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI SAI MARUTHI SUPER SPECIALTY HOSPITAL",
    "address": "Khammam, Telangana",
    "contacts": [
      "MR/MS PAGILLA.SEETHARAMAMMA: 9949726075",
      "RAMULU BHUKYA: 9849999792"
    ],
    "district": "Khammam",
    "lat": null,
    "lng": null
  },


















{
    "hospitalName": "Smile Dental Care",
    "address": "Karimnagar, Telangana",
    "contacts": ["PEDDELLI SRIRAM: 9247009270"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Sapthagiri dental hospital",
    "address": "Karimnagar, Telangana",
    "contacts": ["Ramya: 9666939323"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "KARIMNAGAR SUPER SPECIALITY DENTAL HOSPITAL AND MAXILLOFACIAL TRAUMA CENTRE",
    "address": "Karimnagar, Telangana",
    "contacts": ["DR G MAHESHWAR: 9849463934"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SS DENTAL CLINIC",
    "address": "Karimnagar, Telangana",
    "contacts": ["Swetha: 9704743318"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "S.V. Dental super multi speciality clinic",
    "address": "Karimnagar, Telangana",
    "contacts": ["Shashidhar: 9666626665"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI ANANYA DENTAL HOSPITAL AND IMPLANT CENTRE",
    "address": "Karimnagar, Telangana",
    "contacts": ["Dr SIFALI: 9989472212"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "APOLLO REACH HOSPITAL",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "Devendar Mende: 9573262574",
      "Dr KOLAKALURIANITHA: 8919949737",
      "Dr Neelagiri Trivikram: 9949244450",
      "Mr / Ms ALIKANTI SRILATHA: 8179450682",
      "Mr / Ms GANGARAPU.ARCHANA: 9908800353"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "OMEGA SUSHRUTHA HOSPITALS(A UNIT OF SATHAVAHANA INSTITUTE OF ONCOLOGY PRIVATE LIMITED)",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "Dr DR RAYINI AMARENDAR RAO: 7288887646",
      "Dr GANDHAM KANTHANNAGNANA DEEPTI: 7288887646",
      "MR / MS MD.AARIF PASHA: 7382563978",
      "MR/MS ARIGELA RAMESH: 9492727148"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SANJEEVANEE NURSING HOME",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "Dr M VIJAYA LAKSHMI: 9849167967",
      "GALIPELLI SHARADA: 8500782332",
      "MR / MS K.YADAGIRI: 9493966810"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "CVVM HOSPITAL",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "DR CH SRIDHAR: 9959577751",
      "MR / MS MD.VAZIUDDIN: 9912700393"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "FORTUNE MEDCARE HOSPITAL",
    "address": "Karimnagar, Telangana",
    "contacts": ["Mr / Ms THALLAPELLY RAVINDAR: 9642836235"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Sunshine Hospital (A unit of Suryateja Health Care Pvt. Ltd)-Karimnagar",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "Dr KAMALAKAR KARAMPUDI: 9100663336",
      "Dr. srikanth reddy: 9100663336",
      "MR KANNPURAM KIRAN KUMAR: 9849567046",
      "MR/MS MASAM SUDHAR: 9701672070"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SAROJINI HOSPITAL",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "DR KRISHNACHAITANYAVEMULA: 9985366060",
      "THALLAPELLY RAVINDAR: 8333817455"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI HARSHA EYE HOSPITAL",
    "address": "Karimnagar, Telangana",
    "contacts": ["MOGILI RAJESHAM: 7995446666"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Star Women AND Children Hospital",
    "address": "Karimnagar, Telangana",
    "contacts": ["U Parushuram: 7799376262"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Sharanya dental care & Implant centre",
    "address": "Karimnagar, Telangana",
    "contacts": ["G SANDEEP: 9912339995"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AAROGYA MULTI SPECIALITY HOSPITAL",
    "address": "Karimnagar, Telangana",
    "contacts": ["DR. RAGULA LAXMI: 8125539445"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AMRUTHA NURSING HOME",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "Dr L GEETHA REDDY: 9866230727",
      "MS KONDU NEERAJA: 8333816211",
      "Mr / Ms M.VANAJA: 8500001433"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "CHALMEDA ANAND RAO INSTITUTE OF MEDICAL SCIENCES",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "Dr RAJAIAH: 9866919547",
      "Dr SHRAVAN KUMAR CHANDRAGIRI: 9030525246",
      "KAYITHI MAHESH: 7780324892",
      "MR MATETI SRINIVAS: 8333816209",
      "MR / MS GURRAM RAVI: 9676534534",
      "MR/MS BANDARI ANJANEYULU: 9441440277",
      "MR/MS Bandari Venkanna: 9908281835",
      "MR/MS P SUNITHA: 9640391109",
      "MR/MS SHRAVAN KALLEPALLI: 9849783452",
      "MR/MS Sogala satheesh kumar: 9603985311",
      "N RAVI KUMAR: 9959012562"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "RENEE HOSPITAL A Unit of Renee Medical Center Pvt Ltd",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "MR NAROJU NAGARAJU: 9000224849",
      "RAVINDRA CHARI M: 7330948881"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI CHANDRA HOSPITAL",
    "address": "Karimnagar, Telangana",
    "contacts": ["KOLA SANDHYA RANI: 6281895886"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "PRATHIMA INSITUTE OF MEDICAL SCIENC",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "Dr BOINAPALLYVIKAS: 8500813051",
      "MR / MS MD.RAFEEQ PASHA: 9490322678",
      "MR / MS PURAMSHETTY RAMESHWAR RAO: 8500090556",
      "MR / MS SUNKARA RAMESH: 8333816209",
      "MR/MS KOLAKANI SANJEEV KUMAR: 9963458542",
      "MR/MS Thandra Ravinder: 9866293405"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "DISTRICT HOSPITAL - KARIMNAGAR",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "Dr K K LAXMAN: 9502918535",
      "MR / MS THIRUMALESH: 8333816205",
      "MR/MS GADICHERLA RANJITH: 8179062241"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "GOVT AREA HOSPITAL",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "DR RAJASHEKAR REDDY: 7207667762",
      "Dr Y Suryasrirao: 9441873166",
      "MR/MS DASARI KALPANA: 9908868195",
      "Mr / Ms CH RAMA DEVI: 8333816226",
      "Mr / Ms D.CHANDRA SHEKAR: 7680821182"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Dragarwals eye hospital",
    "address": "Karimnagar, Telangana",
    "contacts": ["MR/MS ALOORI SRINIVAS: 9866616701"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SURYA NURSING HOME",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "DR Srikanth: 9885748777",
      "MR / MS PENDRU KAMALAKAR REDDY: 9550499934"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI KRISHNASAI MULTI SPECIALITY HOSPITAL",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "Dr SABBANI KRISHNA MURTHY: 9959997983",
      "MR/MS GUARAPPA RAMESH: 9959711892",
      "MR/MS MOGILI RAJESHAM: 9553535871"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "APEX HOSPITAL",
    "address": "Karimnagar, Telangana",
    "contacts": ["MR / MS MUTHYAM PRAVEEN KUMAR: 9848663638"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "KPR MULTISPECIALITY HOSPITAL",
    "address": "Karimnagar, Telangana",
    "contacts": ["Y.PRASAD: 9866299290"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI VENKATA DENTAL HOSPITAL",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "DR DR L RAJA BHASKAR: 8099847799",
      "DR DR L RAJA BHASKAR: 9390086581"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "DR.BHOOM REDDYS HOSPITAL",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "Dr DR NOORI AFIFA: 9440517375",
      "Dr DR V BHOOM REDDY: 9866395600",
      "Dr V SURYANARAYANA REDDY: 9440517375",
      "Mr / Ms R.LATHA: 8106156953"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AREA HOSPITAL HUZURABAD",
    "address": "Huzurabad, Karimnagar, Telangana",
    "contacts": [
      "Dr YATA ROHITH REDDY: 9642002222",
      "MR / MS T.VENKAT RAJAM: 9177992722"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "DR SHARAT MAXIVISION EYE HOSPITALS LLP",
    "address": "Karimnagar, Telangana",
    "contacts": ["MR/MS KADASU MALEESHAM: 9676047128"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "ORCHID HOSPITALS",
    "address": "Karimnagar, Telangana",
    "contacts": ["Mr / Ms MOLUGURE MAHENDER BABU: 8008391520"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "VENKATADRI HOSPITAL",
    "address": "Karimnagar, Telangana",
    "contacts": ["VENKATA SURYA JANARDHAN RAO: 7995087617"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "K.K. MULTI SPECIALITY DENTAL CLINIC",
    "address": "Karimnagar, Telangana",
    "contacts": ["DR.IVVALA SIFALI: 8297689901"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "VENKATESHWARA KIDNEY CENTER",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "Dr DR.R.YAKAIAH: 9849343514",
      "Dr K SRINIVAS: 9492462955",
      "MR / MS CHETTI UGENDER: 9948631384",
      "MR/MS PENCHALA RAVI: 9701824105",
      "Mr / Ms GOGIKAR RAJENDER: 9640616208"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI RAMA MULTI SPECIALITY HOSPITAL",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "DR V SRINIVAS: 9866636787",
      "MR/MS POTHUNURI SRISAILAM: 9059592300",
      "MR/MS SAMPATH BODDUPALLY: 9966590591"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "RISHIKA CHILDRENS HOSPITAL",
    "address": "Karimnagar, Telangana",
    "contacts": ["MR / MS AILAPURAM SRINIVAS: 9866645353"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SHIVA ELITE KIDNEY AND MULTI SPECIALTY HOSPITAL",
    "address": "Karimnagar, Telangana",
    "contacts": ["MR/MS KOLLURI RAVINDER: 9000167615"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "JEEVAN HOSPITAL",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "DR D.Ambika: 8008425548",
      "Dr D.Ambika: 9346028313",
      "MR / MS M. SWAPNA: 7286809456",
      "MR/MS T.RAJITHA: 8333816411"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MEDICOVER HOSPITALS (A unit of Sahrudaya Health Care (Karimnagar) Pvt. Ltd.)",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "CHANDRA MOULI: 8978529565",
      "Dr CH PARTHASARATHI RAO: 9030911901",
      "MR/MS DADI THIRUPATHI: 9441127238",
      "MR/MS GALIPELLY ANJANEYULU: 9912287939",
      "Mr / Ms KAMUTAM SRINIVAS: 8333816230"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "LIONS CLUB OF KARIMNAGAR CHARITABLE EYE HOSPITAL",
    "address": "Karimnagar, Telangana",
    "contacts": [],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "NOVA HOSPITAL",
    "address": "Karimnagar, Telangana",
    "contacts": ["B SHIVA: 9700404179"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MAHAVEER HOSPITAL",
    "address": "Karimnagar, Telangana",
    "contacts": ["SRINIVAS: 9618596180"],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Adarsha Hospital",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "DR MAMIDI ANIL KUMAR: 9121000888",
      "Mr / Ms GURRAM KARUNADEVI: 9666409646"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "VIJAYA HOSPITALS",
    "address": "Karimnagar, Telangana",
    "contacts": [
      "Dr M.Vasudeva Reddy: 9989072909",
      "MR/MS ODDAM Manojkumar: 9949456147"
    ],
    "district": "Karimnagar",
    "lat": null,
    "lng": null
  },


































 
 
  {
    "hospitalName": "M/s Prasad Hospitals India Private limited",
    "address": "Nacharam, Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr SUMA K: 9032666622",
      "MR/MS SRIKANTH: 8247240581",
      "P.SHRAVAN KUMAR: 9908873860"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "PADMAJA HOSPITAL",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "DR NAIDU SAI GAUTHAM: 9440950590",
      "MR/MS B.SOWJANYA: 8333816431"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Amor Hospitals a unit of Aptamitra healthcare pvt ltd",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "MOHAMMED MAZARODDIN: 9573141245"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Roma Hospital",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "SUMAN G: 9949402761"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "BBR MULTI SPECIALITY HOSPITAL",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr GOURISHETTY MARUTHI KIRAN: 9177324649",
      "MR/MS MOHAMMED MAZARUDDHIN: 9573141245",
      "J.SRINIVAS GOUD: 9908301634",
      "P SATHISH KUMAR: 8333816425"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "NEW LIFE LINE MULTI SPECIALITY HOSPITAL",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr KODALI RAJ KUMAR: 8885568190",
      "Dr PoolaNaveenkumar: 8885568190",
      "MACHERLA.SWAPNA: 8333816375",
      "Y.HARI BABU MR/MS: 8333816352"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "DR SRIDHAR INTERNATIONAL DENTAL HOSPITAL",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "DR Pathuri: 9703318315",
      "DR Pathuri: 9989377723"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "ANKURA DENTAL CLINIC",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "VIJAYA HOSPITAL",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr SRaghupathi Reddy: 9985100426",
      "N.SANDHYA RANI: 8185809919"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Area Hospital - Parigi",
    "address": "Parigi, Medchal Malkajgiri, Telangana",
    "contacts": [
      "DR.PRAVEEN KUMAR S: 9666177781",
      "MR/MS G.BALRAJ: 9666177781"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SREE LAKSHMI GAYATRI HOSPITALS PVT LTD",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "DR T APPIREDDY: 9989815198",
      "G SATISH BABU: 9866885477"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI SRI HOLISTIC HOSPITALS A Unit of Sree Ramachandra Health Services Pvt Ltd",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "B SOWJANYA: 8333817455"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "VASAN EYE CARE A Unit of Vasan Health Care Pvt Ltd",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "RAJENDAR K: 9989595838"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "KAKATIYA HOSPITALS",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr A.Srinivas: 9848520599",
      "ARE RAJ KUMAR: 8121384611",
      "K.VEENA: 9885479885"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "RENOVA HOSPITALS A UNIT OF SHAKAMBARI HEALTH CARE SERVICES PVT LTD",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Area Hospital - Ibrahimpatnam",
    "address": "Ibrahimpatnam, Medchal Malkajgiri, Telangana",
    "contacts": [],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "RAMANSHOSPITAL",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "BABAJI NETHRALAYYA PRIVATE LIMITED",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "JANGILI. SOUJANYA: 9492457031"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AASHRITHA HOSPITAL",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr Lahitha Polisetty: 8374736532"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "GLOBAL EYE AND LASER HOSPITAL PVT LTD",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr. TADLA TIRUMAL RAO: 8008008811",
      "MR/MS JANGILI.SOUJANYA: 9492457031"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Pure Ortho Hospital",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "E MAHESHWARI: 7396793370"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Rajus dental",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "Mrs Kavya v: 6303771301"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SUREKHA HOSPITAL",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "GUDISA.SUMAN: 9949402761",
      "SUDHEER T: 8333816340",
      "UMASHANKAR: 9247000564"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRIKARA HOSPITAL",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "MR/MS B. DEVENDER: 9985124403"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "CHIRANJEEVI HOSPITALS A UNIT OF CHIRANJEEVI VASCULAR CARE PVT LTD",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "SOWJANA B: 8333817455"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "RAMDEV RAO HOSPITAL",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr.G.Rajini Kumari: 9948546724"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MALLA REDDY NARAYANA MULTISPECIALITY HOSPITAL (A UNIT OF CHANDRAMMA EDUCATIONAL SOCIETY)",
    "address": "Jeedimetla, Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr VENU REDDY: 8886977002",
      "ASHOK KUMAR: 9010108304",
      "T.RAVI KUMAR: 9030494958"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRIKARA HOSPITALS",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "MR/MS D.SRILAXMI: 9603981787"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SAIJYOTHI EYE HOSPITAL",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "MR/MS Y.S.V. SUDHAKAR: 9866358234"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "GEMCARE POULOMI HOSPITALS",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "HARI BABU: 9866570293"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MALLAREDDY HOSPITAL",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr AMUL KUMAR: 9849971777",
      "Dr M UDAYKIRAN YADAV: 9849971777",
      "Dr VINUSHA KALIDINDI: 7893662066",
      "P.VASANTHA: 8333816383"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "M/S LIFELINE TULASI HOSPITALS (A UNIT OF LINELINE MULTI SPECIALITY HOSPITALS PVT. LTD)",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "DR RAMANA REDDY: 9505183821",
      "MR / MS NAVEEN G: 9959449129"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "REMEDY HOSPITAL",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Srikara hospitals ( A unit of venkateswara ortho health care pvt)",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "J Suresh Reddy: 9642114466"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Wellness Hospitals NXP (A unit of Wellness NXP Hospitals Pvt Ltd)",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr.A.Narendra Kumar: 0402460251"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "ANANDBAGH SUPER SPECIALITY DENTAL HOSPITAL",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "DR.SIVA SUNEETHA: 9160167799"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SHARE MEDICAL CARE (MEDICITI INSTITUTE OF MEDICAL SCIENCES- MEDCHAL)",
    "address": "Medchal, Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr C. SHYAM SUNDER REDDY: 9866424028",
      "Dr RAMRAJESH: 9866278043",
      "MR/MS MD.YOUSUF: 9948761496"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "APEX HOSPITALS",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr DR ASHOK KUMAR K: 9963470404",
      "MR / MS G. SUMAN: 9502328566"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SHREE HEALTHCARE MULTI SPECIALITY HOSPITAL",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "DR V SRINIVAS: 9949708268",
      "MR/MS SWAPNA D: 9701393564"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "EYE LAND HOSPITALS A UNIT OF EYE LAND HEALTH CARE",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "MR/MS AMPATI SWAMY: 9949664162"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Area hospital - Ghatkesar",
    "address": "Ghatkesar, Medchal Malkajgiri, Telangana",
    "contacts": [
      "MR/MS D.VIJAYA LAKSHMI: 7382661804"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Suraksha Dental",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "DR Rajitha Gadipelly: 9948806974"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "REVIVE PLUS MULTISPECIALITY HOSPITAL",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "DR SAI BABA T: 7337565660"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MANA HOSPITALS ( A UNIT OF WE CARE LIFE LINE HEALTH CARE PRIVATE LIMITED)",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "KIRAN: 8977732994"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "BOPPANA DENTAL CARE",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "Sriharsha: 9000003652"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "KJS DENTAL HOSPITAL",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr Marakala Venkat Reddy: 9949158864"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "POSITIVE DENTAL SCIENCES PRIVATE LIMITED",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr SRUJANA: 9550405555"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MALLA REDDY HOSPITAL",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr DR DIVYA: 9849971777"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "M/s. Prathima Hospitals (A unit of Mamatha Medicare Pvt. Ltd.)-Medchal",
    "address": "Medchal, Medchal Malkajgiri, Telangana",
    "contacts": [
      "M SUDHA MANI: 9703070085",
      "M.CHANDRAKALA: 9966354169"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "DR SURESHS SUPER SPECIALITY DENTAL HOSPITAL",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr DR SURESH REDDY THOOM: 9966442282"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI RAGHAVENDRA HOSPITAL",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr DR: 9000892621",
      "Dr Pushpalatha: 9000892621"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "TREATMENT RANGE HOSPITAL PVT LIMITED",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "LAXMAIAH. E: 9705516614"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "ABINAV EYE CARE CENTRES",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "ANAND EYE INSTITUTE PVT LTD",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "DR SATHISH G AGRAHARAM: 9848948675",
      "Dr DR MANAV KHERA: 9703724443",
      "Dr GADDE ARUNA KUMARI: 8333816413",
      "Dr NIKHIL SHREERAM CHOUDHARI: 9949497855",
      "Dr SHASHIKALA S.: 9989987000",
      "MR / MS SHAILAJA D: 9848516648",
      "Mr / Ms R. ASHWINI: 8333816395"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI SRI HOLISTIC HOSPITAL A UNIT OF SREE RAMCHANDRA HEALTH SERVICES PRIVATE LIMITED",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "DR Rajesh Khanna: 8886610101",
      "MR / MS T.JAGADESHWARI: 8121935508",
      "MR/MS P.NARENDER REDDY: 9989688085"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SPARK HOSPITALS",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr. SRINIVAS: 7036228333",
      "MR/MS VIJAYA KUMAR: 8333816413"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "CHC - Kadangal",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "ALAVI HOSPITALS",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "RAJIV KUMAR: 9160572345"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "DR.JSR DENTAL HEALTH SPECIALITY",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr DR SHAILENDER PERSHAD: 7842323411"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MAMATA ACADEMY OF MEDICAL SCIENCES HOSPITAL",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr D Sunil Kumar: 9640716167"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MEDIVISION EYE AND HEALTH CARE CENTRE PVT LTD",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "NEO VISION EYE CARE AND LASER CENTRE",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "MR/MS P.ESHWARI BAI: 9441390139"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "RNC HOSPITALS",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "S SATHEESH: 8333817482"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "M/s SUPRAJA HOSPITALS (A UNIT OF DHANTURI HOSPITALS)",
    "address": "Medchal Malkajgiri, Telangana",
    "contacts": [
      "Dr FAISAL ANSARI: 9985717640",
      "Dr. Ch Srinivas: 7731802222",
      "Mr / Ms KISHORE G: 9177228942"
    ],
    "district": "Medchal Malkajgiri",
    "lat": null,
    "lng": null
  },











































  {
    "hospitalName": "Government General Hosptial - MULUGU",
    "address": "Mulugu, Telangana",
    "contacts": [
      "Dr DR. P Gopal: 9959468451",
      "MR/MS B. RAJENDER: 9959468451",
      "MR/MS KOMPELLI SRINU: 9948302637",
      "MR/MS S. RAVINDER: 9949836745"
    ],
    "district": "Mulugu",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "CHC- Eturunagaram",
    "address": "Mulugu, Telangana",
    "contacts": [
      "DR. SURESH KUMAR M: 9441940949",
      "MR / MS KONDA RAMESH: 9948709416",
      "MR/MS G. SARASWATHI: 9441940949",
      "MR/MS G.SIVAKUMAR: 8500404767",
      "MR/MS GAGGURI RAMBABU: 9492445973"
    ],
    "district": "Mulugu",
    "lat": null,
    "lng": null
  },






  {
    "hospitalName": "Area Hospital Achampet Nagarkurnool",
    "address": "Nagarkurnool, Telangana",
    "contacts": [
      "MOHAMMED SIRAJUDDIN SYED: 8978127220",
      "MR/MS J.BALNARAYANA: 9440185560",
      "MR/MS JAYAMMA: 9666834264"
    ],
    "district": "Nagarkurnool",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI DEVI MULTI SPECIALITY DENTAL HOSPITAL",
    "address": "Nagarkurnool, Telangana",
    "contacts": [
      "Dr DR A BHASKER: 9848107414"
    ],
    "district": "Nagarkurnool",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Government General Hospital- Nagarkurnool",
    "address": "Nagarkurnool, Telangana",
    "contacts": [
      "DR DR.RAMESHCHANDRA: 9494827758",
      "MR / MS V.KURMAIAH: 8523864514",
      "MR/MS BANGARAIAH: 9640424185",
      "MR/MS S.SUJATHA: 8374459229",
      "Mr / Ms PARIJATHA C: 8333816166"
    ],
    "district": "Nagarkurnool",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SV YENNAMS HOSPITAL A Unit of SV Yennams Hospitals Pvt Ltd",
    "address": "Nagarkurnool, Telangana",
    "contacts": [],
    "district": "Nagarkurnool",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "CHC - KALWAKURTHY",
    "address": "Nagarkurnool, Telangana",
    "contacts": [
      "Dr Dr.J.Shiva Ram: 9966445559",
      "MR/MS A LAKSMAIAH: 9553627265",
      "MR/MS C.NAGESHWAR RAO: 9912295122",
      "MR/MS EDULAPALLY.RAMARJUN: 9705800457",
      "MR/MS N.KRISHNAIAH: 9948425665"
    ],
    "district": "Nagarkurnool",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Area Hospital-Kollapur",
    "address": "Nagarkurnool, Telangana",
    "contacts": [
      "DR SRINIVASULU: 9032296074",
      "MR/MS ANASUYA: 9492356346",
      "MR/MS K.NARASIMHA: 9491629253",
      "MR/MS M. SHANKAR: 9160375581"
    ],
    "district": "Nagarkurnool",
    "lat": null,
    "lng": null
  },






  {
    "hospitalName": "VEDA SUPER SPECIALITY DENTAL CLNIC",
    "address": "Narayanpet, Telangana",
    "contacts": [
      "K VENUGOPAL: 9492776660"
    ],
    "district": "Narayanpet",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Area Hospital - Makthal",
    "address": "Narayanpet, Telangana",
    "contacts": [
      "MR/MS K ARUN KUMAR: 9908234270",
      "MR/MS RADHIKA: 9704560693"
    ],
    "district": "Narayanpet",
    "lat": null,
    "lng": null
  },







  {
    "hospitalName": "Bapuji super speciality dental hospital",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "JADAV. KUSUM: 9292257595"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "PRIME ASHA SUPER SPECIALITY HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "MR/MS Dommata Yadamma: 7893243076"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Dr Agarwals Health Care Limited",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "MR/MS Kotturu Akhila: 9032856905"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "COMMUNITY HEALTH CENTER – VARNI",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "Dr BHASKARA RAO RAVELLA: 8333817455"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SHASHANK HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "Dr KMothilal: 7569869101"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "ANKAM HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "MR / MS SWAMY.PEDDI: 8333816331",
      "MR/MS T.V.R Lilly Pushpa: 8985045691"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "WELLNESS HOSPITALS A UNIT OF WELLNESS INDUR HOSPITALS PVT LTD",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "MR/MS Thum Ramulu: 9951275128"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "RR LIFELINE HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "DR RODASI: 9848936995",
      "MR/MS Dadipogu Bhagyalaxmi: 9666494101"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "NIZAMABAD SUPER SPECIALITY DENNTAL HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "Dr DR SABA: 7799050505",
      "MR/MS Neeradi Swaroopa: 8985790565"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MANORAMA SUPER SPECIALITY HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "MR / MS N GANGA SAGAR: 9550556558",
      "MR/MS J MANI KUMAR: 8125164317",
      "Mr DR CHANDRA SHEKHAR RAO: 9848936995"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SHIVA SAI EMERGENCY & MULTISPECIALITY HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "Dr cVinoda: 8885786745",
      "M.Aruna MR/MS: 8333816315",
      "MR/MS Gunda Kavitha: 9666776743",
      "MR/MS Jadav Sambaji: 9848908557",
      "MR/MS M Josphin: 800876437",
      "MR/MS Mavuram Rajeshwar: 9948538748",
      "MR/MS Remma Radhika: 8333817042"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI SAI HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "Gouse: 9848476230"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "GOVERNMENT GENERAL HOSPITAL -NIZAMABAD",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "DR. N. BALARAJ: 9553101309",
      "Dr CHALLA SRAVAN KUMAR: 7386580735",
      "JAKKULA VIJAYKUMAR: 9010700104",
      "MR/MS BANAVATH NARENDHAR: 9491315308",
      "MR/MS G Shirin Monica: 9701297064",
      "MR/MS Potharaj Santhosh: 9989151130"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "KIDS CARE EMERGENCY CHILDRENS HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "MR J.RAMA GOUD: 9885557130",
      "RATNA PARAM JYOTHI: 8519904995"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "LIONS EYE HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "MR/MS Macharla Shankar: 9705102396",
      "MR/MS Kolipyaka Sagar: 9948762340"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Area hospital dharpally",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "B.narendhar: 9491315308"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SAI SHUBHA MULTISPECIALITY HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "Dr GANGARAM B: 9848278231",
      "MR/MS Perika Sanjeev: 9951730252",
      "MR/MS Pinapati Vidyavathi: 9618461519"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AREA HOSPITAL - BODHAN",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "Dr Vijay Bhaskar: 8686862208",
      "MR / MS G SRINIVAS: 8333816315",
      "MR/MS Y SURESH: 9642915242"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "VASAVI EYE HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "Dr DWARAKNATH: 9849250290",
      "MR/MS B LAXMAN: 8897082067",
      "MR/MS M Josphin: 800876437"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "PRATIBHA SUPER SPECIALITY HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "DR. MOTHILAL: 9666612266",
      "MRS SHARALA: 8333816334"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI KRISHNA NEURO SUPER SPECIALITY HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "MR. DOPATHI VEERAIAH: 9948430737"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AYYAPPA DIAGNOSTICS AND EYE HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI VISHNU SUPER SPECIALITY HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "PAVAN NEURO & SUPER SPECIALITY HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "J.SAI KUMAR: 9000304750"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MAHALAXMI DENTAL HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "Dr Dr.B.Ganga Reddy: 8019577745"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "COMMUNITY HEALTH CENTER - KOTAGIRI",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "Dr SAMATHA DEVOLLA: 8333817455"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "INDUR CANCER HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "Dr KVNMurthy: 9848987849",
      "Dr RAVINDRANATH SOORY: 9849863130",
      "MR/MS Bhoomaiah Gari Jeevan Reddy: 8074462001",
      "MR/MS Dumpala Sunil Kumar: 9704581150"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "GSBV MEMORIAL AMRUTHA LAXMI MULTISPECIALITY HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "DR Jaya Prakash: 9885459708",
      "MR/MS Angoori Yashvanth: 9299653269",
      "MR/MS G KAPIL: 9573230203",
      "MR/MS Mattamwar Shivaji: 9492002978",
      "Mr / Ms C KAVITHA: 8333816396"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "HEERA NURSING HOME",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "Dr G.kaulaiah: 9396422311",
      "M.Aruna MR/MS: 8333816315",
      "MR/MS Lokula Sailu: 9492011103",
      "MR/MS Pulinti Murali Krishna: 995188255"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "COMMUNITY HEALTH CENTER – NAVIPET",
    "address": "Nizamabad, Telangana",
    "contacts": [],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "NAVATA MULTI SPECIALITY DENTAL CARE CENTRE",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "Dr KAVITHA PARSHI: 9866650346",
      "MR/MS Dhane Muthenna: 7730876774"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "PRAGATHI HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "Dr Vasanth Rao: 9849170704",
      "MR / MS T SRAVAN KUMAR: 8333816315",
      "MR/MS Chandrapalaka Sumalatha: 9912631143",
      "MR/MS Munimi Naresh: 9618992802"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "APARNA HOSPITAL",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "DR GPRAKASH: 7794940008",
      "Dr GPRAKASH: 9492564544",
      "MR / MS GUJJA.RAMA KRISHNA: 9440898447",
      "MR/MS Godbole Sunitha: 7036107584"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Area Hospital - Armur",
    "address": "Nizamabad, Telangana",
    "contacts": [
      "MR/MS Tappa Susheela: 9032526550"
    ],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "CHC - Dichpally",
    "address": "Nizamabad, Telangana",
    "contacts": [],
    "district": "Nizamabad",
    "lat": null,
    "lng": null
  },













  {
    "hospitalName": "PRASHANTHS GKHOSPITALS",
    "address": "Nirmal, Telangana",
    "contacts": [
      "MR/MS PRAVEEN .PODDUTOORI: 9492683486",
      "Mr/Ms DR PRASHANTH: 9989383456"
    ],
    "district": "Nirmal",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "CHC - Khanapur",
    "address": "Nirmal, Telangana",
    "contacts": [],
    "district": "Nirmal",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Dr Lalitha Multispeciality hospital",
    "address": "Nirmal, Telangana",
    "contacts": [
      "Hari krishna: 9133194334"
    ],
    "district": "Nirmal",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SWAPNA MULTISPECIALITY HOSPITAL",
    "address": "Nirmal, Telangana",
    "contacts": [
      "DR. SHASHIKANTH: 9676080700",
      "MR. SUNKARI MUKESH KUMAR: 9440528737",
      "SWAPNA DR.: 7981449548"
    ],
    "district": "Nirmal",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Narendra Multi Speciality Hospital Nirmal",
    "address": "Nirmal, Telangana",
    "contacts": [
      "AKHIL: 8499884477"
    ],
    "district": "Nirmal",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Government General Hospital- Nirmal",
    "address": "Nirmal, Telangana",
    "contacts": [
      "DR T PRAMOD CHANDRA REDDY: 9949169592",
      "MR KOUTIKA SRINIVAS: 9494221110",
      "MR/MS BANTU BHAGYALAXMI: 8096209896",
      "MR/MS PAMULA.DATTU: 9490796679",
      "MR/MS PURKA SHIRISHA: 9441147308"
    ],
    "district": "Nirmal",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Sujala Nursing Home, Nirmal,",
    "address": "Nirmal, Telangana",
    "contacts": [
      "muralidhar: 9849515657"
    ],
    "district": "Nirmal",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "DEVENDER REDDY SUPER SPECIALITY HOSPITAL NIRMAL",
    "address": "Nirmal, Telangana",
    "contacts": [
      "ASHWIN: 9849582152"
    ],
    "district": "Nirmal",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI VIDYA HOSPITAL",
    "address": "Nirmal, Telangana",
    "contacts": [
      "MOHAMMAD SAMEER: 8421222105"
    ],
    "district": "Nirmal",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "VINAY DENTAL ROOT CANAL CENTER",
    "address": "Nirmal, Telangana",
    "contacts": [
      "NIKLHIL: 8885011444"
    ],
    "district": "Nirmal",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AREA HOSPITAL - BHINSA",
    "address": "Nirmal, Telangana",
    "contacts": [
      "Dr Geedi Surender: 8333816063",
      "MR/MS BOMBOTHULA.DEVALATHA: 9676948868",
      "MR/MS GATUPALLI SWAPNA: 9505880736",
      "MR/MS PENDELA.GOPI: 8333816518"
    ],
    "district": "Nirmal",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "DEVIBAI CRITICAL CARE CENTRE AND SUPER SPECIALITY HOSPITAL",
    "address": "Nirmal, Telangana",
    "contacts": [
      "MR/MS GUJALA VIJAYA LAXMI: 9133322710"
    ],
    "district": "Nirmal",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "M/S.Dr Preetham Multi speciality hospital Bhainsa",
    "address": "Nirmal, Telangana",
    "contacts": [
      "Suryakanth: 8886888108"
    ],
    "district": "Nirmal",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI SAI SUPER SPECALITY DENTAL CLINIC",
    "address": "Nirmal, Telangana",
    "contacts": [
      "Dr DR K VENKATA RAMANA: 7386574840"
    ],
    "district": "Nirmal",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI DATTA SAI MULTI SPECIALTY HOSPITAL",
    "address": "Nirmal, Telangana",
    "contacts": [],
    "district": "Nirmal",
    "lat": null,
    "lng": null
  },






































  {
    "hospitalName": "VIJAYA DENTAL CLINIC",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "Bhavani: 7013501191"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "M/s, Skanda Lifeline Hospital-Nalgonda",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "Vanam Suvarna: 7661828202"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "RAJESHWARI HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "Praveen: 9704824424"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "GOVT GENERAL HOSPTIAL, NALGONDA",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "Dr KASTURI CHANDU: 9440442423",
      "Dr KHATROTH RAJ KUMAR: 9949309610",
      "MR/MS CHANDA KAVITHA: 9989983098",
      "MR/MS CHERUKU MALLAIAH: 9959060561",
      "MR/MS KAREEMUNNISA BEGUM: 9676394983",
      "MR/MS KUMBHAM BHARATH REDDY: 9618689594",
      "Mr / Ms SANKOJU VINAY MITREYA: 8333816297",
      "SANKOJU VINAY MITREYA: 9948688037"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "VASANTHI HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "DR ASHWIN KUMAR K: 9959289213",
      "MR/MS PARINI SUNITHA: 9959782532"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SURAKSHA MULTI SPECIALITY HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "Dr DR ARUNA ISLAVATH: 9494353549",
      "MR / MS A.VENU: 8333816297"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "KN AREA HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "DR WUTLA S CHAKRAVARTHI: 8374445627",
      "MR / MS RAPOLU SHASHIKALA: 8333816309",
      "MR / MS RAVULAPATI MADHUSUDHAN: 9502546752",
      "MR/MS LAKSHMI SAILAJA: 8897422607",
      "MR/MS RAMAVATH SIVA KUMAR: 9642917898"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "VARSHITHA HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "GURRAM RAJA SEKHAR REDDY: 7981184308",
      "MR/MS CHNDRALA INDIRA RANI: 9000143693",
      "MR/MS JUBEDA BEGUM: 8096439834"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "LAXMI SAI MODERN EYE AND MATERNITY HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "MR/MS PERELLI SHEKAR: 9052325491"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "G V Hospiatal",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "MR / MS RAMAGIRI SUDHAKAR: 9502501965"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Udayasree maternity and laparoscopy hospital",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "Anji babu: 9491555234"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI TIRUMALA HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "Dr SRIPATHY REDDY: 9603366200",
      "MR/MS KOMARAJU RADHA: 9052590277",
      "MR/MS VUDUM VENKAT LAXMI: 8333817008"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "C K HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "DR RAVI PRAKASH P: 9494594876",
      "MR/MS KALAKOTA DANTHALA RAMA: 9063773754"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "VITTAL MULTI SPECIALITY HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Sudeeksha Multi Speciality Hospital",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "D Santosh Reddy: 9959687717"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "GMS DENTAL HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "Mr. KRISHNA PRASADA RAO V: 9966563142"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "ARUNA'S SMILE CARE CENTRE",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "Dr DR SRINIVAS BHARADWAJ CH: 9440612636"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AREA HOSPITAL - MIRIYALAGUDA",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "DR VIJAY PAVAN KUMAR: 9701345479",
      "MR/MS CHINNABOINA SUJATHA: 9492188564"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SANJEEVINI MULTI SPECIALITY HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "DR K KRISHNA: 7075023111",
      "MR/MS GODUGU MANJULA: 9912441106"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "UROVISION HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "MR / MS K.NARESH KUMAR: 9701333853"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "ROHIT ENT EYE HOSPITAL AND LASER CENTRE",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "MR/MS ALUGUBELLI GOVINDA REDDY: 9573719660"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "RIVER HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "NALGONDA INSTITUTE OF MEDICAL SCIENCES",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "VEERA REDDY: 8125255266"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "JYOTHI HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "Dr MOHAMED RAFIE: 9440440663",
      "MR / MS SK.BASHEERUDDIN: 9989897353",
      "MR/MS DEVARAKONDA RADHA: 9494234024",
      "MR/MS KANDULA SALAIAH: 9502102542"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "PERUMALLA HOSPILTAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "Mr / Ms DANDAMPALLY SAIDULU: 9542817110"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRIGANESHDENTALHOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "Mr. DR M ASHOK KUMAR: 9885522312"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "TEJA SUPER SPECIALITY CLINIC",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "Dr DR MS REDDY: 8019485883",
      "Dr DR MS REDDY: 9440364560",
      "Mr / Ms V.SHIRISHA: 8333816885"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "KIMS, NALGONDA",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "DR PRABHAKARRAO: 9440114368",
      "MR / MS V.PARAMESH: 9701187579",
      "MR/MS DESHABOINA LINGA SWAMY: 9912052505",
      "MR/MS MEDA GOVARDHAN: 9908374161",
      "MR/MS VADDEPALLY SANTHOSHA: 8096097701",
      "Mr / Ms VAVILLA SARITHA: 8333816301"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "LEELA HEALTH CARE HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "MR/MS PALLE KRISHNAIAH: 9618778970"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "APARNA HOSPITAL AND SCAN CENTRE",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "Dr HUSSAIN REDDY: 8886662299",
      "Mr / Ms V.VARA LAXMI: 8333816301"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "ADHVIK DENTAL CLINIC & IMPLANT CENTRE",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "YAMA AJAY KUMAR: 9618792665"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SAMRAKSHA MULTI SPECIALITY HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "THOLUGALLA JAYANTH: 7659923205"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI SAI VENKATESHWARA MULTISPECIALITY DENTAL HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "ANIL: 9989235206"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "DURGA SHANKAR HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "MR/MS BUDIGE NAGALAXMI: 8106473418",
      "MR/MS KAMPASATI NAGARAU: 9505065275"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "RAMAGIRI MULTI SPECIALITY HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "MR/MS BURUGU SAIDULU: 9704618408"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "UPHC – MARRIGUDA",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "Dr DIVI RAGHUNATH: 8333817455"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SAI SRINIVASA MULTISPECIALITY HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "DR SRINIVASU DS: 9440450628",
      "Mr / Ms V.NAGARAJU: 9704051568"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "I RAMULU MEMORIAL ORTHO TRAUMA CENTER",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "DR I KAMESHWAR: 9848158978",
      "MR/MS Meesala Rojamma: 9491367827"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Sri Tulasi Hospitals",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "MR/MS SAMA RADHA: 8978439060"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Kamineni Institute of Dental Sciences",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "G.VASU: 9640045198"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRUJANA DENTAL CLINIC",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "Dr Vamshikiran kancharidasu: 8019167543"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SAI NYSA MULTI SPECIALITY HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "RAPOLU AVANTH: 9705441111"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "PRASHANTH DENTAL CLINIC",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "Dr DR B SWATHI: 9030276846"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "LEELAVATHI HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "Dr K VIJAY KUMAR: 9866774006",
      "MR/MS CHEUKUPALLY RAMALINGAIAH: 9010167345"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AREA HOSPITAL DEVARAKONDA",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "DR RAYIRALA RAVI: 9440103410",
      "MR/MS BODA SWAPNA: 9603579741",
      "MR/MS BUSHARAJU PADMA: 9912014023",
      "MR/MS GIRI YADAIAH: 9704464284",
      "MR/MS GOLI NAGA RAJU: 9848734578",
      "MR/MS SANYLA BIKSHAPATHI: 9542218721",
      "MR/MS VADATHYA BHOJYA: 9440469541"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI SAI RAKSHA MULTISPECIALITY HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "DR V. ANIL: 9848013111",
      "MR/MS DEVIREDDY VINODHA: 9951203261"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AROGYA SUPER SPECIALITY HOSPITAL A UNIIT OF RAMESH HOSPITALS",
    "address": "Nalgonda, Telangana",
    "contacts": [
      "MR / MS A.LAXMI: 8790105361"
    ],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "NAVYA MULTI SPECIALITY HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "VENUVIDYA MULTISPECIALITY HOSPITAL",
    "address": "Nalgonda, Telangana",
    "contacts": [],
    "district": "Nalgonda",
    "lat": null,
    "lng": null
  },
































{
    "hospitalName": "JAYALAXMI ORTHOPEDIC HOSPITAL",
    "address": "Medak, Telangana",
    "contacts": [
      "MR/MS KUMMARI BHRAMHANANDAM: 7995286578"
    ],
    "district": "Medak",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Government General Hospital Medak",
    "address": "Medak, Telangana",
    "contacts": [
      "MR/MS A.SURESH: 9963563511",
      "MR/MS AMMIGALLA RAJAIAH: 9704335546",
      "MR/MS DYAJITI RAJITHA: 9491480795",
      "MR/MS NARAYANOLLA SATHYANAYANA GOUD: 9989215147",
      "P.CHANDRA SHEKAR: 9704030866"
    ],
    "district": "Medak",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "LIFE CARE NURSING HOME",
    "address": "Medak, Telangana",
    "contacts": [
      "MR/MS N.VINODA: 9948886704"
    ],
    "district": "Medak",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SUFI HOSPITAL",
    "address": "Medak, Telangana",
    "contacts": [
      "MD ARAFATH ALI: 9032815070"
    ],
    "district": "Medak",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "CHC - Toopran",
    "address": "Toopran, Medak, Telangana",
    "contacts": [
      "MR/MS D.NARENDHER: 9052445481"
    ],
    "district": "Medak",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "ACE Dental Hospital",
    "address": "Medak, Telangana",
    "contacts": [
      "Swapna: 8106882552"
    ],
    "district": "Medak",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "NIKHIL HOSPITALS",
    "address": "Medak, Telangana",
    "contacts": [
      "Dr venkateshwar rao: 9866966778"
    ],
    "district": "Medak",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Area Hospital - Narsapur",
    "address": "Narsapur, Medak, Telangana",
    "contacts": [
      "MR/MS SHYAM PRASAD: 9676604162"
    ],
    "district": "Medak",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MEDAK DENTAL HOSPITAL",
    "address": "Medak, Telangana",
    "contacts": [
      "Dr. T. CHANDRA MOULI MDS: 9963305001"
    ],
    "district": "Medak",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "NIGHTINGALE HOSPITAL",
    "address": "Medak, Telangana",
    "contacts": [
      "DR V.VENKATESWAR REDDY: 9866163452"
    ],
    "district": "Medak",
    "lat": null,
    "lng": null
  },




























  
  {
    "hospitalName": "VASUDHA HOSPITAL",
    "address": "Mancherial, Telangana",
    "contacts": [
      "MAHENDER: 9127445566"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Srinivasa hospital & nursing home",
    "address": "Mancherial, Telangana",
    "contacts": [
      "Dikshith: 8977972626"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MAATHA CHILDRENS HOSPITAL",
    "address": "Mancherial, Telangana",
    "contacts": [
      "SRAVANTHI: 9490886108"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MEDILIFE SUPER SPECIALITY HOSPITALS",
    "address": "Mancherial, Telangana",
    "contacts": [
      "A RAJU: 8522063523"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MAHALAXMI SUPER SPECIALITY DENTAL HOSPITAL",
    "address": "Mancherial, Telangana",
    "contacts": [
      "Harish Goud: 9963313031"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AREA HOSPITAL - MANCHERIAL",
    "address": "Mancherial, Telangana",
    "contacts": [
      "DR PVVSN MURTHY: 9550314816",
      "MR/MS PARUPELLY MALLESH: 8333816056",
      "MR/MS JODI LAXMANRAO: 9948229478",
      "MR/MS KOTA.NANAIAH: 9701335536",
      "MR/MS SURAMALLA.VASANTHA: 9542453354",
      "DR ARAVIND: 9700507194"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI MITHRA MULTI SPECIALITY HOSPITAL",
    "address": "Mancherial, Telangana",
    "contacts": [
      "DR SRIDHAR KOTHURI: 9390308448",
      "MR/MS SADANANDAM: 8333816054"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AADHYA KIDNEY & DIALYSIS CENTRE",
    "address": "Mancherial, Telangana",
    "contacts": [
      "N RAJU: 7842316720"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "TOUCH HOSPITALS PVT LTD",
    "address": "Mancherial, Telangana",
    "contacts": [
      "SAI PRASHNATH: 9398110307"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "RHS MAXCARE MULTISPECIALITY HOSPITAL",
    "address": "Mancherial, Telangana",
    "contacts": [
      "PREMSAGAR: 7981312164"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "PALLAWI HOSPITAL PAEDIATRIC ,ORTHO & TRAUMA CARE",
    "address": "Mancherial, Telangana",
    "contacts": [
      "sai chand: 7799314619"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Narayana General and Surgical Hospital",
    "address": "Mancherial, Telangana",
    "contacts": [
      "K.Yohan: 9290940411"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "TVVP Community Health Center Bellampally",
    "address": "Bellampally, Mancherial, Telangana",
    "contacts": [
      "MR/MS GARLAPALLY MALATHI: 9060957519",
      "MR/MS MIRIYALA.KAVITHA: 9441865626",
      "SAKARAM CHAPIDI: 8019364366"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SHRUTHI GOLI'S BIRTHROOTS HOSPITAL",
    "address": "Mancherial, Telangana",
    "contacts": [
      "Krishna Goli: 9177912007"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Srilatha Nursing Home",
    "address": "Mancherial, Telangana",
    "contacts": [
      "M NAVEEN KUMAR: 8328549610"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SUGUNA DENTAL & MATERNITY NURSING HOME",
    "address": "Mancherial, Telangana",
    "contacts": [
      "J. SUDHAKAR: 9989358618"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "OM SAI HOSPITAL",
    "address": "Mancherial, Telangana",
    "contacts": [
      "M.RAKESH: 6304740700"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Area Hospital - Chennuru",
    "address": "Chennuru, Mancherial, Telangana",
    "contacts": [
      "MR/MS PULLI SARITHA: 9441382921"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },














{"hospitalName": "SANJANA PALAMOOR NURSING HOME",
    "address": "Mahabubnagar, Telangana",
    "contacts": [
      "Dr K ARAVIND: 9440482999",
      "MR/MS D.SANJEEVA: 9491528360"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SHUBHAM INSTITUTE OF MEDICAL SCIENCES",
    "address": "Mahabubnagar, Telangana",
    "contacts": [
      "MR/MS K.VARAPRASAD: 9491491003"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Dr Agarwals health care limited",
    "address": "Mahabubnagar, Telangana",
    "contacts": [
      "KANIKE GIRI PRASAD: 9848735960"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SUNEETHA HOSPITAL",
    "address": "Mahabubnagar, Telangana",
    "contacts": [
      "Dr P VENKATESWARLU: 8886080602",
      "MR/MS NARSIMHA: 9989860050"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Sri Sanjeevani multi-speciality hospital a unit name of m/s sreenivasa multi-speciality hospital",
    "address": "Mahabubnagar, Telangana",
    "contacts": [
      "Syed adnan uddin: 9059622159"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "S.V.S HOSPITAL",
    "address": "Mahabubnagar, Telangana",
    "contacts": [
      "Dr DSrujana: 8686565642",
      "M MURALI MOHAN: 9959419235",
      "MR / MS CHAKALI KIRAN KUMAR: 9618155842",
      "MR/MS K THIRUPATAMMA: 9493496616",
      "MR/MS KARRE. SAYANNA: 8790173275",
      "MR/MS VIJAYALAXMI: 9885815856",
      "Mr / Ms B.KRISHNAIAH: 9573880286",
      "Mr / Ms M KRISHNA VENI: 8333817216"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "GOVT GENERAL HOSPITAL- MAHABOOBNAGA",
    "address": "Mahabubnagar, Telangana",
    "contacts": [
      "Dr RAMBABU NAIK: 9701369389",
      "MR/MS G.RAGHURAMULU: 9948705008",
      "MR/MS KANDURI ANJANEYULU: 9912993696",
      "Mr / Ms MANGALI.ANJANEYULU: 9985051841"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "NITHIN HOSPITAL",
    "address": "Mahabubnagar, Telangana",
    "contacts": [
      "MR Y.PRADEEPKUMAR: 8333816265"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "ABHAYAPRADA SUPER SPECIALITY HOSPITAL",
    "address": "Mahabubnagar, Telangana",
    "contacts": [
      "MS MUDHANOOR SARITHA RANI: 9490986322"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "PALAMURU EYE HOSPITAL",
    "address": "Mahabubnagar, Telangana",
    "contacts": [
      "SOWJANYS G: 9169172918"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "PHANINDRA MULTISPECIALITY DENTAL HOSPITAL",
    "address": "Mahabubnagar, Telangana",
    "contacts": [
      "Dr KHUSROO: 9985483495"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Government General Hospital - Wanaparthy",
    "address": "Wanaparthy, Mahabubnagar, Telangana",
    "contacts": [
      "DHARMENDAR A: 8074609849",
      "Dr DR. PRANATHI: N/A",
      "MR/MS B RAMA DEVI: 9949305259",
      "MR/MS P. SRIHARI: 8121857800",
      "MR/MS S.Radha: 8333816275",
      "MR/MS VEMULAVADA SWAPNA: 9640699422",
      "Mr / Ms B.MADHAU: 7675848651"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SUSHRUTHA PEOPLES HOSPITAL",
    "address": "Mahabubnagar, Telangana",
    "contacts": [
      "M SREEMANTH: 9492812246",
      "MR / MS SAGA SUREDAR GOUD: 9640165059",
      "MR/MS M BHAGHAWANTHU: 9949582036"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "GAYATHRI MULTI SPECIALITY DENTAL CLINIC",
    "address": "Mahabubnagar, Telangana",
    "contacts": [
      "Shanthi Kumar: 8985000587"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "T.J.R DENTAL HOSPITAL",
    "address": "Mahabubnagar, Telangana",
    "contacts": [
      "Dr Chaitanya: 9640391143",
      "Dr Chaitanya: 9848441415"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "DISTRICT HOSPITAL-NARAYANPET",
    "address": "Narayanpet, Mahabubnagar, Telangana",
    "contacts": [
      "DR Ramesh Chandra: 8008553820",
      "MR / MS BOGAM RAJESH KUMAR: 9000224642",
      "MR/MS CHANDRAKALA: 9032748674",
      "MR/MS G S PURUSHOTHAM: 9490321491",
      "MR/MS VENKAT RAM REDDY: 9440690298"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "NEHA SHINE HOSPITALS",
    "address": "Mahabubnagar, Telangana",
    "contacts": [
      "DR M.Vijaykanth: 9848948672",
      "MR/MS MANJULA: 9705913244",
      "MR/MS S.SATISH KUMAR GOUD: 9676833902",
      "MR/MS VEMULAVADA SWAPNA: 9640699422",
      "Mr / Ms MOHAMMED AKBAR ALI: 8333816265"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "RAVI CHILDRENS HOSPITAL LLP",
    "address": "Mahabubnagar, Telangana",
    "contacts": [
      "MR/MS CHANDRAIAH: 9000416175",
      "RAGHU NANDHAN GOUD: 9492815351"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "VANITHA HOSPITAL",
    "address": "Mahabubnagar, Telangana",
    "contacts": [
      "Dr PADMAKALA: 9393081972",
      "MR / MS ANGAL NAGAPPA: 9490143671",
      "MR/MS BHASKAR NAIK: 9502051964",
      "MR/MS K SURESH: 9703846433",
      "MR/MS VENKATAIAH: 9666018698"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRIKANTH MULTI SPECIALITY DENTAL CLINIC",
    "address": "Mahabubnagar, Telangana",
    "contacts": [
      "ARTHIPASARI: 9290601766"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "VIVEKANANDH REDDY S DENTAL HOSPITAL",
    "address": "Mahabubnagar, Telangana",
    "contacts": [
      "Dr Y.VENKAT RAM MURTTHY: 9849040200"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "RAVI SUPER SPECIALITY DENTAL HOSPITAL",
    "address": "Mahabubnagar, Telangana",
    "contacts": [
      "Dr DR P RAVI KUMAR: 8333816903"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI NAVODAYA INSTITUTE OF MEDICAL SCIENCES PVT LTD",
    "address": "Mahabubnagar, Telangana",
    "contacts": [
      "DR Sameera Khan: 9100777012",
      "MR/MS M.MADAN MOHAN GOUD: 9440377982",
      "Mr / Ms KANDI ASHOK KUMAR: 9866860705"
    ],
    "district": "Mahabubnagar",
    "lat": null,
    "lng": null
  },
























  {
    "hospitalName": "AROGYA HOSPITAL",
    "address": "Mahabubabad, Telangana",
    "contacts": ["Ashok: 9490114619"],
    "district": "Mahabubabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI MAHA LAXMI EYE HOSPITAL",
    "address": "Mahabubabad, Telangana",
    "contacts": ["MR / MS YAKOOBSHAIK: 8519906979"],
    "district": "Mahabubabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "M/s. Keerthi Hospital",
    "address": "Mahabubabad, Telangana",
    "contacts": ["SRAVAN: 8341643643"],
    "district": "Mahabubabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "COMMUNITY HEALTH CENTRE - GARLA",
    "address": "Garla, Mahabubabad, Telangana",
    "contacts": ["Dr RANAPRATAP GUGULOTH: 8333817455"],
    "district": "Mahabubabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI SEETHARAM MEMORIAL HOSPITAL",
    "address": "Mahabubabad, Telangana",
    "contacts": [
      "DR G MADHU LATHA: 9440957529",
      "MR/MS M.VASANTHA: 9618340960"
    ],
    "district": "Mahabubabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SIDDARTHA HOSPITAL",
    "address": "Mahabubabad, Telangana",
    "contacts": [
      "DR BHUKYA GOPILAL: 9703223035",
      "MR/MS B. BALAJI: 8106684598",
      "GADUDULA ANIL: 9618464402"
    ],
    "district": "Mahabubabad",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SAI MULTI SPECIALITY HOSPITAL",
    "address": "Mahabubabad, Telangana",
    "contacts": [
      "DR A PATTABHI: 8008668484",
      "MR/MS B.SRINIVAS: 9440713058",
      "MR/MS CH. RAMU: 8985560295"
    ],
    "district": "Mahabubabad",
    "lat": null,
    "lng": null
  },
















{
    "hospitalName": "Venkateshwara Hospital",
    "address": "Kamareddy, Telangana",
    "contacts": ["Shaik Ishaq Pasha: 9866263614"],
    "district": "Kamareddy",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "COMMUNITY HEALTH CENTER – GANDHARI",
    "address": "Gandhari, Kamareddy, Telangana",
    "contacts": ["Dr RAJA RAMESH.M.G.: 8333817455"],
    "district": "Kamareddy",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "GOVT CICIL HOSPITAL – BICHKUNDA",
    "address": "Bichkunda, Kamareddy, Telangana",
    "contacts": ["Dr Z.JYOTHI SUBHA: 8333817455"],
    "district": "Kamareddy",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Area Hospital - Bichkunda",
    "address": "Bichkunda, Kamareddy, Telangana",
    "contacts": [],
    "district": "Kamareddy",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Shiva Sai dental clinic",
    "address": "Kamareddy, Telangana",
    "contacts": ["G. Praveen Kumar: 9666067596"],
    "district": "Kamareddy",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "LIFE HOSPITAL",
    "address": "Kamareddy, Telangana",
    "contacts": [
      "MR / MS ETIKELAMAHESH: 9951834925",
      "Mr / Ms D.GANGADHAR: 9948421135"
    ],
    "district": "Kamareddy",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AREA HOSPITAL - BANSWADA",
    "address": "Banswada, Kamareddy, Telangana",
    "contacts": [
      "Dr Chary: 9912714107",
      "MR/MS A Sai Babu: 9848475536",
      "MR/MS Bingi Padma: 9951529987",
      "MR/MS Gudipally Sandeep Reddy: 9652724217",
      "MR/MS Jangili Sudheer Kumar: 9492480923",
      "MR/MS Kadige Kashamani: 9849621553",
      "MR/MS Thota Vinoda: 9494714172"
    ],
    "district": "Kamareddy",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Smile Care Multi Speciality Dental Hospital",
    "address": "Kamareddy, Telangana",
    "contacts": ["Gaikwad Bhavitha: 9652001067"],
    "district": "Kamareddy",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "RUKMINI MULTI SPECIALITY DENTAL CLINIC AND IMPLANT CENTER",
    "address": "Kamareddy, Telangana",
    "contacts": ["Sajid: 9866809432"],
    "district": "Kamareddy",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "COMMUNITY HEALTH CENTER – YELLAREDDY",
    "address": "Yellareddy, Kamareddy, Telangana",
    "contacts": ["Dr RAVINDRA MOHAN.E: 8333817455"],
    "district": "Kamareddy",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AREA HOSPITAL - KAMAREDDY",
    "address": "Kamareddy, Telangana",
    "contacts": [
      "Dr JAjay Kumar: 9848346657",
      "MR / MS G KANTHI KIRAN GOUD: 8333816315",
      "MR/MS Gaddameedi Mahendar: 9010105093",
      "MR/MS Gantambotla Anil Kumar: 9494628650",
      "MR/MS Gundreddy Laxma Reddy: 8464030665",
      "MR/MS J Krishna Vardhan: 9652201660",
      "MR/MS Jayavardhan Yadav: 9492881249",
      "MR/MS Jilla Manjula: 9666260412",
      "MR/MS Mangali Raju: 9949177723",
      "MR/MS Mohd Allahuddin: 9492844130",
      "Mr / Ms SYED.MEHARAJODDIN: 9704022107"
    ],
    "district": "Kamareddy",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Sri Medicare Hospital",
    "address": "Kamareddy, Telangana",
    "contacts": [
      "Dr SHIVA PRASAD CHATLA: 9948065219",
      "MR / MS G SWAMY: 9666067823",
      "MR/MS Badugu Madhusudan: 9640588702",
      "MR/MS Baindla Janani Rani: 9618590750",
      "MR/MS Dandu Nirmala: 9676968933",
      "MR/MS Kompalli Thilothama: 9640588702",
      "MR/MS Kummari Anjaiah: 9393111650",
      "MR/MS Pokkili Narsavva: 7674000251"
    ],
    "district": "Kamareddy",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "COMMUNITY HEALTH CENTER – MADNUR",
    "address": "Madnur, Kamareddy, Telangana",
    "contacts": [
      "Dr G.SHIVA PRASAD: 8333817455",
      "Dr RAMU GADDAMIDI: 8333817455"
    ],
    "district": "Kamareddy",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Area Hospital - Yellareddy",
    "address": "Yellareddy, Kamareddy, Telangana",
    "contacts": [],
    "district": "Kamareddy",
    "lat": null,
    "lng": null
  },


























{
    "hospitalName": "Anantha multispeciality Hospital",
    "address": "Jogulamba Gadwal, Telangana",
    "contacts": ["Srinivasulu: 7815822880"],
    "district": "Jogulamba Gadwal",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Gadwal Multi Speciality Hospital",
    "address": "Gadwal, Jogulamba Gadwal, Telangana",
    "contacts": ["K. Parashuram: 9848054471"],
    "district": "Jogulamba Gadwal",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SREENIKA DENTAL HOSPITAL",
    "address": "Jogulamba Gadwal, Telangana",
    "contacts": ["Dr T.ANIL KUMAR: 9885485822"],
    "district": "Jogulamba Gadwal",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Subhakara hospitals",
    "address": "Jogulamba Gadwal, Telangana",
    "contacts": ["MD Hymad: 9966610765"],
    "district": "Jogulamba Gadwal",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRAVANTHI MULTISPECIALITY HOSPITAL",
    "address": "Jogulamba Gadwal, Telangana",
    "contacts": ["H MEENAKETAN REDDY: 7396588816"],
    "district": "Jogulamba Gadwal",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AREA HOSPITAL - GADWAL",
    "address": "Gadwal, Jogulamba Gadwal, Telangana",
    "contacts": [
      "DR Chandra Sekhar: 8008553810",
      "MR / MS CHAKALI .VENKATESH: 8333816271",
      "MR/MS LAXMI: 9160036651",
      "MR/MS PRABHAKAR: 9959915609",
      "MR/MS THAYANNA: 9963174240"
    ],
    "district": "Jogulamba Gadwal",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Area Hospital - Alampur",
    "address": "Alampur, Jogulamba Gadwal, Telangana",
    "contacts": [],
    "district": "Jogulamba Gadwal",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "CHC - Alampur",
    "address": "Alampur, Jogulamba Gadwal, Telangana",
    "contacts": ["Mr / Ms A.BHARATHI: 8333816263"],
    "district": "Jogulamba Gadwal",
    "lat": null,
    "lng": null
 },


















{
    "hospitalName": "CHC - Mahadevapur",
    "address": "Mahadevapur, Jayashankar Bhupalpally, Telangana",
    "contacts": [],
    "district": "Jayashankar Bhupalpally",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "YODHA SUPER SPECIALITY HOSPITAL",
    "address": "Jayashankar Bhupalpally, Telangana",
    "contacts": ["A RAKESH: 7981327465"],
    "district": "Jayashankar Bhupalpally",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "GOVT CIVIL HOPITAL VENKATAPURAM",
    "address": "Venkatapuram, Jayashankar Bhupalpally, Telangana",
    "contacts": [],
    "district": "Jayashankar Bhupalpally",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Sai Suguna multispeciality Dental Hospital",
    "address": "Jayashankar Bhupalpally, Telangana",
    "contacts": ["Dr Ramancha Vinay: 9989047442"],
    "district": "Jayashankar Bhupalpally",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "KIRAN HOSPITAL",
    "address": "Jayashankar Bhupalpally, Telangana",
    "contacts": ["AFROZ: 8106320699"],
    "district": "Jayashankar Bhupalpally",
    "lat": null,
    "lng": null
  },

























 



{
    "hospitalName": "CHC - Zaffergadh",
    "address": "Zaffergadh, Jangaon, Telangana",
    "contacts": ["MR/MS N.SRINU: 9177577556"],
    "district": "Jangaon",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI SAI KRISHANA NURSING HOME JANGAON",
    "address": "Jangaon, Telangana",
    "contacts": ["NAGARAJ: 7997761244"],
    "district": "Jangaon",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Smile Dental clinic",
    "address": "Jangaon, Telangana",
    "contacts": ["Venkateshwarlu: 9948350846"],
    "district": "Jangaon",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SSK HOSPITAL JANGAON",
    "address": "Jangaon, Telangana",
    "contacts": ["N yellesh: 9441151207"],
    "district": "Jangaon",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "ANJATHA HOSPITAL",
    "address": "Jangaon, Telangana",
    "contacts": ["Ravindar: 9951547263"],
    "district": "Jangaon",
    "lat": null,
    "lng": null
  },























{
    "hospitalName": "FORTUNE SIGMA MULTIPLICITY HOSPITAL",
    "address": "Jagtial, Telangana",
    "contacts": ["MR / MS GUDLA GANGADHAR: 9700083612"],
    "district": "Jagtial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "JAGTIAL MULTI SPECIALITY HOSPITAL",
    "address": "Jagtial, Telangana",
    "contacts": ["MD.Mubarizuddin Arshad: 9666457444"],
    "district": "Jagtial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Prathima dental and childrens hospital",
    "address": "Jagtial, Telangana",
    "contacts": ["Naresh: 9110737528"],
    "district": "Jagtial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Manjunatha dental care and implant center",
    "address": "Jagtial, Telangana",
    "contacts": ["Venkatesh adlagatta: 8247829321"],
    "district": "Jagtial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "GEETA ORTHOPEDIC& MATERNITY NURSING HOME",
    "address": "Jagtial, Telangana",
    "contacts": [
      "AMEETH KUMAR.T: 9490255025",
      "Dr M Vishwa Bharathi: 8019432112",
      "MR/MS PANDIRI SRIDHAR: 9441459088",
      "P P.RAJESHWARI: 8333816224"
    ],
    "district": "Jagtial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AREA HOSPITAL - JAGITYAL",
    "address": "Jagtial, Telangana",
    "contacts": [
      "CHIRUVAIPATI ANANDRAM: 9177607137",
      "MR / MS C.RAJASHEKER: 8333816224",
      "MR/MS GARISE KAMALAKAR: 9440158003"
    ],
    "district": "Jagtial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Area Hospital - korutla",
    "address": "Korutla, Jagtial, Telangana",
    "contacts": ["MR/MS KARNI SRINIVAS: 9866669536"],
    "district": "Jagtial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AMRITHA TRINETHRA MULTI SPECIALITY HOSPITAL",
    "address": "Jagtial, Telangana",
    "contacts": [
      "Dr CHANDRASHEKAR GOUD: 9949136845",
      "K RAMESH: 9989108409",
      "MR/MS SUNKE SHANKAR: 9701074083"
    ],
    "district": "Jagtial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Om sri sai hospital",
    "address": "Jagtial, Telangana",
    "contacts": ["A.sai kumar: 9908397503"],
    "district": "Jagtial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Area Hospital - Dharmapuri",
    "address": "Dharmapuri, Jagtial, Telangana",
    "contacts": [],
    "district": "Jagtial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Sri Mithra Hospital",
    "address": "Jagtial, Telangana",
    "contacts": ["V.Srinivas: 7013393158"],
    "district": "Jagtial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Gayatri Super Speciality Dental Hospital",
    "address": "Jagtial, Telangana",
    "contacts": ["Sundaragiri Rajender Goud: 9573811098"],
    "district": "Jagtial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Padmalaya Multispeciality Dental Hospital",
    "address": "Jagtial, Telangana",
    "contacts": ["P.Srujana: 9949051515"],
    "district": "Jagtial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Sri Sai Super Speciality Dental Hospital",
    "address": "Jagtial, Telangana",
    "contacts": ["BAIRI BHANU PRAKASH: 9703250368"],
    "district": "Jagtial",
    "lat": null,
    "lng": null
  },


























  




{
    "hospitalName": "GOVERNMENT MATERNITY HOSPITAL WARANGAL",
    "address": "Warangal, Telangana",
    "contacts": [
      "Dr K PURUSHOTHAM: 7799448963",
      "MR/MS V. PADMA: 9494790864"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI SRINIVASA KIDNEY AND MATERNITY CENTER",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "DR M MUNIPRASAD: 8008682241",
      "DR T E SAMRAT: 9642461144",
      "MR / MS NUNE.ANAND: 9110353358",
      "MR / MS VEEDA KISHORE KUMAR: 9849375622"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SEVENHILLS HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "MR/MS KANDE SWAMY: 9676411805",
      "Mr DR K SURYANARAYANA: 9849352728"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "DR GOUDA RAMESH ENT",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "MR / MS THOTA RAMAKRISHNA: 9030119626",
      "Mr/Mrs Dr Gouda Ramesh: 9849324977"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MEDICARE HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "DILIP LONE: 9700103131",
      "DR A.PATTABIRAMAIAH: 9885097847",
      "MR/MS B.SRINIVAS: 9866730640"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "BALAJI HOSPITAL WARANGAL",
    "address": "Warangal, Telangana",
    "contacts": [
      "Dr P SUDHIR KUMAR: 9573654744",
      "MR / MS R KOMALA: 8333816465",
      "Mr / Ms RANGARAJU DEVENDAR: 7702706508"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Samraksha Hospital ( A Unit of Samraksha Health Care PVT LTD)",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr N SAMUEL: 7997977707",
      "MR / MS GADDALA TEJA: 9550522186",
      "MR / MS MOTE MAHESH: 8341622171",
      "MR / MS THIMMAPURAM RAJENDHAR: 9866557746",
      "MR/MS AKULA BABY RANI: 7995404837",
      "MR/MS BANALA.RAMESH: 9959669597"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "RIYA HOSPITAL (A UNIT OF VAISHNAVI MEDICARE AND DIAGNOSTIC RESEARCH CENTRE)",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "G. KRISHNA MURTHY: 9177616146",
      "MR / MS O.NAGARJUNA: 9848223148"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "RENOVA BANNU HOSPITALS (A Unit Of Bhagyalakshmi Healthcare Services Private Limited)",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr DILIP: 7207968811",
      "Mr / Ms RAMADAN: 8333816475",
      "Mr / Ms SURESH: 8333816460"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "VENKATESHWARA MULTISPECIALTY HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": ["MR / MS MAHESWARAPU SRIPAL: 9866778256"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "GOVT.CD & TB HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": ["Dr G Krishna Murthy: 9849135461"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Indian Red Cross Society Thalassemia Sickle Cell Transusion Centre",
    "address": "Hanamkonda, Telangana",
    "contacts": [],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Byram Hospital",
    "address": "Hanamkonda, Telangana",
    "contacts": ["P Naresh: 9949749721"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "CHAKRAVARTHY HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": ["RANADHEER: 9701163081"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "RAGHU DENTAL LASER AND IMPLANT CENTRE",
    "address": "Hanamkonda, Telangana",
    "contacts": ["Uday charan: 9603549645"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Kavitha Reddy Dental Hospital",
    "address": "Hanamkonda, Telangana",
    "contacts": ["Ginnarapu Daniel: 8106474131"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "VIJAYA DENTAL HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": ["Dr PRATHIMA RAO: 9491423344"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "ROHINI MEDICARE PVT. LTD.",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr K.NARAYANA REDDY: 9440162691",
      "GADDAM SAGARIKA: 8919642560",
      "MR/MS KUMMARI SRINIVAS: 9949455617",
      "MR/MS RAMA: 8333816441"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "LAXMI NARASIMHA HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr Sandhya Rani: 9885106728",
      "Mr / Ms KUMARASWAMY CH: 9908925114"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "KAKATHIYA EYE HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr POKKULA PRAVEEN: 9652829652",
      "MR / MS R LAVANYA: 9581613272",
      "Mr Apparaju Keshav: 9533325131"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SREE BALAJI HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr.K SAMPATH RAO: 8106625814",
      "MR/MS J..RADHIKA: 9949906277"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "APOLLO REACH NSR HOSPITALS A UNIT OF NSR HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "LINGAMPALLY NAGESHWAR RAO: 9603273962",
      "RAJESH SAMBARI: 9618472774"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Vasan Eye Care A Unit of Vasan Health Care Pvt Ltd",
    "address": "Hanamkonda, Telangana",
    "contacts": ["Mr / Ms MD SULEMAN BABA: 9652698226"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "EKASHILAA HOSPITALS(A UNIT OF KAKATHIYAN MEDICAL SERVICES PVT LTD)",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr K.Venkat Reddy: 7093661333",
      "MR / MS MOHD.ABDUL MUSTAFA: 9390167606",
      "MR/MS CHERALA . VINAY: 9985332611",
      "MR/MS N NARESH: 9177998625",
      "THOTA PRAVEEN KUMAR: 8333816460"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },










{
    "hospitalName": "GRAVID HOME HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": ["LAVANYA: 9154853971"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "M/s. Aditya Criticare Pvt.Ltd-Hanumakonda",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "DR Rakesh Reddy: 9704983555",
      "MR/MS CHINTHALAPURI CHAKRAPANI: 9959771522"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "LIFE LINE HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr N LAXMI PRASAD: 9848052609",
      "MR/MS TALLAPELLI MAMATHA: 9705026793"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI SRUSTI HOSPITALS(A UNIT OF SRUSTI INFERTILITY AND ORTHOPAEDIC CENTRE)",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "DODDA PRASAD REDDY: 9963285454",
      "MR / MS NOMULA LALITHA: 8096626533"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Medicover Hospitals A Unit of Sahrudaya Health Pvt Ltd",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "GUNDEBOINA SATYAMYADAV: 9848125478",
      "MR / MS PESARI VARADESHWAR: 9866561427",
      "MR/MS EPPA SRINIVAS: 9963720621"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Dr Agarwals Health Care Limited",
    "address": "Hanamkonda, Telangana",
    "contacts": ["MR/MS K Rajesh: 9704777790"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI GANESH ORTHO PAEDIC HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr P SURENDER REDDY: 9989765699",
      "Mr / Ms L. SHASHIKUMARI: 8333816452"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Vinoda Super Specialty Dental Hospital and Facial Trauma Care Centre",
    "address": "Hanamkonda, Telangana",
    "contacts": ["Janaki: 8886359551"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "TANAYA CHILDREN'S HOSPITAL(A UNIT OF KMP HEALTH LLP)",
    "address": "Hanamkonda, Telangana",
    "contacts": ["L ARJUN REDDY: 6309129900"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "DR.MANJULA HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": ["T SRINIVAS: 9493260570"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MADHUKAR REDDY SUPERSPECIALITY DENTAL HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": ["Mr. MADHUKARREDDY: 9394575767"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI SHARANYA NURSING HOME AND CRITICAL CARE",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr N Prashantha: 9390672891",
      "MR / MS JALI . PRANITHA: 9989752668"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SATYA HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr BRADHAKRISHNA: 7013989209",
      "MS CH VINITHA: 8790093195"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "GUARDIAN MULTI SPECIALTY HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr Kaliprasad Rao: 9866963274",
      "MR / MS ALIGIREDDY.DAMODAR REDDY: 9491824324",
      "Mr / Ms SWATHI S: 9573864936"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MITHRA HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "DR AMBIKA SANDEPALLY: 9618804324",
      "MR N Anil: 8333816465",
      "MR / MS CH.SRIKARNA: 9912226660"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "GOVT.REGIONAL EYE HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "DR R. Ashok: 9849281111",
      "MR/MS KASAGANI RAMESH: 9963569620",
      "MR/MS PONNALA KATTAIAH: 9666218302"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "VISHWASSUPERSPECIALITYHOSPITALANDDIALYSISCENTRE",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr MANDA RAJANEESH REDDY: 9618334451",
      "MR/MS PULUGU SHIRISHA: 9700792388"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "KALYANI HOSPITAL (PRAKUAN HEALTH CARE VT LTD)",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr VANKUDOTHU SARAIAH: 8143631715",
      "Dr. P ANJANI DEVI: 9966448108",
      "MR / MS V RAVINDER: 9014482204"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "DR SHARAT MAXIVISION EYE HOSPITALS LLP",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr K ANNAPURNA: 8885558355",
      "Dr PINAPALA SRUJANA: 9052138111",
      "MR / MS SWATHI J: 9177568484",
      "Mr / Ms CH.RAMESH: 8333816460"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "PRAMODA HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr. S VENKAT RAM REDDY: 8790056840",
      "MR / MS MARABOINA SWAPNA: 7989739728"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Renova Bannu Hospitals ( a unit of Bhagyalakshmi Healthcare Services Pvt. Ltd.)",
    "address": "Hanamkonda, Telangana",
    "contacts": ["Sandeep: 7707197711"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "LALITHA HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr DR D MAHESHWAR: 9849192717",
      "Mr / Ms K KIRAN KUMAR: 9959783123"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SUSRUTHA HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr. S. JAYAPRAKASH: 9010866609",
      "MR / MS GURIJALA THIRUPATHI: 9705314326"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AJARAHEALTHCAREANDRESEARCHCENTEREPVTLTD",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "DR. ASHA DEEPTHI: 9959800200",
      "MR / MS Sakinala Raju: 8333816454",
      "MR/MS T.PAVANI: 8374161295",
      "PARAMKUSHAM HARIPRASAD: 9394896269"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "JAYA HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr V Koti Reddy: 9966590014",
      "MR/MS G RAVINDER: 9951547263",
      "Mr / Ms P.RAMBABU: 8333816473"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "GLS Dental Laser & Implant Centre",
    "address": "Hanamkonda, Telangana",
    "contacts": ["KARUNAKAR: 7993473551"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "JAYAHOSPITALS",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr. VANAJA: 9849162262",
      "Dr. VANAJA: 9849162263"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "GOVT MATERNITY HOSPITAL HANMAKONDA",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr B.VIJAYALAXMI: 9849012715",
      "MR / MS NAGAMALLA ASHWINI: 8500881069",
      "MR/MS PAGE SAMAKKA: 9491324294"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Government General Hospital- Mahabubabad",
    "address": "Mahabubabad, Telangana",
    "contacts": [
      "DR V.DEVENDER: 9966880711",
      "DR.BODLA MADHUSUDHAN RAO: 9440509955",
      "MR/MS BHEEMISETTI.SRINIVAS: 9948759239",
      "MR/MS K.VIJAY: 8333816725",
      "MR/MS P.RADHIKA: 9908026276",
      "MR/MS SK. SHAKIRA BEGUM: 9052542250"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "RELIEF HOSPITALS (A UNIT OF SAHASRA EDUCATIONAL SOCIETY)",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr T RAMESH: 9676788041",
      "MR P MADHU: 9704116226",
      "MR / MS S.SATHEESH: 8333816460"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Area Hospital - Madhira",
    "address": "Madhira, Telangana",
    "contacts": ["MR/MS A.RAGHAVENDRA RAO: 9618652229"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI UDAY MULTISPECIALITY HOSPITALS PRIVATE LTD",
    "address": "Hanamkonda, Telangana",
    "contacts": ["Mr / Ms PALAKUTHY ANILKUMAR: 8333816465"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "ROHINI MEDICARE PVT LTD",
    "address": "Hanamkonda, Telangana",
    "contacts": ["K MADAN MOHAN REDDY: 9848453869"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "CHRISTHU JYOTHI HOSPITALS",
    "address": "Hanamkonda, Telangana",
    "contacts": ["T.SANDHYA: 7842322018"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "ST.ANNS HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr Dr. K.V.Ragavaiah: 9999999999",
      "MR / MS SRIKANTH: 8333816491",
      "MR/MS T. MAHESWARI: 9494787325"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AMRUTHA CHILDRENS NURSING HOME",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "DR GUNDETI RAMESH: 7207204546",
      "MR/MS KANTHULA RAJU: 9492726550"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MAHATMA GANDHI MEMORIAL HOSPITAL",
    "address": "Warangal, Telangana",
    "contacts": [
      "DR D. Ramesh Kumar: 9849062211",
      "GILLELLA PREM JYOTHI G: 8985979312",
      "MR VENGALA . RAVI: 8333816467",
      "MR/MS B.RAJASEKHAR: 9963645945",
      "MR/MS G.RAJANI: 9949439765",
      "MR/MS K PAVAN KUMAR: 9553897272",
      "MR/MS KONDAPARTHY SRIKANTH: 9849193553",
      "Mr / Ms KARUNAKAR: 8106698646",
      "RAMA RAMU: 8143109129"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Ganga Hospital-Warangal",
    "address": "Warangal, Telangana",
    "contacts": [
      "Dr DR. B Swapnalatha: 9573001650",
      "MR/MS N.SUHASINI: 7660855997"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SIRI SPECIALITY HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": ["Dr.MANASA REDDY MATTA: 8790200200"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "PRATHIMA CANCER HOSPITALS PRIVATE LIMITED",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "DR.SUSHMITHA PITTALA: 9550516351",
      "Mr / Ms MAMIDISHETTI SREEKANTH: 9959025483",
      "VINEETH DV: 9550516351"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "VEENA MEDICARES",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "DR V RAJESH: 9849367879",
      "MR / MS SATISH: 9700060778"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "CURE WELL HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr V RAKESH: 9440171175",
      "MR/MS V.SUVARNA: 8106841070"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI LAKSHMI NURSING HOME",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr PV SATYAPAL REDDY: 9177466366",
      "MR/MS MAMIDEPALLY KUMARASWAMY: 9959019567"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "STAR HEALTH CARE HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": [
      "Dr P RAMESH: 9849410046",
      "MR / MS NAGAMALLA KARUNASAGAR: 9989321914"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MEDHA HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": ["Mr / Ms ADAVELLI . MADHUKAR: 9908384740"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "CKM GVT. MATERNITY HOSPITAL- MATWADA",
    "address": "Matwada, Warangal, Telangana",
    "contacts": [],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI KAKATIYA KIDNEY AND MULTY-SPECIALITY HOSPITAL",
    "address": "Hanamkonda, Telangana",
    "contacts": ["D SUMANTH: 6281943141"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "VASAVI NURSING HOME",
    "address": "Hanamkonda, Telangana",
    "contacts": ["A SRAVAN: 8142559955"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Fathima multispecality hospital",
    "address": "Hanamkonda, Telangana",
    "contacts": ["Sujith: 9573164747"],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "WARANGAL HOSIPTAL DIAGNOSTIC AND RESEARCH CENTER PVT LTD",
    "address": "Warangal, Telangana",
    "contacts": [
      "DR E .Ananthanag: 9963310304",
      "MR / MS KANNOJU THRIVENI: 9908862833"
    ],
    "district": "Hanamkonda",
    "lat": null,
    "lng": null
  },



{
    "hospitalName": "VASUDHA HOSPITAL",
    "address": "Mancherial, Telangana",
    "contacts": [
      "MAHENDER: 9127445566"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Srinivasa hospital & nursing home",
    "address": "Mancherial, Telangana",
    "contacts": [
      "Dikshith: 8977972626"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MAATHA CHILDRENS HOSPITAL",
    "address": "Mancherial, Telangana",
    "contacts": [
      "SRAVANTHI: 9490886108"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MEDILIFE SUPER SPECIALITY HOSPITALS",
    "address": "Mancherial, Telangana",
    "contacts": [
      "A RAJU: 8522063523"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "MAHALAXMI SUPER SPECIALITY DENTAL HOSPITAL",
    "address": "Mancherial, Telangana",
    "contacts": [
      "Harish Goud: 9963313031"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AREA HOSPITAL - MANCHERIAL",
    "address": "Mancherial, Telangana",
    "contacts": [
      "DR PVVSN MURTHY: 9550314816",
      "MR / MS PARUPELLY MALLESH: 8333816056",
      "MR/MS JODI LAXMANRAO: 9948229478",
      "MR/MS KOTA.NANAIAH: 9701335536",
      "MR/MS SURAMALLA.VASANTHA: 9542453354",
      "Mr DR ARAVIND: 9700507194"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI MITHRA MULTI SPECIALITY HOSPITAL",
    "address": "Mancherial, Telangana",
    "contacts": [
      "DR SRIDHAR KOTHURI: 9390308448",
      "Mr / Ms SADANANDAM: 8333816054"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AADHYA KIDNEY & DIALYSIS CENTRE",
    "address": "Mancherial, Telangana",
    "contacts": [
      "N RAJU: 7842316720"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "TOUCH HOSPITALS PVT LTD",
    "address": "Mancherial, Telangana",
    "contacts": [
      "SAI PRASHNATH: 9398110307"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "RHS MAXCARE MULTISPECIALITY HOSPITAL",
    "address": "Mancherial, Telangana",
    "contacts": [
      "PREMSAGAR: 7981312164"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "PALLAWI HOSPITAL PAEDIATRIC ,ORTHO & TRAUMA CARE",
    "address": "Mancherial, Telangana",
    "contacts": [
      "sai chand: 7799314619"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Narayana General and Surgical Hospital",
    "address": "Mancherial, Telangana",
    "contacts": [
      "K.Yohan: 9290940411"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "TVVP Community Health Center Bellampally",
    "address": "Bellampally, Mancherial, Telangana",
    "contacts": [
      "MR/MS GARLAPALLY MALATHI: 9060957519",
      "MR/MS MIRIYALA.KAVITHA: 9441865626",
      "SAKARAM CHAPIDI: 8019364366"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SHRUTHI GOLI'S BIRTHROOTS HOSPITAL",
    "address": "Mancherial, Telangana",
    "contacts": [
      "Krishna Goli: 9177912007"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Srilatha Nursing Home",
    "address": "Mancherial, Telangana",
    "contacts": [
      "M NAVEEN KUMAR: 8328549610"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SUGUNA DENTAL & MATERNITY NURSING HOME",
    "address": "Mancherial, Telangana",
    "contacts": [
      "J. SUDHAKAR: 9989358618"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "OM SAI HOSPITAL",
    "address": "Mancherial, Telangana",
    "contacts": [
      "M.RAKESH: 6304740700"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Area Hospital - Chennuru",
    "address": "Chennuru, Mancherial, Telangana",
    "contacts": [
      "MR/MS PULLI SARITHA: 9441382921"
    ],
    "district": "Mancherial",
    "lat": null,
    "lng": null
  },


























  {
    "hospitalName": "GOVT CIVIL HOPITAL YELLANDU",
    "address": "Yellandu_kothagudem Rd, Bhagya Nagar Thanda, Indira Nagar, Yellandu, Telangana 507123",
    "contacts": ["Dr RAMESH THEJAVATH: 8333817455"],
    "district": "Bhadradri Kothagudem",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "GAYATRI HOSPITAL",
    "address": "Coolie Ln, opp. durga kalamandir, Coolie Lane, Hanuman Basthi, Kothagudem, Telangana 507101",
    "contacts": [
      "Dr ALLURI NAGARAJU: 9494679996",
      "MR/MS T.SAMPATH KUMAR: 9515545951",
      "MR/MS T.SARAIAH: 9885974630"
    ],
    "district": "Bhadradri Kothagudem",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "NIKITHA HOSPITAL",
    "address": "Bhadrachalam, Venkateshwara Colony, Telangana 507111",
    "contacts": ["K RAMU PRASAD: 9182908314"],
    "district": "Bhadradri Kothagudem",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "JAGRUTHI ORTHOPEDIC HOSPITAL",
    "address": "6-12-46, Ganesh Basthi, Srinagar, Kothagudem, Laxmidevipally, Telangana 507101",
    "contacts": ["GONE MOHAN RAO: 9182905245"],
    "district": "Bhadradri Kothagudem",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "CHC CHARLA - KHAMMAM",
    "address": "Gajularajam Bhasthi, Hanuman Basthi, Kothagudem, Telangana 507101",
    "contacts": [
      "Dr JANAKIRAMULU E: 8333817455",
      "MR/MS G.YASHODA: 9666525663",
      "MR/MS I.SHIVA SHANKAR: 9550845806"
    ],
    "district": "Bhadradri Kothagudem",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AREA HOSPITAL - BADRACHALAM",
    "address": "Bhadrachalam, Medical Colony, Telangana 507111",
    "contacts": [
      "DR MVKOTIREDDY: 9059301921",
      "MR/MS PEDDIM.MUTYALA RAO: 9704972737",
      "Mr/Ms V.KIRAN: 8522067469"
    ],
    "district": "Bhadradri Kothagudem",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI SRINIVAS NURSING HOME, Bhadrachalam",
    "address": "Vasavi Theatre, VCM, Khammam, behind RTC Bus Stand Complex, Bhadrachalam, Telangana 507111",
    "contacts": [
      "MR/MS KOTTE.PRADEEP: 9010121748",
      "Mr/Mrs DR A ADI MOHANRAO: 9494526211"
    ],
    "district": "Bhadradri Kothagudem",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "COMMUNITY HEALTH CENTRE, ASWARAOPET",
    "address": "Aswaraopeta to Kukunuru Rd, Aswaraopeta, Telangana 507301",
    "contacts": [],
    "district": "Bhadradri Kothagudem",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "CHC JULURUPADU",
    "address": "Papakollu Road, Julurpad Village and Mandal, Bhadradri Kothagudem District, Telangana, 50716",
    "contacts": [
      "Dr RAMESH KOTTE: 8333817455",
      "MR/MS DHARAVATH.NARASIMHARAO: 9133646878",
      "RADHA KRISHNA RAO: 9133646878"
    ],
    "district": "Bhadradri Kothagudem",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Area Hospital - Manuguru",
    "address": "Ashok Nagar, Manuguru (PT), Telangana 507117",
    "contacts": ["Dr. K. Sunil Maznekar: 8317541454"],
    "district": "Bhadradri Kothagudem",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "CHC - MANUGURU",
    "address": "located in Ashok Nagar near the Sai Baba Temple, Manuguru (PT), Telangana 507117",
    "contacts": [
      "Dr VENKATA BHAVANI KALDI: 8333817455",
      "MR/MS P.RAMESH: 9642052220",
      "MR/MS Y.SATYANARAYANA: 8008778389"
    ],
    "district": "Bhadradri Kothagudem",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "JAYABHARATHI MULTISPECIALITY HOSPITAL",
    "address": "Bhadrachalam, Ashok Nagar Colony, Telangana 507111",
    "contacts": [
      "DR G.V.V.Sudarsana Rao: 9177616146",
      "MR/MS RAMISETTI.VENKATA LAKSHMI: 9704972737"
    ],
    "district": "Bhadradri Kothagudem",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AREA HOSPITAL - KOTHAGUDEM",
    "address": "Panjabgadda, Kothagudem, Telangana 507118",
    "contacts": [
      "DR N.Vijaya Laxman: 9989141143",
      "MR/MS A.VIJAYA LAXMI: 7382234008",
      "MR/MS B.RAMU: 9640911565",
      "MR/MS BHATTU.KRISHNA: 8978756553",
      "MR/MS CH.SRINIVASARAO: 9573194492",
      "MR/MS J. RAJ KUMAR: 9963250908",
      "MR/MS MD.MUNTHAJ BEGAM: 9912575082",
      "MR/MS MEESALA. JHANSI: 7337028253"
    ],
    "district": "Bhadradri Kothagudem",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "AREA HOSPITAL PALONCHA",
    "address": "KTPS, Palwancha, Telangana 507115",
    "contacts": [
      "DR J.V.L.Sireesha: 9490144326",
      "MR/MS B.LALU: 9705111346",
      "MR/MS MD.SABEER PASHA: 9959041781"
    ],
    "district": "Bhadradri Kothagudem",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "Area Hospital - Yellandu",
    "address": "Indira Nagar, Yellandu, Bhadradri Kothagudem district, Telangana (507123)",
    "contacts": ["Dr. Ravi Babu G: 9949882286"],
    "district": "Bhadradri Kothagudem",
    "lat": null,
    "lng": null
  },
  {
    "hospitalName": "SRI SURAKSHA MULTI SPECIALTY HOSPITAL",
    "address": "Ambedkar Centre, Opp. CPI Office, Ashok Nagar Colony, Bhadrachalam, Bhadradri Kothagudem, Telangana 507111",
    "contacts": ["TUNGA VYSHNAVI: 9391332143"],
    "district": "Bhadradri Kothagudem",
    "lat": null,
    "lng": null
  },










    {"hospitalName": "SRI RAM MULTY SPECIALITY DENTAL CARE", "address": "Netaji chowk, opposite to Agrawal sweets, Ponnar, Ravindra Nagar Colony, Adilabad, Telangana 504001", "contacts": ["G SURESH: 9133613548"], "district": "Adilabad", "lat": 19.6641, "lng": 78.5320},
    {"hospitalName": "M/s Kartikeya Hospital", "address": "Door Number 4, 5-55/2, opposite Girls High School, Vidya Nagar, Adilabad, Telangana 504001", "contacts": ["Sudeep Sankarneni: 9293124842"], "district": "Adilabad", "lat": null, "lng": null},
    {"hospitalName": "COMMUNITY HEALTH CENTER-UTNOOR", "address": "Near Little Flower School, Utnoor, Adilabad, Telangana", "contacts": ["Dr SRIDHAR REDDY: 9849759105", "MR/MS CHOWDARY.JAIRAM: 9441629025", "MR/MS JADAV AMBAJI: 9492135275", "MR/MS JADAV VIJAYESH: 8978045582"], "district": "Adilabad", "hospitalType": "GOVERNMENT HOSPITAL",   "lat": null, "lng": null},
    {"hospitalName": "SHRI KRISHNA HOSPITAL", "address": "Vidya Nagar, Adilabad, Telangana 504001","contacts": ["DR A KRANTHI KUMAR: 9492123111"], "district": "Adilabad", "lat": null, "lng": null},
    {"hospitalName": "KIRAN EYE LASER HOSPITAL", "address": "Opposite Central Library Cinema Road, Netaji Chowk Rd, Adilabad, Telangana 504001", "contacts": ["SWAMY: 9951243615"], "district": "Adilabad", "lat": null, "lng": null},
    {"hospitalName": "SHRAVYA HOSPITAL", "address": "Vidya Nagar, Adilabad, Telangana 504001", "contacts": ["AZEEZ: 9493749749"], "district": "Adilabad", "lat": null, "lng": null},
    {"hospitalName": "RIMS SUPER SPECIALITY HOSPITAL", "address": "13-10, Dasnapur, Sapthagiri Colony, Saraswathi nagar, chaitanyapuri, Adilabad, Telangana 504001", "contacts": ["Dr Meghanath: 9490025109"], "district": "Adilabad", "lat": null, "lng": null},
    {"hospitalName": "CARE DENTAL HOSPITAL", "address": "Mochigally, Adilabad, Telangana 504001", "contacts": ["HEERA MOTHI: 9949427055"], "district": "Adilabad", "lat": null,"lng": null},
    {"hospitalName": "SHRI GAJANAN MULTY SPECIALITY HOSPITAL", "address": "Vidya Nagar, Bhuktapur, Adilabad, Telangana 504001", "contacts": ["ANEEL: 9949698171"], "district": "Adilabad", "lat": null, "lng": null},
    {"hospitalName": "SHREE CRITICLE CARE HOSPITAL", "address": "Bhuktapur, Telangana 504001", "contacts": ["ASWIN: 9704454673"], "district": "Adilabad", "lat": null, "lng": null},
    {"hospitalName": "SHARADA HOSPITAL", "address": "Dwaraka Nagar, Ravindra Nagar Colony, Adilabad, Telangana 504001", "contacts": ["Shiva: 9177385157"], "district": "Adilabad", "lat": null, "lng": null},
    {"hospitalName": "SRI SAIRAM MULTISPECIALITY DENTAL CARE", "address": "Netaji chowk, opposite to Agrawal sweets, Ponnar, Ravindra Nagar Colony, Adilabad, Telangana 504001", "contacts": ["G SURESH: 9133613548"], "district": "Adilabad", "lat": null, "lng": null},
    {"hospitalName": "AYYAPPA ORTHOPEDIC & CHILDREN'S HOSPITAL", "address": "Ponnar, Ravindra Nagar Colony, Adilabad, Telangana 504001", "contacts": ["RAHUL: 9154861269"], "district": "Adilabad", "lat": null, "lng": null},
    {"hospitalName": "KALLEM BHUMAREDDY MULTY SPECIALITY HOSPITAL", "address": "Bhuktapur, near arun ice cream, Adilabad, Telangana 504001", "contacts": ["VIPUL: 7993271019"], "district": "Adilabad", "lat": null, "lng": null},
    {"hospitalName": "SRI VIGNESHWARA ORTHOPEDIC & MATERNITY HOSPITAL", "address": "Raviteja Hotel, Lane, Vidya Nagar, Adilabad, Telangana 504001", "contacts": ["SAI: 9849287515"], "district": "Adilabad", "lat": null,"lng": null},  
    {"hospitalName": "GRAVID HOME HOSPITAL", "address": "Near Asian Mall, Sai Nagar, Hanamkonda, Telangana, 506001", "contacts": ["LAVANYA: 9154853971"], "district": "Hanamkonda", "lat": 19.6641, "lng": 78.5320},
    {"hospitalName": "OZONE HOSPITALS", "address": "Rd Number 1, Green Hills Colony, Narsimha Puri Colony, Huda Colony, Kothapet", "contacts": ["DEVUDU ARUNA: 8501915893"], "lat": 17.4032, "lng": 78.4682},
    {"hospitalName": "GANDHI HOSPITALS", "address": "Musheerabad, Walker Town, Padmarao Nagar, Secunderabad", "contacts": ["DR SUNIL KUMAR: 7207206420"], "lat": 17.4032, "lng": 78.4682},
    {"hospitalName": "GOVERNMENT DENTAL COLLEGE AND HOSPITAL", "address": "Afzalgunj Rd, near Police Station, Ghansi Bazaar, Hyderabad", "contacts": ["ARUNA MITHRA: 9989032110"], "lat": 17.4032, "lng": 78.4682},
    {"hospitalName": "GOVT GENERAL AND CHEST HOSPITAL", "address": "Kalyan Nagar Phase 1, Sunder Nagar, Hyderabad", "contacts": ["Dr TPramod Kumar: 9848232139"], "lat": 17.4032, "lng": 78.4682},
    {"hospitalName": "Vivekananda Hospital ( A Unit of Aditya Hospital Private Limited )", "address": "6-3-871/A, Greenlands Road, Beside CM Camp Office, Begumpet, Punjagutta", "contacts": ["ROHIT: 8978976633"], "lat": 17.4032, "lng": 78.4682},
    {"hospitalName": "GOVERNMENT HOSPITAL FOR MENTAL CARE", "address": "Erragadda Main Road, beside ESI Hospital and Gokul Theater, Hyderabad", "contacts": ["Dr. K. Phanikanth: 9885604377"], "lat": 17.4032, "lng": 78.4682},
    {"hospitalName": "KINGSTON HOSPITALS PRIVATE LIMITED", "address": "ROAD NO 1, BANJARA HILLS, Owaisi Pura, Masab Tank", "contacts": ["DR MAHEEN: 9885507014"], "lat": 17.4032, "lng": 78.4682},
    {"hospitalName": "SAI SANJEEVINI HOSPITALS (A UNIT OF SINGAPANGA HEALTH CARE INDIA PVT.LTD)", "address": "Plot No.V–7, NH–9, Narsimhapuri Colony, Kothapet, Saroornagar", "contacts": ["DR K MADHUSUDHAN: 8333816402"], "lat": 17.4032, "lng": 78.4682},
    {"hospitalName": "CARE HOSPITALS MALAKPET", "address": "16-6-104 to 109, Old Kamal Theater Complex Chaderghat Road, Opp Niagara Hotel, Chaderghat", "contacts": ["ANITHA: 9494721092"], "lat": 17.4032, "lng": 78.4682},
    {"hospitalName": "Dr Akbar Eye Hospital", "address": "12-2-831/87, Asif Nagar Rd, MIGH Colony, Murad Nagar", "contacts": ["GOVARDHAN: 9704848454"], "lat": 17.4032, "lng": 78.4682},
    {"hospitalName": "NILOUFER HOSPITAL", "address": "6-2-29/A/1, Niloufer Hospital Rd, Red Hills, Lakdikapul", "contacts": ["BHAGYA LAKSHMI: 8977273543"], "lat": 17.4032, "lng": 78.4682},
    {"hospitalName": "Asian Institute Of Nephrology And Urology", "address": "Irram Manzil Colony, Somajiguda", "contacts": ["Dr Abdullah: 7207830680"], "lat": 17.4258, "lng": 78.4521},           
    {"hospitalName": "AREA HOSPITAL - GOLCONDA", "address": "440, 9-10-440, Fort Rd, Reti Galli, Golconda Fort", "contacts": ["DR P.V SRINIVASA RAO: 9848886678"], "lat": 17.3850, "lng": 78.3970},
    {"hospitalName": "MYTHRI HOSPITAL LLP", "address": "Opp. Pillar No. 83, PVNR Expressway, Gudi Malkapur Rd, Mehdipatnam", "contacts": ["SREEDHAR: 8886604177"], "lat": 17.3912, "lng": 78.4350},
    {"hospitalName": "OLIVE HOSPITAL", "address": "Building No. 12-2-718/3,4,5, Nanalnagar ‘X’ Road, Mehdipatnam", "contacts": ["Dr SHAJAHAN: 9440022529"], "lat": 17.3955, "lng": 78.4342},
    {"hospitalName": "HYDERABAD EYE INSTITUTE (OPERATING TRUST OF L V PRASAD EYE INSTITUTE)", "address": "LV Prasad Marg, Park View Enclave, Banjara Hills", "contacts": ["Dr K JHANSI: 9676868033" , "MR/MS A SHESHI REKA: 7386178453"], "lat": 17.4244, "lng": 78.4187},
    {"hospitalName": "ARAVIND EYE HOSPITAL PRIVATE LIMITED", "address": "Fl no-303, 12-2, Gudimalkapur", "contacts": ["MOHAMMED IBRAHIM: 9908571307"], "lat": 17.3890, "lng": 78.4310},
    {"hospitalName": "HUMANITY HOSPITAL (A UNIT OF HUMANITY FIRST FOUNDATION)", "address": "12-02-709, A/11, Karol Bagh Rd, Khader Bagh, Rethibowli, Gudimalkapur", "contacts": ["SHAHBAAZ HUSSAIN: 9182271713"], "lat": 17.3920, "lng": 78.4330},
    {"hospitalName": "SAROJINI DEVI EYE HOSPITAL", "address": "Mehdipatnam Rd, Ex Service Men Colony, Humayun Nagar", "contacts": ["Dr Srinivas: 8121862271"], "lat": 17.4011, "lng": 78.4410},
    {"hospitalName": "Ankura Hospital for women and Children (A Unit of Ankura Medical and Research Centre Pvt Ltd)", "address": "8-2-686/A/B/1/Vengalrao building", "contacts": [], "lat": 17.4150, "lng": 78.4420},
    {"hospitalName": "Aster Prime Hospital", "address": "7-1-450/20 Plot No 2 and 4 Mythri Vihar Ameerpet Hyderabad", "contacts": ["Devanand: 9995998832"], "lat": 17.4375, "lng": 78.4482},
    {"hospitalName": "Hyderabad Multispeciality Hospital", "address": "Malakpet", "contacts": ["Pradeep: 7680883666"], "lat": 17.3750, "lng": 78.5020},
    {"hospitalName": "Mythri Hospital", "address": "Mythri Hospital Pillar No 81 Mehdipatnam", "contacts": ["Akheel: 9160378092"], "lat": 17.3910, "lng": 78.4355},
    {"hospitalName": "Smiline Dental Hospital Pvt Ltd", "address": "8-3-952/10/2 Srinagar Colony Road Punjagutta Hyderabad", "contacts": ["Srinivas: 919347035432"], "lat": 17.4320, "lng": 78.4450},
    {"hospitalName": "Apple Oral and Dental Private Limited", "address": "9-6-1/2", "contacts": ["DR BNSOWMYA: 9949587582", "Dr KURUGUNTLA NANDINI: 7989629956"], "lat": 17.4100, "lng": 78.4500},
    {"hospitalName": "OMEGA HOSPITALS", "address": "road no 12 Mla colony", "contacts": ["Dr SYED ALI ABBAS BILGRAMI: 9700860811", "VIJAY KUMAR: 8686320657", "B. SUJATHA: 9032802410"], "lat": 17.4162, "lng": 78.4080},
    {"hospitalName": "APOLLO HOSPITALS", "address": "3-5-836 to 838 Near Old MLA Qrts, Hyderguda, Hyderabad", "contacts": ["Dr Saranya C: 8978934244"], "lat": 17.3980, "lng": 78.4750},
    {"hospitalName": "DR AGARWAL HEALTH CARE LIMITED", "address": "6-3-712/80/81", "contacts": ["Dr AGARWAL HEALTH CARE LIMITED: 9000441485", "Dr KARLAPUDI HARINATH BABU: 9848465560", "BHAGAVATHAM SUNEETA: 9963614101", "K.RAMA DEVI: 9912097040"], "lat": 17.4260, "lng": 78.4510},
    {"hospitalName": "RISHAB EYE CENTRE", "address": "35-60/1", "contacts": ["Dr Rita B Shaw: 9848186712", "M.NAGALAXMI: 9848741553"], "lat": 17.4000, "lng": 78.4600},
    {"hospitalName": "DRISHTI EYE CARE CENTRE", "address": "8-3-1100/6/114A", "contacts": ["Dr MADHUKAR REDDY K: 9848018170", "KAMATHAM INDIRAPRIYADARSHINI: 9618277109"], "lat": 17.4300, "lng": 78.4400},
    {"hospitalName": "ADITYA HOSPITAL", "address": "HYDERABAD", "contacts": ["DR B.SARITHA: 8374447214", "A.SANTHOSH: 8333816187"], "lat": 17.4200, "lng": 78.4500},
    {"hospitalName": "ALPHA SUPER SPECIALITY HOSPITAL", "address": "HYDEARBAD", "contacts": ["DR SYED SIRAJ UDDIN: 9396506764", "JYOTHI: 9666507511", "GADDAM JHANSI: 8143306952"], "lat": 17.3800, "lng": 78.4800},
    {"hospitalName": "NIKHIL HOSPITAL", "address": "HYDERABAD", "contacts": ["Dr Neeshma: 7893933335"], "lat": 17.3900, "lng": 78.4900},
    {"hospitalName": "SOWMYA HOSPITAL RAMNAGAR", "address": "HYDERABAD", "contacts": ["DR RAJESHWAR RAO: 9848485834", "GULAGATTU EMIMA: 9989294640"], "lat": 17.4100, "lng": 78.5100},
    {"hospitalName": "SRIDHAR MULTI SPECIALITY HOSPITAL", "address": "9-79, MARUTHI NAGAR ,SANTHOSH NAGAR ,HYD", "contacts": ["DR HIMABINDU: 9703535437", "DR. MAHENDER: 8919840834", "Dr NARENDER KUMAR: 9010124956", "DAYANANDAM: 9440567976", "MAHMOODA NASEER: 8333817238"], "lat": 17.3550, "lng": 78.5200},
    {"hospitalName": "NICE INSTITUTE FOR THE NEWBORN", "address": "10-2-247 248, SHANTI NAGAR, OFF. MASAB TANK, HYDERABAD-57", "contacts": ["Dr P SURESH KUMAR: 9490759415"], "lat": 17.4050, "lng": 78.4450},
    {"hospitalName": "THE DECCAN HOSPITAL", "address": "-364076 Somajiguda", "contacts": ["Mr C Damodar Reddy: 9849338067"], "lat": 17.4250, "lng": 78.4550},
    {"hospitalName": "KAMALA HOSPITAL AND RESEARCH CENTRE FOR THALASSEMIA AND SICKLE CELL PATIENTS", "address": "8-13-95/1/C", "contacts": ["KAVITHA: 9010867696", "Dr SUMAN JAIN: 9966880711"], "lat": 17.3700, "lng": 78.5300},
    {"hospitalName": "NIRMALA MATERNITY ORTHOPAEDICS AND GENERAL HOSPITAL", "address": "10-3-761/10", "contacts": ["NUZAHAT FEROZ: 7337260552"], "lat": 17.4000, "lng": 78.4700},
    {"hospitalName": "M/s. APOLLO SPECTRA HOSPITAL", "address": "7-1-57/B&C, SHYAM KARAN ROAD, ANANDBAGH, AMEERPET", "contacts": ["Dr KRISHNAVENI: 9849050806", "CHANDI HYMAWATHI: 9573159509"], "lat": 17.4400, "lng": 78.4500},
    {"hospitalName": "ST THERESA HOSPITAL", "address": "7 1 645 A", "contacts": ["DR LAITHA: 9491415040", "SHARADA: 7989462932"], "lat": 17.4500, "lng": 78.4300},
    {"hospitalName": "MEDIVISION EYE CARE CENTRE PRIVATE LIMITED COMPANY", "address": "10-3-304/F/1 to 4, INDIRASADAN, HUMAYUN NAGAR MAIN ROAD, HYDERABAD-500028", "contacts": ["Dr Rupak Kumar Reddy: 9100123261", "M. ANITHA: 9010993782"], "lat": 17.3990, "lng": 78.4400},
    {"hospitalName": "Asian Institute of Gastroenterology", "address": "Red Rose Cafe Lane, Somajiguda, Hyderabad", "contacts": ["K S Ram: 9963333711"], "lat": 17.4270, "lng": 78.4530},
    {"hospitalName": "Suraksha Children Hospital", "address": "12-3-64, Beside tarnaka flyover", "contacts": ["Sridhar: 9703733669"], "lat": 17.4320, "lng": 78.5320},
    {"hospitalName": "SOWJANYA DENTAL HOSPITALS", "address": "3-6-198 / F / 7, 1st Floor, Shreemukh Complex, Himayatnagar, Hyderabad", "contacts": ["DR SOWJANYA: 9704848000", "BHARATHI: 8333816199"], "lat": 17.4050, "lng": 78.4830},
    {"hospitalName": "A.P SUPERSPECIALITY DENTAL HOSPITAL", "address": "JUBILEE HILLS HYD", "contacts": ["Dr. M D QUSROO AHMED: 9491212111", "ARUNA: 8333816596"], "lat": 17.4310, "lng": 78.4070},
    {"hospitalName": "OUTLOOK DENTAL HOSPITAL", "address": "PLOT NO 86, RTC COLONY, TRIMULGHERRY", "contacts": ["Dr P DINESH: 9866559091"], "lat": 17.4700, "lng": 78.5100},
    {"hospitalName": "SV HAPPY SMILES MULTISPECIALITY DENTAL HOSPITAL", "address": "38, 5-5-181/2", "contacts": ["Dr A CHANDRA SHEKAR: 9701551551"], "lat": 17.3600, "lng": 78.5000},
    {"hospitalName": "SHINE N SMILE DENTAL HOSPITAL", "address": "3-4-174/7", "contacts": ["Dr K SHRAVAN KUMAR: 9246817911"], "lat": 17.3850, "lng": 78.4900},
    {"hospitalName": "PARTHA DENTAL", "address": "7-1-201/2", "contacts": ["Dr Aditi Nethikar: 8500779000"], "lat": 17.4350, "lng": 78.4450},
    {"hospitalName": "SIGMA HOSPITALS", "address": "16-11-740/3/14, PLOT NO: 32, DILSUKHNAGAR", "contacts": ["DR Jogireddy: 9700009432", "Dr Jogireddy: 8499938393"], "lat": 17.3685, "lng": 78.5250},
    {"hospitalName": "SRESHTA SRI KAMALA HOSPITALS", "address": "Dilsukh Nagar", "contacts": ["Dr Dilip Reddy: 7799702778"], "lat": 17.3680, "lng": 78.5240},
    {"hospitalName": "MAHAVIR HOSPITAL AND RESEARCH CENTRE", "address": "MASAB TANK, HYD", "contacts": ["Dr PRASHANTH: 9849409446", "J.SUKANYA: 8790356610", "TALLA NAGESH GOUD: 9866047514"], "lat": 17.4040, "lng": 78.4480},
    {"hospitalName": "HYDERABAD NURSING HOME", "address": "5-9-29/40, BASHEERBAGH, HYDERABAD", "contacts": ["DR THUNTAPURAM KARTHIK: 9703120022"], "lat": 17.4030, "lng": 78.4730},
    {"hospitalName": "Maxivision Eye Hospitals Private Limited", "address": "6-3-903/1/A/1/1, Raj Bhavan Road, somajiguda", "contacts": ["SARITHA: 9640899455", "Dr SAHITYA: 9390035948"], "lat": 17.4265, "lng": 78.4550},
    {"hospitalName": "INTEGRO HOSPITAL", "address": "12-2-725/2", "contacts": ["KAREEMUNNISA BEGUM: 9676394983"], "lat": 17.3940, "lng": 78.4340},
    {"hospitalName": "Eye Care Hyderabad", "address": "16-10-48/A", "contacts": ["KALTA SUDHA: 8333816105"], "lat": 17.3750, "lng": 78.5150},
    {"hospitalName": "NEO BBC NEW BORN & CHILDREN HOSPITAL", "address": "S.K. MALL, ABOVE BATA, OPP: ANDHRA MAHELA SABHA HOSPITAL, VIDYA NAGAR, OU ROAD, HYD-44", "contacts": ["Dr RANGAIAH: 9949513132", "MADHAVI: 9666154376"], "lat": 17.4010, "lng": 78.5080},
    {"hospitalName": "SRIKARA HOSPITALS", "address": "10-3-188", "contacts": ["Dr. C R HARISH: 8977848058"], "lat": 17.4500, "lng": 78.3800},
    {"hospitalName": "Aadya Hospital", "address": "5-9-29/40 Basheerbagh", "contacts": ["Chinimilli: 9866174816"], "lat": 17.4030, "lng": 78.4730},
    {"hospitalName": "Care Hospital", "address": "6-3-248/2 Road No 1 Banjara Hills Hyderabad", "contacts": ["Nilesh: 8861201220"], "lat": 17.4150, "lng": 78.4400},
    {"hospitalName": "Glenfield Mallareddy Hospital", "address": "5-91 Chapel Road Nampally", "contacts": ["Mohammed Younus: 9866773771"], "lat": 17.3930, "lng": 78.4700},
    {"hospitalName": "Lotus Cure Multi Speciality Hospital", "address": "BLOCK.NO 56, G.V.REDDY COLONY BESIDE SBI BANK OPPOSITE RYTHU BAZAR LANE ALWAL", "contacts": ["Mannem Manjula: 9696228228"], "lat": 17.4850, "lng": 78.5200},
    {"hospitalName": "Rainbow Childrens Medicare Limited", "address": "Road No.2, Banjara Hills", "contacts": ["Anki: 9390686948"], "lat": 17.4180, "lng": 78.4150},
    {"hospitalName": "Sri Uma Devi Dental Hospital", "address": "Champapet", "contacts": ["Prabhakar: 9014496144"], "lat": 17.3500, "lng": 78.5300},
    {"hospitalName": "CLEAR VISION EYE HOSPITAL", "address": "3-6-272/B", "contacts": ["Dr N NAVEENA: 8008888511", "Dr R V S KALYANI: 8008888511", "K.KOMALA: 9652301350"], "lat": 17.4080, "lng": 78.4820},
    {"hospitalName": "SAGARLAL MEMORIAL HOSPITAL & MATADIN GOEL RESEARCH CENTRE", "address": "1-5-551, Musheerabad, Hyderabad - 500 020.", "contacts": ["Dr S. Janardhan Rao: 9533960654"], "lat": 17.4120, "lng": 78.5000},
    {"hospitalName": "KAMINENI HOSPITAL KING KOTI", "address": "4-1-1227, KING KOTI ROAD, ABIDS", "contacts": ["Dr. SARASWATHI THIRUPATI: 9866995990", "VIMMY DAFFNY: 9010344520", "KALPANA: 8333816095"], "lat": 17.3920, "lng": 78.4850},
    {"hospitalName": "APOLLO HOSPITALS SECUNDERABAD", "address": "St. Johns road, beside Keys High School, Secunderabad 500003", "contacts": ["Dr EHSAAN: 9491060801", "Dr Upeder Reddy M: 9490722719", "Dr SYED RAHAMTULLAH: 9000750500", "SAROLA PRAMEELA: 7386932098", "N. RAMADEVI: 7893517745"], "lat": 17.4350, "lng": 78.5020},
    {"hospitalName": "ONUS HOSPITALS", "address": "17-1-382/B/7", "contacts": ["Dr. BALARAJU: 9502792322", "TANDRA LAKSHMI: 9010303807"], "lat": 17.3600, "lng": 78.4700},
    {"hospitalName": "SMART VISION EYE SPECIALITIES PVT LTD", "address": "143", "contacts": ["J.SUGANDHINI: 9948506146"], "lat": 17.4000, "lng": 78.4500},
    {"hospitalName": "Solis Eye Care Hospitals Pvt Ltd", "address": "13", "contacts": ["N.SANDHYA RANI: 8185809919"], "lat": 17.4100, "lng": 78.4600},
    {"hospitalName": "IMAGE HOSPITAL - AMEERPET", "address": "PLOT NO 8-3-903/F12&13 BESIDE BATA SHOW ROOM, AMEERPET", "contacts": ["Dr koteshwar rao: 8374447266"], "lat": 17.4350, "lng": 78.4480},
    {"hospitalName": "ARAVIND EYE HOSPITAL PRIVATE LIMITED", "address": "12-2-824/A/1 MEHEDIPATNAM", "contacts": ["Dr. SUBHAS CHANDRA BOSH: 9849490532", "MOHAMMED IBRAHIM: 9908571307"], "lat": 17.3915, "lng": 78.4345},
    {"hospitalName": "Renova Century Hospitals", "address": "8-2-703 BANJARAHILLS", "contacts": ["JAJARAAPU NARSIMHA RAO: 9553146406", "KOPPURAVURI VENKATA RAMANA PRASAD: 9391006809", "ZAREENA: 8374215581"], "lat": 17.4170, "lng": 78.4190},
    {"hospitalName": "RISE CHILDRENS HOSPITAL", "address": "13-6-431/D/77/AB", "contacts": ["Dr. DV RAMA MANOHARA REDDY: 9849139127"], "lat": 17.3750, "lng": 78.4500},
    {"hospitalName": "Bristlecone Hospitals", "address": "Plot No 3-4-136/A Street No 6 Barkatpura Hyderabad", "contacts": ["Maddala Veera: 9849022028"], "lat": 17.3980, "lng": 78.5000},
    {"hospitalName": "Soumya Multi Speciality Hospital", "address": "Plot No. 3-7-218 and 219, Beside Lucid Diagnostics", "contacts": ["Janardhan: 7569712842"], "lat": 17.3880, "lng": 78.5100},
    {"hospitalName": "SMILINE DENTAL HOSPITAL PVT LTD", "address": "8-3-952/10/2&2", "contacts": ["Dr. G.SUNITHA: 9949333444"], "lat": 17.4320, "lng": 78.4450},
    {"hospitalName": "APOLLO HOSPITALS ENTERPRISES LTD (JUBILEE HILLS)", "address": "JUBILEE HILLS HYDEARBAD", "contacts": ["Dr. DASARI MADHUSUDHANA RAO: 9440207766", "Dr. RENUKA: 9849253700", "Dr E Peddi Reddy: 9949569678", "Dr Subba Reddy: 9440732218", "P.VENKATA LAXMI: 8333816081"], "lat": 17.4230, "lng": 78.4090},
    {"hospitalName": "THUMBAY HOSPITAL NEW LIFE - CHADERGHAT", "address": "HYDERABAD", "contacts": ["Dr MASOOD ALI KHAN: 9290530490"], "lat": 17.3780, "lng": 78.4850},
    {"hospitalName": "INNOVA CHILDRENS HEART HOSPITAL PVT", "address": "TARNAKA, SEC-BAD", "contacts": ["Dr RV RAO: 9866377977"], "lat": 17.4300, "lng": 78.5300},
    {"hospitalName": "YASHODA HOSPITALS - SOMAJIGUDA", "address": "SOMAJIGUDA", "contacts": ["B PADMAJA: 9885708873", "Dr. ANAND BHARGAV: 8978790404", "Dr Gopinath: 8333816149", "Dr Parvez: 8333816149", "Dr PRADEEP SUNDER G: 9133493508", "BHUTHARAJU SAIDULU: 8686585908"], "lat": 17.4250, "lng": 78.4590},
    {"hospitalName": "WIN VISION EYE HOSPITALS DILSUKHNAGAR", "address": "16-11-741/5 MOOSARAMBAGH", "contacts": ["Dr K SRIDHAR: 9866843111", "Dr RAMAVATH HIMABINDU: 7032716317"], "lat": 17.3690, "lng": 78.5260},
    {"hospitalName": "AVS WELLNESS HOSPITALS", "address": "7-1-27/2", "contacts": ["BALAIAH BALAIAH: 9912468601", "Indhira: 9989427503", "MAKAM ANURADHA: 9866728357", "PRASHANTH RAO R: 9490667172"], "lat": 17.4380, "lng": 78.4420},
    {"hospitalName": "NEO RETINA EYE CARE CENTRE", "address": "55-9-84/1", "contacts": ["SARITHA: 9959480875"], "lat": 17.4100, "lng": 78.4650},
    {"hospitalName": "EYECURE HOSPITAL", "address": "SCB7-R2-264", "contacts": ["A. NARSING RAO: 9948949870"], "lat": 17.4450, "lng": 78.5000},
    {"hospitalName": "PARAMITHA CHILDRENS HOSPITAL PVT LTD", "address": "3-112, HANUMANNAGAR, CHAITANYAPURI HYDERABAD", "contacts": ["DR GIRIDHAR DERANGULA: 9440251524"], "lat": 17.3650, "lng": 78.5350},
    {"hospitalName": "Hyderabad Kidney and Laparoscopic Centre", "address": "Sir Louis Braille Flyover, Jamia Masjid St,", "contacts": ["Singireddy: 9391012964"], "lat": 17.4080, "lng": 78.4700},
    {"hospitalName": "Win Vision Eye Hospitals Pvt Ltd", "address": "6-3-868/2 Greenlands Begumpet", "contacts": ["Chaparala: 9866843111"], "lat": 17.4350, "lng": 78.4550},
    {"hospitalName": "YASHODA HOSPITALS SECUNDERABAD", "address": "NEAR CLOCK TOWER, SECUNDERABAD", "contacts": ["Dr. P JAGAN MOHAN REDDY: 9154105649", "Dr. VIJAY: 9030000996", "Dr RAJ KUMAR K: 9154105649", "GRANDHALA. MAHESH: 8333816067"], "lat": 17.4390, "lng": 78.5010},
    {"hospitalName": "YASHODA HOSPITAL (MALAKPET)", "address": "MALAKPET HYDERABAD", "contacts": ["Dr. PREETY: 7893821313", "Dr. SRIDHAR: 9701345556", "Dr MINNIE NAOMI M: 9849582041", "Dr MOHAMED ABDUL ALEEM: 9392401681", "Dr MOHAMED MAJID HASAN: 7396606933", "N.SHARATH CHANDRA: 8333816391", "G.ANIL KUMAR: 9063105186", "P.MAMATHA: 9703549700"], "lat": 17.3750, "lng": 78.5020},
    {"hospitalName": "PRIME HOSPITALS", "address": "HYDERABAD", "contacts": ["Dr PREM SAGAR: 9701972100", "SARASWATHI: 8333816191", "SHANKARA MURTHI: 9441513046"], "lat": 17.4300, "lng": 78.4400},
    {"hospitalName": "AMEERPET SUPER SPECIALITY DENTAL HOSPITAL", "address": "6-3-790/7", "contacts": ["Dr. B RAGINI: 9885012444"], "lat": 17.4350, "lng": 78.4480},
    {"hospitalName": "MEDICOVER HOSPITALS, SECRETARIAT", "address": "SECRATERIAT HYDERABAD", "contacts": ["Dr Prasad PGVS: 9390161891", "MURIKIPUDI BHARATHI: 8333816144"], "lat": 17.4080, "lng": 78.4650},
    {"hospitalName": "PUSHPAGIRI EYE HOSPITAL", "address": "HYDERABAD", "contacts": ["DR O MURALIDHAR: 8688820299", "G.NARESH: 8333816067", "k.vijay kumar: 9392493117"], "lat": 17.4400, "lng": 78.5100},
    {"hospitalName": "PRINCESS ESRA HOSPITAL (DCMS)", "address": "HYDERABAD", "contacts": ["Dr IMTIAZ BANDEALI: 7799042906", "JAYALAXMI: 8919700632", "KAREEMUNNISA BEGUM: 8464820013"], "lat": 17.3550, "lng": 78.4600},
    {"hospitalName": "VASAVI HOSPITAL", "address": "6-1-91, OPP. MEERA THEATER, LAKIDI-KA-POOL, KHAIRTABAD", "contacts": ["DR V.SRIMAN NARAYANA: 9912410166", "Dr. SHIVASHANKAR REDDY: 7989144230", "RAYAPATI KHASIMPEERA: 8333816201"], "lat": 17.4050, "lng": 78.4620},
    {"hospitalName": "MADHAVA NURSING HOME, SECUNDERABAD", "address": "43 SAROJINI DEVI ROAD, SECUNDERABAD 500003", "contacts": ["Dr A MOHAN CHARY: 9848048914", "N.GANESH: 9652601966"], "lat": 17.4420, "lng": 78.5000},
    {"hospitalName": "SWARUP EYE CENTRE", "address": "#145", "contacts": ["Dr Pradeep Swarup: 9849003639", "SHAIK ABDULLAH: 9030905149"], "lat": 17.4200, "lng": 78.4500},
    {"hospitalName": "MEDICOVER HOSPITALS, MADHAPUR", "address": "1-90", "contacts": ["Dr SATEESH KUMAR K: 9701876584", "K. CHIRANJEEVI: 9063577110"], "lat": 17.4480, "lng": 78.3900},
    {"hospitalName": "INDUSS HOSPITALS", "address": "PLOT NO.34, KRISHNAVENI NAGAR, OPP. KOTHAPET FRUT MARKET, KOTHAPET", "contacts": ["D.PREMA LATHA: 9581133273", "Dr DB SRINIVAS: 8897237777"], "lat": 17.3680, "lng": 78.5280},
    {"hospitalName": "NEW DELHI CENTRE FOR SIGHT", "address": "Hyderabad", "contacts": ["Dr ABDUL RASHEED: 9652621100", "Dr MAJJI AJIT BABU: 9849712200", "DANDI RAJESH: 8179129161"], "lat": 17.4200, "lng": 78.4500},
    {"hospitalName": "MEDWIN HOSPITALS", "address": "ABIDS, HYDERABAD", "contacts": ["Dr K SRINIVAS KUMAR: 9666101837"], "lat": 17.3910, "lng": 78.4800},
    {"hospitalName": "DURGA BHAI DESHMUKH HOSPITAL AND RESEARCH CENTRE", "address": "VIDYANAGAR, HYDERABAD", "contacts": ["Dr SUDHAKAR: 8985744302", "MAMIDI UMA MAHESWARI: 9490762979"], "lat": 17.4010, "lng": 78.5080},
    {"hospitalName": "LOTUS CHILDRENS HOSPITAL", "address": "6-3-29", "contacts": ["Dr Lavanya: 9949687907"], "lat": 17.4250, "lng": 78.4480}
];

function processNehsData(rawList) {
    return rawList.map(item => {
        let name = item.hospitalName;
        let lowerName = name.toLowerCase();
        let specialty = "General & Multispecialty";
        
        if (lowerName.includes("eye") || lowerName.includes("drishti") || lowerName.includes("vision") || lowerName.includes("retina")) {
            specialty = "Eye & Dental";
        } else if (lowerName.includes("dental") || lowerName.includes("oral") || lowerName.includes("smiline") || lowerName.includes("smile")) {
            specialty = "Eye & Dental";
        } else if (lowerName.includes("children") || lowerName.includes("newborn") || lowerName.includes("women") || lowerName.includes("ankura") || lowerName.includes("maternity")) {
            specialty = "Maternity & Pediatric";
        } else if (lowerName.includes("gastro") || lowerName.includes("kidney") || lowerName.includes("nephro") || lowerName.includes("cancer") || lowerName.includes("omega")) {
            specialty = "Oncology";
        }

        let phone = "040-23456789";
        let mitra = "Help Desk";
        let hours = "24/7 Available";
        if (item.contacts && item.contacts.length > 0) {
            let parts = item.contacts[0].split(":");
            if (parts.length > 1) {
                mitra = parts[0].trim();
                phone = parts[1].trim();
            } else {
                phone = item.contacts[0].trim();
            }
        }
        
        if (lowerName.includes("area hospital") || lowerName.includes("osmania") || lowerName.includes("gandhi")) {
            hours = "General Hours: 9 AM - 6 PM";
        }

       



let type = "Corporate Hospital";

if (
    lowerName.includes("govt") || 
    lowerName.includes("government") || 
    lowerName.includes("chc") || 
    lowerName.includes("phc") || 
    lowerName.includes("community health") || 
    lowerName.includes("primary health") || 
    lowerName.includes("area hospital") || 
    lowerName.includes("district hospital") || 
    lowerName.includes("nims") || 
    lowerName.includes("osmania") || 
    lowerName.includes("gandhi") || 
    lowerName.includes("niloufer") || 
    lowerName.includes("golconda") || 
    lowerName.includes("rims") || 
    lowerName.includes("riims")
) {
    type = "Government Hospital";
}



























        return {
            name: name,
            type: type,
            state: "Telangana",
            district: item.district || "Hyderabad",
            specialty: specialty,
            mitraName: mitra,
            phone: phone,
            cover: "Cashless Treatment",
            address: item.address || "Telangana",
            availability: hours,
            verifiedDate: "Verified Aug 2026",
            rating: 5,
            lat: item.lat || 17.3850,
            lng: item.lng || 78.4867
        };
    });
}

const cardHospitalsMap = {
    "NEHS Card": processNehsData(nehsRawData),
    "Rajiv Aarogyasri": [
        { name: "AVS Wellness Hospitals", type: "Corporate Hospital", state: "Telangana", district: "Hyderabad", specialty: "General & Multispecialty", mitraName: "Makam Anuradha", phone: "9866728357", cover: "Cashless up to ₹10 Lakhs", address: "Leelanagar, Ameerpet, Hyderabad", availability: "24/7 Available", verifiedDate: "Verified Aug 2026", rating: 5, lat: 17.358689, lng: 78.4491 },
        { name: "Apollo Hospitals Secunderabad", type: "Corporate Hospital", state: "Telangana", district: "Hyderabad", specialty: "General & Multispecialty", mitraName: "N. Ramadevi", phone: "7893517745", cover: "Cashless up to ₹10 Lakhs", address: "St. Johns Road, Beside Keys High School, Secunderabad", availability: "24/7 Available", verifiedDate: "Verified Aug 2026", rating: 5, lat: 17.440022, lng: 78.504408 },
        { name: "Apollo Institute of Medical Sciences and Research", type: "Corporate Hospital", state: "Telangana", district: "Hyderabad", specialty: "General & Multispecialty", mitraName: "Bagya Laxmi", phone: "9705465173", cover: "Cashless up to ₹10 Lakhs", address: "Apollo health City Campus, Road No.92, Jubilee Hills, Film Nagar", availability: "24/7 Available", verifiedDate: "Verified Aug 2026", rating: 5, lat: 17.4141927, lng: 78.4124893 },
        { name: "Apollo Hospitals Enterprises Ltd (Jubilee Hills)", type: "Corporate Hospital", state: "Telangana", district: "Hyderabad", specialty: "General & Multispecialty", mitraName: "P.Venkata Laxmi", phone: "9290506300", cover: "Cashless up to ₹10 Lakhs", address: "Road No 72, opp. Bharatiya Vidya Bhavan School, Film Nagar, Jubilee Hills", availability: "24/7 Available", verifiedDate: "Verified Aug 2026", rating: 5, lat: 17.414822, lng: 78.412654 },
        { name: "Area Hospital Nampally", type: "Government Hospital", state: "Telangana", district: "Hyderabad", specialty: "General & Multispecialty", mitraName: "Razia Sultana", phone: "9177397550", cover: "Cashless up to ₹10 Lakhs", address: "Nampally Market, Bazar Ghat, Nampally", availability: "24/7 Available", verifiedDate: "Verified Aug 2026", rating: 5, lat: 17.392134, lng: 78.46298 },
        { name: "Medivision Eye And Health Care Centre", type: "Corporate Hospital", state: "Telangana", district: "Hyderabad", specialty: "Eye & Dental", mitraName: "M.Anitha", phone: "9010993782", cover: "Cashless up to ₹10 Lakhs", address: "10-3-304/F/1 To 4, Indirasadan, Humayun Nagar Main Road", availability: "8 AM – 8 PM", verifiedDate: "Verified Aug 2026", rating: 5, lat: 17.398881, lng: 78.448088 },
        { name: "Aravind Eye Hospital Private Limited", type: "Corporate Hospital", state: "Telangana", district: "Hyderabad", specialty: "Eye & Dental", mitraName: "Mohammed Ibrahim", phone: "9908571307", cover: "Cashless up to ₹10 Lakhs", address: "12-2-824/A/1 Mehedipatnam", availability: "General Hours: 9 AM – 1 PM", verifiedDate: "Verified Aug 2026", rating: 5, lat: 17.391885, lng: 78.437855 },
        { name: "Area Hospital Golconda", type: "Government Hospital", state: "Telangana", district: "Hyderabad", specialty: "General & Multispecialty", mitraName: "Neeraja", phone: "8978977830", cover: "Cashless up to ₹10 Lakhs", address: "440, 9-10-440, Fort Rd, Reti Galli, Golconda Fort", availability: "General Hours: 9 AM – 1 PM", verifiedDate: "Verified Aug 2026", rating: 5, lat: 17.385923, lng: 78.403117 },
        { name: "Alpha Super Speciality Hospital", type: "Corporate Hospital", state: "Telangana", district: "Hyderabad", specialty: "General & Multispecialty", mitraName: "Kareemunnisa Begum", phone: "8464820013", cover: "Cashless up to ₹10 Lakhs", address: "Near MCH Swimming Pool, Moghalpura", availability: "24/7 Available", verifiedDate: "Verified Aug 2026", rating: 5, lat: 17.358689, lng: 78.478127 },
        { name: "Care Hospital", type: "Corporate Hospital", state: "Telangana", district: "Hyderabad", specialty: "Cardiology", mitraName: "M. Rajesh", phone: "9948854099", cover: "Cashless up to ₹10 Lakhs", address: "Banjara Hills, Hyderabad", availability: "24/7 Available", verifiedDate: "Verified Aug 2026", rating: 5, lat: 17.4150, lng: 78.4400 },
        { name: "Yashoda Hospital", type: "Corporate Hospital", state: "Telangana", district: "Hyderabad", specialty: "General & Multispecialty", mitraName: "P. Naresh", phone: "8008283399", cover: "Cashless up to ₹10 Lakhs", address: "Malakpet, Hyderabad", availability: "24/7 Available", verifiedDate: "Verified Aug 2026", rating: 5, lat: 17.3750, lng: 78.5020 },
        { name: "Basavatarakam Indo-American Cancer Institute", type: "Corporate Hospital", state: "Telangana", district: "Hyderabad", specialty: "Oncology", mitraName: "P. Gopal", phone: "9912225348", cover: "Full Oncology Cover", address: "Banjara Hills, Hyderabad", availability: "24/7 Available", verifiedDate: "Verified Aug 2026", rating: 5, lat: 17.4200, lng: 78.4120 },
        { name: "Osmania General Hospital", type: "Government Hospital", state: "Telangana", district: "Hyderabad", specialty: "General & Multispecialty", mitraName: "Help Desk", phone: "040-24600121", cover: "Free Govt Care", address: "Afzal Gunj, Hyderabad", availability: "General Hours: 9 AM - 6 PM", verifiedDate: "Verified Aug 2026", rating: 5, lat: 17.3780, lng: 78.4780 }
    ]
};

const cardDetailsMap = {
    "NEHS Card": {
        rules: "Completely cashless medical treatment and digital pre-authorisation workflow for state government employees, pensioners, and dependent family members across empanelled hospitals.",
        packages: "1,816 medical and surgical packages aligned with CGHS standards covering specialized treatments, IPD, and chronic care.",
        corrections: "Managed through official NEHS portal (nehs.telangana.gov.in) and Employees Health Care Trust workflow.",
        documents: "1. NEHS Digital Health Card\n2. Employee Service ID / PPO Copy\n3. Government ID Proof"
    },
    "Rajiv Aarogyasri": {
        rules: "Zero payment at empanelled network hospitals. Pre-authorization from Aarogya Mithra within 24 hours of emergency admission.",
        packages: "1,835+ treatments covered across Cardiology, Oncology, Nephrology, Orthopedics, Neurology, and Organ Transplants.",
        corrections: "Must be updated first in your White Ration Card / Food Security Card (FSC) via MeeSeva or Civil Supplies Dept.",
        documents: "1. White Ration Card / FSC\n2. Valid ID Proof\n3. Doctor Admission Slip / Prescription"
    }
};

function applyChipFilter(filterType) {
    const cardSel = document.getElementById('healthCardSelect');
    const stateSel = document.getElementById('stateSelect');
    const typeSel = document.getElementById('hospitalTypeSelect');
    const specSel = document.getElementById('specializationFilter');
    const searchInput = document.getElementById('globalSearch');

    if(cardSel) cardSel.value = "";
    if(stateSel) stateSel.value = "Telangana";
    updateDistricts();
    if(typeSel) typeSel.value = "";
    if(specSel) specSel.value = "All";
    if(searchInput) searchInput.value = "";

    if(filterType === 'NEHS') {
        if(cardSel) cardSel.value = "NEHS Card";
        if(typeSel) typeSel.value = "All";
    } else if(filterType === 'Aarogyasri') {
        if(cardSel) cardSel.value = "Rajiv Aarogyasri";
        if(typeSel) typeSel.value = "All";
    } else if(filterType === 'Government') {
        if(cardSel) cardSel.value = "NEHS Card";
        if(typeSel) typeSel.value = "Government Hospital";
    } else if(filterType === 'Corporate') {
        if(cardSel) cardSel.value = "NEHS Card";
        if(typeSel) typeSel.value = "Corporate Hospital";
    }

    displayHubInfo();
}

function onCardChange() {
    const cardVal = document.getElementById('healthCardSelect').value;
    const stateSel = document.getElementById('stateSelect');
    if(cardVal) {
        stateSel.value = "Telangana";
        updateDistricts();
    }
    checkReadyState();
}

function updateDistricts() {
    const districtSel = document.getElementById('districtSelect');
    if(districtSel) {
        let currentVal = districtSel.value || "Hyderabad";
        let options = '<option value="">-- Select District --</option>';
        telanganaDistricts.forEach(dist => {
            options += `<option value="${dist}" ${dist === currentVal ? 'selected' : ''}>${dist}</option>`;
        });
        districtSel.innerHTML = options;
    }
    checkReadyState();
}

function selectCardAndSearch(cardName) {
    if(!document.getElementById('healthCardSelect')) {
        window.location.href = '/?card=' + encodeURIComponent(cardName);
        return;
    }
    document.getElementById('healthCardSelect').value = cardName;
    document.getElementById('stateSelect').value = "Telangana";
    updateDistricts();
    document.getElementById('hospitalTypeSelect').value = "All";
    displayHubInfo();
}

function filterCategory(categoryName) {
    if(!document.getElementById('healthCardSelect')) {
        window.location.href = '/?spec=' + encodeURIComponent(categoryName);
        return;
    }
    document.getElementById('healthCardSelect').value = "NEHS Card";
    document.getElementById('stateSelect').value = "Telangana";
    updateDistricts();
    document.getElementById('hospitalTypeSelect').value = "All";
    document.getElementById('specializationFilter').value = categoryName;
    displayHubInfo();
}

function checkReadyState() {
    if(!document.getElementById('healthCardSelect')) return;
    const card = document.getElementById('healthCardSelect').value;
    const dist = document.getElementById('districtSelect').value;
    const hospType = document.getElementById('hospitalTypeSelect').value;

    if(card && dist && hospType) {
        displayHubInfo();
    }
}

function displayHubInfo() {
    if(!document.getElementById('healthCardSelect')) return;
    const card = document.getElementById('healthCardSelect').value;
    const dist = document.getElementById('districtSelect').value || "Hyderabad";
    const hospType = document.getElementById('hospitalTypeSelect').value || "All";

    if(!card) {
        alert("Please select a 'Health Card' from the dropdown first!");
        document.getElementById('healthCardSelect').focus();
        return;
    }

    document.getElementById('resHospitalTypeName').innerHTML = hospType === "All" ? "All Hospital Types" : hospType;
    document.getElementById('resDistrictName').innerHTML = dist + " District";
    document.getElementById('selectedCardBadge').innerHTML = card;

    const details = cardDetailsMap[card] || cardDetailsMap["NEHS Card"];
    document.getElementById('resCashlessRules').innerHTML = details.rules;
    document.getElementById('resPackages').innerHTML = details.packages;
    document.getElementById('resCorrections').innerHTML = details.corrections;
    document.getElementById('resDocuments').innerHTML = details.documents.replace(/\n/g, '<br/>');

    resetPageAndRender();

    document.getElementById('resultCard').style.display = 'block';
    document.getElementById('guidelinesSection').style.display = 'block';
    document.getElementById('resultCard').scrollIntoView({ behavior: 'smooth' });
}

function resetPageAndRender() {
    currentPage = 1;
    filterHospitals();
    renderHospitalList();
}

function resetAllFilters() {
    const cardSel = document.getElementById('healthCardSelect');
    const stateSel = document.getElementById('stateSelect');
    const typeSel = document.getElementById('hospitalTypeSelect');
    const specSel = document.getElementById('specializationFilter');
    const searchInput = document.getElementById('globalSearch');

    if(cardSel) cardSel.value = "";
    if(stateSel) stateSel.value = "";
    updateDistricts();
    if(typeSel) typeSel.value = "";
    if(specSel) specSel.value = "All";
    if(searchInput) searchInput.value = "";
    userCoords = null;

    const resCard = document.getElementById('resultCard');
    const guideSec = document.getElementById('guidelinesSection');
    if(resCard) resCard.style.display = 'none';
    if(guideSec) guideSec.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function findHospitalsNearMe() {
    if(!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }
    const cardSel = document.getElementById('healthCardSelect');
    if(!cardSel.value) {
        cardSel.value = "NEHS Card";
    }
    document.getElementById('stateSelect').value = "Telangana";
    updateDistricts();
    document.getElementById('hospitalTypeSelect').value = "All";
    
    navigator.geolocation.getCurrentPosition((position) => {
        userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        displayHubInfo();
        alert("GPS Location detected successfully! Hospitals are now sorted from nearest to farthest based on your current location.");
    }, (error) => {
        console.warn("Geolocation error: ", error);
        alert("Unable to retrieve your precise GPS location. Displaying standard network hospital listings.");
        userCoords = null;
        displayHubInfo();
    }, { timeout: 10000, maximumAge: 60000, enableHighAccuracy: true });
}

function filterHospitals() {
    if(!document.getElementById('healthCardSelect')) return;
    const card = document.getElementById('healthCardSelect').value || "NEHS Card";
    const selectedDistrict = document.getElementById('districtSelect') ? document.getElementById('districtSelect').value : "Hyderabad";
    const hospType = document.getElementById('hospitalTypeSelect').value || "All";
    const selectedSpecialty = document.getElementById('specializationFilter').value || "All";
    const searchQuery = document.getElementById('globalSearch') ? document.getElementById('globalSearch').value.toLowerCase().trim() : "";
    
    let hospitals = [...(cardHospitalsMap[card] || cardHospitalsMap["NEHS Card"])];
    
    currentFilteredList = hospitals.filter(h => {
        let matchesDistrict = !selectedDistrict || selectedDistrict === 'All' || h.district.toLowerCase() === selectedDistrict.toLowerCase();
        let matchesType = !hospType || hospType === 'All' || h.type === hospType;
        let matchesSpec = selectedSpecialty === 'All' || h.specialty === selectedSpecialty;
        let matchesSearch = !searchQuery || h.name.toLowerCase().includes(searchQuery) || h.address.toLowerCase().includes(searchQuery);
        return matchesDistrict && matchesType && matchesSpec && matchesSearch;
    });

    if (userCoords && userCoords.lat && userCoords.lng) {
        currentFilteredList.forEach(h => {
            h.distance = calculateDistance(userCoords.lat, userCoords.lng, h.lat, h.lng);
        });
        currentFilteredList.sort((a, b) => a.distance - b.distance);
    }
}

// RENDER HOSPITAL LIST FUNCTION WITH MODAL REPORT TRIGGER
function renderHospitalList() {
    const hospListContainer = document.getElementById('regionHospitalsList');
    if(!hospListContainer) return;
    hospListContainer.innerHTML = '';

    if(currentFilteredList.length === 0) {
        hospListContainer.innerHTML = `<div class='col-span-1 md:col-span-2 p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300'>No hospitals found matching the selected district/filters.</div>`;
        document.getElementById('paginationContainer').style.display = 'none';
        return;
    }

    document.getElementById('paginationContainer').style.display = 'flex';

    const totalPages = Math.ceil(currentFilteredList.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, currentFilteredList.length);
    const paginatedItems = currentFilteredList.slice(startIndex, endIndex);

    paginatedItems.forEach((h, index) => {
        let mapUrl = `https://www.google.com/maps/search/?api=1&query=` + encodeURIComponent(h.name + " " + h.address);
        
        let uberDeepLink = `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${h.lat}&dropoff[longitude]=${h.lng}&dropoff[nickname]=${encodeURIComponent(h.name)}`;
        let olaDeepLink = `https://book.olacabs.com/c/ola?lat=${h.lat}&lng=${h.lng}&category=cab&drop_name=${encodeURIComponent(h.name)}`;
        let rapidoDeepLink = `https://www.rapido.bike/`;

        let whatsappText = `*Hospital Details - Telangana Healthcare Hub*%0A` +
                           `🏥 *Hospital:* ${encodeURIComponent(h.name)}%0A` +
                           `📍 *Address:* ${encodeURIComponent(h.address)}%0A` +
                           `👤 *Helpdesk Contact:* ${encodeURIComponent(h.mitraName)} (${encodeURIComponent(h.phone)})%0A` +
                           `🗺️ *Google Maps:* ${encodeURIComponent(mapUrl)}`;
        let whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappText}`;

        // Escape single quotes for inline JS function call
        let safeName = h.name.replace(/'/g, "\\'");
        let safeAddress = h.address.replace(/'/g, "\\'");

        let distanceBadge = (h.distance !== undefined && !isNaN(h.distance)) ? 
            `<span class='bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-bold px-2 py-0.5 rounded'><i class='fa-solid fa-route mr-1'></i>${h.distance.toFixed(1)} km away</span>` : '';

        let div = document.createElement('div');
        div.className = 'bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-xs hover:shadow-md transition space-y-2.5 flex flex-col justify-between';
        div.innerHTML = `
            <div class='space-y-1.5'>
                <div class='flex justify-between items-start gap-2'>
                    <h5 class='font-bold text-slate-900 text-xs sm:text-sm leading-snug'>${h.name}</h5>
                    <div class='flex flex-col items-end gap-1 shrink-0'>
                        <span class='bg-blue-100 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded uppercase'>${h.type}</span>
                        ${distanceBadge}
                    </div>
                </div>
                <p class='text-[11px] text-slate-600 flex items-start'><i class='fa-solid fa-location-dot text-rose-500 mr-1.5 mt-0.5 shrink-0'></i><span>${h.address}</span></p>
                <div class='bg-white p-2 rounded-lg border border-slate-200 text-[11px] space-y-1'>
                    <p class='font-semibold text-slate-800 flex items-center justify-between'>
                        <span><i class='fa-solid fa-user-tie text-blue-600 mr-1'></i> ${h.mitraName}</span>
                        <a href='tel:${h.phone}' class='text-blue-600 font-bold hover:underline'><i class='fa-solid fa-phone mr-1'></i> ${h.phone}</a>
                    </p>
                    <p class='text-slate-500 flex items-center justify-between text-[10px]'>
                        <span><i class='fa-solid fa-clock text-amber-500 mr-1'></i> ${h.availability}</span>
                        <span class='text-emerald-600 font-semibold'><i class='fa-solid fa-shield-check mr-0.5'></i> ${h.cover}</span>
                    </p>
                </div>
            </div>

            <!-- 4 BUTTONS STRICTLY IN A SINGLE ROW ACROSS ALL DEVICES -->
            <div class='pt-2 border-t border-slate-200/60 grid grid-cols-4 gap-1.5 w-full items-center'>
                <!-- 1. MAP BUTTON -->
                <a href='${mapUrl}' target='_blank' class='bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-1.5 px-1 rounded-lg text-[10px] sm:text-xs transition border border-blue-200 flex items-center justify-center gap-1 min-w-0' title='View on Google Maps'>
                    <i class='fa-solid fa-map-location-dot text-blue-600 shrink-0 text-[10px] sm:text-xs'></i>
                    <span class='truncate'>Map</span>
                </a>

                <!-- 2. BOOK CAB BUTTON -->
                <div class='relative group/cab min-w-0'>
                    <button class='w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-1.5 px-1 rounded-lg text-[10px] sm:text-xs transition border border-slate-300 flex items-center justify-center gap-0.5'>
                        <i class='fa-solid fa-taxi text-amber-600 shrink-0 text-[10px] sm:text-xs'></i>
                        <span class='truncate'>Cab</span>
                        <i class='fa-solid fa-chevron-down text-[8px] shrink-0 opacity-70'></i>
                    </button>
                    <div class='absolute left-0 bottom-full mb-1 w-32 bg-white border border-slate-200 rounded-lg shadow-xl py-1 hidden group-hover/cab:block z-50 text-[11px] font-medium'>
                        <a href='${uberDeepLink}' target='_blank' class='block px-2.5 py-1.5 hover:bg-slate-50 text-slate-700'><i class='fa-brands fa-uber mr-1.5 text-black'></i> Uber</a>
                        <a href='${olaDeepLink}' target='_blank' class='block px-2.5 py-1.5 hover:bg-slate-50 text-slate-700'><i class='fa-solid fa-car mr-1.5 text-emerald-600'></i> Ola</a>
                        <a href='${rapidoDeepLink}' target='_blank' class='block px-2.5 py-1.5 hover:bg-slate-50 text-slate-700'><i class='fa-solid fa-motorcycle mr-1.5 text-yellow-600'></i> Rapido</a>
                    </div>
                </div>

                <!-- 3. REPORT BUTTON (OPENS POPUP MODAL) -->
                <button onclick="openReportModal('${safeName}', '${safeAddress}')" class='bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold py-1.5 px-1 rounded-lg text-[10px] sm:text-xs transition border border-rose-200 flex items-center justify-center gap-1 min-w-0 cursor-pointer' title='Report Hospital Info'>
                    <i class='fa-solid fa-flag text-rose-600 shrink-0 text-[10px] sm:text-xs'></i>
                    <span class='truncate'>Report</span>
                </button>

                <!-- 4. SHARE BUTTON -->
                <a href='${whatsappUrl}' target='_blank' class='bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold py-1.5 px-1 rounded-lg text-[10px] sm:text-xs transition border border-emerald-200 flex items-center justify-center gap-1 min-w-0' title='Share via WhatsApp'>
                    <i class='fa-brands fa-whatsapp text-emerald-600 font-bold shrink-0 text-[10px] sm:text-xs'></i>
                    <span class='truncate'>Share</span>
                </a>
            </div>
        `;
        hospListContainer.appendChild(div);
    });

    document.getElementById('pageInfo').innerHTML = `Showing ${startIndex + 1} to ${endIndex} of ${currentFilteredList.length} results`;
    document.getElementById('currentPageBadge').innerHTML = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
}

function changePage(direction) {
    const totalPages = Math.ceil(currentFilteredList.length / itemsPerPage);
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    renderHospitalList();
    document.getElementById('resultCard').scrollIntoView({ behavior: 'smooth' });
}

function searchHub() {
    resetPageAndRender();
}

document.addEventListener('DOMContentLoaded', function() {
    updateDistricts();
});
//]]>
</script>
