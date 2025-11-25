export interface FormComponent {
    id: string;
    type: 'input' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'date' | 'upload' | 'rate' | 'phone' | 'email' | 'divider' | 'description' | 'image';
    label: string;
    placeholder?: string;
    required?: boolean;
    options?: {
        label: string;
        value: string;
    }[];
    config?: Record<string, any>;
}
export interface FormConfig {
    components: FormComponent[];
    style?: {
        backgroundColor?: string;
        primaryColor?: string;
        borderRadius?: string;
    };
    settings?: {
        submitButtonText?: string;
        successMessage?: string;
    };
}
export declare class CreateFormDto {
    title: string;
    description?: string;
    config: FormConfig;
}
