import React, { useState } from 'react';
import { LostItem, Locker } from '../types';
import { MapPin, Search, SlidersHorizontal, Plus, Shield, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MapTabProps {
  lockers: Locker[];
  lostItems: LostItem[];
  onSelectItem: (item: LostItem) => void;
  onAddLostItem: (item: Omit<LostItem, 'id' | 'status' | 'reportedTime'>) => void;
}

export default function MapTab({ lockers, lostItems, onSelectItem, onAddLostItem }: MapTabProps) {
  const [selectedLockerId, setSelectedLockerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Form states
  const [reportTitle, setReportTitle] = useState('');
  const [reportCategory, setReportCategory] = useState<'ELECTRONICS' | 'WALLET' | 'DOCUMENT' | 'OTHERS'>('ELECTRONICS');
  const [reportLocation, setReportLocation] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportLocker, setReportLocker] = useState('locker-a');
  const [reportImageUrl, setReportImageUrl] = useState('');

  const filteredItems = lostItems.filter(item => {
    const matchesLocker = selectedLockerId ? item.lockerId === selectedLockerId : true;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLocker && matchesSearch && item.status !== 'CLAIMED';
  });

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle || !reportLocation || !reportDescription) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }
    onAddLostItem({
      title: reportTitle,
      category: reportCategory,
      location: reportLocation,
      description: reportDescription,
      lockerId: reportLocker,
      lockerDetails: reportLocker === 'locker-a' ? 'Level 1, Section A-3' : 'Level 1, Section B-12',
      image: reportImageUrl || 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600',
    });
    // Clear form
    setReportTitle('');
    setReportLocation('');
    setReportDescription('');
    setReportImageUrl('');
    setIsReportModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF8F5] pb-24 text-stone-800">
      {/* Search Bar Block */}
      <div className="p-4 bg-white/70 backdrop-blur-md border-b border-orange-100/50 sticky top-0 z-10 flex gap-2 items-center">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="에타에서 헤매지 마세요! 물건 찾기"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-100/80 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-sm transition-all shadow-inner border border-stone-200/50"
            id="search-input-id"
          />
          <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-stone-400" id="search-icon-id" />
        </div>
        <button className="p-3 bg-stone-100/80 hover:bg-stone-200/60 rounded-2xl border border-stone-200/50 text-stone-600 transition-colors" id="filter-btn-id">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Conceptual Map Area */}
      <div className="relative w-full aspect-[4/3] bg-amber-50/40 border-b border-orange-100 overflow-hidden flex flex-col items-center justify-center">
        {/* Animated Background Gradients & Pathways representing isometric map */}
        <div className="absolute inset-0 bg-[#E8F3EE] opacity-90">
          {/* Schematic grass, forest, block SVGs */}
          <svg className="w-full h-full opacity-40" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="#EAEFEA" />
            {/* Roads */}
            <path d="M 0 150 Q 200 120, 400 240" stroke="#FAF8F5" strokeWidth="24" strokeLinecap="round" />
            <path d="M 120 0 Q 180 200, 300 300" stroke="#FAF8F5" strokeWidth="16" strokeLinecap="round" />
            {/* Building outlines */}
            <rect x="30" y="40" width="80" height="50" rx="8" fill="#DFE6DE" stroke="#CFD8CE" strokeWidth="2" transform="rotate(-15 30 40)" />
            <rect x="260" y="30" width="110" height="60" rx="12" fill="#D3DDD2" stroke="#C4CEC3" strokeWidth="2" transform="rotate(10 260 30)" />
            <rect x="40" y="210" width="90" height="55" rx="8" fill="#DFE6DE" stroke="#CFD8CE" strokeWidth="2" />
            {/* Trees SVG */}
            <circle cx="180" cy="70" r="10" fill="#B4C7B3" />
            <circle cx="200" cy="65" r="12" fill="#9FBCA2" />
            <circle cx="215" cy="80" r="8" fill="#B4C7B3" />
            <circle cx="80" cy="180" r="14" fill="#9FBCA2" />
          </svg>
        </div>

        {/* Dynamic Instructional Banner */}
        <div className="absolute top-3 left-4 right-4 bg-amber-900/8 px-4 py-2 rounded-xl text-xs text-amber-900 font-medium z-10 flex items-center gap-2 border border-amber-900/10">
          <Landmark className="w-3.5 h-3.5" />
          <span>보관함을 선택하여 실시간 수납 현황을 확인하세요.</span>
        </div>

        {/* PIN 1: Locker A */}
        <motion.button
          onClick={() => setSelectedLockerId(selectedLockerId === 'locker-a' ? null : 'locker-a')}
          className={`absolute left-[30%] top-[45%] flex flex-col items-center z-10`}
          whileHover={{ scale: 1.05 }}
          id="pin-locker-a"
        >
          <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border text-xs font-semibold select-none transition-all ${
            selectedLockerId === 'locker-a'
              ? 'bg-[#D97706] text-white border-[#B45F06] ring-4 ring-[#FEF3C7]/40'
              : 'bg-[#2D241E] text-[#FCF9F5] border-[#4A3F35] hover:bg-[#4A3F35]'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Locker A ({lockers.find(l => l.id === 'locker-a')?.count || 12})
          </div>
          <div className={`w-3 h-3 border-2 border-white rounded-full mt-1 animate-bounce ${
            selectedLockerId === 'locker-a' ? 'bg-[#D97706]' : 'bg-[#2D241E]'
          }`}></div>
        </motion.button>

        {/* PIN 2: Locker B */}
        <motion.button
          onClick={() => setSelectedLockerId(selectedLockerId === 'locker-b' ? null : 'locker-b')}
          className="absolute left-[65%] top-[60%] flex flex-col items-center z-10"
          whileHover={{ scale: 1.05 }}
          id="pin-locker-b"
        >
          <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border text-xs font-semibold select-none transition-all ${
            selectedLockerId === 'locker-b'
              ? 'bg-[#D97706] text-white border-[#B45F06] ring-4 ring-[#FEF3C7]/40'
              : 'bg-[#2D241E] text-[#FCF9F5] border-[#4A3F35] hover:bg-[#4A3F35]'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Locker B ({lockers.find(l => l.id === 'locker-b')?.count || 5})
          </div>
          <div className={`w-3 h-3 border-2 border-white rounded-full mt-1 animate-bounce ${
            selectedLockerId === 'locker-b' ? 'bg-[#D97706]' : 'bg-[#2D241E]'
          }`}></div>
        </motion.button>

        {/* Map Label Watermarks */}
        <span className="absolute bottom-4 left-4 text-[10px] font-mono text-stone-500/60 uppercase tracking-widest bg-stone-100/50 px-2 py-0.5 rounded border border-stone-200/30">
          Campus Isometric Grid v4.1
        </span>
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsReportModalOpen(true)}
        className="fixed bottom-24 right-6 bg-[#D97706] hover:bg-[#B45F06] text-white px-5 py-3.5 rounded-full shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all z-20 font-semibold border border-[#D97706]"
        id="report-fab-id"
      >
        <Plus className="w-5 h-5" />
        <span>분실 신고</span>
      </button>

      {/* Title & Scroll Content */}
      <div className="p-4 flex-1">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-1">
              최근 습득물
              {selectedLockerId && (
                <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-100 font-normal">
                  Locker {selectedLockerId === 'locker-a' ? 'A' : 'B'} 필터 적용 중
                </span>
              )}
            </h2>
            <p className="text-xs text-stone-500">내 물건, 여기서 1분 만에 확인 가능합니다.</p>
          </div>
          {selectedLockerId && (
            <button
              onClick={() => setSelectedLockerId(null)}
              className="text-xs text-stone-400 hover:text-stone-600 font-medium"
              id="clear-filter-id"
            >
              필터 해제
            </button>
          )}
        </div>

        {/* Horizontal scroll or vertical layout */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-stone-100 shadow-sm text-stone-400">
            <Landmark className="w-8 h-8 mx-auto mb-2 opacity-30 text-stone-500" />
            <p className="text-xs text-stone-500 font-medium">검색어 매칭 또는 보관 중인 물품이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="bg-white rounded-2xl p-3 border border-stone-100 shadow-sm hover:shadow-md hover:border-orange-100 transition-all cursor-pointer flex gap-4 relative group"
                whileTap={{ scale: 0.98 }}
                id={`recent-item-${item.id}`}
              >
                {/* Thumb image with shield check badge */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  {/* Outer Check Badge matching the upper right blue shield icon from screenshot */}
                  <div className="absolute top-1 right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border border-white shadow-sm">
                    <Shield className="w-2.5 h-2.5 text-white stroke-[3.5]" />
                  </div>
                </div>

                <div className="flex flex-col justify-between py-1 flex-1">
                  <div>
                    <span className="text-[10px] bg-stone-100 text-stone-500 rounded px-1.5 py-0.5 font-bold uppercase tracking-wider mb-1 inline-block">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 line-clamp-1">{item.title}</h3>
                    <p className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>{item.location}</span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-stone-400">{item.reportedTime}</span>
                    <span className="text-[11px] text-[#D97706] font-semibold group-hover:underline">예약하기 →</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {isReportModalOpen && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-end justify-center">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white w-full max-w-md rounded-t-[2.5rem] shadow-2xl p-6 pb-8 border-t border-amber-100/30 overflow-y-auto max-h-[85vh]"
              id="report-form-container"
            >
              <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mb-5"></div>
              <h3 className="text-lg font-extrabold text-stone-900 tracking-tight mb-1 text-center">
                🎁 습득물 / 분실물 신고서
              </h3>
              <p className="text-xs text-stone-500 text-center mb-6">
                발견하신 소중한 물건을 안전 금고에 보관하고 포인트를 획득하세요.
              </p>

              <form onSubmit={handleSubmitReport} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1.5">물품 사진 URL (인스플래시 등)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={reportImageUrl}
                    onChange={(e) => setReportImageUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-100 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-stone-200/50 text-xs"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">비워두시면 카테고리 기본 이미지로 대체됩니다.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1.5">물품명 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 에어팟 프로, 클래식 에코백"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-100 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-stone-200/50 text-sm font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1.5">카테고리 *</label>
                    <select
                      value={reportCategory}
                      onChange={(e) => setReportCategory(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-xl bg-stone-100 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-stone-200/50 text-xs font-medium"
                    >
                      <option value="ELECTRONICS">전자기기 (ELECTRONICS)</option>
                      <option value="WALLET">지갑/가방 (WALLET)</option>
                      <option value="DOCUMENT">서류/카드 (DOCUMENT)</option>
                      <option value="OTHERS">기타 (OTHERS)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1.5">보관 위치 *</label>
                    <select
                      value={reportLocker}
                      onChange={(e) => setReportLocker(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-stone-100 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-stone-200/50 text-xs font-medium"
                    >
                      <option value="locker-a">Locker A (중앙도서관 1층)</option>
                      <option value="locker-b">Locker B (학생회관 1층)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1.5">발견 위치 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 중앙도서관 2층 매점 뒤 휴게 소파"
                    value={reportLocation}
                    onChange={(e) => setReportLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-100 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-stone-200/50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1.5">상세 내용 및 팁 *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="물품의 스크래치, 케이스 색상, 자세한 특징을 적어 본인 확인이 신속하게 이루어지도록 해주세요."
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-100 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-stone-200/50 text-xs leading-relaxed"
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="flex-1 py-3.5 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 text-sm font-bold transition-all"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold shadow-lg transition-all"
                  >
                    신고하기
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
