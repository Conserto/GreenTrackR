export interface TableData {
  content?: any;
  style?: string;
  action?: boolean;
  contentHtml?: string;
}

export interface TableHeader {
  id: string;
  translateKey: string;
  groupHead?: string;
  class?: string;
  icon?: string;
}

export interface TableSurHeader {
  id: string;
  translateKey?: string;
  colspan: number;
  class?: string;
  icon?: string;
}
