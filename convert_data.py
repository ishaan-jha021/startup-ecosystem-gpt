import csv
import json
import re

csv_data = """Name,Type,Address,Contact & Website,Startups Incubated,Notable Portfolio,Equity Taken,Fee,Funding Guarantee,Investor Access,Conf. Hall Capacity,Call Booths,Seating Scalability,Program Structure,Brand Value,Ideal Stage,Founder Freedom,Time Lock-in
Venture Catalysts (VCats),Private Accelerator & VC,"Mittal Commercia, Andheri East",venturecatalysts.in,300+ Funded,"BharatPe, Beardo, Innov8",5–10%,NIL,Yes (If selected),10,20-30,Yes,Low,90-Day Acceleration Cohort,9,Seed → Series A,6,Yes
JIIF (JITO Incubation),Angel Network + Incubator,"MIDC Marol, Andheri East",jitojiif.com,110+ Invested,"BluSmart, Fasal, ChargeGrid",3% or Deal-based,Membership,Yes (Post-pitch),9,20-30,Yes,Low,JIIF Cohorts,8,Pre-Seed → Seed,7,No
TiE Mumbai,Angel Network & Incubator,"Sahana Enclave, Bandra West",mumbai.tie.org,Hundreds Mentored,Sector Agnostic,Deal-based,Membership,No (Pitch-based),10,50+,Yes,Medium,Charter Mentorship,10,Pre-Seed → Series A,8,No
SP-TBI (Sardar Patel TBI),Academic / Govt-Backed (DST),"Bhavans Campus, Andheri West",sptbi.com,100+ Incubated,"AAS Vidyalaya, Smowcode",2-5%,Subsidized,Yes (DST Seed Fund),8,50+,Yes,Medium,Incubation & Commercialization,8,Idea → Seed,8,Yes
AIC-NMIMS,Govt-Backed (NITI Aayog),"V L Mehta Road, Vile Parle West",aic.nmims.edu,50+ Incubated,"Websites.co.in, EdTech",0–2%,NIL,Grants (Startup India),8,100+,Limited,Medium,Launchpad Program,8,Idea → Pre-Seed,7,Yes
Zone Startups India (BIL Ryerson),Institutional Accelerator,"18th Floor, BSE Building, Fort",india.zonestartups.com,414 Accelerated,"Focus on FinTech, RegTech",4–8% (Program dependent),NIL,Yes (Seed Fund Access),10,50+,Yes,Medium,Cohort-based,10,Seed → Series A,7,Yes
WebEngage Startup Program,Corporate Accelerator,Goregaon East,webengage.com,Early-stage tech,"B2B SaaS, MarTech",Credits-based,NIL,Yes (Scale Support),8,50+,Yes,Medium,6-Month Scale-up,8,Early → Seed,8,Yes
India SME Accelerator Network,Private SME Accelerator,"Workafella, SV Road, Goregaon West",indiasmeaccelerator.org,MSME Cohorts,SME & Manufacturing Tech,NIL (Fee-based),Paid (Program Fee),No (Scale-up Focus),7,50+,Yes,Medium,Owners Growth Accelerator,7,Early → Growth (MSME),9,No
AIC-RMP,Govt-Backed (NITI Aayog),Thane District / MMR,aic-rmp.org,100+ Incubated,"Agriculture, Education, ICT",Deal-based,Subsidized,Yes (Grants & Seed Fund),9,50+,Yes,Medium,Pre-Incubation to Scale-up,8,Idea → Seed,8,Yes
SPJIMR WISE Tech,B-School Accelerator,"SPJIMR Campus, Andheri West",wisetech@spjimr.org,Cohort 5 Active,Early-stage tech,NIL,NIL,Cloud Credits Only,7,100+,Yes,Medium,3-Month Cohort,9,Pre-Seed → Seed,8,Yes
thinQbate,Private Micro-VC,"Marol, Andheri East",info@thinqbate.com,29+ Investments,"HealthTech, SaaS",5–15%,NIL,Yes,7,20,Yes,Low,Conveyor Belt Model,7,Pre-Seed,9,No
DJSCE IIC,Academic (MoE Cell),Vile Parle West,djsce.ac.in,Academic Prototypes,"Healthcare, IT",NIL,NIL,No,4,100+,No,Low,Academic,5,Student / Idea,9,No
Thakur Incubation Centre,Academic (MSME Host),"Thakur Village, Kandivali East",tcetmumbai.in,Academic Prototypes,Grassroots Hardware,NIL,NIL,No,3,100+,No,High,Project-based,5,Student / Idea,9,No
SFIT IIC (St. Francis),Academic (MoE Cell),"Mt. Poinsur, Borivali West",sfit.ac.in,Student Prototypes,Embedded Systems,NIL,NIL,No,3,100+,No,Low,Hackathon/Academic,4,Student / Idea,9,No
Dalmia Lions IIC,Academic (College IIC),Malad West,dalmialionscollege.ac.in,Student Prototypes,Commerce Concepts,NIL,NIL,No,3,100+,No,Low,Academic,4,Student / Idea,9,No
IES Innovation & Incubation Centre,Academic (College IIC),"IES MCRC Campus, Bandra West",mcrc.ies.edu,20+ Innovative Projects,Early Academic Prototypes,NIL,NIL,Grants / Pitch-based,5,50+,No,Low,Academic & Prototyping,6,Student / Idea,9,No
Amity Innovation Incubator,Virtual / Academic Incubator,"Amity Global Business School, Malad West",info@aii.amity.edu,Student Prototypes,Tech & Business Services,NIL,NIL,Amity Fund Access,6,50+,No,High,Virtual Incubation,7,Student / Idea,9,No
MET Incubation Centre,Academic / Trust Incubator,"Bhujbal Knowledge City, Bandra West",met.edu,Recently Launched,Student & Faculty Prototypes,NIL,NIL,No (Mentorship Focus),6,50+,No,High,Academic / Idea Validation,6,Student / Idea,9,No
CIBA (Centre for Incubation),Govt-Backed (DST),"Fr Agnel Education Complex, Vashi",ciba.org.in,100+ Incubated,"Tech, Hardware, SaaS",Deal-based,Subsidized,Yes (Seed Fund),8,100+,Yes,High,Incubation & Rapid Prototyping,8,Idea → Seed,8,Yes
CETIBA (India SME Forum),Govt-Backed Incubator (MSME),"Veera Desai Road, Andheri West",indiasmeforum.org,SME & Tech Startups,Sector Agnostic / SME Innovations,Deal-based,Subsidized,Grants (Up to ₹1Cr),8,50+,Yes,Medium,Up to 3-Year Incubation,8,Idea → Pre-Seed,7,Yes
KG Mittal College Incubation Centre,Academic (College IIC),"Nahar Nagar, Malad West",kgmittalcollege.edu.in,Student Prototypes,Academic Concepts,NIL,NIL,No (Grants Guidance),3,50+,No,Low,6-Month Academic Incubation,4,Student / Idea,9,No
AIC-NIFIE (IIM Mumbai),Govt-Backed (NITI Aayog),"IIM Mumbai Campus, Powai",aic-nifie.com,40+ Mentored,"Supply Chain, Mfg & DeepTech",2–5%,Subsidized,Yes (Startup India Seed Fund),9,100+,Limited,Medium,Spark Pre-incubation,9,Idea → Pre-Seed,8,Yes
SPJIMR FinNovate Accelerator,B-School FinTech Accelerator,"SPJIMR Campus, Andheri West",spjimr.org,Early-traction FinTechs,FinTech / TechFin MVPs,NIL (Equity-Free),NIL,"Up to $600,000 in Credits",9,100+,Yes,Medium,1-on-1 Mentoring,9,MVP / Early-Traction,7,Yes
PTVAIM COEI,Academic Incubator (MoE IIC),"PTVAIM Campus, Vile Parle East",ptvaim.ac.in,15+ Graduated,Academic Prototypes,NIL,NIL,Seed Fund for Pitch Winners,6,50+,No,Low,Pre-incubation & Incubation,6,Student / Idea,9,No
WISE SNDTWU Incubation Centre,Govt-Backed (MSInS/SIDBI),"SNDT Juhu Campus, Santacruz West",wisesndtwu.org,Women-led Startups,EvolutioNari Cohort,Deal-based,Subsidized,Yes (Grants & SIDBI Support),8,50+,Yes,Medium,Women Entrepreneurship,8,Idea → Early Stage,8,Yes
100Unicorns (Formerly 9Unicorns),Private Accelerator / Micro-VC,"Times Square, Andheri East",100unicorns.in,100+ per year,"VideoVerse, Shiprocket",5-7%,NIL,Yes (Upfront Seed Check),10,100+,Yes,Low,VC Acceleration Cohorts,10,Pre-Seed → Seed,8,No
RISE Accelerator (Barclays),Corporate FinTech Accelerator,Lower Parel,home.barclays / rise,10 per cohort,"Customer XPS, CrediWatch",NIL (Equity-Free),NIL,Barclays POC Onboarding,10,100+,Yes,High,18-Week FinTech Cohort,10,Pre-Seed → Seed,8,Yes
Alsisar Impact Foundation,Impact Incubator,"World Trade Centre-1, Cuffe Parade",alsisarimpact.com,25+ Social Enterprises,Global Impact Portfolio,Deal-based,NIL,Connects to Impact Capital,9,20-30,Yes,Low,Social Enterprise Scaling,8,Seed → Growth,8,No
Dr. A.P.J. Abdul Kalam Incubation Centre,Healthcare / Academic Incubator,"Old Prabhadevi Road, Worli",apjerc.org.in,Early HealthTech,MedTech Prototypes,Deal-based / Equity,Subsidized,Seed Fund Access,7,50+,No,Medium,3-Stage Pre-incubation,7,Idea → Pre-Seed,8,No
ISME ACE,Private FinTech Accelerator,"One Indiabulls, Lower Parel",ismeace.com,14+ Investments,"Trendlyne, Moneytor",5–8%,NIL,Seed Funding ($25k-$100k),8,50+,Yes,Medium,FinTech Venture Building,8,Seed,7,Yes
Antfarm Business Incubator,Venture Builder / Studio,"Metro Dome, M G Road, Churchgate",Private / Selective,Select Consumer Tech,High (Venture Studio),NIL,Internal Capital Deployments,7,20+,Yes,Low,In-house Venture Building,6,Idea,5,Yes,
KEC International Corporate Incubator,Corporate Innovation Lab,"RPG House, Worli",kecin.com,Corporate Pilot Focused,Infra & Supply Chain Tech,NIL (Vendor/POC model),NIL,Corporate Vendor Contracts,5,50+,Yes,Low,Corporate Pilot Integration,9,Seed → Series A,6,Yes
Jai Hind College Incubator (IAC),Academic Incubator,"Jai Hind College Campus, Churchgate",jaihindcollege.com,20+ Mentored,Student & Academic Prototypes,NIL,NIL,No (Network Focus),6,50+,No,Medium,Pre-Incubation & Mentoring,7,Student / Idea,9,No
WTC Mumbai Centre for Incubation,Global Trade / Corporate,"World Trade Centre, Cuffe Parade",wtcmumbai.org,Recently Launched,Trade & Early-stage tech,NIL,Subsidized,No (Global Market Access),8,100+,Yes,High,Structured Guidance,9,Idea → Early Stage,8,No
UnLtd India,Social Enterprise Incubator,"Court Chambers, New Marine Lines",unltdindia.org,300+ Supported,"PadCareLabs, ReCircle",NIL (Grant-based),NIL,Grants / Philanthropic Capital,8,20-30,Yes,Medium,9-Month Cohort,9,Idea → Seed (Impact),8,Yes
JioGenNext (Reliance),Corporate Accelerator,"Reliance Ecosystem, Worli",jiogennext.com,170+ Accelerated,"LogiNext, Miko, Headout",NIL (Equity-Free),NIL,Reliance POC / Investment Access,10,100+,Yes,High,4-Week Basecamp + Scale-up,10,Seed → Series A,7,Yes
ah! Ventures,Angel Network & Accelerator,"Naman Midtown, Lower Parel",ahventures.in,50+ Funded,"Ketto, Testbook",Deal-based,Membership,No (Pitch-based),10,50+,Yes,Medium,Pitch Days & Acceleration,9,Seed → Growth,8,No
FWC Incubator (Famous Studios),Media/Creative Incubator,"Famous Studios, Mahalaxmi",famousstudios.com,Niche Media Startups,"Media, Film & Content Creators",Deal-based,Paid (Flexi-desk),No (Infrastructure Focus),6,50+,Yes,Low,Content Prototyping,8,Idea → Early,9,No
100X.VC,Micro-VC & Accelerator,Churchgate / Nariman Point,100x.vc,100+ per year,"Pocketly, Recordent",7% (iSAFE Note),NIL,Yes (₹1.25 Cr upfront),10,Varies,Yes,Low,Intense Masterclass Cohorts,10,Pre-Seed,9,No
India Accelerator,Private Accelerator / Micro-VC,Fort Area,indiaaccelerator.co,150+ Accelerated,Insurance Samadhan,Deal-based,NIL,Yes (Seed Fund Access),9,50+,Yes,Medium,16-Week Structured Cohort,9,Seed,7,Yes
Viridian Accelerator (V@C),Private Accelerator,Nariman Point,viridian.vc,50+ Accelerated,Sector Agnostic,Deal-based,NIL,No (Investor Connects),8,50+,Yes,Medium,Enablement & Scale-up,8,Early → Growth,8,Yes
WaveX Media-Tech Incubator,Govt-Backed (IICT),"NFDC Complex, South Mumbai",pib.gov.in,15 in First Cohort,"AVGC-XR, Gaming, Animation",Deal-based,Subsidized,Yes (Access to ₹50Cr Pool),9,50+,Yes,Medium,Creative Tech Incubation,9,Idea → Early Stage,8,Yes
Startup Réseau,Enterprise Accelerator Operator,Mumbai (Multiple Corporate Hubs),startupreseau.com,100+ (Across Programs),\"B2B, Enterprise, FinTech\",Deal-based,NIL,No (Corporate Pilot Focus),9,Varies,Yes,Varies,Corporate & Govt Innovation,9,Seed → Series A,7,Yes
SINE (IIT Bombay),Deep-Tech / NIDHI-TBI,"IIT Bombay Campus, Powai",sineiitb.org,200+ Incubated,"IdeaForge, BillDesk",2–6%,Subsidized,"Yes (TIDE 2.0, NIDHI, SISFS)\",10,100+,Yes,High,Long-term Tech Validation,10,Idea → Series A,8,Yes
riidl (Somaiya Vidyavihar),BioNEST / NIDHI-TBI,Vidyavihar East,riidl.org,150+ Incubated,"Karkhana.io, Microlyte",2-5%,Subsidized,"Grants (BIRAC, NIDHI-PRAYAS)\",9,50+,Yes,Medium,Maker Lab & Acceleration,9,Prototype → Seed,8,No
SIES Incubation Centre,Academic Incubator,"Sector 5, Nerul, Navi Mumbai",siesincubationcentre.in,Student & Early Stage,Sector Agnostic,NIL,Subsidized,No (Network Focus),6,50+,No,Medium,Business Plan & Hackathons,6,Student / Idea,9,No
CIII Kharghar,Govt/Corporate Backed,"Kharghar, Navi Mumbai",rayatciii.org,Early Stage Tech,"AgriTech, IT, BioTech",Deal-based,Subsidized,Yes (Funding Access),7,50+,Yes,Medium,Skill Training & Incubation,7,Idea → Seed,8,Yes
FHealth Accelerator,Private VC Accelerator,Thane,fhealth.vc,HealthTech & Agri,"Desi Farms, Mykare Health",Deal-based (Equity),NIL,Yes (Seed & Series A),8,Varies,Yes,Low,VC Acceleration,7,Seed → Series A,7,No
Marwari Catalysts (MCats),Private Accelerator / VC,"WeWork BKC, Bandra East",marwaricatalysts.com,100+ Funded,FinTech & EdTech Focus,Deal-based,NIL,Yes (Day 1 Signal Funding),10,Varies,Yes,Low,3-Month Rigorous Cohort,9,Pre-Seed → Seed,8,Yes
BITSoM AI Accelerator,Academic / Enterprise AI,"BITSoM Campus, MMR",bitsom.edu.in,Launching April 2026,AI & Enterprise Automation,Deal-based,NIL,Yes (Silicon Valley Connect),10,100+,Yes,High,90-Day AI Venture Lifecycle,10,Idea → MVP,7,Yes
Sygnia Forge,Private Accelerator,Navi Mumbai,sygniaforge.com,Early Stage Cohorts,Sector Agnostic,Deal-based,NIL,No (Investor Connects),7,50+,Yes,Medium,Mentorship & Go-to-Market,6,Idea → Seed,8,No
VJTI-TBI,Academic / Govt-Backed,"VJTI Campus, Matunga",vjti.ac.in,Academic Prototypes,Tech & Engineering Innovations,0-2%,Subsidized,Yes (Startup India Seed Fund),8,50+,No,Low,Quarterly Cohorts,9,Idea → Pre-Seed,8,Yes
ICT-NICE (S.M. Mokashi),Govt-Backed (NIDHI-iTBI),"ICT Campus, Matunga",ictnice.in,17+ Pre-incubated,Green Shift Energy,Deal-based,Subsidized,Yes (DBT-BIRAC & NIDHI Grants),8,50+,Yes,Medium,Pre-incubation & Incubation,9,Idea → Seed,8,Yes
Arka Venture Labs,Private Cross-Border Accelerator,"Jetha Compound, Byculla East",arka.vc,B2B Tech Startups,Cross-border B2B Tech,Deal-based,NIL,Yes (Seed Fund),9,Varies,Yes,Low,Silicon Valley Access,8,Seed → Early Stage,7,Yes
MetaMorph,Venture Studio / HR Accelerator,"Raheja Xion, Byculla East",metamorph.work,Talent-focused Incubation,1HR.market,Deal-based,NIL,No (Talent Capital),7,Varies,Yes,Low,Talent & Brand Incubation,7,Idea → Seed,6,No"""

