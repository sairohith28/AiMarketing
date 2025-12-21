import math
import json
import time
import random
import asyncio
import re
import aiohttp
from fastapi import FastAPI, Query
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from playwright.async_api import async_playwright

app = FastAPI(title="Hospital Competitor Analysis API")

# ==========================
# CONFIGURATION
# ==========================
API_KEY = "API_KEY_HERE"  # Replace with your Google Places API key
YOUR_SERVICES = [
    "Cardiology", "Oncology", "Orthopedics", "Neurology", "Gastroenterology",
    "Pediatrics", "Gynecology", "Urology", "Dermatology", "Pulmonology",
    "ENT", "Emergency", "Radiology", "Psychiatry", "Endocrinology",
    "Rheumatology", "Ophthalmology", "Nephrology", "Pain Management",
    "Physiotherapy", "General Medicine", "Critical Care"
]
HEADLESS = True
TIMEOUT = 15000
CRAWL_LIMIT = 10
SERVICE_KEYWORDS = [
    # Core Medical Specialties
    "Cardiology", "Neurology", "Orthopedics", "Gynecology", "Oncology",
    "Pediatrics", "Radiology", "Dermatology", "Urology", "Nephrology",
    "Endocrinology", "Gastroenterology", "Psychiatry", "Pulmonology",
    "ENT", "Emergency", "ICU", "Critical Care", "Dental", "Ophthalmology",
    "Physiotherapy", "General Surgery", "Plastic Surgery", "IVF",
    "Fertility", "Trauma", "Rehabilitation", "Diagnostics", "Nutrition",
    "Pain Management", "Spine Surgery", "Laparoscopic Surgery",
    "Cancer Care", "Neurosurgery", "Vascular Surgery", "Diabetology",
    "Neonatal Care", "Nutritional Assessment", "Dentistry",
    
    # Cardiology & Cardiac Care
    "Interventional Cardiology", "Cardiac Surgery", "Cardiac Catheterization", 
    "Angioplasty", "Heart Bypass Surgery", "Valve Replacement", "Pacemaker Implantation",
    "Electrophysiology", "Echocardiography", "Cardiac Rehabilitation", "Heart Failure Clinic",
    "Coronary Artery Disease", "CABG", "TAVR", "Cardiac Imaging", "Stress Test",
    
    # Neurology & Neurosurgery
    "Stroke Unit", "Epilepsy Clinic", "Movement Disorders", "Dementia Clinic",
    "Headache Clinic", "Brain Surgery", "Spinal Surgery", "Deep Brain Stimulation",
    "Neuro-oncology", "Pediatric Neurology", "Neurophysiology", "Neuroradiology",
    
    # Orthopedics & Joint Care
    "Joint Replacement", "Hip Replacement", "Knee Replacement", "Shoulder Surgery",
    "Sports Medicine", "Arthroscopy", "Fracture Care", "Spine Care",
    "Pediatric Orthopedics", "Hand Surgery", "Foot and Ankle Surgery",
    "Orthopedic Trauma", "Bone Tumor Surgery", "Limb Reconstruction",
    
    # Obstetrics & Gynecology
    "Obstetrics", "High Risk Pregnancy", "Prenatal Care", "Labor and Delivery",
    "NICU", "Maternity Care", "Menopause Clinic", "Gynecological Oncology",
    "Urogynecology", "Minimally Invasive Gynecology", "Hysterectomy",
    "Laparoscopic Hysterectomy", "Cesarean Section", "Normal Delivery",
    
    # Oncology & Cancer Care
    "Medical Oncology", "Surgical Oncology", "Radiation Oncology", "Chemotherapy",
    "Immunotherapy", "Bone Marrow Transplant", "Cancer Screening", "Breast Cancer Care",
    "Lung Cancer Care", "Colorectal Cancer Care", "Prostate Cancer Care",
    "Hematology Oncology", "Pediatric Oncology", "Cancer Genetics",
    
    # Pediatrics & Child Care
    "Neonatology", "Pediatric Surgery", "Pediatric Cardiology", "Pediatric Neurology",
    "Pediatric Intensive Care", "PICU", "Pediatric Emergency", "Pediatric Gastroenterology",
    "Pediatric Endocrinology", "Pediatric Nephrology", "Pediatric Pulmonology",
    "Pediatric Orthopedics", "Pediatric Urology", "Vaccination", "Well Baby Clinic",
    "Child Development", "Pediatric Allergist",
    
    # Urology
    "Kidney Stone Treatment", "Prostate Surgery", "Urological Oncology",
    "Pediatric Urology", "Female Urology", "Andrology", "Male Infertility",
    "Erectile Dysfunction", "Bladder Surgery", "Kidney Transplant",
    "Urinary Incontinence", "TURP", "Nephrectomy", "Cystoscopy",
    
    # Nephrology & Kidney Care
    "Dialysis", "Hemodialysis", "Peritoneal Dialysis", "Kidney Transplant",
    "Chronic Kidney Disease", "Acute Kidney Injury", "Hypertension Management",
    
    # Gastroenterology
    "Endoscopy", "Colonoscopy", "ERCP", "Liver Disease", "Hepatology",
    "Inflammatory Bowel Disease", "IBD Clinic", "Liver Transplant",
    "Pancreatic Disorders", "Gastric Bypass", "Colorectal Surgery",
    
    # Bariatric and Gastric Procedures
    "Bariatric Procedures", "Bariatric Surgery", "Weight Loss Surgery",
    "Sleeve Gastrectomy", "Roux-en-Y Gastric Bypass", "Mini Gastric Bypass",
    "Sleeve Plus Procedure", "Gastrointestinal Surgeries", "Metabolic Surgery",
    
    # Laparoscopic Procedures
    "Laparoscopic Splenectomy", "Hydatid Cyst Liver Surgery", "Laparoscopic Cholecystectomy",
    "Laparoscopic CBD Exploration", "Laparoscopic Appendicectomy", "Laparoscopic Varicocelectomy",
    "Laparoscopic Adhesiolysis", "Laparoscopic Hellers cardiomyotomy", 
    "Laparoscopic Right/Left Hemicolectomy", "Laparoscopic Rectopexy",
    "Minimally Invasive Surgery", "Robotic Surgery", "Laparoscopy",
    
    # General Surgery
    "Whipple's Resection", "Pancreatic Surgery", "Esophagectomy", "Liver Resections",
    "Laparoscopic GJ", "Laparoscopic Intestinal anastomosis", "Laparocopic Gastric Resections",
    "Hepaticojejunostomy", "Intestinal fistulae surgeries", "Laparoscopic Nissen's Fundoplication",
    "Abdominal wall Reconstruction surgeries", "Gallbladder Surgery", "Appendectomy",
    "Mastectomy", "Lumpectomy", "Breast Surgery", "Thyroid Surgery",
    
    # Hernia Surgeries
    "Hernia Surgeries", "Hernia Repair", "Robotic Hernia Repairs", "Laparoscopic Hernia Repairs", 
    "Spigelian Hernia", "Umbilical Hernia", "Incisional Hernia", "Femoral Hernia", 
    "Ventral Hernia", "Inguinal Hernia", "Hiatal Hernia", "General Surgries",
    
    # Colorectal & Proctology
    "MIPH", "Stapled Haemorrhoidectomy", "Anal Fistulectomy", "Anal Fissure Surgery",
    "Pilonidal sinus Surgery", "Hemorrhoid Treatment", "Piles Treatment",
    "Fistula Surgery", "Colorectal Surgery", "Bowel Surgery",
    
    # Endocrine Surgery
    "Thyroidectomy", "Parathyroidectomy", "Parotidectomy", "Adrenal Surgery",
    
    # Pulmonology & Respiratory
    "Asthma Clinic", "COPD Management", "Bronchoscopy", "Lung Function Test",
    "Sleep Study", "Sleep Apnea Treatment", "Tuberculosis Treatment", "TB Clinic",
    "Chest Medicine", "Respiratory ICU", "Lung Transplant",
    
    # ENT (Ear, Nose, Throat)
    "Otology", "Rhinology", "Laryngology", "Head and Neck Surgery",
    "Tonsillectomy", "Adenoidectomy", "Sinus Surgery", "Ear Surgery",
    "Hearing Clinic", "Voice Clinic", "Cochlear Implant", "Septoplasty",
    
    # Ophthalmology & Eye Care
    "Cataract Surgery", "LASIK", "Glaucoma Treatment", "Retina Surgery",
    "Cornea Transplant", "Pediatric Ophthalmology", "Oculoplasty",
    "Vitreoretinal Surgery", "Squint Surgery", "Eye Trauma", "Low Vision Clinic",
    
    # Dermatology
    "Cosmetic Dermatology", "Hair Transplant", "Laser Treatment",
    "Vitiligo Treatment", "Psoriasis Treatment", "Acne Treatment",
    "Skin Cancer Treatment", "Dermatosurgery", "Aesthetic Dermatology",
    
    # Psychiatry & Mental Health
    "De-addiction Center", "Addiction Treatment", "Counseling",
    "Child Psychiatry", "Geriatric Psychiatry", "Psychotherapy",
    "Depression Treatment", "Anxiety Disorder Treatment", "Mental Health Clinic",
    
    # Rheumatology
    "Arthritis Clinic", "Rheumatoid Arthritis", "Lupus Treatment",
    "Osteoporosis Clinic", "Joint Pain Management",
    
    # Plastic & Reconstructive Surgery
    "Cosmetic Surgery", "Reconstructive Surgery", "Burn Surgery",
    "Hand Surgery", "Microvascular Surgery", "Craniofacial Surgery",
    "Breast Reconstruction", "Cleft Lip Surgery", "Hair Restoration",
    "Liposuction", "Rhinoplasty", "Facelift", "Tummy Tuck",
    
    # Dental & Oral Surgery
    "Oral Surgery", "Maxillofacial Surgery", "Dental Implants",
    "Orthodontics", "Periodontics", "Endodontics", "Prosthodontics",
    "Teeth Whitening", "Root Canal", "Dental Extraction",
    
    # Radiology & Imaging
    "CT Scan", "MRI", "X-Ray", "Ultrasound", "Mammography",
    "PET Scan", "Interventional Radiology", "Fluoroscopy",
    "Nuclear Medicine", "Bone Scan", "Digital Radiology",
    
    # Laboratory Services
    "Pathology", "Clinical Laboratory", "Blood Bank", "Microbiology",
    "Biochemistry", "Histopathology", "Cytopathology", "Molecular Diagnostics",
    "Genetic Testing", "NABL Accredited Lab",
    
    # Emergency & Critical Care
    "24x7 Emergency", "Trauma Center", "Accident & Emergency", "Casualty",
    "Critical Care Unit", "Intensive Care", "CCU", "ICCU", "MICU", "SICU",
    "Burns ICU", "Neuro ICU", "Cardiac ICU", "Pediatric ICU", "Neonatal ICU",
    "Emergency Medicine", "Ambulance Service", "Trauma Surgery",
    
    # Anesthesiology
    "Anesthesia", "Pain Clinic", "Regional Anesthesia", "Cardiac Anesthesia",
    "Pediatric Anesthesia", "Obstetric Anesthesia",
    
    # Physical Medicine & Rehabilitation
    "Physiotherapy", "Occupational Therapy", "Speech Therapy",
    "Rehabilitation Medicine", "Sports Rehabilitation", "Cardiac Rehabilitation",
    "Neuro Rehabilitation", "Pediatric Rehabilitation", "Prosthetics and Orthotics",
    
    # Infectious Diseases
    "Infectious Disease", "HIV/AIDS Treatment", "Infection Control",
    "Tropical Medicine", "Travel Medicine",
    
    # Geriatrics
    "Geriatric Medicine", "Elderly Care", "Geriatric Psychiatry",
    
    # Allergy & Immunology
    "Allergy Testing", "Immunotherapy", "Allergist", "Asthma and Allergy",
    
    # Andrology & Sexual Health
    "Andrology", "Sexual Dysfunction", "Male Infertility Clinic",
    
    # Reproductive Medicine
    "IVF", "ICSI", "Assisted Reproduction", "Fertility Clinic",
    "Reproductive Endocrinology", "Surrogacy", "Egg Freezing",
    "Sperm Bank", "Infertility Treatment",
    
    # Genetics & Genomics
    "Genetic Counseling", "Prenatal Genetics", "Cancer Genetics",
    
    # Preventive Health
    "Health Checkup", "Executive Health Checkup", "Preventive Medicine",
    "Vaccination Center", "Wellness Center", "Health Screening",
    
    # Specialized Clinics
    "Diabetic Foot Clinic", "Wound Care", "Ostomy Care",
    "Anticoagulation Clinic", "Thyroid Clinic", "Breast Clinic",
    "Memory Clinic", "Fall Prevention Clinic", "Continence Clinic",
    
    # Transplant Services
    "Organ Transplant", "Liver Transplant", "Kidney Transplant",
    "Heart Transplant", "Lung Transplant", "Bone Marrow Transplant",
    "Cornea Transplant", "Transplant Surgery",
    
    # Vascular Surgery
    "Varicose Veins", "Aneurysm Surgery", "Carotid Surgery",
    "Peripheral Vascular Disease", "Diabetic Foot Surgery",
    "Vascular Access", "Endovascular Surgery",
    
    # Interventional Procedures
    "Interventional Cardiology", "Interventional Radiology",
    "Interventional Neuroradiology", "Interventional Pulmonology",
    
    # Day Care Services
    "Day Care Surgery", "Day Care Chemotherapy", "Dialysis Day Care",
    
    # Other Services
    "MIS for Other health problems", "Telemedicine", "Home Care",
    "Palliative Care", "Hospice Care", "Medical Tourism",
    "International Patient Services", "Pharmacy", "Medical Social Services",
    "Patient Education", "Clinical Research", "Clinical Trials"
]

