import { Locker, LostItem, TransactionTrack, RewardProduct, ClaimLog } from './types';

export const INITIAL_LOCKERS: Locker[] = [
  {
    id: 'locker-a',
    name: 'Locker A (중앙도서관)',
    count: 12,
    lat: 37.5, // Schematic
    lng: 126.9,
    locationDetails: 'Central Library Hub, Level 1, Section A-3',
  },
  {
    id: 'locker-b',
    name: 'Locker B (학생회관)',
    count: 5,
    lat: 42.5,
    lng: 132.4,
    locationDetails: 'Student Union Hub, Level 1, Section B-12',
  },
];

export const INITIAL_LOST_ITEMS: LostItem[] = [
  {
    id: 'item-1',
    title: 'AirPods Pro',
    category: 'ELECTRONICS',
    location: '중앙도서관 2층 휴게실',
    description: '3층 스터디 테이블 위 흰색 케이스 안에 든 에어팟 프로입니다.',
    reportedTime: '2시간 전',
    image: 'https://images.unsplash.com/photo-1588449668338-d13417f16af1?auto=format&fit=crop&q=80&w=600',
    status: 'AVAILABLE',
    lockerId: 'locker-a',
    lockerDetails: 'Level 1, Section A-3',
  },
  {
    id: 'item-2',
    title: 'Black Leather Wallet',
    category: 'WALLET',
    location: '학생회관 식당 출구',
    description: '검은색 수제 가죽 슬림 가죽 지갑, 내부 학생증 홍길동 포함.',
    reportedTime: '1시간 전',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600',
    status: 'AVAILABLE',
    lockerId: 'locker-b',
    lockerDetails: 'Level 1, Section B-12',
  },
  {
    id: 'item-3',
    title: 'iPad Air 5세대 (스페이스 그레이)',
    category: 'ELECTRONICS',
    location: '인문관 302호 강의실',
    description: '스페이스 그레이 색상의 아이패드, 브라운 스마트 커버 씌워짐.',
    reportedTime: '3시간 전',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600',
    status: 'AVAILABLE',
    lockerId: 'locker-a',
    lockerDetails: 'Level 2, Section A-8',
  },
  {
    id: 'item-4',
    title: '마티스 가죽 키링',
    category: 'OTHERS',
    location: '경상관 로비 엘리베이터 앞',
    description: '베이지색 열쇠고리와 다크 그린 색 장식품이 달려 있는 자동차 키 키링.',
    reportedTime: '5시간 전',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
    status: 'AVAILABLE',
    lockerId: 'locker-b',
    lockerDetails: 'Level 1, Section B-15',
  },
  {
    id: 'item-5',
    title: '써모스 스테인리스 텀블러',
    category: 'OTHERS',
    location: '체육관 웨이트 트레이닝 룸',
    description: '매트 실버 색상의 텀블러, 뒷면에 스포츠 로고 스티커 부착.',
    reportedTime: '어제',
    image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&q=80&w=600',
    status: 'AVAILABLE',
    lockerId: 'locker-b',
    lockerDetails: 'Level 2, Section B-4',
  },
];

export const INITIAL_TRANSACTIONS: TransactionTrack[] = [
  {
    id: 'tx-1',
    title: '프리미엄 아카이브 저장',
    points: -150,
    time: '2023.10.24 14:20',
    remainingPoints: 1250,
  },
  {
    id: 'tx-2',
    title: '일일 출석 체크 보상',
    points: 50,
    time: '2023.10.24 09:05',
    remainingPoints: 1400,
  },
  {
    id: 'tx-3',
    title: 'Deep Hub 데이터 검색',
    points: -300,
    time: '2023.10.23 18:45',
    remainingPoints: 1350,
  },
  {
    id: 'tx-4',
    title: '지역 데이터 락 해제',
    points: -500,
    time: '2023.10.23 11:12',
    remainingPoints: 1650,
  },
];

export const REWARD_PRODUCTS: RewardProduct[] = [
  {
    id: 'prod-1',
    title: '캠퍼스 카페 아메리카노',
    category: 'Beverage',
    points: 500,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600',
    description: '교내 전 매장 (학생회관, 도서관 커피숍) 사용 가능 핫/아이스 선택 가능',
  },
  {
    id: 'prod-2',
    title: '프린트 스테이션 10매권',
    category: 'Service',
    points: 200,
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=600',
    description: '중앙도서관 및 IT관 무인 프린트 복합기 전용 흑백/컬러 공용 10장 출력권',
  },
];

export const INITIAL_CLAIM_LOGS: ClaimLog[] = [
  {
    id: 'log-1',
    userId: 'oss0001',
    completionTime: '2026-05-11 14:32',
    hubLocation: '학술정보관 Hub (Locker A)',
    itemTitle: '에어팟 가죽 수납 케이스',
    status: 'COMPLETED',
    signature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path d="M10 80 Q 52.5 10, 95 80" stroke="blue" stroke-width="2" fill="none"/></svg>'
  }
];
