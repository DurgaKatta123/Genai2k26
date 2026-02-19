// API Service Layer for KrishiSahay
import { GoogleGenerativeAI } from '@google/generative-ai';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// ─── GROQ Chat API ──────────────────────────────────────────────────────────
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1/chat/completions';

const AGRI_SYSTEM_PROMPT = `You are KrishiSahay, an expert agricultural assistant for Indian farmers. 
You have deep knowledge of:
- Crop cultivation (Kharif, Rabi, Zaid crops)
- Pest and disease management
- Fertilizers (NPK, organic, bio-fertilizers)
- Government schemes (PM-KISAN, Fasal Bima Yojana, Kisan Credit Card, etc.)
- Soil health and irrigation techniques
- Market prices and MSP (Minimum Support Price)
- Weather-based farming advice
- Organic farming and sustainable agriculture

Always respond in a helpful, simple manner suitable for farmers.
If the user writes in Hindi, respond in Hindi. If in Telugu, respond in Telugu.
Provide practical, actionable advice. Use bullet points for clarity.
Always mention safety precautions when discussing pesticides or chemicals.
Format your responses with clear sections using **bold** for headers.
Do NOT mention AI model names, company names, or technical details in your responses.`;

export async function askGroq(messages, language = 'en') {
    let systemPrompt = AGRI_SYSTEM_PROMPT;
    if (language === 'hi') systemPrompt += '\n\nIMPORTANT: Always respond in Hindi (Devanagari script).';
    if (language === 'te') systemPrompt += '\n\nIMPORTANT: Always respond in Telugu (తెలుగు script).';

    const response = await fetch(GROQ_BASE_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages,
            ],
            temperature: 0.7,
            max_tokens: 1024,
        }),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Service unavailable. Please try again.');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// ─── Gemini Vision API (using SDK to avoid CORS) ─────────────────────────────
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function analyzeImageWithGemini(base64Image, mimeType = 'image/jpeg') {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an expert agricultural plant pathologist and crop scientist helping Indian farmers.
Analyze this crop/plant image and provide a comprehensive diagnosis in simple language:

1. **Plant/Crop Identification**: What crop or plant is this?
2. **Health Status**: Is the plant healthy or diseased?
3. **Disease/Pest Identification** (if any): 
   - Name of disease/pest (in simple terms)
   - Severity (Mild/Moderate/Severe)
4. **Symptoms Observed**: Describe visible symptoms
5. **Causes**: What causes this condition?
6. **Treatment & Cure**:
   - Immediate actions
   - Chemical treatments (with dosage)
   - Organic/natural remedies
7. **Prevention**: How to prevent this in future
8. **Yield Impact**: Expected impact on yield if untreated
9. **Recommended Action**: Urgency level and next steps

If the image is not of a plant/crop, politely say so and ask for a plant image.
Be specific, practical, and farmer-friendly. Use simple language.`;

    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: mimeType,
        },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    return response.text();
}

// ─── Weather API ─────────────────────────────────────────────────────────────
export async function getWeather(city = 'Delhi') {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather data unavailable');
    return response.json();
}

export async function getWeatherForecast(city = 'Delhi') {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric&cnt=5`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Forecast unavailable');
    return response.json();
}

// ─── Government Schemes API (data.gov.in) ────────────────────────────────────
const GOV_API_KEY = '579b464db66ec23bdd000001e994c89d42c74da65b540e8f107a9a39';

export async function getGovtSchemes() {
    // Resource ID for schemes by Dept of Agriculture, Cooperation & Farmers Welfare
    const resourceId = 'b4e6b503-05e5-4e4e-8e53-4b4a7f6e3e3e';
    const url = `https://api.data.gov.in/resource/${resourceId}?api-key=${GOV_API_KEY}&format=json&limit=20`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        if (data.records && data.records.length > 0) return data.records;
        throw new Error('No records');
    } catch {
        // Return static schemes data as fallback
        return STATIC_SCHEMES;
    }
}

// ─── Market Prices API ───────────────────────────────────────────────────────
export async function getMarketPrices(state = 'Maharashtra', commodity = '') {
    const baseUrl = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
    const params = new URLSearchParams({
        'api-key': GOV_API_KEY,
        format: 'json',
        limit: 20,
        'filters[state]': state,
    });
    if (commodity) params.append('filters[commodity]', commodity);

    const response = await fetch(`${baseUrl}?${params}`);
    if (!response.ok) throw new Error('Market data unavailable');
    const data = await response.json();
    return data.records || [];
}

