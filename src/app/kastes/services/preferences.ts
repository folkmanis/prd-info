export interface KastesPreferences extends UserPreferences, SystemPreferences { }

export interface UserPreferences {
  pasutijums: string;
}

export interface SystemPreferences {
  yellow: string;
  rose: string;
  white: string;
}