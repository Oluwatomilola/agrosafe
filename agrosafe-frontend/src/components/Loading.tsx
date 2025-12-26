import React from "react";

interface LoadingProps {
    size?: "sm" | "md" | "lg";
    text?: string;
    fullScreen?: boolean;
}

export default function Loading({ size = "md", text, fullScreen = false }: LoadingProps) {
    const sizeClasses = {
        sm: "w-4 h-4 border-2",
        md: "w-8 h-8 border-3",
        lg: "w-12 h-12 border-4",
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center gap-2">
            <div
                className={`${sizeClasses[size]} border-green-500 border-t-transparent rounded-full animate-spin`}
            />
            {text && <p className="text-gray-600 text-sm">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return spinner;
}

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    loadingText?: string;
    children: React.ReactNode;
}

export function LoadingButton({
    loading = false,
    loadingText = "Loading...",
    children,
    disabled,
    className = "",
    ...props
}: LoadingButtonProps) {
    return (
        <button
            {...props}
            disabled={loading || disabled}
            className={`${className} relative flex items-center justify-center gap-2 ${
                loading ? "cursor-not-allowed opacity-70" : ""
            }`}
        >
            {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>{loading ? loadingText : children}</span>
        </button>
    );
}