# ==========================
# GOOGLE PLACES HELPERS
# ==========================
async def get_nearby_hospitals(lat, lon, radius):
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lon}&radius={radius}&type=hospital&key={API_KEY}"
    hospitals = []
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            data = await response.json()
    for place in data.get("results", []):
        hospitals.append({
            "name": place.get("name"),
            "address": place.get("vicinity"),
            "latitude": place["geometry"]["location"]["lat"],
            "longitude": place["geometry"]["location"]["lng"],
            "place_id": place.get("place_id"),
        })
    return hospitals[:25]


async def get_place_details(place_id, session):
    fields = "displayName,formattedAddress,internationalPhoneNumber,websiteUri,rating,userRatingCount,types,location"
    url = f"https://places.googleapis.com/v1/places/{place_id}?fields={fields}"
    headers = {"X-Goog-Api-Key": API_KEY, "X-Goog-FieldMask": fields}
    try:
        async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
            if response.status != 200:
                return {}
            d = await response.json()
            return {
                "name": d.get("displayName", {}).get("text"),
                "address": d.get("formattedAddress"),
                "phone": d.get("internationalPhoneNumber"),
                "website": d.get("websiteUri"),
                "rating": d.get("rating"),
                "types": d.get("types", []),
                "latitude": d.get("location", {}).get("latitude"),
                "longitude": d.get("location", {}).get("longitude"),
            }
    except Exception:
        return {}

