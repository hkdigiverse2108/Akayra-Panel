declare module 'color-namer' {
    interface ColorName {
        name: string;
        hex: string;
        distance: number;
    }

    interface NamerResult {
        [key: string]: ColorName[];
    }

    function namer(color: string, options?: any): NamerResult;
    export default namer;
}