// ─── Utility: Convert file to base64 ─────────────────────────────────────────
export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ─── Static Schemes Data ──────────────────────────────────────────────────────
export const STATIC_SCHEMES = [
    {
        name: 'PM-KISAN',
        nameHi: 'पीएम-किसान',
        nameTe: 'పీఎం-కిసాన్',
        category: 'Income Support',
        amount: '₹6,000/year',
        desc: 'Direct income support of ₹6,000 per year to all farmer families in 3 installments of ₹2,000.',
        descHi: 'सभी किसान परिवारों को ₹6,000 प्रति वर्ष की प्रत्यक्ष आय सहायता, ₹2,000 की 3 किस्तों में।',
        descTe: 'అన్ని రైతు కుటుంబాలకు సంవత్సరానికి ₹6,000 నేరుగా ₹2,000 చొప్పున 3 వాయిదాలలో.',
        eligibility: 'All small and marginal farmers with cultivable land',
        link: 'https://pmkisan.gov.in',
        icon: '💰', color: '#4ade80',
    },
    {
        name: 'PM Fasal Bima Yojana',
        nameHi: 'पीएम फसल बीमा योजना',
        nameTe: 'పీఎం పంట బీమా యోజన',
        category: 'Crop Insurance',
        amount: '1.5-5% Premium',
        desc: 'Comprehensive crop insurance covering natural calamities, pests, and diseases.',
        descHi: 'प्राकृतिक आपदाओं, कीटों और बीमारियों को कवर करने वाला व्यापक फसल बीमा।',
        descTe: 'సహజ విపత్తులు, తెగుళ్ళు మరియు వ్యాధులను కవర్ చేసే సమగ్ర పంట బీమా.',
        eligibility: 'All farmers growing notified crops',
        link: 'https://pmfby.gov.in',
        icon: '🛡️', color: '#60a5fa',
    },
    {
        name: 'Kisan Credit Card',
        nameHi: 'किसान क्रेडिट कार्ड',
        nameTe: 'కిసాన్ క్రెడిట్ కార్డ్',
        category: 'Credit',
        amount: 'Up to ₹3 Lakh',
        desc: 'Flexible credit for crop cultivation and allied activities at subsidized interest rates.',
        descHi: 'फसल खेती और संबद्ध गतिविधियों के लिए रियायती ब्याज दरों पर लचीला ऋण।',
        descTe: 'పంట సాగు మరియు అనుబంధ కార్యకలాపాలకు రాయితీ వడ్డీ రేట్లలో సౌకర్యవంతమైన రుణం.',
        eligibility: 'All farmers, sharecroppers, tenant farmers',
        link: 'https://www.nabard.org',
        icon: '💳', color: '#f59e0b',
    },
    {
        name: 'Soil Health Card Scheme',
        nameHi: 'मृदा स्वास्थ्य कार्ड योजना',
        nameTe: 'నేల ఆరోగ్య కార్డ్ పథకం',
        category: 'Soil Health',
        amount: 'Free Testing',
        desc: 'Free soil testing and health card with fertilizer recommendations to improve productivity.',
        descHi: 'उत्पादकता बढ़ाने के लिए उर्वरक सिफारिशों के साथ मुफ्त मिट्टी परीक्षण।',
        descTe: 'ఉత్పాదకత మెరుగుపరచడానికి ఎరువుల సిఫార్సులతో ఉచిత నేల పరీక్ష.',
        eligibility: 'All farmers across India',
        link: 'https://soilhealth.dac.gov.in',
        icon: '🌱', color: '#a78bfa',
    },
    {
        name: 'PM Krishi Sinchai Yojana',
        nameHi: 'पीएम कृषि सिंचाई योजना',
        nameTe: 'పీఎం వ్యవసాయ నీటిపారుదల యోజన',
        category: 'Irrigation',
        amount: '55-90% Subsidy',
        desc: 'Subsidies for drip and sprinkler irrigation. Har Khet Ko Pani - water to every field.',
        descHi: 'ड्रिप और स्प्रिंकलर सिंचाई पर सब्सिडी। हर खेत को पानी।',
        descTe: 'డ్రిప్ మరియు స్ప్రింక్లర్ నీటిపారుదలకు సబ్సిడీ. ప్రతి పొలానికి నీరు.',
        eligibility: 'All farmers with agricultural land',
        link: 'https://pmksy.gov.in',
        icon: '💧', color: '#34d399',
    },
    {
        name: 'eNAM - National Agriculture Market',
        nameHi: 'eNAM - राष्ट्रीय कृषि बाजार',
        nameTe: 'eNAM - జాతీయ వ్యవసాయ మార్కెట్',
        category: 'Market Access',
        amount: 'Better Prices',
        desc: 'Online trading platform connecting farmers to buyers across India for better price discovery.',
        descHi: 'बेहतर मूल्य खोज के लिए किसानों को भारत भर के खरीदारों से जोड़ने वाला ऑनलाइन प्लेटफॉर्म।',
        descTe: 'మెరుగైన ధర కనుగొనడానికి రైతులను భారతదేశం అంతటా కొనుగోలుదారులతో అనుసంధానించే ఆన్‌లైన్ వేదిక.',
        eligibility: 'Farmers registered with local APMC',
        link: 'https://enam.gov.in',
        icon: '🏪', color: '#fb923c',
    },
    {
        name: 'Paramparagat Krishi Vikas Yojana',
        nameHi: 'परंपरागत कृषि विकास योजना',
        nameTe: 'సంప్రదాయ వ్యవసాయ అభివృద్ధి యోజన',
        category: 'Organic Farming',
        amount: '₹50,000/ha',
        desc: 'Financial support for organic farming. Promotes chemical-free sustainable agriculture.',
        descHi: 'जैविक खेती के लिए वित्तीय सहायता। रासायनिक मुक्त टिकाऊ कृषि को बढ़ावा।',
        descTe: 'సేంద్రీయ వ్యవసాయానికి ఆర్థిక సహాయం. రసాయన రహిత స్థిరమైన వ్యవసాయాన్ని ప్రోత్సహిస్తుంది.',
        eligibility: 'Farmer groups of 50+ farmers',
        link: 'https://pgsindia-ncof.gov.in',
        icon: '🌿', color: '#4ade80',
    },
    {
        name: 'Rashtriya Krishi Vikas Yojana',
        nameHi: 'राष्ट्रीय कृषि विकास योजना',
        nameTe: 'జాతీయ వ్యవసాయ అభివృద్ధి యోజన',
        category: 'Development',
        amount: 'State-specific',
        desc: 'Holistic development of agriculture. Funding for infrastructure, technology, and capacity building.',
        descHi: 'कृषि का समग्र विकास। बुनियादी ढांचे, प्रौद्योगिकी के लिए फंडिंग।',
        descTe: 'వ్యవసాయం యొక్క సమగ్ర అభివృద్ధి. మౌలిక సదుపాయాలు, సాంకేతికతకు నిధులు.',
        eligibility: 'State governments and farmer groups',
        link: 'https://rkvy.nic.in',
        icon: '🏗️', color: '#f87171',
    },
];

