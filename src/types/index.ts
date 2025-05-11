export interface DocumentItem {
  Contributors: Contributor[];
  Version: string;
  Attachments: string[];
  CreatedAt: string;
  Title: string;
  ID: string;
  UpdatedAt: string;
}
export interface Contributor {
  ID: string;
  Name: string;
}
