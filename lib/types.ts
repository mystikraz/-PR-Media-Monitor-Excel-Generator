export interface ColumnDef {
  id: string;
  key: string;
  label: string;
  width?: number; // approx character width or pixel width
  align: 'left' | 'center' | 'right';
  type: 'text' | 'number' | 'link_image' | 'select' | 'badge';
  options?: string[]; // for select type
  required?: boolean;
}

export interface ReportMeta {
  companyName: string;
  reportTitle: string;
  reportDate: string;
  clickInstruction: string;
  quickCategoryTabs: string[];
  sectionTitle: string;
  footerNote: string;
  themeColor: string; // e.g. '#1E3A8A'
  textColor: string;
  mergeDuplicateSubjects: boolean;
  embedThumbnailsInExcel: boolean;
}

export interface ReportRow {
  id: string;
  no: number | string;
  subject: string;
  publication: string;
  pageNo: string;
  section: string;
  heading: string;
  linkUrl?: string;
  imageName?: string;
  imageDataUrl?: string;
  imageSize?: number;
  [key: string]: any;
}

export interface BulkParseResult {
  rows: Partial<ReportRow>[];
  errors?: string[];
}
