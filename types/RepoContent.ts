export interface RepoContext {
  repo: any;
  packageJson?: any;
  files: string[];
  readme?: string;
}

export interface Signal {
  type: string;       
  confidence: number; 
  source: string;     
}

export interface Insight {
  label: string;  
  confidence: number;
}