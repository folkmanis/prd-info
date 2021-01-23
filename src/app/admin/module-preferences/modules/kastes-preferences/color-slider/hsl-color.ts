const hslRegex = /hsl\((?<hue>\d+),(?<saturation>\d+)%,(?<lightness>\d+)%\)/;

export class HslColor {

    static fromString(str: string): HslColor {
        return this.stringToHsl(str);
    }

    static stringToHsl(color: string): HslColor {
        const { hue, saturation, lightness } = color.match(hslRegex).groups;
        return new HslColor(+hue || 0, +saturation || 0, +lightness || 0);
    }

    static hslToString({ hue, saturation, lightness }: HslColor): string {
        return `hsl(${hue},${saturation}%,${lightness}%)`;
    }

    constructor(
        public hue = 0,
        public saturation = 0,
        public lightness = 0,
    ) { }
    toString = (): string => HslColor.hslToString(this);


}


