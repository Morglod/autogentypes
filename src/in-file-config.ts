import { ConvertFromVariants, ConvertToVariants } from "./convert";

export type InFileConfig = {
    /** append by default */
    convertMode?: 'append' | 'export',

    /**
     * by default:  
     * joi->ts does not change name  
     * joi->schema4 append 'Schema4' to name  
     */
    exportedSymbolNameTransform?: (originalName: string, params: {
        from: ConvertFromVariants,
        to: ConvertToVariants,
    }) => string,
};