def get_sub_region(address):
    address = address.lower()
    west_keywords = ["andheri west", "vile parle west", "bandra west", "kandivali west", "borivali west", "malad west", "santacruz west", "juhu", "worli", "prabhadevi", "mahalaxmi", "bandra east", "khar"]
    east_keywords = ["andheri east", "goregaon east", "powai", "vidyavihar", "ghatkopar", "thane", "mulund", "kanjurmarg", "vikhroli", "marol", "seepz", "mittall commercia"]
    south_keywords = ["fort", "churchgate", "nariman point", "lower parel", "byculla", "cuffe parade", "prabhadevi", "worli", "mahalaxmi", "colaba"]
    central_keywords = ["matunga", "dadar", "parel", "wadala", "sion"]
    navi_mumbai_keywords = ["vashi", "nerul", "kharghar", "belapur", "kopar khairane", "ghansoli", "airoli", "navi mumbai"]

    if any(x in address for x in west_keywords):
        if "andheri east" in address or "goregaon east" in address or "powai" in address or "vidyavihar" in address or "ghatkopar" in address:
            return "East Mumbai"
        return "West Mumbai"
    
    if any(x in address for x in east_keywords):
        return "East Mumbai"
    
    if any(x in address for x in south_keywords):
        return "South Mumbai"
    
    if any(x in address for x in central_keywords):
        return "Central Mumbai"
    
    if any(x in address for x in navi_mumbai_keywords):
        return "Navi Mumbai"
    
    if "thane" in address:
        return "Thane / MMR"
        
    # Heuristics based on common areas
    if "andheri" in address: return "West Mumbai" if "west" in address else "East Mumbai"
    if "goregaon" in address: return "East Mumbai" if "east" in address else "West Mumbai"
    if "bk" in address or "bandra kurla" in address: return "West Mumbai"
    if "fort" in address or "marine lines" in address or "churchgate" in address or "nariman point" in address: return "South Mumbai"
    
    return "Other Mumbai"

