import Image from 'next/image';

export interface FormStep {
    label: string;
    icon: 'edit' | 'clipboard';
    active?: boolean;
}

function StepIcon({
    icon,
    active,
}: Readonly<{ icon: 'edit' | 'clipboard'; active: boolean }>) {
    return (
        <div
            className={`relative h-[1.625rem] w-[1.625rem] shrink-0 rounded-full ${
                active ? 'bg-[#0369a1]' : 'bg-[#e5e7eb]'
            }`}
        >
            <div
                className={`absolute left-0.25 top-0.25 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-transparent`}
            >
                <Image
                    src={
                        icon === 'edit'
                            ? '/images/edit-icon.svg'
                            : '/images/clipboard-icon.svg'
                    }
                    alt=""
                    width={icon === 'edit' ? 18 : 16}
                    height={icon === 'edit' ? 18 : 16}
                    className={icon === 'edit' ? '' : ''}
                />
            </div>
        </div>
    );
}

export default function FormSteps({
    steps,
}: Readonly<{
    steps: FormStep[];
}>) {
    return (
        <div className="flex w-54 shrink-0 flex-col gap-0 border-r border-[#d1d5db] bg-white px-5.5 py-4.5">
            {steps.map((step, i) => (
                <div>
                    <div
                        key={step.label}
                        className="flex w-full items-center gap-1.5"
                    >
                        <StepIcon
                            icon={step.icon}
                            active={step.active ?? false}
                        />
                        <p className="font-[Arial,sans-serif] text-[0.875rem] font-bold leading-none text-black">
                            {step.label}
                        </p>
                    </div>
                    {i < steps.length - 1 && (
                        <div className="h-8 w-0.5 bg-gray-200 relative -top-0.25 left-3"></div>
                    )}
                </div>
            ))}
        </div>
    );
}
