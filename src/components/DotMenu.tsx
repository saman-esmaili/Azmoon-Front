import {useEffect, useRef, useState, ReactNode} from "react";

type MenuItem = {
    label: string;
    onClick: () => void;
    danger?: boolean;
};

type ThreeDotsMenuProps = {
    items: MenuItem[];
};

export default function ThreeDotsMenu({
                                          items,
                                      }: ThreeDotsMenuProps) {
    const [open, setOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    return (
        <div
            ref={menuRef}
            style={{
                position: "relative",
                display: "flex",
                justifyContent:'left'
            }}
        >
            {/* button */}
            <button
                onClick={() => setOpen(!open)}
                style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "12px",
                    border: "none",
                    background: "#f4f4f5",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "0.2s",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                    }}
                >
          <span
              style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "#222",
              }}
          />

                    <span
                        style={{
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            background: "#222",
                        }}
                    />

                    <span
                        style={{
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            background: "#222",
                        }}
                    />
                </div>
            </button>

            {/* dropdown */}
            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "25px",
                        left: 0,
                        minWidth: "140px",
                        background: "white",
                        borderRadius: "16px",
                        padding: "8px",
                        boxShadow:
                            "0 10px 30px rgba(0,0,0,0.12)",
                        border: "1px solid #eee",
                        zIndex: 1000,
                        animation: "fadeIn 0.15s ease",
                    }}
                >
                    {items.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                item.onClick();
                                setOpen(false);
                            }}
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                border: "none",
                                background: "transparent",
                                borderRadius: "12px",
                                textAlign: "right",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: 500,
                                color: item.danger
                                    ? "#dc2626"
                                    : "#222",
                                transition: "0.15s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                    item.danger
                                        ? "rgba(220,38,38,0.08)"
                                        : "#f4f4f5";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                    "transparent";
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}