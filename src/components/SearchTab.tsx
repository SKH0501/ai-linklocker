import React, { useState, useEffect, useRef } from 'react';
import { LostItem } from '../types';
import {
  Search as SearchIcon, MapPin, ClipboardList, Clock, ArrowLeft, Shield, Check,
  Mail, BookOpen, CreditCard, PlayCircle, Eye, RefreshCw, Smartphone, KeyRound, Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SearchTabProps {
  lostItems: LostItem[];
  userPoints: number;
  onModifyPoints: (amount: number, title: string) => void;
  onSelectItemFromParent: LostItem | null;
  onClearSelectedItem: () => void;
  onClaimItem: (itemId: string, signature: string) => void;
}

type TabType = 'ALL' | 'ELECTRONICS' | 'WALLET' | 'DOCUMENT' | 'OTHERS';

export default function SearchTab({
  lostItems,
  userPoints,
  onModifyPoints,
  onSelectItemFromParent,
  onClearSelectedItem,
  onClaimItem,
}: SearchTabProps) {
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemLocal, setSelectedItemLocal] = useState<LostItem | null>(null);

  // Sync parent selection (e.g. from MapTab)
  useEffect(() => {
    if (onSelectItemFromParent) {
      setSelectedItemLocal(onSelectItemFromParent);
    }
  }, [onSelectItemFromParent]);

  // Claims Workflows
  const [claimStep, setClaimStep] = useState<'DETAILS' | 'VERIFY_ID' | 'CHOOSE_METHOD' | 'AD_TIMER' | 'OTP_SCREEN'>('DETAILS');

  // Verify Form State
  const [emailId, setEmailId] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [fullName, setFullName] = useState('홍길동');
  const [birthday, setBirthday] = useState('2002.05.11');
  const [phone, setPhone] = useState('010-4892-2384');
  const [address, setAddress] = useState('학술정보관생활관 3동 204호');

  // Choice, Ad Timer, and OTP
  const [adTick, setAdTick] = useState(15);
  const [otpTimer, setOtpTimer] = useState(180); // 3 minutes

  useEffect(() => {
    let adInterval: any;
    if (claimStep === 'AD_TIMER' && adTick > 0) {
      adInterval = setInterval(() => {
        setAdTick((prev) => prev - 1);
      }, 1000);
    } else if (claimStep === 'AD_TIMER' && adTick === 0) {
      setClaimStep('OTP_SCREEN');
      setOtpTimer(180); // Reset OTP timer
    }
    return () => clearInterval(adInterval);
  }, [claimStep, adTick]);

  useEffect(() => {
    let otpInterval: any;
    if (claimStep === 'OTP_SCREEN' && otpTimer > 0) {
      otpInterval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(otpInterval);
  }, [claimStep, otpTimer]);

  const handleSendVerification = () => {
    if (!emailId) {
      alert('이메일 ID를 입력해 주세요!');
      return;
    }
    setEmailSent(true);
    alert(`[인증번호 전송] ${emailId}@university.ac.kr 메일로 인증 코드가 발급되었습니다.`);
  };

  const handleVerifyCode = () => {
    if (!emailCode) {
      alert('인증 코드를 입력해 주세요!');
      return;
    }
    setEmailVerified(true);
    alert('이메일 신원 인증이 완료되었습니다.');
  };

  const handleStepVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailVerified) {
      alert('먼저 대학 메일 인증을 완료하셔야 인증번호 발급이 가능합니다.');
      return;
    }
    setClaimStep('CHOOSE_METHOD');
  };

  const executePointClaim = () => {
    if (userPoints < 200) {
      alert('보유 포인트가 부족합니다. 광고 시청 무료 수령을 선택해 보세요.');
      return;
    }
    onModifyPoints(-200, `${selectedItemLocal?.title} 수령 차감`);
    setClaimStep('OTP_SCREEN');
  };

  const executeAdClaim = () => {
    setAdTick(15);
    setClaimStep('AD_TIMER');
  };

  const handleReceiptComplete = () => {
    if (!selectedItemLocal) return;
    // Award 100 points as bonus immediately
    onModifyPoints(100, `${selectedItemLocal.title} 성공적 회수 + 안전 보관 보너스`);
    // Complete claiming under signature logic
    onClaimItem(selectedItemLocal.id, 'SIGNATURE_MOCK');
    alert('수령 완료되었습니다! 성공적으로 물품을 찾아가서 +100 Coins 가 적립되었습니다.');
    setSelectedItemLocal(null);
    onClearSelectedItem();
    setClaimStep('DETAILS');
  };

  const handleBack = () => {
    if (claimStep === 'DETAILS') {
      setSelectedItemLocal(null);
      onClearSelectedItem();
    } else if (claimStep === 'VERIFY_ID') {
      setClaimStep('DETAILS');
    } else if (claimStep === 'CHOOSE_METHOD') {
      setClaimStep('VERIFY_ID');
    } else if (claimStep === 'AD_TIMER') {
      setClaimStep('CHOOSE_METHOD');
    } else if (claimStep === 'OTP_SCREEN') {
      setClaimStep('CHOOSE_METHOD');
    }
  };

  // Filtering Logic
  const filteredItems = lostItems.filter((item) => {
    const matchesTab =
      activeTab === 'ALL' || item.category === activeTab;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch && item.status !== 'CLAIMED';
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF8F5] pb-24 text-stone-800 font-sans" id="search-tab-root-id">
      {!selectedItemLocal ? (
        <>
          {/* Top Searching Input Header */}
          <div className="p-4 bg-white/80 border-b border-orange-100/40 sticky top-0 z-10">
            <h2 className="text-xl font-bold text-stone-900 tracking-tight mb-3">안심 보관 찾기</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="찾으시려는 아이템을 검색해 주세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-100/70 border border-stone-200/50 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-sm transition-all shadow-inner"
                id="search-tab-input-id"
              />
              <SearchIcon className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-stone-400" />
            </div>
          </div>

          {/* Categories Tab Bar */}
          <div className="flex gap-2 overflow-x-auto p-4 scrollbar-none" id="categories-tabs-id">
            {([
              { key: 'ALL', label: '전체' },
              { key: 'ELECTRONICS', label: '전자기기' },
              { key: 'WALLET', label: '지갑/가방' },
              { key: 'DOCUMENT', label: '서류/카드' },
              { key: 'OTHERS', label: '기타' },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  activeTab === tab.key
                    ? 'bg-amber-900 border-amber-950 text-[#FAF8F5] shadow-sm'
                    : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
                }`}
                id={`tab-btn-${tab.key}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* List Content */}
          <div className="p-4 flex-1 space-y-3.5">
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-100 shadow-sm text-stone-400">
                <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30 text-amber-900" />
                <p className="text-sm font-semibold text-stone-700">해당 물건을 발굴하지 못했습니다</p>
                <p className="text-xs text-stone-400 mt-1">상단의 검색어 또는 카테고리를 다시 조정해보세요.</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItemLocal(item);
                    setClaimStep('DETAILS');
                  }}
                  className="bg-white rounded-3xl p-4 border border-stone-100/80 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 group hover:border-amber-200"
                  id={`item-card-${item.id}`}
                >
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 border border-stone-100 shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-1 right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border border-white shadow-sm">
                      <Shield className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between py-0.5 flex-1 select-none">
                    <div>
                      <span className="text-[9px] bg-stone-100 group-hover:bg-amber-50 text-stone-500 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider mb-1 inline-block">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-extrabold text-stone-900 leading-tight group-hover:text-amber-950 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-amber-700 font-bold" />
                        <span>{item.location}</span>
                      </p>
                    </div>
                    <span className="text-[10px] text-stone-400 font-medium">{item.reportedTime}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        /* DETAIL Claim flow screens */
        <div className="flex-1 flex flex-col bg-stone-50" id="detail-workflow-arena">
          {/* Header */}
          <div className="p-4 bg-white border-b border-stone-200/50 flex items-center justify-between sticky top-0 z-10">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-stone-100 rounded-xl text-stone-600 transition-colors flex items-center gap-1"
              id="back-workflow-btn"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-xs font-semibold">뒤로</span>
            </button>
            <h2 className="text-base font-extrabold text-stone-900 tracking-tight uppercase">
              {claimStep === 'DETAILS' && '물품 분실 안전 보관'}
              {claimStep === 'VERIFY_ID' && '신원 인증 확인'}
              {claimStep === 'CHOOSE_METHOD' && '수령 방법 결정'}
              {claimStep === 'AD_TIMER' && '안심 수령 스폰서'}
              {claimStep === 'OTP_SCREEN' && '사물함 스마트 연동'}
            </h2>
            <div className="w-10"></div> {/* Spacer balance */}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* CLAIM STEP A: DETAILS */}
            {claimStep === 'DETAILS' && (
              <>
                {/* Hero image with Official Campus Verified */}
                <div className="relative rounded-3xl overflow-hidden aspect-video bg-white shadow-md border border-[#F0E6D8]">
                  <img
                    src={selectedItemLocal.image}
                    alt={selectedItemLocal.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#D97706] text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md border border-[#B45F06]">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Official Campus Verified</span>
                  </div>
                </div>

                {/* Main description section */}
                <div className="bg-white rounded-3xl p-5 border border-[#F0E6D8] shadow-sm space-y-4">
                  <div>
                    <span className="text-xs font-mono font-bold tracking-wider text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded-md border border-[#F0E6D8]">
                      {selectedItemLocal.category}
                    </span>
                    <h1 className="text-xl font-extrabold text-[#2D241E] tracking-tight mt-2">{selectedItemLocal.title}</h1>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FEF3C7]/60 flex items-center justify-center text-[#D97706] shrink-0 border border-[#F0E6D8]">
                        <MapPin className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Found at</p>
                        <p className="text-sm font-bold text-stone-800">{selectedItemLocal.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-500 shrink-0 border border-stone-200/50">
                        <ClipboardList className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Description</p>
                        <p className="text-xs text-stone-600 leading-relaxed font-semibold mt-0.5">
                          {selectedItemLocal.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-500 shrink-0 border border-stone-200/50">
                        <Clock className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Reported</p>
                        <p className="text-xs font-semibold text-stone-700">{selectedItemLocal.reportedTime}</p>
                      </div>
                    </div>
                  </div>

                  {/* Primary Amber CTA to Reserve Pickup */}
                  <button
                    onClick={() => setClaimStep('VERIFY_ID')}
                    className="w-full bg-[#D97706] hover:bg-[#B45F06] text-white font-extrabold py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-sm uppercase tracking-wide border border-[#B45F06] flex items-center justify-center gap-2"
                  >
                    <KeyRound className="w-4.5 h-4.5" />
                    <span>찾아가기 예약</span>
                  </button>
                </div>

                {/* Subinfo badge from screenshots */}
                <div className="bg-[#FEF3C7] border border-[#F0E6D8] p-4 rounded-2xl flex items-start gap-3">
                  <div className="p-1 text-[#D97706] bg-white shadow-inner rounded-md border border-[#F0E6D8]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#92400E] leading-tight">수령 시 학생증 인증이 필요할 수 있습니다.</h4>
                    <p className="text-[11px] text-[#92400E]/80 leading-relaxed mt-0.5">
                      안심 사물함 연동 후, 보안 확인 및 부정 방지를 위해 대학생 신원 확인 인증을 1회 진행합니다.
                    </p>
                  </div>
                </div>

                {/* Locker location details card */}
                <div className="bg-white rounded-3xl p-5 border border-[#F0E6D8] shadow-sm space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-500">Locker Location</h3>
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#F5EFE6] flex items-center justify-center border border-stone-200 shadow-inner">
                    {/* SVG map visual */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="200" height="100" fill="#FCF9F5" />
                      <path d="M0 50 C80 30, 120 70, 200 50" stroke="#F0E6D8" strokeWidth="8" />
                      <circle cx="100" cy="50" r="24" fill="#FEF3C7" stroke="#F0E6D8" strokeWidth="2" />
                      <circle cx="100" cy="50" r="4" fill="#D97706" />
                    </svg>
                    {/* Pulsing Target marker */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="p-2 bg-[#D97706] rounded-full text-white shadow-md animate-bounce ring-4 ring-[#D97706]/10">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] bg-[#2D241E] text-white font-extrabold px-2 py-0.5 rounded mt-1 shadow border border-[#4A3F35]">
                        {selectedItemLocal.lockerDetails}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Safety Procedure items */}
                <div className="bg-white rounded-3xl p-4 border border-[#F0E6D8] shadow-sm space-y-2">
                  <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-2">Safety Procedure</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#FEF3C7] text-[#92400E] p-2.5 rounded-xl border border-[#F0E6D8] text-center flex flex-col items-center">
                      <Smartphone className="w-5 h-5 text-[#D97706] mb-1" />
                      <span className="text-[10px] font-extrabold">1. 앱 예약</span>
                    </div>
                    <div className="bg-stone-50 text-stone-800 p-2.5 rounded-xl border border-stone-200 text-center flex flex-col items-center">
                      <KeyRound className="w-5 h-5 text-stone-600 mb-1" />
                      <span className="text-[10px] font-extrabold">2. 비밀번호 수령</span>
                    </div>
                    <div className="bg-stone-50 text-stone-800 p-2.5 rounded-xl border border-stone-200 text-center flex flex-col items-center">
                      <Shield className="w-5 h-5 text-stone-600 mb-1" />
                      <span className="text-[10px] font-extrabold">3. 물품 수령</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* CLAIM STEP B: IDENTITY VERIFICATION FORM (신원인증) */}
            {claimStep === 'VERIFY_ID' && (
              <form onSubmit={handleStepVerifySubmit} className="space-y-4 font-sans select-none">
                {/* Stepper progress */}
                <div className="flex justify-between items-center bg-white px-4 py-3 rounded-2xl border border-[#F0E6D8]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#D97706] text-white text-[11px] font-bold flex items-center justify-center shadow-sm">1</span>
                    <span className="text-xs font-bold text-[#2D241E]">대학인증</span>
                  </div>
                  <div className="h-0.5 w-6 bg-[#F0E6D8]"></div>
                  <div className="flex items-center gap-1.5 opacity-40">
                    <span className="w-5 h-5 rounded-full bg-stone-300 text-[#FCF9F5] text-[11px] font-bold flex items-center justify-center">2</span>
                    <span className="text-xs font-semibold text-stone-500">수령방법</span>
                  </div>
                  <div className="h-0.5 w-6 bg-[#F0E6D8]"></div>
                  <div className="flex items-center gap-1.5 opacity-40">
                    <span className="w-5 h-5 rounded-full bg-stone-300 text-[#FCF9F5] text-[11px] font-bold flex items-center justify-center">3</span>
                    <span className="text-xs font-semibold text-stone-500">사물함 해제</span>
                  </div>
                </div>

                <div className="bg-[#FEF3C7] border border-[#F0E6D8] p-4 rounded-2xl flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] text-[#92400E] leading-relaxed font-semibold">
                      도난·사고 발생 시 대처를 위한 필수 개인정보 입력 단계입니다. 모든 정보는 암호화되어 안전하게 보관됩니다.
                    </p>
                  </div>
                </div>

                {/* Email Verification Box */}
                <div className="bg-white rounded-3xl p-5 border border-stone-100 shadow-sm space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-stone-500 uppercase mb-1.5">학내 이메일 주소 *</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          required
                          placeholder="student_id"
                          value={emailId}
                          onChange={(e) => setEmailId(e.target.value)}
                          className="w-full pl-3 pr-[130px] py-3 rounded-xl bg-stone-100/90 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-stone-800"
                        />
                        <span className="absolute right-3.5 top-3.5 text-xs text-stone-500 font-bold bg-stone-200/60 px-2 py-0.5 rounded border border-stone-300/40">
                          @university.ac.kr
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleSendVerification}
                        className={`px-4 bg-stone-900 text-[#FAF8F5] hover:bg-stone-800 text-xs font-bold rounded-xl scroll-p-1 select-none whitespace-nowrap transition-all border border-stone-950 shadow-sm ${
                          emailSent ? 'bg-emerald-600 text-white' : ''
                        }`}
                      >
                        {emailSent ? '인증완료' : '인증발송'}
                      </button>
                    </div>
                  </div>

                  {emailSent && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-100/80 space-y-2">
                      <label className="block text-[10px] font-extrabold text-amber-800">메일로 수신된 4자리 인증번호 입력 *</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          placeholder="인증코드를 입력하세요"
                          value={emailCode}
                          onChange={(e) => setEmailCode(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white text-stone-800 border border-stone-300 rounded-lg text-xs font-bold"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyCode}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors"
                        >
                          확인
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3.5 pt-3 border-t border-stone-100">
                    <div>
                      <label className="block text-xs font-extrabold text-stone-500 mb-1.5">성명 *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-stone-100/90 border border-stone-200 text-sm font-bold text-stone-800 focus:ring-2 focus:ring-blue-500"
                        id="verify-name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-stone-500 mb-1.5">생년월일 *</label>
                      <input
                        type="text"
                        required
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-stone-100/90 border border-stone-200 text-sm font-semibold text-stone-800 focus:ring-2 focus:ring-blue-500"
                        id="verify-dob"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-stone-500 mb-1.5">전화번호 *</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-stone-100/90 border border-stone-200 text-sm font-semibold text-stone-800 focus:ring-2 focus:ring-blue-500"
                        id="verify-phone"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-stone-500 mb-1.5">주소 (거주지/생활관) *</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="flex-1 px-4 py-3 rounded-xl bg-stone-100/90 border border-stone-200 text-sm font-semibold text-stone-800 focus:ring-2 focus:ring-blue-500"
                          id="verify-address"
                        />
                        <button
                          type="button"
                          onClick={() => alert('학내 인물/기숙사 주소 인증 자동 검색이 완료되었습니다.')}
                          className="px-4 py-3 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-xl text-xs whitespace-nowrap transition-all"
                        >
                          검색
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-2 text-center">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-[#D97706] hover:bg-[#B45F06] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-1"
                    id="verify-id-cta-btn"
                  >
                    <span>신원 인증하기</span>
                    <span>→</span>
                  </button>
                  <p className="text-[10px] text-stone-400 mt-2">
                    '신원 인증하기'를 누름으로써 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
                  </p>
                </div>
              </form>
            )}

            {/* CLAIM STEP C: CHOOSE CLAIM METHOD (분실물을 찾으시겠어요?) */}
            {claimStep === 'CHOOSE_METHOD' && (
              <div className="space-y-4 font-sans select-none">
                {/* Stepper progress */}
                <div className="flex justify-between items-center bg-white px-4 py-3 rounded-2xl border border-[#F0E6D8]">
                  <div className="flex items-center gap-1.5 text-[#D97706]">
                    <span className="w-5 h-5 rounded-full bg-[#FEF3C7] border border-[#D97706] text-[#D97706] text-[11px] font-bold flex items-center justify-center shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span className="text-xs font-bold text-stone-500">대학인증</span>
                  </div>
                  <div className="h-0.5 w-6 bg-[#D97706]"></div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#D97706] text-white text-[11px] font-bold flex items-center justify-center shadow-sm">2</span>
                    <span className="text-xs font-bold text-[#2D241E]">수령방법</span>
                  </div>
                  <div className="h-0.5 w-6 bg-[#F0E6D8]"></div>
                  <div className="flex items-center gap-1.5 opacity-40">
                    <span className="w-5 h-5 rounded-full bg-stone-300 text-[#FCF9F5] text-[11px] font-bold flex items-center justify-center">3</span>
                    <span className="text-xs font-semibold text-stone-500">사물함 해제</span>
                  </div>
                </div>

                <div className="bg-white rounded-[2rem] p-6 border border-[#F0E6D8] shadow-xl flex flex-col items-center text-center space-y-6">
                  {/* Floating Safe Box illustration */}
                  <div className="w-20 h-20 bg-[#FEF3C7] rounded-2xl flex items-center justify-center text-[#D97706] shadow-md border border-[#F0E6D8]">
                    <Building className="w-10 h-10" />
                  </div>

                  <div>
                    <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">분실물을 찾으시겠어요?</h2>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      소중한 물건이 안전하게 보관 중입니다. <br />
                      수령에 필요한 비용 결제 수단을 선택해 주세요.
                    </p>
                  </div>

                  {/* Options containers */}
                  <div className="w-full space-y-3">
                    {/* Option A: Point payment */}
                    <button
                      type="button"
                      onClick={executePointClaim}
                      className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${
                        userPoints >= 200
                          ? 'bg-[#FAF8F5] hover:bg-stone-50 border-stone-200 text-stone-800 cursor-pointer'
                          : 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-stone-200 text-stone-600 rounded-xl">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold">포인트로 즉시 지불</p>
                          <p className="text-[11px] text-stone-500">
                            {userPoints >= 200
                              ? `보유 포인트에서 즉시 차감 (보유: ${userPoints} pts)`
                              : `보유 포인트가 부족합니다 (잔여: ${userPoints} pts)`}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-stone-800 shrink-0">-200 pts</span>
                    </button>

                    {/* Option B: Free sponsorship viewing */}
                    <button
                      type="button"
                      onClick={executeAdClaim}
                      className="w-full p-4 rounded-2xl bg-[#FEF3C7]/60 hover:bg-[#FEF3C7] border-2 border-[#D97706] text-left flex justify-between items-center transition-all cursor-pointer ring-4 ring-[#FEF3C7]/20 relative animate-pulse"
                    >
                      <div className="absolute -top-3 left-4 bg-[#D97706] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#B45F06]">
                        Recommended
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#FEF3C7] text-[#D97706] rounded-xl border border-[#F0E6D8]">
                          <PlayCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-[#92400E]">광고 시청 후 무료 수령</p>
                          <p className="text-[11px] text-[#A17150]">포인트 차감 없이 수령하기 (약 15초 소요)</p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-[#D97706] shrink-0">무료</span>
                    </button>
                  </div>

                  <button
                    onClick={executeAdClaim}
                    className="w-full py-4 rounded-2xl bg-[#D97706] hover:bg-[#B45F06] text-white font-extrabold text-sm shadow-lg transition-colors border border-[#B45F06]"
                  >
                    광고 시청하고 찾기
                  </button>

                  <button
                    onClick={() => setSelectedItemLocal(null)}
                    className="text-stone-400 hover:text-stone-600 font-semibold text-xs transition-colors underline"
                  >
                    나중에 하기
                  </button>
                </div>
              </div>
            )}

            {/* CLAIM STEP D: ADVERTISING COUNTDOWN TIMER */}
            {claimStep === 'AD_TIMER' && (
              <div className="bg-stone-900 rounded-[2rem] p-6 text-white text-center space-y-6 aspect-square flex flex-col justify-between shadow-2xl relative overflow-hidden select-none">
                {/* Simulated dynamic video border */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-stone-950 to-stone-950 opacity-90 z-0"></div>

                <div className="relative z-10 flex justify-between items-center text-xs text-stone-400 bg-stone-950/45 px-3 py-1.5 rounded-full border border-stone-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                    <span>안심 보관 스폰서 광고 송출 중</span>
                  </div>
                  <span className="font-mono bg-rose-500 text-[#FAF8F5] font-bold px-2 py-0.5 rounded text-[10px]">
                    {adTick}초 남음
                  </span>
                </div>

                {/* Funny local ad slogan */}
                <div className="relative z-10 py-12 space-y-3.5">
                  <p className="text-[11px] uppercase tracking-widest text-[#B9E3D2] font-semibold">
                    LinkLocker Campus Sponser
                  </p>
                  <h1 className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 to-amber-100 bg-clip-text text-transparent">
                    "매주 아메리카노 한 잔 무료!"
                  </h1>
                  <p className="text-xs text-stone-300 leading-relaxed max-w-xs mx-auto">
                    링클로커와 제휴된 캠퍼스 오피셜 몰에서 안심 거래를 인증하면 매일 리워드 보너스를 자동 지급합니다.
                  </p>
                </div>

                <div className="relative z-10 flex justify-center items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  <span className="text-xs font-mono text-stone-400">광고 시청이 원할하게 완료되면 수령 비밀번호가 노출됩니다.</span>
                </div>
              </div>
            )}

            {/* CLAIM STEP E: GOT OTP CODE (수령 OTP 발급 완료) */}
            {claimStep === 'OTP_SCREEN' && (
              <div className="space-y-4 font-sans select-none">
                {/* Stepper progress */}
                <div className="flex justify-between items-center bg-white px-4 py-3 rounded-2xl border border-[#F0E6D8]">
                  <div className="flex items-center gap-1.5 text-[#D97706]">
                    <span className="w-5 h-5 rounded-full bg-[#FEF3C7] border border-[#D97706] text-[#D97706] text-[11px] font-bold flex items-center justify-center shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span className="text-xs font-bold text-stone-500 font-mono">ID인증</span>
                  </div>
                  <div className="h-0.5 w-6 bg-[#D97706]"></div>
                  <div className="flex items-center gap-1.5 text-[#D97706]">
                    <span className="w-5 h-5 rounded-full bg-[#FEF3C7] border border-[#D97706] text-[#D97706] text-[11px] font-bold flex items-center justify-center shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span className="text-xs font-bold text-stone-500 font-mono">수령결정</span>
                  </div>
                  <div className="h-0.5 w-6 bg-[#D97706]"></div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#D97706] text-white text-[11px] font-bold flex items-center justify-center shadow-sm">3</span>
                    <span className="text-xs font-bold text-[#2D241E] font-mono">사물함 해제</span>
                  </div>
                </div>

                {/* Main OTP display panel matching exact visual schema */}
                <div className="bg-white rounded-[2rem] p-6 border border-[#F0E6D8] shadow-xl flex flex-col items-center space-y-6">
                  {/* Lock symbol */}
                  <div className="w-14 h-14 bg-[#FEF3C7] text-[#D97706] border border-[#F0E6D8] rounded-full flex items-center justify-center shadow-inner">
                    <KeyRound className="w-6 h-6 animate-pulse" />
                  </div>

                  <div className="text-center">
                    <h2 className="text-base font-extrabold text-[#2D241E] leading-tight">수령 OTP 발급 완료</h2>
                    <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                      본인 확인을 위한 일회용 보안 연동 코드입니다.
                    </p>
                  </div>

                  {/* 6 Digit codes in grid blocks exactly matching the image mock */}
                  <div className="flex gap-2 justify-center" id="otp-tile-grid">
                    {['6', '4', '8', '6', '2', '1'].map((num, i) => (
                      <div
                        key={i}
                        className="w-11 h-14 bg-[#FEF3C7] border-2 border-[#D97706]/65 text-[#92400E] text-2xl font-black rounded-xl flex items-center justify-center shadow-md animate-fade-in"
                      >
                        {num}
                      </div>
                    ))}
                  </div>

                  {/* Countdown Timer with clock */}
                  <div className="bg-rose-50 border border-rose-100 px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Clock className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="text-xs font-mono font-bold text-rose-700">{formatTime(otpTimer)}</span>
                  </div>

                  {/* Cautions info alert inside verification block */}
                  <div className="bg-[#FEF3C7] border border-[#F0E6D8] p-3.5 rounded-2xl w-full flex items-start gap-2.5">
                    <Smartphone className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5 animate-bounce" />
                    <div>
                      <p className="text-[11px] leading-relaxed text-[#92400E] font-semibold">
                        사물함 화면에 코드를 입력하고 물건을 꺼내주세요.
                      </p>
                      <p className="text-[10px] text-[#A17150] mt-1 flex items-center gap-1 font-semibold leading-tight text-left">
                        <span>📹 도난 방지를 위해 수령 시 얼굴이 촬영됩니다.</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleReceiptComplete}
                    className="w-full bg-[#D97706] hover:bg-[#B45F06] text-white py-4 rounded-xl font-bold transition-all text-sm shadow-md border border-[#B45F06]"
                  >
                    수령 완료
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
