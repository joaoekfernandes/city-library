export interface Loan {
  title: string;
  dueDate: string | Date;
}

export interface Member {
  userid: string;
  firstname: string;
  lastname: string;
  name?: string;
  avatar?: string;
  joinedDate?: string | Date;
  activeLoans?: number;
  totalLoans?: number;
  fines?: number;
  email?: string;
  phone?: string;
  bio?: string;
  recentLoans?: Loan[];
}
