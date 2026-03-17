export default function BaseCard({
    header,
    children,
    className = '',
    contentClassName = '',
}: Readonly<{
    header: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
}>) {
    return (
        <div
            className={`flex w-78.75 h-74 flex-1 flex-col overflow-hidden rounded-sm bg-white shadow-[0_0_0.5rem_rgba(0,0,0,0.25)] ${className}`}
        >
            <div className="shrink-0 ">{header}</div>
            <div
                className={`flex min-h-0 flex-1 flex-col overflow-y-auto ${contentClassName}`}
            >
                {children}
            </div>
        </div>
    );
}
