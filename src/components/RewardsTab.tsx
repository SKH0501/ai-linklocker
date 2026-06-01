import React, { useState } from 'react';
import { TransactionTrack, RewardProduct } from '../types';
import { REWARD_PRODUCTS } from '../data';
import { Award, Plus, Flame, ShieldCheck, Ticket, Coffee, Printer, Shield, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RewardsTabProps {
  userPoints: number;
  transactions: TransactionTrack[];
  onModifyPoints: (amount: number, title: string) => void;
}

export default function RewardsTab({ userPoints, transactions, onModifyPoints }: RewardsTabProps) {
  const [dailyHubProgress, setDailyHubProgress] = useState(1);
  const [showVoucherCoupon, setShowVoucherCoupon] = useState<RewardProduct | null>(null);

  const handleChargePoints = () => {
    onModifyPoints(500, '포인트 자가 충전 시뮬레이션');
    alert('모의 포인트 충전이 성공적으로 완료되었습니다! +500 pts 가 적립되었습니다.');
  };

  const handleHubCheckIn = () => {
    if (dailyHubProgress >= 3) {
      alert('오늘의 일일 Hub 접근 횟수(3/3)가 가득 찼습니다.');
      return;
    }
    const newProgress = dailyHubProgress + 1;
    setDailyHubProgress(newProgress);
    onModifyPoints(50, `일일 Hub 순찰 접근 인증 보서 (${newProgress}/3)`);
    alert(`[출석/보안 순찰] 안전 구역 Hub 순찰이 인증되었습니다. +50 pts 획득!`);
  };

  const handleBuyProduct = (prod: RewardProduct) => {
    if (userPoints < prod.points) {
      alert(`보유 포인트가 부족합니다. (필요: ${prod.points} pts / 보유: ${userPoints} pts)`);
      return;
    }
    onModifyPoints(-prod.points, `[상점교환] ${prod.title}`);
    setShowVoucherCoupon(prod);
    alert(`성공적으로 교환되었습니다! [${prod.title}] 쿠폰 바코드가 발급되었습니다.`);
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF8F5] pb-24 text-stone-800 font-sans p-4 space-y-4" id="rewards-tab-layout">
      {/* POINTS CARD UPPER DISPLAY */}
      <div className="bg-gradient-to-br from-amber-400 via-amber-400 to-[#FBB03B] rounded-[2rem] p-6 shadow-xl relative overflow-hidden select-none" id="points-card">
        {/* Subtle decorative circles */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white opacity-10"></div>
        <div className="absolute -left-10 -top-10 w-24 h-24 rounded-full bg-amber-200 opacity-20"></div>

        <div>
          <span className="text-xs text-stone-800 font-extrabold uppercase tracking-wide opacity-80 block">
            Available Balance
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-extrabold text-stone-950 tracking-tight">
              {userPoints.toLocaleString()}
            </span>
            <span className="text-xl font-black text-stone-900">pts</span>
          </div>
        </div>

        {/* Buttons matching design specs */}
        <div className="flex justify-between items-center mt-5">
          <button
            onClick={handleChargePoints}
            className="px-4.5 py-3 h-11 bg-stone-950 hover:bg-stone-900 text-[#FAF8F5] text-xs font-bold rounded-2xl flex items-center gap-1.5 transition-colors border border-stone-800 shadow"
            id="charge-pt-btn"
          >
            <Plus className="w-4 h-4 text-amber-400 stroke-[3]" />
            <span>포인트 충전</span>
          </button>

          <span className="text-[11px] font-bold text-amber-950 tracking-tight opacity-90">
            Next rewards tier 1,500 pts (+250)
          </span>
        </div>
      </div>

      {/* DAILY WHEEL PROGRESS CONTAINER */}
      <div className="bg-white rounded-3xl p-5 border border-stone-100 shadow-sm flex flex-col items-center text-center space-y-4" id="progress-card">
        {/* Beautiful radial wheel SVG */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="44"
              className="stroke-stone-100 fill-transparent"
              strokeWidth="10"
            />
            <circle
              cx="56"
              cy="56"
              r="44"
              className="stroke-stone-900 fill-transparent transition-all duration-500"
              strokeWidth="10"
              strokeDasharray={276}
              strokeDashoffset={276 - (276 * dailyHubProgress) / 3}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-x-0 inset-y-0 flex flex-col items-center justify-center select-none">
            <span className="text-2xl font-black text-stone-900">{dailyHubProgress}/3</span>
            <span className="text-[9px] font-bold text-stone-400">DAILY TARGET</span>
          </div>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-[#111] leading-tight">일일 Hub 접근</h3>
          <p className="text-[11px] text-stone-500 mt-1 leading-relaxed max-w-xs mx-auto">
            악용 방지를 위해 일일 접근 횟수가 제한되며 <br />
            매 접근 인증 시 보너스 혜택 포인트를 가득 드립니다.
          </p>
        </div>

        <div className="flex gap-2 w-full">
          <button
            onClick={handleHubCheckIn}
            className={`flex-1 py-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
              dailyHubProgress < 3
                ? 'bg-amber-500 hover:bg-amber-600 text-stone-950 border-amber-600 shadow'
                : 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
            }`}
            id="hub-checkin-btn"
          >
            <Flame className="w-4 h-4 text-stone-950" />
            <span>{dailyHubProgress < 3 ? 'Hub 순시 보안인증' : '오늘 인증 완료'}</span>
          </button>

          {/* System Protected Tag */}
          <div className="bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl flex items-center gap-1 text-[10px] text-stone-500 font-bold shrink-0">
            <ShieldCheck className="w-4 h-4 text-stone-600" />
            <span>System Protected</span>
          </div>
        </div>
      </div>

      {/* RECENT STATEMENT LEDGER ROW LIST */}
      <div className="bg-white rounded-3xl p-5 border border-stone-100 shadow-sm space-y-4" id="ledger-card">
        <div className="flex justify-between items-center bg-stone-50/50 p-2.5 rounded-xl -mx-2">
          <h3 className="text-sm font-black text-[#111] uppercase tracking-wider">최근 이용 내역</h3>
          <button
            onClick={() => alert('누적된 거래 기록 전문이 블록체인에 영구 기록되어 보존 중입니다 (분실 분쟁 사전 예방 완료).')}
            className="text-stone-400 hover:text-stone-700 text-xs font-bold flex items-center gap-1"
          >
            전체보기
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-stone-100">
          {transactions.map((tx) => (
            <div key={tx.id} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 shrink-0">
                  {tx.points > 0 ? (
                    <Award className="w-5 h-5 text-amber-600" />
                  ) : tx.title.includes('아카이브') ? (
                    <Ticket className="w-5 h-5 text-indigo-600" />
                  ) : tx.title.includes('커피') || tx.title.includes('카페') ? (
                    <Coffee className="w-5 h-5 text-orange-600" />
                  ) : (
                    <Printer className="w-5 h-5 text-stone-600" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#111]">{tx.title}</h4>
                  <p className="text-[10px] text-stone-400 mt-0.5">{tx.time}</p>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-xs font-black shrink-0 ${
                  tx.points > 0 ? 'text-[#F9A61A]' : 'text-stone-800'
                }`}>
                  {tx.points > 0 ? `+ ${tx.points.toLocaleString()}` : `${tx.points.toLocaleString()}`} pts
                </span>
                <p className="text-[9px] text-[#A1A1A1] font-mono mt-0.5">잔액 {tx.remainingPoints.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CAMPUS PARTNERS EXCHANGE MARKET FOR VOUCHERS */}
      <div className="bg-white rounded-3xl p-5 border border-stone-100 shadow-sm space-y-4" id="store-card">
        <div className="bg-[#FEF3C7] border border-[#F0E6D8] p-3 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <div>
              <p className="text-xs font-bold text-[#92400E]">캠퍼스 파트너 제휴 혜택</p>
              <p className="text-[9px] text-[#D97706]">모은 포인트로 VOUCHER 쿠폰을 즉시 발급 받으세요</p>
            </div>
          </div>
          <span className="text-[10px] bg-[#D97706] text-white font-extrabold px-2 py-0.5 rounded-full">+100 Coins 추가 적립</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {REWARD_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="bg-stone-50/50 rounded-2xl p-3 border border-stone-200/50 flex flex-col justify-between group overflow-hidden"
              id={`partner-item-${prod.id}`}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                <img
                  src={prod.image}
                  alt={prod.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <span className="absolute top-1 left-2 text-[8px] font-bold bg-indigo-900 text-white px-2 py-0.5 rounded-md uppercase tracking-wider shadow">
                  {prod.category}
                </span>
              </div>

              <div className="mt-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-stone-900 leading-tight group-hover:text-amber-800 transition-colors">
                    {prod.title}
                  </h4>
                  <p className="text-[9px] text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex lg:flex-row flex-col justify-between items-center gap-1">
                  <span className="text-xs font-mono font-black text-amber-700 shrink-0 select-none">
                    {prod.points} pts
                  </span>
                  <button
                    onClick={() => handleBuyProduct(prod)}
                    className="w-full xl:w-auto px-2.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-[#FAF8F5] text-[10px] font-bold rounded-lg whitespace-nowrap shadow transition-colors"
                  >
                    쿠폰 교환
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOARAN WARNING BLOCK (Warm Espresso/Sand) */}
      <div className="bg-[#2D241E] border border-[#F0E6D8] p-4.5 rounded-3xl flex items-start gap-3 text-[#FCF9F5] select-none" id="boaran-warning-card">
        <Shield className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-extrabold tracking-wide text-[#D97706] uppercase">보안 안내</h4>
          <p className="text-[10px] text-stone-300 leading-relaxed mt-1">
            부정 사용 감지 시 계정 이용이 즉시 제한될 수 있습니다. 비정상적인 포인트 적립 및 허가되지 않은 Hub 접근을 삼가 주세요.
          </p>
        </div>
      </div>

      {/* REWARD DRAWER COUPON MODAL ON BUY SUCCESS */}
      <AnimatePresence>
        {showVoucherCoupon && (
          <div className="fixed inset-0 bg-stone-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[2.5rem] border border-stone-100 shadow-2xl p-6 relative overflow-hidden text-center fill-stone-800"
              id="active-voucher-drawer"
            >
              {/* Confetti decoration */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-400/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>

              <div className="w-14 h-14 bg-amber-50 hover:bg-amber-100 text-[#F9A61A] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
                {showVoucherCoupon.category === 'Beverage' ? <Coffee className="w-7 h-7" /> : <Printer className="w-7 h-7" />}
              </div>

              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
                {showVoucherCoupon.category} GIFT VOUCHER
              </span>

              <h2 className="text-lg font-black text-stone-900 mt-3">{showVoucherCoupon.title}</h2>
              <p className="text-xs text-stone-500 leading-relaxed mt-1 max-w-xs mx-auto">
                {showVoucherCoupon.description}
              </p>

              {/* Barcode section simulating premium physical voucher coupon */}
              <div className="bg-stone-50 border border-stone-200 rounded-3xl p-5 my-5 flex flex-col items-center select-none shadow-inner relative">
                {/* Visual Barcode bars */}
                <div className="w-full flex justify-between h-14 bg-white px-4 py-2 border rounded-xl" id="barcode-visualization">
                  {[...Array(24)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-stone-950 shrink-0"
                      style={{
                        width: `${i % 4 === 0 ? 3 : i % 3 === 0 ? 1 : 2}px`,
                        opacity: i % 5 === 0 ? 0.35 : 1
                      }}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-mono tracking-widest text-stone-500 mt-2 font-bold uppercase">
                  UNIV-PK-{Math.floor(1000 + Math.random() * 9000)}-{Math.floor(10 + Math.random() * 90)}
                </span>
                <p className="text-[10px] text-stone-400 mt-1 font-semibold">바코드를 인쇄소나 매장 카운터에 스캔해 주세요.</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowVoucherCoupon(null)}
                  className="flex-1 py-3.5 rounded-xl border border-stone-300 text-stone-600 font-bold bg-white text-xs hover:bg-stone-50 transition-colors"
                >
                  보관함에 저장
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('바코드가 이미지 앨범에 자외선 오프라인 증명서로 캡처 저장되었습니다.');
                    setShowVoucherCoupon(null);
                  }}
                  className="flex-1 py-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45F06] text-white font-bold text-xs shadow transition-colors"
                >
                  이미지 저장
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
