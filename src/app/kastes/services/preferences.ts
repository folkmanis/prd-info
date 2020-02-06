export interface KastesPreferences extends UserPreferences, SystemPreferences { }

export interface UserPreferences {
  pasutijums: string;
}

export interface SystemPreferences {
  colors:{
    yellow: string;
    rose: string;
    white: string;
  }
}