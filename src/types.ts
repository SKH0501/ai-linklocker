export interface Locker {
  id: string;
  name: string;
  count: number;
  lat: number;
  lng: number;
  locationDetails: string;
}

export interface LostItem {
  id: string;
  title: string;
  category: 'ELECTRONICS' | 'WALLET' | 'DOCUMENT' | 'OTHERS';
  location: string;
  description: string;
  reportedTime: string;
  image: string;
  status: 'AVAILABLE' | 'RESERVED' | 'CLAIMED';
  lockerId: string;
  lockerDetails: string;
}

export interface ClaimLog {
  id: string;
  userId: string;
  completionTime: string;
  hubLocation: string;
  signature?: string; // Base64 signature image
  status: 'PENDING_SIGNATURE' | 'COMPLETED';
  itemTitle: string;
}

export interface TransactionTrack {
  id: string;
  title: string;
  points: number; // positive or negative
  time: string;
  remainingPoints: number;
}

export interface RewardProduct {
  id: string;
  title: string;
  category: string;
  points: number;
  image: string;
  description: string;
}
