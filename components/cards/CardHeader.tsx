import Image from 'next/image';

export default function CardHeader({
    title,
    actions,
}: Readonly<{
    title: string;
    actions?: React.ReactNode;
}>) {
    return (
        <div className="flex h-fit shrink-0 items-center justify-between p-2">
            <p className="font-sans text-[0.9375rem] font-semibold tracking-[0.0375rem] text-[#292929]">
                {title}
            </p>
            {actions ?? (
                <div className="flex items-center gap-2 ">
                    <button
                        type="button"
                        className="flex items-center justify-center px-1"
                    >
                        <Image
                            src="/images/more-vert.svg"
                            alt=""
                            width={4}
                            height={4}
                        />
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center px-1"
                    >
                        <Image
                            src="/images/bookmark.svg"
                            alt=""
                            width={12}
                            height={12}
                        />
                    </button>
                </div>
            )}
        </div>
    );
}
