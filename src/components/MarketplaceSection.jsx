import React, { useState, useEffect } from 'react';
import { ShoppingBag, Phone, Plus, Search, MapPin, Tag } from 'lucide-react';
import { INITIAL_MARKETPLACE } from '../data/initialData';

export default function MarketplaceSection() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('dim_farm_marketplace');
    return saved ? JSON.parse(saved) : INITIAL_MARKETPLACE;
  });

  const [filterCat, setFilterCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Listing Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Seeds');
  const [newPrice, setNewPrice] = useState('');
  const [newUnit, setNewUnit] = useState('क्विंटल');
  const [newVendor, setNewVendor] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    localStorage.setItem('dim_farm_marketplace', JSON.stringify(products));
  }, [products]);

  const handleCreateListing = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newPhone) return;

    const item = {
      id: `prod-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      price: parseFloat(newPrice),
      unit: newUnit,
      vendor: newVendor || "प्रमाणित किसान / विक्रेता",
      phone: newPhone,
      location: newLocation || "भारत",
      desc: newDesc || "उच्च गुणवत्ता उत्पाद"
    };

    setProducts([item, ...products]);
    setShowAddModal(false);
    setNewTitle('');
    setNewPrice('');
    setNewPhone('');
    setNewDesc('');
  };

  const filtered = products.filter(p => {
    const matchCat = filterCat === 'All' || p.category === filterCat;
    const matchQuery = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#193729] flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#145C38]" />
            कृषि बाज़ार (Agri Marketplace)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            प्रमाणित बीज, जैविक खाद, सिंचाई उपकरण एवं कृषि उत्पाद — सीधे विक्रेता से संपर्क
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#145C38] hover:bg-[#23764A] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ अपना उत्पाद सूचीबद्ध करें</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap gap-3 items-center justify-between text-xs">
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Seeds', 'Fertilizers', 'Irrigation', 'Tools'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                filterCat === cat
                  ? 'bg-[#145C38] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat === 'All' ? 'सभी श्रेणियां' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="उत्पाद या शहर खोजें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#75B85B]"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((prod) => (
          <div
            key={prod.id}
            className="border border-gray-200 rounded-2xl p-4 bg-white hover:border-[#75B85B] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  {prod.category}
                </span>
                <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
                  <MapPin className="w-3 h-3" /> {prod.location}
                </span>
              </div>

              <h3 className="font-bold text-sm text-[#193729] mt-2 line-clamp-2">{prod.title}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{prod.desc}</p>
              
              <div className="mt-3">
                <span className="text-base font-extrabold text-[#145C38]">₹{prod.price}</span>
                <span className="text-xs text-gray-500 font-normal"> / {prod.unit}</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">विक्रेता: <strong className="text-gray-700">{prod.vendor}</strong></p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <a
                href={`tel:${prod.phone.replace(/\s+/g, '')}`}
                className="w-full bg-[#145C38] hover:bg-[#23764A] text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>फोन लगाएं ({prod.phone})</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 text-xs">
            <h3 className="text-base font-bold text-[#145C38] mb-3">नया कृषि उत्पाद सूचीबद्ध करें</h3>
            <form onSubmit={handleCreateListing} className="space-y-3">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">उत्पाद का नाम:</label>
                <input
                  type="text"
                  placeholder="उदा. प्रमाणित सरसों बीज (गिरिराज)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">श्रेणी:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none font-medium"
                  >
                    <option value="Seeds">Seeds</option>
                    <option value="Fertilizers">Fertilizers</option>
                    <option value="Irrigation">Irrigation</option>
                    <option value="Tools">Tools</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">मूल्य (₹):</label>
                  <input
                    type="number"
                    placeholder="उदा. 1200"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">इकाई (Unit):</label>
                  <input
                    type="text"
                    placeholder="उदा. 40kg बैग / सेट"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">स्थान / जिला:</label>
                  <input
                    type="text"
                    placeholder="उदा. जयपुर, राजस्थान"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">विक्रेता का नाम:</label>
                <input
                  type="text"
                  placeholder="उदा. चौधरी बीज भंडार"
                  value={newVendor}
                  onChange={(e) => setNewVendor(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">मोबाइल नंबर (सीधा संपर्क):</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">विवरण (Description):</label>
                <textarea
                  rows="2"
                  placeholder="उत्पाद की विशेषताएं लिखें..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#145C38] text-white rounded-xl font-bold hover:bg-[#23764A]"
                >
                  सहेजें व प्रकाशित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