// ─── Mock market data for fallback ───────────────────────────────────────────
export const MOCK_MARKET_DATA = [
    { commodity: 'Wheat', variety: 'Sharbati', market: 'Indore', state: 'Madhya Pradesh', min_price: '2100', max_price: '2350', modal_price: '2200', arrival_date: '18/02/2026' },
    { commodity: 'Rice', variety: 'Basmati', market: 'Karnal', state: 'Haryana', min_price: '3200', max_price: '3800', modal_price: '3500', arrival_date: '18/02/2026' },
    { commodity: 'Tomato', variety: 'Hybrid', market: 'Pune', state: 'Maharashtra', min_price: '800', max_price: '1200', modal_price: '1000', arrival_date: '18/02/2026' },
    { commodity: 'Onion', variety: 'Red', market: 'Nashik', state: 'Maharashtra', min_price: '600', max_price: '900', modal_price: '750', arrival_date: '18/02/2026' },
    { commodity: 'Potato', variety: 'Jyoti', market: 'Agra', state: 'Uttar Pradesh', min_price: '400', max_price: '650', modal_price: '520', arrival_date: '18/02/2026' },
    { commodity: 'Soybean', variety: 'JS-335', market: 'Bhopal', state: 'Madhya Pradesh', min_price: '4200', max_price: '4600', modal_price: '4400', arrival_date: '18/02/2026' },
    { commodity: 'Cotton', variety: 'Bt Cotton', market: 'Akola', state: 'Maharashtra', min_price: '5800', max_price: '6200', modal_price: '6000', arrival_date: '18/02/2026' },
    { commodity: 'Maize', variety: 'Hybrid', market: 'Davangere', state: 'Karnataka', min_price: '1800', max_price: '2100', modal_price: '1950', arrival_date: '18/02/2026' },
    { commodity: 'Mustard', variety: 'Yellow', market: 'Jaipur', state: 'Rajasthan', min_price: '5200', max_price: '5600', modal_price: '5400', arrival_date: '18/02/2026' },
    { commodity: 'Chilli', variety: 'Teja', market: 'Guntur', state: 'Andhra Pradesh', min_price: '8000', max_price: '12000', modal_price: '10000', arrival_date: '18/02/2026' },
];
