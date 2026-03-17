export interface StudentRecord {
  id: number;
  email: string;
  address: string;
  birthdate: string;
  name: string;
  level_of_study: "BACHELORS" | "MASTERS" | "DOCTORAL";
  ssn?: string;
  verificationStatus: "UNVERIFIED" | "VERIFIED" | "NEEDS_REVIEW" | "FRAUDULENT";
  consented: boolean;
}

export interface StudentListResponse {
  data: StudentRecord[];
  pagination: {
    offset: number;
    limit: number;
    currentPage: number;
  };
  links: {
    self: string;
    prev: string | null;
    next: string | null;
  };
}

export interface AdvisingAdvisorResponse {
  advisorId: string;
  advisorName?: string;
}

export interface AdvisorDirectoryEntry {
  advisorId: string;
  username: string;
  email: string;
  name: string;
  enabled: boolean;
  status: string;
  createdAt?: string;
  lastModifiedAt?: string;
}

export interface AdvisorDirectoryResponse {
  data: AdvisorDirectoryEntry[];
  pagination: {
    offset: number;
    limit: number;
    currentPage: number;
  };
  links: {
    self: string;
    prev: string | null;
    next: string | null;
  };
}

export interface AdvisingSlot {
  slotId: string;
  advisorId: string;
  slotDateTime: string;
  status: "AVAILABLE" | "BOOKED" | "CANCELLED";
  advisorDisplayName?: string;
  studentId?: number;
  bookingDescription?: string;
}

export interface AdvisingSlotsResponse {
  data: AdvisingSlot[];
}

export interface InquiryStartResponse {
  status: "success";
  statusCode: number;
  message: string;
  data: {
    inquiryId: string;
    checkType: "ADDRESS_LIVENESS";
    status: "QUEUED";
  };
}

export interface InquiryStatusResponse {
  status: "success";
  statusCode: number;
  data: {
    inquiryId: string;
    studentId: number;
    checkType: "ADDRESS_LIVENESS";
    status: "QUEUED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
    createdAt: string;
    updatedAt: string;
    inputAddress?: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    result?: {
      addressValid: boolean;
      deliverability: "DELIVERABLE" | "UNDELIVERABLE" | "UNKNOWN";
      addressType: "RESIDENTIAL" | "COMMERCIAL" | "PO_BOX" | "UNKNOWN";
      nameMatch: boolean;
      recentMove: boolean;
    };
    errorMessage?: string;
  };
}

export interface CreateApplicationResponse {
  status: "success";
  statusCode: number;
  message: string;
  data: {
    appid: number;
    studentId: number;
  };
}

export interface AdvisingInsight {
  insightId: string;
  advisorId: string;
  name: string;
  templateKey:
    | "CREDENTIALS_NEAR_COMPLETION"
    | "SCHOLARSHIP_ELIGIBILITY"
    | "SUGGESTED_COURSES";
  parameters: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AdvisingInsightsResponse {
  data: AdvisingInsight[];
}

export interface InsightExecuteResponse {
  data: Record<string, unknown>[];
  insightId: string;
  studentId: number;
  message?: string;
}