# ==========================
# DISTANCE & SERVICE OVERLAP
# ==========================
def haversine_distance(origin, destination):
    lat1, lon1 = origin
    lat2, lon2 = destination
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1))*math.cos(math.radians(lat2))*math.sin(dlon/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

def compute_service_overlap(competitor_services):
    overlap = set(competitor_services) & set(YOUR_SERVICES)
    overlap_percent = (len(overlap) / len(YOUR_SERVICES)) * 100
    return round(overlap_percent, 1), list(overlap)

# ==========================
# DIGITAL FOOTPRINT ANALYZER
# ==========================
async def scan_digital_footprint(url):
    result = {
        "url": url,
        "website_reachable": False,
        "phones": [],
        "chat_widgets": [],
        "whatsapp_present": False,
        "appointment_links": [],
        "digital_footprint_score": 0,
        "activity_level": "Low Active"
    }

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=HEADLESS)
        page = await browser.new_page()
        try:
            await page.goto(url, timeout=TIMEOUT)
            result["website_reachable"] = True
            await page.wait_for_load_state("networkidle", timeout=10000)
            html = await page.content()
        except Exception:
            await browser.close()
            return result
        await browser.close()

    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text(" ", strip=True).lower()

    # phone numbers
    phones = re.findall(r'\+91\d{10}|\b\d{10}\b', text)
    result["phones"] = list(set(phones))

    # chat detection
    chat_markers = ["intercom","tawk.to","livechat","drift","zendesk","freshchat","chatbot"]
    result["chat_widgets"] = [m for m in chat_markers if m in html.lower()]

    # whatsapp
    result["whatsapp_present"] = any(k in html.lower() for k in ["wa.me","api.whatsapp.com","whatsapp"])

    # appointment links
    result["appointment_links"] = [a["href"] for a in soup.find_all("a", href=True) if any(k in a["href"].lower() for k in ["book","appointment"])]

    # compute score
    score = 0
    if result["website_reachable"]: score += 20
    if len(result["phones"]) == 1: score += 20
    if result["chat_widgets"]: score += 20
    if result["whatsapp_present"]: score += 20
    if result["appointment_links"]: score += 20

    result["digital_footprint_score"] = score
    result["activity_level"] = "Highly Active" if score >= 80 else ("Moderately Active" if score >= 60 else "Low Active")
    return result