def get_broad_type(provider_type):
    provider_type = provider_type.lower()
    if any(x in provider_type for x in ["govt", "govt-backed", "moe", "msme", "niti", "iit", "iim", "vjti", "ict", "academic"]):
        return "Government / Academic"
    return "Private"

def get_equity_category(equity):
    equity = equity.lower()
    if any(x in equity for x in ["nil", "zero", "0%"]):
        return "Zero Equity"
    return "Equity Taken"

reader = csv.DictReader(csv_data.splitlines())
results = []

for row in reader:
    item = {
        "id": re.sub(r'[^a-z0-9]+', '-', row["Name"].lower()).strip('-'),
        "name": row["Name"],
        "type": row["Type"],
        "broadType": get_broad_type(row["Type"]),
        "area": row["Address"],
        "subRegion": get_sub_region(row["Address"]),
        "contactDetails": row["Contact & Website"],
        "incubationExperience": row["Startups Incubated"],
        "lastFiveIncubations": row["Notable Portfolio"],
        "equityTaken": row["Equity Taken"],
        "equityCategory": get_equity_category(row["Equity Taken"]),
        "fee": row["Fee"],
        "fundingGuarantee": row["Funding Guarantee"],
        "investorAccess": row["Investor Access"],
        "confHallCapacity": row["Conf. Hall Capacity"],
        "callBooths": row["Call Booths"],
        "seatingScalability": row["Seating Scalability"],
        "programStructure": row["Program Structure"],
        "brandValue": row["Brand Value"],
        "idealStage": row["Ideal Stage"],
        "founderFreedom": row["Founder Freedom"],
        "timeLockIn": row["Time Lock-in"]
    }
    results.append(item)

# print(json.dumps(results, indent=4))
with open("d:\\Startup Ecosystem GPT\\lib\\data\\western_line.js", "w", encoding="utf-8") as f:
    f.write("export const westernLineData = ")
    json.dump(results, f, indent=4)
    f.write(";")
