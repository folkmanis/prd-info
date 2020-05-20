export interface UserPreferences {
  pasutijums: string;
}

export interface SystemPreferences {
  colors: {
    yellow: string;
    rose: string;
    white: string;
  };
}

export interface KastesPreferences extends UserPreferences, SystemPreferences { }