# ==========================
# SERVICE EXTRACTION
# ==========================
async def fetch_html(url, session):
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as r:
            if r.status == 200:
                return await r.text()
    except Exception:
        return ""
    return ""

async def extract_services_from_site(base_url, session):
    html = await fetch_html(base_url, session)
    if not html:
        return []

    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text(" ", strip=True)
    found = set()

    for term in SERVICE_KEYWORDS:
        if re.search(rf"\b{term}\b", text, re.IGNORECASE):
            found.add(term)

    # also crawl internal "service" pages in parallel
    domain = urlparse(base_url).netloc
    links = [urljoin(base_url, a["href"]) for a in soup.find_all("a", href=True)]
    links = [l for l in links if urlparse(l).netloc == domain and any(k in l.lower() for k in ["service","special","treatment","care"])]
    
    # Fetch all links in parallel
    tasks = [fetch_html(link, session) for link in links[:CRAWL_LIMIT]]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    for inner in results:
        if not inner or isinstance(inner, Exception): 
            continue
        for term in SERVICE_KEYWORDS:
            if re.search(rf"\b{term}\b", inner, re.IGNORECASE):
                found.add(term)

    return sorted(list(found)) if found else ["General Medicine", "Emergency", "Diagnostics"]

# ==========================
# PROCESS SINGLE HOSPITAL
# ==========================
async def process_hospital(h, lat, lon, session):
    try:
        details = await get_place_details(h["place_id"], session)
        if not details or not details.get("website"):
            return None

        distance = round(haversine_distance((lat, lon), (details["latitude"], details["longitude"])), 2)
        
        # Run digital footprint and service extraction in parallel
        digital, services = await asyncio.gather(
            scan_digital_footprint(details["website"]),
            extract_services_from_site(details["website"], session),
            return_exceptions=True
        )
        
        # Handle exceptions
        if isinstance(digital, Exception):
            digital = {"digital_footprint_score": 0, "activity_level": "Low Active", "phones": []}
        if isinstance(services, Exception):
            services = ["General Medicine", "Emergency", "Diagnostics"]
        
        overlap_pct, overlap_services = compute_service_overlap(services)

        return {
            "name": details["name"],
            "address": details["address"],
            "distance_km": distance,
            "phone": details["phone"],
            "website": details["website"],
            "rating": details["rating"],
            "services_detected": services,
            "service_overlap_percentage": overlap_pct,
            "overlapping_services": overlap_services,
            "digital_footprint_score": digital["digital_footprint_score"],
            "activity_level": digital["activity_level"],
            "phones": digital["phones"]
        }
    except Exception:
        return None

# ==========================
# MAIN ANALYSIS FUNCTION
# ==========================
@app.get("/analyze")
async def analyze_hospitals(
    lat: float = Query(..., description="Latitude of your hospital"),
    lon: float = Query(..., description="Longitude of your hospital"),
    radius: int = Query(2000, description="Search radius in meters (default 2km)")
):
    hospitals = await get_nearby_hospitals(lat, lon, radius)
    
    async with aiohttp.ClientSession() as session:
        # Process up to 15 hospitals in parallel
        tasks = [process_hospital(h, lat, lon, session) for h in hospitals[:15]]
        results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Filter out None values and exceptions
    results = [r for r in results if r is not None and not isinstance(r, Exception)]

    return {"total_competitors": len(results), "competitors": results}
