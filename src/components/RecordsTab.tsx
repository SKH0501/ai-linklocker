import React, { useRef, useState, useEffect } from 'react';
import { ClaimLog } from '../types';
import { ShieldAlert, Trash2, Edit3, CheckCircle, FileText, Sparkles, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface RecordsTabProps {
  claimLogs: ClaimLog[];
  onAddSignatureToLog: (logId: string, signatureBase64: string) => void;
}

export default function RecordsTab({ claimLogs, onAddSignatureToLog }: RecordsTabProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [activeLog, setActiveLog] = useState<ClaimLog | null>(null);

  // Set the first pending signature log or the latest log as active
  useEffect(() => {
    if (claimLogs.length > 0) {
      const pendingForm = claimLogs.find(l => l.status === 'PENDING_SIGNATURE') || claimLogs[0];
      setActiveLog(pendingForm);
    }
  }, [claimLogs]);

  // Setup canvas resolution and basic options
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#D97706'; // POOM signature line (Amber gold)
        ctx.lineWidth = 3;
      }
    }
  }, [activeLog]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSubmitSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !activeLog) return;
    if (!hasDrawn) {
      alert('서명을 그리신 후에 제출해 주세요!');
      return;
    }
    const signatureBase64 = canvas.toDataURL('image/png');
    onAddSignatureToLog(activeLog.id, signatureBase64);
    alert('디지털 서명이 정상적으로 암호화 저장되었습니다. 기록이 영구 보관됩니다.');
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF8F5] pb-24 text-stone-800 font-sans p-4 space-y-4" id="records-tab-layout">
      {/* Upper header matches exact wording from screenshot A */}
      <div className="text-center py-3">
        <h1 className="text-2xl font-black text-stone-900 tracking-tight" id="records-main-title">수령 완료 로그</h1>
        <p className="text-xs text-stone-500 mt-1.5 leading-relaxed max-w-sm mx-auto">
          물품 수령이 성공적으로 확인되었습니다. <br />
          보안과 기록 보관을 위해 아래 영역에 서명을 남겨주세요.
        </p>
      </div>

      {activeLog ? (
        <>
          {/* DIGITAL SIGNITURE INTERACTIVE PAD */}
          <div className="bg-white rounded-3xl p-5 border border-stone-100 shadow-sm space-y-4 relative overflow-hidden" id="draw-signature-card-id">
            <div className="flex justify-between items-center bg-stone-50 -mx-5 -mt-5 px-5 py-3 border-b border-stone-100/85">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wide">
                <Edit3 className="w-4 h-4 text-blue-600" />
                디지털 서명
              </span>
              <button
                type="button"
                onClick={clearCanvas}
                className="text-stone-400 hover:text-stone-700 font-bold text-xs flex items-center gap-1 shrink-0 transition-colors"
                id="clear-canvas-btn"
              >
                <Trash2 className="w-3.5 h-3.5" />
                지우기
              </button>
            </div>

            {/* Signature Draw Area Box */}
            <div className="relative border-2 border-dashed border-stone-200 bg-stone-50/50 rounded-2xl aspect-[4/3] flex items-center justify-center overflow-hidden">
              {/* Draw message watermark */}
              {!hasDrawn && (
                <div className="absolute inset-x-0 inset-y-0 flex flex-col items-center justify-center text-center text-stone-400 select-none pointer-events-none p-4">
                  <span className="text-xs font-bold bg-white text-stone-500 px-3 py-1 rounded-full shadow border mb-2">
                    이곳에 서명을 그려주세요.
                  </span>
                  <div className="opacity-15 relative">
                    <Shield className="w-16 h-16 text-blue-800" />
                  </div>
                </div>
              )}

              {/* Real canvas drawing element */}
              <canvas
                ref={canvasRef}
                width={320}
                height={240}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-full cursor-pencil relative z-10"
              />
            </div>

            {/* Note prompt badge from screenshots */}
            <div className="bg-[#FEF3C7] border border-[#F0E6D8] p-3.5 rounded-xl flex items-start gap-2.5 text-left text-[#92400E]">
              <CheckCircle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-[#92400E] font-semibold select-none">
                작성된 서명은 암호화되어 안전하게 보관되며, 수령 분쟁 발생 시 법적 효력을 가질 수 있습니다.
              </p>
            </div>

            {/* Completion Trigger Submit Buttons */}
            <button
              onClick={handleSubmitSignature}
              className="w-full py-4 rounded-xl bg-[#D97706] hover:bg-[#B45F06] text-white font-extrabold text-xs tracking-wider shadow-md active:scale-98 transition-all"
              id="submit-signature-btn"
            >
              수령 완료 및 서명 제출
            </button>
          </div>

          {/* RECEIPT RECORDS METADATA INFORMATION */}
          <div className="bg-white rounded-3xl p-5 border border-stone-100 shadow-sm space-y-4" id="receipt-metadata-card-id">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-widest flex items-center gap-1">
              <FileText className="w-4 h-4 text-indigo-700" />
              수령 기록 정보
            </h3>

            <div className="grid grid-cols-1 gap-3.5 pt-1.5">
              <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/50 flex justify-between items-center">
                <div>
                  <p className="text-[9px] text-stone-400 font-black uppercase tracking-wider">User ID</p>
                  <p className="text-sm font-extrabold text-stone-800 mt-0.5">{activeLog.userId}</p>
                </div>
                <div className="w-5 h-5 rounded-full bg-stone-200/40 flex items-center justify-center text-stone-400">
                  <span className="text-[10px]">👤</span>
                </div>
              </div>

              <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/50 flex justify-between items-center">
                <div>
                  <p className="text-[9px] text-stone-400 font-black uppercase tracking-wider">Completion Time</p>
                  <p className="text-sm font-bold text-stone-800 font-mono mt-0.5">{activeLog.completionTime}</p>
                </div>
                <span className="text-[10px]">⏰</span>
              </div>

              <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/50 flex justify-between items-center">
                <div>
                  <p className="text-[9px] text-stone-400 font-black uppercase tracking-wider">Hub Location</p>
                  <p className="text-sm font-extrabold text-stone-800 mt-0.5">{activeLog.hubLocation}</p>
                </div>
                <span className="text-[10px]">📍</span>
              </div>
            </div>

            {/* Footnote status banner */}
            <div className="flex justify-between items-center pt-2 text-[#999] select-none">
              <div className="flex items-center gap-1.5 text-xs text-stone-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>보안 통신 활성화됨</span>
              </div>
              <span className="text-[9px] font-mono tracking-widest uppercase bg-stone-100 p-1 rounded font-bold">
                SEC-LOG-ID: 4892-X
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-[2rem] p-12 text-center border border-stone-100/90 shadow-sm">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <p className="text-sm font-extrabold text-stone-800">모든 물품의 서명 및 수령 처리가 완료되었습니다.</p>
          <p className="text-xs text-stone-400 mt-1">대기 중인 수령 확인 처리가 생성되면 여기에 표시됩니다.</p>
        </div>
      )}

      {/* BOARAN TRUST SECURITY FOOTER BANNER (Warm Espresso/Sand) */}
      <div className="bg-[#2D241E] border border-[#F0E6D8] p-4.5 rounded-[1.5rem] flex items-center justify-between shadow-lg text-white font-sans select-none" id="boaran-trust-card">
        <div>
          <h4 className="text-sm font-black tracking-tight flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706] animate-spin" />
            보안 신뢰성 보장
          </h4>
          <p className="text-[11px] text-stone-300 mt-1 leading-relaxed">
            LinkLocker의 모든 거래는 256비트 암호화로 보호됩니다.
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#4A3F35] border border-stone-600 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-5 h-5 text-[#D97706]" />
        </div>
      </div>
    </div>
  );
}
