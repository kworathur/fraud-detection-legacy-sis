import Dropdown from '@/components/ui/Dropdown';

export function FormFieldText({
    label,
    required = false,
    placeholder,
    value,
    onChange,
}: Readonly<{
    label: string;
    required?: boolean;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
}>) {
    return (
        <div className="flex w-56.25 flex-col gap-2">
            <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
                {required && '* '}
                {label}
            </label>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className="h-7 w-full border border-[#d1d5db] bg-white px-2.5 font-[Arial,sans-serif] text-[0.75rem] text-black outline-none focus:border-[#3182ce]"
            />
        </div>
    );
}

export function FormFieldDisabled({
    label,
    required = false,
    value,
}: Readonly<{
    label: string;
    required?: boolean;
    value?: string;
}>) {
    return (
        <div className="flex w-56.25 flex-col gap-2">
            <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
                {required && '* '}
                {label}
            </label>
            <div className="flex h-7 w-full items-center bg-[#f3f4f6] px-2.5 font-[Arial,sans-serif] text-[0.75rem] text-black">
                {value}
            </div>
        </div>
    );
}

export function FormFieldDropdown({
    label,
    required = false,
    placeholder = '-- Select --',
    options,
    value,
    onChange,
}: Readonly<{
    label: string;
    required?: boolean;
    placeholder?: string;
    options?: string[];
    value?: string;
    onChange?: (value: string) => void;
}>) {
    return (
        <div className="flex w-56.25 flex-col gap-2">
            <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
                {required && '* '}
                {label}
            </label>
            <Dropdown
                value={value ?? ''}
                onChange={(v) => onChange?.(v)}
                options={(options ?? []).map((opt) => ({
                    value: opt,
                    label: opt,
                }))}
                placeholder={placeholder}
            />
        </div>
    );
}
