export type CurrentUser = {
  id: string;
  email: string;
  firstname: string | null;
  lastname: string | null;
  profilePic: string | null;
  status: 'PENDING' | 'ACTIVE' | 'REVOKED';
  lastSignedIn: Date | null;
  roleTitles: string[];
};
