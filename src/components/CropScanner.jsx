import React, { useState, useRef } from 'react';
import { ScanLine, Upload, Camera, AlertTriangle, CheckCircle, ShieldAlert, Sparkles, RefreshCw, Info, FileText } from 'lucide-react';
import { analyzeCropImageWithGemini } from '../services/aiService';

export default function CropScanner() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [cropType, setCropType] = useState('गेहूं (Wheat)');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("तस्वीर का आकार 10MB से कम होना चाहिए।");
      return;
    }

    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target.result);
      setDiagnosis(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRunAnalysis = async () => {
    if (!selectedImage) {
      setError("कृपया पहले प्रभावित पत्ती या पौधे की तस्वीर चुनें।");
      return;
    }

    setLoading(true);
    setError(null);
    setDiagnosis(null);

    try {
      const result = await analyzeCropImageWithGemini({
        imageBase64: selectedImage,
        mimeType,
        cropType,
        notes
      });
      setDiagnosis(result);
    } catch (err) {
      setError(err.message || "फसल का विश्लेषण करने में विफलता। कृपया इंटरनेट और सर्वर जांचें।");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setDiagnosis(null);
    setError(null);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#145C38] via-[#1E6B43] to-[#23764A] text-white p-6 rounded-2xl shadow-md border border-[#75B85B]/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#75B85B]/20 rounded-xl border border-[#75B85B]/40">
              <ScanLine className="w-6 h-6 text-[#75B85B]" />
            </span>
            <h2 className="text-xl font-bold tracking-wide">AI क्रॉप स्कैनर — पादप रोग एवं कीट पहचान</h2>
          </div>
          <p className="text-xs text-emerald-200 mt-1 max-w-2xl leading-relaxed">
            पत्ती या तने की स्पष्ट फोटो अपलोड करें। हमारा सुरक्षित विज़न मॉडल (Gemini AI Vision) लक्षणों, संभावित कारणों, जैविक रोकथाम और रासायनिक उपचार का सटीक विश्लेषण प्रस्तुत करता है।
          </p>
        </div>
        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-emerald-300">सर्वर सुरक्षित विज़न मॉडल</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload & Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-sm text-[#193729] mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#145C38]" />
              पौधे / पत्ती की तस्वीर अपलोड करें
            </h3>

            {/* Image Preview Box */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[240px] relative overflow-hidden ${
                selectedImage 
                  ? 'border-[#75B85B] bg-emerald-50/20' 
                  : 'border-gray-300 hover:border-[#145C38] bg-gray-50/60'
              }`}
            >
              {selectedImage ? (
                <>
                  <img 
                    src={selectedImage} 
                    alt="Crop preview" 
                    className="max-h-[220px] rounded-lg object-contain shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                    तस्वीर बदलने के लिए क्लिक करें
                  </div>
                </>
              ) : (
                <div className="space-y-2 py-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-[#145C38]">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700">तस्वीर खींचें या फ़ाइल चुनें</p>
                    <p className="text-[11px] text-gray-400">JPG, PNG या WEBP (अधिकतम 10MB)</p>
                  </div>
                </div>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
            </div>

            {/* Inputs: Crop type & Notes */}
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">फसल का चयन करें:</label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#75B85B] font-medium text-gray-800"
                >
                  <option value="गेहूं (Wheat)">गेहूं (Wheat)</option>
                  <option value="सोयाबीन (Soybean)">सोयाबीन (Soybean)</option>
                  <option value="सरसों (Mustard)">सरसों (Mustard)</option>
                  <option value="प्याज (Onion)">प्याज (Onion)</option>
                  <option value="कपास (Cotton)">कपास (Cotton)</option>
                  <option value="धान (Paddy/Rice)">धान (Paddy/Rice)</option>
                  <option value="टमाटर (Tomato)">टमाटर (Tomato)</option>
                  <option value="अन्य फसल (Other)">अन्य / अज्ञात (Auto Identify)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">अतिरिक्त लक्षण या टिप्पणी (वैकल्पिक):</label>
                <input
                  type="text"
                  placeholder="उदा. पत्तियों पर पीले धब्बे, कल्ले सूख रहे हैं..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#75B85B] text-gray-800"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={handleRunAnalysis}
                  disabled={loading || !selectedImage}
                  className="flex-1 bg-[#145C38] hover:bg-[#23764A] disabled:opacity-50 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                      <span>विज़न मॉडल विश्लेषण कर रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>रोग की जांच करें (AI Diagnosis)</span>
                    </>
                  )}
                </button>
                {selectedImage && (
                  <button
                    onClick={handleReset}
                    className="px-3 py-3 border border-gray-300 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-medium"
                    title="रीसेट करें"
                  >
                    रीसेट
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Photography Guide */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 text-xs text-gray-700 space-y-1.5">
            <p className="font-bold text-[#145C38] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              सटीक जांच हेतु सुझाव:
            </p>
            <p>1. प्रभावित हिस्से पर पर्याप्त रोशनी रखें और कैमरा फोकस रखें।</p>
            <p>2. केवल हरी पत्ती के बजाय लक्षण वाले हिस्से (धब्बे, कीड़ा, सूखापन) को केंद्र में रखें।</p>
          </div>
        </div>

        {/* Diagnosis Results Column */}
        <div className="lg:col-span-7">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs mb-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">जांच पूरी नहीं हो सकी:</p>
                <p className="mt-0.5">{error}</p>
                <p className="mt-2 text-[11px] text-red-600">
                  (यदि आप स्थानीय विकास या Render पर हैं, तो सर्वर के पर्यावरण चर में <code>GEMINI_API_KEY</code> अवश्य जोड़ें।)
                </p>
              </div>
            </div>
          )}

          {diagnosis ? (
            <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-6 space-y-5 animate-in fade-in duration-300">
              {/* Header result */}
              <div className="border-b border-gray-100 pb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {diagnosis.conditionType}
                  </span>
                  <h3 className="text-xl font-extrabold text-[#193729] mt-2">
                    {diagnosis.conditionName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">
                    पहचानी गई फसल: <span className="text-[#145C38] font-bold">{diagnosis.identifiedCrop}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    गंभीरता: {diagnosis.severity}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">विश्वास स्कोर: {diagnosis.confidenceScore}%</p>
                </div>
              </div>

              {/* Symptoms & Causes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#F4F7F3] p-4 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-[#145C38] mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    पहचाने गए मुख्य लक्षण
                  </h4>
                  <ul className="space-y-1 list-disc list-inside text-gray-700">
                    {diagnosis.visibleSymptoms?.map((sym, idx) => (
                      <li key={idx}>{sym}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    संभावित कारण
                  </h4>
                  <ul className="space-y-1 list-disc list-inside text-gray-700">
                    {diagnosis.possibleCauses?.map((cause, idx) => (
                      <li key={idx}>{cause}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Organic & Chemical Treatments */}
              <div className="space-y-3 text-xs">
                <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
                  <h4 className="font-bold text-[#145C38] mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    जैविक एवं सुरक्षित उपचार (Organic Remedies)
                  </h4>
                  <ul className="space-y-1.5 text-emerald-950 font-medium list-disc list-inside">
                    {diagnosis.organicTreatment?.map((org, idx) => (
                      <li key={idx}>{org}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                  <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-700" />
                    अनुमोदित रासायनिक उपचार (Chemical Treatment & Dosage)
                  </h4>
                  <ul className="space-y-1.5 text-gray-800 list-disc list-inside">
                    {diagnosis.chemicalTreatment?.map((chem, idx) => (
                      <li key={idx}>{chem}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Prevention & Expert Guidance */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700 space-y-2">
                <p className="font-bold text-[#193729]">भविष्य में बचाव के उपाय:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {diagnosis.preventiveMeasures?.map((prev, idx) => (
                    <li key={idx}>{prev}</li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-gray-200/80 text-[11px] text-gray-500 italic">
                  * वैधानिक चेतावनी: {diagnosis.expertAdvisory || "रासायनिक दवाओं के छिड़काव से पहले स्थानीय कृषि विज्ञान केंद्र (KVK) अथवा कृषि अधिकारी से सलाह अवश्य लें।"}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-500 min-h-[400px] flex flex-col items-center justify-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-[#F4F7F3] flex items-center justify-center text-gray-400">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-[#193729]">कोई सक्रिय जांच रिपोर्ट नहीं</h4>
              <p className="text-xs max-w-sm text-gray-400">
                बाईं ओर पत्ती या फसल की तस्वीर चुनकर "रोग की जांच करें" बटन दबाएं। यहां तुरंत वैज्ञानिक जांच रिपोर्ट तैयार होकर आ जाएगी।
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
