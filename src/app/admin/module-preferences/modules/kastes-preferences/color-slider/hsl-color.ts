export interface HslColor {
    hue: number;
    saturation: number;
    lightness: number;
}

export function stringToHsl(color: string): HslColor | null {
    const hslRegex = /hsl\((?<hue>\d+),(?<saturation>\d+)%,(?<lightness>\d+)%\)/;
    const regexMatch = color.match(hslRegex);
    if (typeof regexMatch?.groups === 'object' && regexMatch.groups !== null) {
        const { hue, saturation, lightness } = regexMatch.groups;
        return {
            hue: +(hue ?? 0),
            saturation: +(saturation ?? 0),
            lightness: +(lightness ?? 0),
        };
    } else {
        return null;
    }
}

export function hslToString(hue: number, saturation: number, lightness: number): string {
    return `hsl(${hue},${saturation}%,${lightness}%)`;
}

