import React, { useState } from 'react';
import {
  INITIAL_LOCKERS,
  INITIAL_LOST_ITEMS,
  INITIAL_TRANSACTIONS,
  INITIAL_CLAIM_LOGS
} from './data';
import { LostItem, ClaimLog, TransactionTrack } from './types';
import MapTab from './components/MapTab';
import SearchTab from './components/SearchTab';
import RecordsTab from './components/RecordsTab';
import RewardsTab from './components/RewardsTab';
import { Compass, Search, FolderClosed, Award, User, Sparkles, LogOut, CheckCircle, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ActiveTabType = 'MAP' | 'SEARCH' | 'RECORDS' | 'REWARDS';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('MAP');

  // Real-time globally synchronized simulation state
  const [userPoints, setUserPoints] = useState<number>(1250);
  const [lostItems, setLostItems] = useState<LostItem[]>(INITIAL_LOST_ITEMS);
  const [transactions, setTransactions] = useState<TransactionTrack[]>(INITIAL_TRANSACTIONS);
  const [claimLogs, setClaimLogs] = useState<ClaimLog[]>(INITIAL_CLAIM_LOGS);

  // Cross-tab routing trigger (clicking item in Map -> switch tab to Search and auto-select)
  const [selectedItemInSearch, setSelectedItemInSearch] = useState<LostItem | null>(null);

  // Profile overlay modal
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Unified callback for modifying points balances and recording ledger events
  const handleModifyPoints = (amount: number, title: string) => {
    const updatedPoints = userPoints + amount;
    setUserPoints(updatedPoints);

    // Create a new ledger transaction track
    const newTx: TransactionTrack = {
      id: `tx-new-${Date.now()}`,
      title,
      points: amount,
      time: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }) + ' ' + new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      remainingPoints: updatedPoints
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // Callback to register a new reported lost item
  const handleAddLostItem = (newItemData: Omit<LostItem, 'id' | 'status' | 'reportedTime'>) => {
    const freshItem: LostItem = {
      ...newItemData,
      id: `item-new-${Date.now()}`,
      status: 'AVAILABLE',
      reportedTime: '방금 전'
    };
    setLostItems(prev => [freshItem, ...prev]);

    // Give points reward for reporting (+150 pts)
    handleModifyPoints(150, `안심 연동보관함 물품 등록 보상 (${newItemData.title})`);
    alert(`[신고 보상] 분실물이 안심 캐비닛에 등록되었습니다. 대학 보안 기여에 감사하는 마음으로 +150 pts 가 지급되었습니다!`);
  };

  // Callback to complete claiming an item, logging to records tab
  const handleClaimItem = (itemId: string, signatureMockBase64: string) => {
    // 1. Mark item as CLAIMED
    setLostItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, status: 'CLAIMED' } : item))
    );

    // 2. Add signature/claim record log
    const targetItem = lostItems.find(i => i.id === itemId);
    const newClaimLog: ClaimLog = {
      id: `log-${Date.now()}`,
      userId: 'oss0001',
      completionTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
      hubLocation: targetItem ? `${targetItem.lockerId === 'locker-a' ? '학술정보관 Hub' : '학생회관 Hub'}` : '학내 거점 Hub',
      itemTitle: targetItem ? targetItem.title : '분실 물품',
      status: 'PENDING_SIGNATURE',
      signature: signatureMockBase64
    };
    setClaimLogs(prev => [newClaimLog, ...prev]);

    // Go to Records tab immediately so they can drawing sign
    setActiveTab('RECORDS');
  };

  // Sign callback
  const handleAddSignatureToLog = (logId: string, signatureBase64: string) => {
    setClaimLogs(prev =>
      prev.map(log => log.id === logId ? { ...log, signature: signatureBase64, status: 'COMPLETED' } : log)
    );
  };

  // Transition to a specific item inside the Search screen
  const handleSelectItemFromMap = (item: LostItem) => {
    setSelectedItemInSearch(item);
    setActiveTab('SEARCH');
  };

  return (
    <div className="min-h-screen bg-[#F0ECE4] flex justify-center items-start py-0 md:py-8 antialiased">
      {/* Simulation Device Frame Container for perfect layout representation */}
      <div className="w-full max-w-md min-h-screen md:min-h-[820px] md:max-h-[860px] bg-[#FAF8F5] md:rounded-[2.5rem] md:shadow-2xl flex flex-col overflow-hidden relative border border-stone-200/50">
        
        {/* TOP STATUS HEADER PANEL */}
        <div className="px-5 py-4 bg-white/90 backdrop-blur-md border-b border-orange-100/30 flex justify-between items-center z-20">
          {/* Avatar and name */}
          <div
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            id="header-user-badge"
          >
            <div className="w-9 h-9 rounded-full bg-amber-100/80 border border-amber-300 flex items-center justify-center text-stone-700 relative overflow-hidden group-hover:scale-105 transition-all">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                alt="Profile Avatar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
            </div>
            <div>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Campus Member</p>
              <h3 className="text-sm font-black text-stone-800 tracking-tight group-hover:text-amber-950 transition-colors">
                LinkLocker
              </h3>
            </div>
          </div>

          {/* Points Pill Counter Badge */}
          <motion.div
            key={userPoints}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-blue-50/80 border border-blue-200 rounded-full px-3.5 py-1.5 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all hover:bg-blue-100/50"
            onClick={() => setActiveTab('REWARDS')}
            id="points-pill-id"
          >
            <span className="text-lg">🏆</span>
            <span className="text-xs font-black text-blue-900 font-mono">
              {userPoints.toLocaleString()} pts
            </span>
          </motion.div>
        </div>

        {/* MAIN TAB VIEW CONTAINER PORT WITH SLICK ANIMATIONS */}
        <div className="flex-1 overflow-y-auto bg-[#FAF8F5]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="h-full"
            >
              {activeTab === 'MAP' && (
                <MapTab
                  lockers={INITIAL_LOCKERS}
                  lostItems={lostItems}
                  onSelectItem={handleSelectItemFromMap}
                  onAddLostItem={handleAddLostItem}
                />
              )}

              {activeTab === 'SEARCH' && (
                <SearchTab
                  lostItems={lostItems}
                  userPoints={userPoints}
                  onModifyPoints={handleModifyPoints}
                  onSelectItemFromParent={selectedItemInSearch}
                  onClearSelectedItem={() => setSelectedItemInSearch(null)}
                  onClaimItem={handleClaimItem}
                />
              )}

              {activeTab === 'RECORDS' && (
                <RecordsTab
                  claimLogs={claimLogs}
                  onAddSignatureToLog={handleAddSignatureToLog}
                />
              )}

              {activeTab === 'REWARDS' && (
                <RewardsTab
                  userPoints={userPoints}
                  transactions={transactions}
                  onModifyPoints={handleModifyPoints}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* BOTTOM NAVIGATION FIXED BUTTONS BAR (Exactly matching image design) */}
        <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200/50 px-3 py-2 flex justify-around items-center z-20">
          {[
            { id: 'MAP', label: 'Map', icon: Compass },
            { id: 'SEARCH', label: 'Search', icon: Search },
            { id: 'RECORDS', label: 'Records', icon: FolderClosed },
            { id: 'REWARDS', label: 'Rewards', icon: Award },
          ].map((item) => {
            const IconComponent = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as ActiveTabType);
                  // Reset child pointer state if navigating manually away
                  if (item.id !== 'SEARCH') {
                    setSelectedItemInSearch(null);
                  }
                }}
                className={`py-1.5 px-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all outline-none ${
                  isSelected
                    ? 'text-blue-700 bg-blue-50 border border-blue-100 shadow-sm scale-102'
                    : 'text-stone-400 hover:text-stone-700 hover:bg-stone-50'
                }`}
                id={`nav-tab-${item.id}`}
              >
                <IconComponent className={`w-5.5 h-5.5 ${isSelected ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px] font-bold tracking-tight uppercase select-none">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* USER PROFILE CARD MODAL SUB-ROUTE */}
        <AnimatePresence>
          {isProfileOpen && (
            <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl relative border"
                id="profile-overlay-modal"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-300 relative overflow-hidden shadow-inner">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                      alt="Profile Avatar"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-stone-900">홍길동 (Gildong Hong)</h2>
                    <p className="text-xs text-stone-500 font-semibold mt-0.5">student_id@university.ac.kr</p>
                    <span className="mt-1.5 inline-block text-[9px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-100 font-extrabold uppercase">
                      Official Campus Member
                    </span>
                  </div>

                  <div className="w-full bg-[#FAF8F5] border rounded-2xl p-3 text-left space-y-2">
                    <p className="text-[10px] text-stone-500 font-bold flex justify-between">
                      <span>보안 신용등급</span>
                      <span className="text-blue-600 font-extrabold">Excellent (99/100)</span>
                    </p>
                    <p className="text-[10px] text-stone-500 font-bold flex justify-between">
                      <span>누적 습득 구출 건수</span>
                      <span className="text-stone-850 font-extrabold">12건 회수</span>
                    </p>
                    <p className="text-[10px] text-stone-500 font-bold flex justify-between border-t pt-1.5">
                      <span>가용 포인트</span>
                      <span className="text-[#F9A61A] font-extrabold">{userPoints.toLocaleString()} pts</span>
                    </p>
                  </div>

                  <div className="w-full flex gap-2 pt-2">
                    <button
                      onClick={() => setIsProfileOpen(false)}
                      className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-250 text-stone-600 font-bold rounded-lg text-xs transition-colors"
                    >
                      목록 닫기
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        alert('Campus LinkLocker 스마트 모의 계정 로그아웃되었습니다.');
                      }}
                      className="flex-1 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>로그아웃</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
