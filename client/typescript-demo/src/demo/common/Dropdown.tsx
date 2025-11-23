import React, { useState, useRef, useEffect } from "react";

export interface DropdownItem {
    label: string;
    onClick: () => void;
    icon?: string | React.ReactNode;
}

export interface DropdownProps {
    label: string | React.ReactNode;
    items: DropdownItem[];
    buttonClassName?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ label, items, buttonClassName = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleItemClick = (onClick: () => void) => {
        onClick();
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
            <button onClick={toggleDropdown} className={buttonClassName} style={{ cursor: "pointer" }}>
                {label}
            </button>

            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        marginTop: "5px",
                        backgroundColor: "var(--dropdown-bg, #ffffff)",
                        border: "1px solid var(--dropdown-border, #ccc)",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        minWidth: "150px",
                        zIndex: 1000,
                    }}
                >
                    {items.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleItemClick(item.onClick)}
                            style={{
                                padding: "10px 15px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                borderBottom: index < items.length - 1 ? "1px solid var(--dropdown-divider, #eee)" : "none",
                                transition: "background-color 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "var(--dropdown-hover, #f5f5f5)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                            }}
                        >
                            {item.icon && (
                                <span style={{ display: "flex", alignItems: "center" }}>
                                    {typeof item.icon === "string" ? (
                                        <img src={item.icon} alt="" style={{ width: "20px", height: "20px" }} />
                                    ) : (
                                        item.icon
                                    )}
                                </span>
                            )}
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
