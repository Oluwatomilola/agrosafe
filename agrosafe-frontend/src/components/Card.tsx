import React from "react";

interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    footer?: React.ReactNode;
}

export default function Card({ title, children, className = "", footer }: CardProps) {
    return (
        <div className={`bg-white rounded-lg shadow border border-gray-200 ${className}`}>
            {title && (
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                </div>
            )}
            <div className="p-6">{children}</div>
            {footer && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    {footer}
                </div>
            )}
        </div>
    );
}
