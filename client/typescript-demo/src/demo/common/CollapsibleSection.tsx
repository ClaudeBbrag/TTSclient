import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
    storageKey?: string; // Key for localStorage to persist state
    headerClassName?: string;
    contentClassName?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title,
    children,
    defaultExpanded = true,
    storageKey,
    headerClassName = "",
    contentClassName = "",
}) => {
    // Initialize state from localStorage if storageKey is provided
    const [isExpanded, setIsExpanded] = useState(() => {
        if (storageKey) {
            const saved = localStorage.getItem(storageKey);
            return saved !== null ? saved === "true" : defaultExpanded;
        }
        return defaultExpanded;
    });

    // Save to localStorage when state changes
    useEffect(() => {
        if (storageKey) {
            localStorage.setItem(storageKey, isExpanded.toString());
        }
    }, [isExpanded, storageKey]);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div style={{ width: "100%" }}>
            <div
                onClick={toggleExpanded}
                style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",
                    userSelect: "none",
                }}
                className={headerClassName}
            >
                <span style={{ fontWeight: "bold" }}>{title}</span>
                <span style={{ fontSize: "0.9em" }}>
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </span>
            </div>
            {isExpanded && <div className={contentClassName}>{children}</div>}
        </div>
    );
};
