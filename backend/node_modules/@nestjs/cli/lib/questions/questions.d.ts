export declare const generateInput: (name: string, message: string) => (defaultAnswer: string) => any;
export declare const generateSelect: (name: string) => (message: string) => (choices: string[]) => {
    name: string;
    message: string;
    choices: {
        name: string;
        value: string;
    }[];
};
